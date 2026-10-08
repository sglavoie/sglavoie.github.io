#!/usr/bin/env python3
"""Checks a built site for what the browser or Cloudflare Pages would break on.

- Every inline <script> matches a hash in the Content-Security-Policy of
  _headers (layouts/index.headers), or the browser blocks it.
- Every internal destination in _redirects is a page or file of the build,
  and no source is listed twice (the first match wins, so a second is dead).

Usage: build-validate.py SITE_DIR
"""

from __future__ import annotations

import base64
import hashlib
import re
import sys
from pathlib import Path

# Inline scripts the CSP governs: JSON-LD and other data blocks aren't run.
INLINE_SCRIPT_RE = re.compile(r"<script(\s[^>]*)?>(.*?)</script>", re.IGNORECASE | re.DOTALL)
SRC_OR_DATA_RE = re.compile(r"\bsrc=|type=\"?application/(?:ld\+)?json", re.IGNORECASE)
CSP_RE = re.compile(r"^\s*Content-Security-Policy:\s*(.+)$", re.MULTILINE)
CSP_HASH_RE = re.compile(r"'(sha256-[A-Za-z0-9+/=]+)'")


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


def main() -> int:
    if len(sys.argv) != 2:
        print(__doc__.strip().splitlines()[-1], file=sys.stderr)
        return 2
    site_dir = Path(sys.argv[1])
    failures: list[str] = []
    check_inline_scripts(site_dir, failures)
    check_redirects(site_dir, failures)
    for failure in failures:
        print(f"FAIL {failure}", file=sys.stderr)
    if failures:
        return 1
    print("Build validation passed: inline scripts match the CSP and redirects land on built pages.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
