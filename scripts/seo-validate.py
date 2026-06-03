#!/usr/bin/env python3

from __future__ import annotations

import html
import json
import re
import sys
from pathlib import Path


ABS_URL_PREFIX = "https://www.sglavoie.com"
SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
POSTS_DIR = REPO_ROOT / "content" / "posts"

TAG_RE = re.compile(r"<([a-zA-Z0-9:-]+)\b[^>]*>", re.IGNORECASE)
ATTR_RE = re.compile(
    r'([A-Za-z_:][-A-Za-z0-9_:.]*)\s*=\s*("([^"]*)"|\'([^\']*)\'|([^\s>]+))',
    re.DOTALL,
)
JSON_LD_RE = re.compile(
    r"<script\b[^>]*type=(?:\"application/ld\+json\"|'application/ld\+json'|application/ld\+json)[^>]*>(.*?)</script>",
    re.IGNORECASE | re.DOTALL,
)
FRONT_MATTER_RE = re.compile(r"\A---\s*\n(.*?)\n(?:---|\.\.\.)\s*\n", re.DOTALL)
DESCRIPTION_RE = re.compile(r"^description:\s*(.+?)\s*$", re.MULTILINE)
SITEMAP_404_RE = re.compile(rf"{re.escape(ABS_URL_PREFIX)}/404\.html")


def normalize_text(value: str) -> str:
    return " ".join(html.unescape(value).split())


def parse_attributes(tag: str) -> dict[str, str]:
    attributes: dict[str, str] = {}
    for match in ATTR_RE.finditer(tag):
        key = match.group(1).lower()
        raw_value = match.group(3) or match.group(4) or match.group(5) or ""
        attributes[key] = html.unescape(raw_value)
    return attributes


def extract_tags(document: str, tag_name: str) -> list[dict[str, str]]:
    tags: list[dict[str, str]] = []
    for match in TAG_RE.finditer(document):
        if match.group(1).lower() != tag_name.lower():
            continue
        tags.append(parse_attributes(match.group(0)))
    return tags


def extract_json_ld(document: str) -> list[str]:
    return [payload.strip() for payload in JSON_LD_RE.findall(document)]


def read_source_descriptions() -> dict[str, str]:
    descriptions: dict[str, str] = {}
    for path in sorted(POSTS_DIR.glob("*.md")):
        match = FRONT_MATTER_RE.match(path.read_text())
        if not match:
            raise SystemExit(f"error: missing front matter in {path}")

        description_match = DESCRIPTION_RE.search(match.group(1))
        if not description_match:
            raise SystemExit(f"error: missing description in {path}")

        description = description_match.group(1).strip().strip("'\"")
        descriptions[path.stem.lower()] = normalize_text(description)

    return descriptions


def canonical_count(document: str) -> int:
    count = 0
    for tag in extract_tags(document, "link"):
        if tag.get("rel", "").lower() != "canonical":
            continue
        href = tag.get("href", "")
        if href.startswith(ABS_URL_PREFIX):
            count += 1
    return count


def meta_contents(document: str, *, name: str | None = None, property_name: str | None = None) -> list[str]:
    contents: list[str] = []
    for tag in extract_tags(document, "meta"):
        if name is not None and tag.get("name", "").lower() != name.lower():
            continue
        if property_name is not None and tag.get("property", "").lower() != property_name.lower():
            continue
        contents.append(normalize_text(tag.get("content", "")))
    return contents


def relative_to_site(path: Path, site_dir: Path) -> str:
    return str(path.relative_to(site_dir))


def validate_home_structured_data(payloads: list[str], failures: list[str]) -> None:
    if len(payloads) != 1:
        failures.append(f"index.html: expected 1 JSON-LD block on the home page, found {len(payloads)}")
        return

    try:
        data = json.loads(payloads[0])
    except json.JSONDecodeError as exc:
        failures.append(f"index.html: invalid home page JSON-LD ({exc})")
        return

    graph = data.get("@graph")
    if data.get("@context") != "https://schema.org" or not isinstance(graph, list):
        failures.append("index.html: home page JSON-LD is missing @context or @graph")
        return

    graph_types = {entry.get("@type") for entry in graph if isinstance(entry, dict)}
    if {"Person", "WebSite"} - graph_types:
        failures.append("index.html: home page JSON-LD must include Person and WebSite entries")


def validate_post_structured_data(path: Path, payloads: list[str], failures: list[str], site_dir: Path) -> None:
    rel_path = relative_to_site(path, site_dir)
    if len(payloads) != 1:
        failures.append(f"{rel_path}: expected 1 JSON-LD block, found {len(payloads)}")
        return

    try:
        data = json.loads(payloads[0])
    except json.JSONDecodeError as exc:
        failures.append(f"{rel_path}: invalid JSON-LD ({exc})")
        return

    missing_fields = [
        field
        for field in ("@context", "@type", "headline", "description", "url", "mainEntityOfPage")
        if field not in data
    ]
    if missing_fields:
        failures.append(f"{rel_path}: BlogPosting JSON-LD is missing {', '.join(missing_fields)}")
        return

    if data.get("@context") != "https://schema.org" or data.get("@type") != "BlogPosting":
        failures.append(f"{rel_path}: expected BlogPosting schema.org JSON-LD")


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: ./scripts/seo-validate.py <built-site-dir>", file=sys.stderr)
        return 1

    site_dir = Path(sys.argv[1]).expanduser().resolve()
    if not site_dir.is_dir():
        print(f"error: built site directory not found: {site_dir}", file=sys.stderr)
        return 1

    sitemap_path = site_dir / "sitemap.xml"
    if not sitemap_path.is_file():
        print(f"error: sitemap.xml not found in built site directory: {site_dir}", file=sys.stderr)
        return 1

    source_descriptions = read_source_descriptions()
    html_files = sorted(site_dir.rglob("*.html"))
    non_alias_pages: list[Path] = []
    article_pages = sorted((site_dir / "posts").glob("*/index.html"))
    failures: list[str] = []

    for path in html_files:
        document = path.read_text()
        if "http-equiv=refresh" in document.lower():
            continue
        non_alias_pages.append(path)

        canonical_matches = canonical_count(document)
        if canonical_matches != 1:
            failures.append(
                f"{relative_to_site(path, site_dir)}: expected exactly 1 absolute canonical link, found {canonical_matches}"
            )

        og_titles = meta_contents(document, property_name="og:title")
        if len(og_titles) != 1:
            failures.append(
                f"{relative_to_site(path, site_dir)}: expected exactly 1 og:title tag, found {len(og_titles)}"
            )

        if "[TOC]" in document:
            failures.append(f"{relative_to_site(path, site_dir)}: found literal [TOC] output")

    rendered_post_descriptions: dict[str, list[str]] = {}
    for path in article_pages:
        slug = path.parent.name.lower()
        rel_path = relative_to_site(path, site_dir)
        document = path.read_text()

        descriptions = meta_contents(document, name="description")
        if len(descriptions) != 1:
            failures.append(f"{rel_path}: expected exactly 1 meta description, found {len(descriptions)}")
            continue

        rendered_description = descriptions[0]
        expected_description = source_descriptions.get(slug)
        if expected_description is None:
            failures.append(f"{rel_path}: no matching content source found for slug {slug}")
            continue

        if rendered_description != expected_description:
            failures.append(f"{rel_path}: rendered description does not match content front matter")
            continue

        rendered_post_descriptions.setdefault(rendered_description, []).append(rel_path)
        validate_post_structured_data(path, extract_json_ld(document), failures, site_dir)

    for description, paths in sorted(rendered_post_descriptions.items()):
        if len(paths) > 1:
            failures.append(f"duplicate post description used by {', '.join(paths)}")

    home_path = site_dir / "index.html"
    if not home_path.is_file():
        failures.append("index.html: home page not found")
    else:
        validate_home_structured_data(extract_json_ld(home_path.read_text()), failures)

    if SITEMAP_404_RE.search(sitemap_path.read_text()):
        failures.append("sitemap.xml: found forbidden /404.html entry")

    if failures:
        print("SEO validation failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("SEO validation passed.")
    print(f"normal_html_pages={len(non_alias_pages)}")
    print(f"post_pages={len(article_pages)}")
    print("checks=canonical,post-description,og-title,toc,json-ld,sitemap")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
