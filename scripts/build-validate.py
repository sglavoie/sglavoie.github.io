#!/usr/bin/env python3
"""Checks a built site for what the browser or Cloudflare Pages would break on.

- Every inline <script> matches a hash in the Content-Security-Policy of
  _headers (layouts/index.headers), or the browser blocks it.
- Every internal destination in _redirects is a page or file of the build,
  and no source is listed twice (the first match wins, so a second is dead).
- Headings in a post go down one level at a time from the title (h1), so
  the table of contents and the outline screen readers give stay nested.
- Every link and source to the site itself (href, src, srcset, written in
  Markdown, raw HTML or a template) is a file of the build, and its
  fragment, if any, an id on that page.
- Every file in static/images/posts and static/files is linked from the
  build somewhere, so none ships for nothing.
- Every post heading id recorded in scripts/heading-ids.txt is still in the
  build, so links to a section from elsewhere keep landing on it. After
  renaming a heading, keep its old id with an <a id="old-id"></a> in the
  section, or drop the id from the list if nothing links to it.
  --record-headings rewrites the list from the build, to add new headings.

Usage: build-validate.py [--record-headings] SITE_DIR
"""

from __future__ import annotations

import base64
import hashlib
import html
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

REPO = Path(__file__).resolve().parent.parent
SITE_URL = "https://www.sglavoie.com"
HEADING_IDS = REPO / "scripts" / "heading-ids.txt"
# Files of these trees are only worth shipping when something links to them.
LINKED_STATIC = ("images/posts", "files")
# Written by Pagefind after Hugo, so never in the build checked here.
NOT_BUILT_BY_HUGO = ("/pagefind/",)

# Inline scripts the CSP governs: JSON-LD and other data blocks aren't run.
INLINE_SCRIPT_RE = re.compile(r"<script(\s[^>]*)?>(.*?)</script>", re.IGNORECASE | re.DOTALL)
SRC_OR_DATA_RE = re.compile(r"\bsrc=|type=\"?application/(?:ld\+)?json", re.IGNORECASE)
CSP_RE = re.compile(r"^\s*Content-Security-Policy:\s*(.+)$", re.MULTILINE)
CSP_HASH_RE = re.compile(r"'(sha256-[A-Za-z0-9+/=]+)'")
HEADING_RE = re.compile(r"<h([1-6])\b[^>]*>(.*?)</h\1>", re.IGNORECASE | re.DOTALL)
TAG_RE = re.compile(r"<[^>]+>")


def check_inline_scripts(site_dir: Path, failures: list[str]) -> None:
    headers = site_dir / "_headers"
    if not headers.is_file():
        failures.append("_headers is missing from the build")
        return
    match = CSP_RE.search(headers.read_text(encoding="utf-8"))
    if not match:
        failures.append("_headers has no Content-Security-Policy")
        return
    allowed = set(CSP_HASH_RE.findall(match.group(1)))
    for page in sorted(site_dir.rglob("*.html")):
        for attributes, body in INLINE_SCRIPT_RE.findall(page.read_text(encoding="utf-8")):
            if SRC_OR_DATA_RE.search(attributes or ""):
                continue
            digest = base64.b64encode(hashlib.sha256(body.encode("utf-8")).digest()).decode()
            if f"sha256-{digest}" not in allowed:
                where = page.relative_to(site_dir).as_posix()
                failures.append(
                    f"{where}: inline script not allowed by the CSP"
                    " (bundle it in assets/js, or write it with partials/inline-script.html)"
                )


def exists_in_build(site_dir: Path, path: str) -> bool:
    path = path.split("#", 1)[0].split("?", 1)[0]
    target = site_dir / path.lstrip("/")
    if path.endswith("/"):
        return (target / "index.html").is_file()
    return target.is_file() or (target / "index.html").is_file()


def check_redirects(site_dir: Path, failures: list[str]) -> None:
    redirects = site_dir / "_redirects"
    if not redirects.is_file():
        return
    sources: dict[str, int] = {}
    for number, line in enumerate(redirects.read_text(encoding="utf-8").splitlines(), start=1):
        fields = line.split()
        if not fields or fields[0].startswith("#"):
            continue
        if len(fields) < 2:
            failures.append(f"_redirects:{number}: no destination")
            continue
        source, destination = fields[0], fields[1]
        if source in sources:
            failures.append(f"_redirects:{number}: {source} is already redirected on line {sources[source]}")
        else:
            sources[source] = number
        # External, or filled in from the request (:splat, :placeholder).
        if not destination.startswith("/") or ":" in destination:
            continue
        if not exists_in_build(site_dir, destination):
            failures.append(f"_redirects:{number}: {source} -> {destination}, which isn't in the build")


def check_heading_levels(site_dir: Path, failures: list[str]) -> None:
    for page in sorted((site_dir / "posts").glob("*/index.html")):
        document = page.read_text(encoding="utf-8")
        # The article text, between the post header and the post footer.
        start = document.find("article_text")
        end = document.find("post-footer", start)
        if start == -1:
            continue
        previous = 1
        for level, inner in HEADING_RE.findall(document[start:end]):
            level = int(level)
            if level > previous + 1:
                where = page.relative_to(site_dir).as_posix()
                text = html.unescape(TAG_RE.sub("", inner)).rstrip("#").strip()
                failures.append(f"{where}: h{level} \"{text}\" follows an h{previous}")
            previous = level


class PageParser(HTMLParser):
    """The ids of a page, its links and sources, and its post heading ids."""

    LINK_ATTRIBUTES = {"href", "src", "srcset", "poster"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: set[str] = set()
        self.links: list[str] = []
        self.heading_ids: list[str] = []
        self.refresh = False
        self._in_article = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {name: value or "" for name, value in attrs}
        if "id" in values:
            self.ids.add(values["id"])
        if tag == "meta" and values.get("http-equiv", "").lower() == "refresh":
            self.refresh = True
        if "article_text" in values.get("class", "").split():
            self._in_article = True
        elif "post-footer" in values.get("class", "").split():
            self._in_article = False
        if self._in_article and re.fullmatch(r"h[2-6]", tag) and values.get("id"):
            self.heading_ids.append(values["id"])
        # <link rel=preconnect> and friends name origins, not files.
        if tag == "link" and values.get("rel") in {"preconnect", "dns-prefetch"}:
            return
        for name, value in values.items():
            if name not in self.LINK_ATTRIBUTES or not value:
                continue
            if name == "srcset":
                self.links.extend(part.split()[0] for part in value.split(",") if part.strip())
            else:
                self.links.append(value)


def page_url(site_dir: Path, page: Path) -> str:
    relative = page.relative_to(site_dir).as_posix()
    if relative == "index.html":
        return "/"
    if relative.endswith("/index.html"):
        return "/" + relative.removesuffix("index.html")
    return "/" + relative


def parse_pages(site_dir: Path) -> dict[str, PageParser]:
    pages: dict[str, PageParser] = {}
    for page in sorted(site_dir.rglob("*.html")):
        parser = PageParser()
        parser.feed(page.read_text(encoding="utf-8"))
        pages[page_url(site_dir, page)] = parser
    return pages


def internal_path(base: str, link: str) -> tuple[str, str] | None:
    """The path and fragment a link goes to on this site, or None."""
    if link.startswith(SITE_URL + "/"):
        link = link.removeprefix(SITE_URL)
    parts = urlsplit(urljoin(base, link))
    if parts.scheme or parts.netloc:
        return None
    return unquote(parts.path), unquote(parts.fragment)


def check_internal_links(site_dir: Path, pages: dict[str, PageParser], failures: list[str]) -> None:
    for url, parser in pages.items():
        if parser.refresh:
            continue
        reported: set[str] = set()
        for link in parser.links:
            target = internal_path(url, link)
            if target is None or link in reported:
                continue
            path, fragment = target
            if path.startswith(NOT_BUILT_BY_HUGO):
                continue
            if not exists_in_build(site_dir, path):
                reported.add(link)
                failures.append(f"{url}: link to {link}, which isn't in the build")
                continue
            # Text fragments (#:~:text=) aren't ids; browsers find the text.
            if not fragment or fragment.startswith(":~:") or fragment == "top":
                continue
            page = path if path.endswith((".html", "/")) else path + "/"
            target_page = pages.get(page.removesuffix("index.html"))
            if target_page is not None and fragment not in target_page.ids:
                reported.add(link)
                failures.append(f"{url}: link to {link}, but that page has no id \"{fragment}\"")


def check_linked_static(site_dir: Path, failures: list[str]) -> None:
    built_text = "\n".join(
        unquote(path.read_text(encoding="utf-8", errors="replace"))
        for path in site_dir.rglob("*")
        if path.suffix in {".html", ".xml", ".json", ".css", ".js"}
    )
    for tree in LINKED_STATIC:
        root = REPO / "static" / tree
        for file in sorted(root.rglob("*")):
            if not file.is_file() or file.name.startswith("."):
                continue
            path = "/" + file.relative_to(REPO / "static").as_posix()
            if path not in built_text:
                failures.append(f"static{path}: nothing in the build links to it (delete it, or link it)")


def post_heading_ids(pages: dict[str, PageParser]) -> list[str]:
    return [
        url + "#" + heading_id
        for url, parser in pages.items()
        if url.startswith("/posts/") and not parser.refresh
        for heading_id in parser.heading_ids
    ]


def recorded_heading_ids() -> set[str]:
    if not HEADING_IDS.is_file():
        return set()
    lines = HEADING_IDS.read_text(encoding="utf-8").splitlines()
    return {line.strip() for line in lines if line.strip() and not line.startswith("#")}


def check_heading_ids(pages: dict[str, PageParser], failures: list[str]) -> None:
    for anchor in sorted(recorded_heading_ids()):
        url, _, heading_id = anchor.partition("#")
        page = pages.get(url)
        if page is None:
            failures.append(f"{anchor}: recorded heading, but {url} isn't in the build (redirect it in static/_redirects, or drop the line from scripts/heading-ids.txt)")
        elif heading_id not in page.ids:
            failures.append(f"{anchor}: recorded heading is gone (keep <a id=\"{heading_id}\"></a> in its section, or drop the line from scripts/heading-ids.txt)")


def record_heading_ids(pages: dict[str, PageParser]) -> None:
    anchors = sorted(set(post_heading_ids(pages)))
    header = (
        "# Post heading ids that links from elsewhere may use. build-validate.py\n"
        "# fails when one leaves the build; `build-validate.py --record-headings\n"
        "# SITE_DIR` rewrites this list from a build.\n"
    )
    HEADING_IDS.write_text(header + "\n".join(anchors) + "\n", encoding="utf-8")
    print(f"Recorded {len(anchors)} heading ids in {HEADING_IDS.relative_to(REPO)}.")


def main() -> int:
    arguments = sys.argv[1:]
    record = "--record-headings" in arguments
    if record:
        arguments.remove("--record-headings")
    if len(arguments) != 1:
        print(__doc__.strip().splitlines()[-1], file=sys.stderr)
        return 2
    site_dir = Path(arguments[0])
    pages = parse_pages(site_dir)
    if record:
        record_heading_ids(pages)
        return 0
    failures: list[str] = []
    check_inline_scripts(site_dir, failures)
    check_redirects(site_dir, failures)
    check_heading_levels(site_dir, failures)
    check_internal_links(site_dir, pages, failures)
    check_linked_static(site_dir, failures)
    check_heading_ids(pages, failures)
    for failure in failures:
        print(f"FAIL {failure}", file=sys.stderr)
    if failures:
        return 1
    print(
        "Build validation passed: inline scripts match the CSP, redirects land on built pages,"
        " post headings are nested, internal links resolve, linked static files are used"
        " and recorded headings remain."
    )
    unrecorded = len(set(post_heading_ids(pages)) - recorded_heading_ids())
    if unrecorded:
        print(
            f"Note: {unrecorded} post heading id(s) aren't in scripts/heading-ids.txt yet;"
            f" record them with ./scripts/build-validate.py --record-headings {site_dir}"
        )
    return 0


if __name__ == "__main__":
    sys.exit(main())
