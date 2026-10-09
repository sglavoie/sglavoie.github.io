#!/usr/bin/env python3
"""Checks the front matter of every post for what the templates rely on.

- Each post has a title, date, slug, summary and description, one
  category and at least one tag: single.html takes the first category
  for the post header, and Pagefind's filters take both.
- No key is misspelled (`lastmode`, `tag`...), which Hugo would ignore.
- Dates read as dates, and `lastmod` isn't before `date`.
- Titles and slugs are unique, as two posts at the same address would be
  one page.
- No two spellings of a tag, category or series differ only by case,
  punctuation or a plural (`design pattern`, `design-patterns`), which
  would split their posts over two pages.
- An `image` for social cards is a file of static/.
- Each series has a content/series/<slug>/_index.md, whose title keeps
  the name as written (Hugo would otherwise title-case it).

A series with a single post lists nothing yet (partials/series.html); it's
reported as a note, not a failure, since its next part may be on the way.

Usage: check-front-matter.py
"""

from __future__ import annotations

import re
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
POSTS = REPO / "content" / "posts"
FRONT_MATTER = re.compile(r"\A---\n(.*?)\n---\n", re.S)
KEY = re.compile(r"^([A-Za-z_]+):\s*(.*)$")
ITEM = re.compile(r"^\s+-\s+(.*)$")

REQUIRED = ("title", "date", "slug", "summary", "description")
KNOWN = set(REQUIRED) | {
    "ai_assistance",
    "author",
    "book_author",
    "categories",
    "draft",
    "evergreen",
    "featured",
    "image",
    "lastmod",
    "series",
    "skim_notes",
    "tags",
    "teaser",
    # Hugo's own.
    "aliases",
    "build",
    "expiryDate",
    "keywords",
    "publishDate",
    "robots",
    "sitemap",
    "url",
    "weight",
}
TERMS = ("tags", "categories", "series")
# How much an AI assistant wrote; layouts/partials/ai-assistance.html has the words for each.
AI_ASSISTANCE = ("drafted", "assisted")


def unquote(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
        return value[1:-1]
    return value


def parse(text: str) -> dict[str, str | list[str]] | None:
    """Top-level `key: value` pairs and `- item` lists, as the posts write
    them; enough for these checks without a YAML library."""
    match = FRONT_MATTER.match(text)
    if not match:
        return None
    fields: dict[str, str | list[str]] = {}
    current = None
    for line in match.group(1).splitlines():
        key = KEY.match(line)
        if key:
            current = key.group(1)
            value = key.group(2).strip()
            fields[current] = unquote(value) if value else []
            continue
        item = ITEM.match(line)
        if item and current and isinstance(fields[current], list):
            fields[current].append(unquote(item.group(1)))
    return fields


def terms(fields: dict[str, str | list[str]], key: str) -> list[str]:
    value = fields.get(key, [])
    return [value] if isinstance(value, str) and value else list(value)


def parse_date(value: str) -> datetime | None:
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).replace(tzinfo=None)
    except ValueError:
        return None


def spelling_key(term: str) -> str:
    """What two spellings of one term have in common."""
    key = re.sub(r"[^a-z0-9]", "", term.lower())
    return key[:-1] if key.endswith("s") else key


def main() -> int:
    failures: list[str] = []
    notes: list[str] = []
    titles: dict[str, str] = {}
    slugs: dict[str, str] = {}
    spellings: dict[str, dict[str, set[str]]] = {key: defaultdict(set) for key in TERMS}
    series_posts: dict[str, list[str]] = defaultdict(list)

    for post in sorted(POSTS.glob("*.md")):
        name = post.relative_to(REPO).as_posix()
        fields = parse(post.read_text(encoding="utf-8"))
        if fields is None:
            failures.append(f"{name}: no front matter")
            continue

        for key in REQUIRED:
            if not fields.get(key):
                failures.append(f"{name}: no {key}")
        for key in sorted(set(fields) - KNOWN):
            failures.append(f"{name}: unknown key {key!r} (misspelled? add it to KNOWN if it's new)")
        if "ai_assistance" in fields and fields["ai_assistance"] not in AI_ASSISTANCE:
            failures.append(f"{name}: ai_assistance {fields['ai_assistance']!r} isn't one of {', '.join(AI_ASSISTANCE)}")
        if len(terms(fields, "categories")) != 1:
            failures.append(f"{name}: needs exactly one category, has {len(terms(fields, 'categories'))}")
        if not terms(fields, "tags"):
            failures.append(f"{name}: no tags")

        date = parse_date(str(fields.get("date", "")))
        if fields.get("date") and date is None:
            failures.append(f"{name}: date {fields['date']!r} isn't a date")
        if fields.get("lastmod"):
            lastmod = parse_date(str(fields["lastmod"]))
            if lastmod is None:
                failures.append(f"{name}: lastmod {fields['lastmod']!r} isn't a date")
            elif date and lastmod < date:
                failures.append(f"{name}: lastmod {fields['lastmod']} is before date {fields['date']}")

        for key, seen in (("title", titles), ("slug", slugs)):
            value = str(fields.get(key, ""))
            if value and value in seen:
                failures.append(f"{name}: same {key} as {seen[value]}: {value!r}")
            elif value:
                seen[value] = name

        for key in TERMS:
            for term in terms(fields, key):
                spellings[key][spelling_key(term)].add(term)
        for series in terms(fields, "series"):
            series_posts[series].append(name)

        image = fields.get("image")
        if isinstance(image, str) and image and not (REPO / "static" / image.lstrip("/")).is_file():
            failures.append(f"{name}: image {image} isn't in static/")

    for key in TERMS:
        for variants in spellings[key].values():
            if len(variants) > 1:
                failures.append(f"{key} spelled more than one way: {', '.join(sorted(variants))}")
    for series, posts in sorted(series_posts.items()):
        slug = re.sub(r"[^a-z0-9-]", "", re.sub(r"\s+", "-", series.lower()))
        if not (REPO / "content" / "series" / slug / "_index.md").is_file():
            failures.append(f"series {series!r} has no content/series/{slug}/_index.md")
        if len(posts) == 1:
            notes.append(f"series {series!r} has a single post ({posts[0]}), so it lists nothing yet")

    for failure in failures:
        print(f"FAIL {failure}", file=sys.stderr)
    for note in notes:
        print(f"Note: {note}")
    if failures:
        return 1
    print("Front matter check passed: required fields, known keys, AI assistance levels, dates, unique titles and slugs, one spelling per term.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
