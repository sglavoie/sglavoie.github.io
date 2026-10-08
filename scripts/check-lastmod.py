#!/usr/bin/env python3
"""Fails when a staged post's text changed but its `lastmod` didn't.

The note on older posts (partials/age-notice.html) goes by `lastmod`, so a
revision that doesn't bump it keeps calling the post out of date. Front
matter edits and changes in whitespace alone don't count as a revision.
A fix too small to date can be committed anyway with
`SKIP=check-lastmod git commit`.

Usage: check-lastmod.py [POST ...]   (the staged versions are compared to HEAD)
"""

from __future__ import annotations

import re
import subprocess
import sys

FRONT_MATTER = re.compile(r"\A---\n(.*?)\n---\n", re.S)
LASTMOD = re.compile(r'^lastmod:\s*"?([^"\n]*)"?\s*$', re.M)


def git_show(revision: str, path: str) -> str | None:
    result = subprocess.run(
        ["git", "show", f"{revision}:{path}"], capture_output=True, text=True
    )
    return result.stdout if result.returncode == 0 else None


def split(text: str) -> tuple[str, str]:
    """Returns the post's lastmod (empty without one) and its body."""
    match = FRONT_MATTER.match(text)
    if not match:
        return "", text
    lastmod = LASTMOD.search(match.group(1))
    return (lastmod.group(1) if lastmod else ""), text[match.end() :]


def main() -> int:
    stale = []
    for path in sys.argv[1:]:
        before = git_show("HEAD", path)
        after = git_show("", path)
        if before is None or after is None:
            continue  # a new or deleted post
        lastmod_before, body_before = split(before)
        lastmod_after, body_after = split(after)
        if body_before.split() != body_after.split() and lastmod_before == lastmod_after:
            stale.append(path)
    for path in stale:
        print(f"FAIL {path}: the text changed but lastmod didn't", file=sys.stderr)
    if stale:
        print(
            "Set lastmod in the front matter, or commit with "
            "SKIP=check-lastmod for a fix too small to date.",
            file=sys.stderr,
        )
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
