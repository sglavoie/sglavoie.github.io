#!/usr/bin/env python3
"""Checks the external links of a built site and reports the ones that fail.

Not part of the pre-commit hook: it goes over the network and takes a while.
Run it now and then to catch links that have rotted:

    ./scripts/check-external-links.py            # builds the site first
    ./scripts/check-external-links.py public     # an existing build
    ./scripts/check-external-links.py --redirects

Broken links (4xx, 5xx, no such host, timeouts) fail the run. With
--redirects, links that permanently redirect are listed too, with where they
go now, so they can be updated. Some sites refuse scripted requests outright;
those are listed as "unverified" rather than broken.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import html
import re
import socket
import ssl
import subprocess
import sys
import itertools
import tempfile
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
OWN_HOSTS = {"www.sglavoie.com", "sglavoie.com"}
LINK_RE = re.compile(r"""<(?:a|iframe|img|source)\b[^>]*?\b(?:href|src)=["']?(https?://[^"'\s>]+)""", re.IGNORECASE)
USER_AGENT = "Mozilla/5.0 (compatible; sglavoie.com link checker; +https://www.sglavoie.com/)"
# Answers that mean "no robots", not "gone": LinkedIn's 999, rate limits,
# and bot walls.
UNVERIFIABLE = {401, 403, 429, 999}


@dataclass
class Result:
    url: str
    status: int | None = None
    error: str = ""
    location: str = ""  # where a permanent redirect leads

    @property
    def broken(self) -> bool:
        return bool(self.error) or (self.status is not None and self.status >= 400 and self.status not in UNVERIFIABLE)

    @property
    def unverified(self) -> bool:
        return self.status in UNVERIFIABLE


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


OPENER = urllib.request.build_opener(NoRedirect)


def request(url: str, method: str, timeout: float) -> tuple[int, dict[str, str]]:
    req = urllib.request.Request(url, method=method, headers={"User-Agent": USER_AGENT, "Accept": "*/*"})
    try:
        with OPENER.open(req, timeout=timeout) as response:
            return response.status, dict(response.headers)
    except urllib.error.HTTPError as error:
        return error.code, dict(error.headers or {})


def follow(url: str, timeout: float) -> Result:
    """Follows redirects by hand to tell permanent ones from temporary ones."""
    result = Result(url)
    current = url
    permanent = True
    try:
        for _ in range(10):
            status, headers = request(current, "HEAD", timeout)
            # Plenty of servers don't do HEAD properly.
            if status in {400, 403, 404, 405, 501} or status >= 500:
                status, headers = request(current, "GET", timeout)
            if status in {301, 302, 303, 307, 308} and headers.get("Location"):
                permanent = permanent and status in {301, 308}
                current = urllib.parse.urljoin(current, headers["Location"])
                continue
            result.status = status
            break
        else:
            result.error = "too many redirects"
    except (urllib.error.URLError, socket.timeout, TimeoutError, ssl.SSLError, ConnectionError, ValueError) as error:
        reason = getattr(error, "reason", error)
        result.error = str(reason) or type(error).__name__
    if current != url and permanent and not result.broken:
        result.location = current
    return result


def check(url: str, timeout: float) -> Result:
    """Tries once more after a pause when the request fails outright, as a
    connection now and then does without the link being dead."""
    result = follow(url, timeout)
    if result.error and "timed out" not in result.error:
        time.sleep(2)
        result = follow(url, timeout)
    return result


# Many lookups at once make the system resolver fail some of them ("nodename
# nor servname provided" on macOS), so each host is looked up once, one
# lookup at a time, and the answer kept.
_resolve = socket.getaddrinfo
_resolved: dict[tuple, list] = {}
_resolving = threading.Lock()


def cached_getaddrinfo(host, port, *args, **kwargs):
    key = (host, port, *args, *sorted(kwargs.items()))
    with _resolving:
        if key not in _resolved:
            for attempt in range(3):
                try:
                    _resolved[key] = _resolve(host, port, *args, **kwargs)
                    break
                except socket.gaierror as error:
                    if error.errno == socket.EAI_NONAME and attempt == 2:
                        raise
                    time.sleep(1)
            else:
                raise socket.gaierror(socket.EAI_AGAIN, "lookup failed")
        return _resolved[key]


socket.getaddrinfo = cached_getaddrinfo


def interleave(urls: list[str]) -> list[str]:
    """Orders the links round-robin by host, so the workers spread out over
    sites instead of queueing on the one with the most links."""
    by_host: dict[str, list[str]] = {}
    for url in urls:
        by_host.setdefault(urllib.parse.urlsplit(url).hostname or "", []).append(url)
    rounds = itertools.zip_longest(*by_host.values())
    return [url for row in rounds for url in row if url]


def collect_links(site_dir: Path) -> dict[str, set[str]]:
    """Maps each external URL to the pages that link to it."""
    links: dict[str, set[str]] = {}
    for page in sorted(site_dir.rglob("*.html")):
        where = "/" + page.relative_to(site_dir).as_posix().removesuffix("index.html")
        for url in LINK_RE.findall(page.read_text(encoding="utf-8")):
            url = html.unescape(url).split("#", 1)[0]
            if urllib.parse.urlsplit(url).hostname in OWN_HOSTS:
                continue
            links.setdefault(url, set()).add(where)
    return links


def build(destination: Path) -> None:
    subprocess.run(["hugo", "--quiet", "--destination", str(destination)], cwd=REPO_ROOT, check=True)


def report(title: str, results: list[Result], links: dict[str, set[str]], detail) -> None:
    if not results:
        return
    print(f"\n{title} ({len(results)})")
    for result in sorted(results, key=lambda r: r.url):
        print(f"  {result.url}\n    {detail(result)}")
        for page in sorted(links[result.url]):
            print(f"    on {page}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.strip().splitlines()[0])
    parser.add_argument("site_dir", nargs="?", type=Path, help="a built site (default: build one)")
    parser.add_argument("--redirects", action="store_true", help="also list links that permanently redirect")
    parser.add_argument("--workers", type=int, default=16)
    parser.add_argument("--per-host", type=int, default=3, help="requests to one site at once")
    parser.add_argument("--timeout", type=float, default=15)
    args = parser.parse_args()

    with tempfile.TemporaryDirectory() as scratch:
        site_dir = args.site_dir
        if site_dir is None:
            site_dir = Path(scratch)
            build(site_dir)
        links = collect_links(site_dir)

    print(f"Checking {len(links)} external links...", file=sys.stderr)
    # Per host, so a site with many links doesn't get a burst of requests.
    limits: dict[str, threading.Semaphore] = {}
    lock = threading.Lock()

    def check_limited(url: str) -> Result:
        host = urllib.parse.urlsplit(url).hostname or ""
        with lock:
            limit = limits.setdefault(host, threading.Semaphore(args.per_host))
        with limit:
            return check(url, args.timeout)

    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
        results = list(pool.map(check_limited, interleave(list(links))))
    # The resolver still fails a few lookups under load: whatever failed
    # outright gets one last, unhurried try once the rest is done.
    failed = [r.url for r in results if r.error]
    if failed:
        print(f"Checking {len(failed)} failures again...", file=sys.stderr)
        again = {url: check(url, args.timeout) for url in failed}
        results = [again.get(r.url, r) for r in results]

    broken = [r for r in results if r.broken]
    report("Broken", broken, links, lambda r: r.error or f"HTTP {r.status}")
    report("Unverified (the site refuses scripted requests)", [r for r in results if r.unverified], links, lambda r: f"HTTP {r.status}")
    if args.redirects:
        report("Moved permanently", [r for r in results if r.location], links, lambda r: f"now {r.location}")

    print(f"\n{len(results)} links checked, {len(broken)} broken.")
    return 1 if broken else 0


if __name__ == "__main__":
    sys.exit(main())
