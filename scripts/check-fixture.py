#!/usr/bin/env python3
"""Checks that the feature fixture still shows every feature of a post.

content/posts/feature-fixture.md is a draft that uses every feature a post
can have. Built with drafts (check-site.sh does), its page must still carry
the markup each feature is made of, or a template change dropped one. What
the scripts then do with that markup is for a person to look at:
`hugo server -D`, then /posts/feature-fixture/.

Usage: check-fixture.py SITE_DIR   (a build made with --buildDrafts)
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

FIXTURE = "/posts/feature-fixture/"

# What the page must contain, by feature: a regular expression over the
# minified HTML, where attribute quotes may be left out.
EXPECTED = {
    "table of contents": r"<aside id=\"?toc\b",
    "collapsible sections (15 min or more)": r"\bdata-collapsible\b",
    "section bar": r"class=\"?section-bar\b",
    "note on older posts": r"\bage-notice\b",
    "note on AI assistance": r"\bai-notice\b",
    "AI assistance label": r"class=\"?ai-label\b",
    "heading links": r"class=\"?heading-anchor\b",
    "note callout": r"callout--note\b",
    "tip callout with a title": r"callout--tip\b[\s\S]*?callout__title[^>]*>A tip with its own title<",
    "important callout": r"callout--important\b",
    "warning callout": r"callout--warning\b",
    "caution callout": r"callout--caution\b",
    "footnote references": r"class=\"?footnote-ref\b",
    "titled code block": r"code-block--titled\b[\s\S]*?code-block__title[^>]*>main\.go<",
    "highlighted code lines": r"class=\"?line hl\b",
    "wrapped code block": r"code-block--wrap\b",
    "shell prompts": r"\bdata-prompted\b[\s\S]*?code-block__prompt",
    "copy and wrap buttons": r"code-block__copy\b[\s\S]*?code-block__wrap\b|code-block__wrap\b[\s\S]*?code-block__copy\b",
    "table": r"class=\"?table-wrapper\b[\s\S]*?<table",
    "responsive WebP image": r"<picture>[\s\S]*?type=\"?image/webp",
    "image alt text": r"<img[^>]*alt=\"?The i3 window manager",
    "link to another post": r"href=\"?/posts/git-worktrees-for-a-better-parallel-workflow/",
    "link to a section of another post": r"href=\"?/posts/aliases-also-known-as-terminal-users-best-friends/#some-aliases-that-i-find-useful",
    "save for later button": r"\bdata-save\b",
    "share button": r"\bdata-share\b",
    "suggest an edit link": r"/edit/main/content/posts/feature-fixture\.md",
    "Markdown alternate link": r"<link[^>]*type=\"?text/markdown",
}


def main() -> int:
    if len(sys.argv) != 2:
        print(__doc__.strip().splitlines()[-1], file=sys.stderr)
        return 2
    site_dir = Path(sys.argv[1])
    page = site_dir / FIXTURE.strip("/") / "index.html"
    if not page.is_file():
        print(f"FAIL {FIXTURE} isn't in the build (built with --buildDrafts?)", file=sys.stderr)
        return 1
    html = page.read_text(encoding="utf-8")
    failures = [feature for feature, pattern in EXPECTED.items() if not re.search(pattern, html)]

    if not (page.parent / "index.md").is_file():
        failures.append("Markdown copy (index.md)")
    previews = site_dir / "posts" / "previews.json"
    if not previews.is_file() or FIXTURE not in json.loads(previews.read_text(encoding="utf-8")):
        failures.append("link preview details (posts/previews.json)")

    for feature in failures:
        print(f"FAIL {FIXTURE}: no {feature}", file=sys.stderr)
    if failures:
        print("A template change dropped a feature; content/posts/feature-fixture.md uses each one.", file=sys.stderr)
        return 1
    print(f"Fixture check passed: {len(EXPECTED) + 2} post features render on {FIXTURE}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
