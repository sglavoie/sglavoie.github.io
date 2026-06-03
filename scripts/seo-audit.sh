#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat >&2 <<'EOF'
Usage: ./scripts/seo-audit.sh <built-site-dir>

Audit a rendered Hugo site for the current SEO baseline.
Override the large-image threshold with SEO_IMAGE_LARGE_BYTES.
EOF
}

if [ "${1:-}" = "" ]; then
  usage
  exit 1
fi

site_dir=${1%/}

if [ ! -d "$site_dir" ]; then
  echo "error: built site directory not found: $site_dir" >&2
  exit 1
fi

if [ ! -f "$site_dir/sitemap.xml" ]; then
  echo "error: sitemap.xml not found in built site directory: $site_dir" >&2
  exit 1
fi

script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
repo_root=$(cd "$script_dir/.." && pwd)
image_root="$repo_root/static/images/posts"
image_threshold_bytes=${SEO_IMAGE_LARGE_BYTES:-524288}

tmp_dir=$(mktemp -d)
trap 'rm -rf "$tmp_dir"' EXIT

html_manifest="$tmp_dir/html-files.txt"
non_alias_manifest="$tmp_dir/non-alias-html-files.txt"
article_manifest="$tmp_dir/article-files.txt"
description_pairs="$tmp_dir/description-pairs.tsv"

find "$site_dir" -name '*.html' | sort >"$html_manifest"

{
  while IFS= read -r file; do
    [ -n "$file" ] || continue
    if ! rg -q 'http-equiv=refresh' "$file"; then
      printf '%s\n' "$file"
    fi
  done <"$html_manifest"
  true
} >"$non_alias_manifest"

if [ -d "$site_dir/posts" ]; then
  find "$site_dir/posts" -mindepth 2 -maxdepth 2 -name index.html | sed '/\/page\//d' | sort >"$article_manifest"
else
  : >"$article_manifest"
fi

count_lines() {
  awk 'NF { count++ } END { print count + 0 }' "$1"
}

extract_description() {
  perl -0ne 'if (/<meta[^>]*name=description[^>]*content="([^"]*)"/i) { print $1 }' "$1"
}

duplicate_description_pages() {
  awk -F '\t' '
    NF == 2 {
      count[$1]++
      rows[++n] = $0
    }
    END {
      for (i = 1; i <= n; i++) {
        split(rows[i], parts, "\t")
        if (count[parts[1]] > 1) {
          total++
        }
      }
      print total + 0
    }
  ' "$description_pairs"
}

{
  while IFS= read -r file; do
    [ -n "$file" ] || continue
    description=$(extract_description "$file")
    if [ -n "$description" ]; then
      printf '%s\t%s\n' "$description" "$file"
    fi
  done <"$non_alias_manifest"
  true
} >"$description_pairs"

duplicate_description_values=$(cut -f1 "$description_pairs" | sort | uniq -d | wc -l | tr -d ' ')
missing_primary_canonicals=$({
  while IFS= read -r file; do
    [ -n "$file" ] || continue
    rg -q '<link[^>]*rel=("canonical"|canonical)[^>]*href=("https://www\.sglavoie\.com[^"]*"|https://www\.sglavoie\.com[^ >]*)[^>]*>' "$file" || printf '%s\n' "$file"
  done <"$non_alias_manifest"
  true
} | wc -l | tr -d ' ')
toc_leaks=$({
  while IFS= read -r file; do
    [ -n "$file" ] || continue
    rg -q '\[TOC\]' "$file" && printf '%s\n' "$file"
  done <"$html_manifest"
  true
} | wc -l | tr -d ' ')
multi_h1_article_pages=$({
  while IFS= read -r file; do
    [ -n "$file" ] || continue
    h1_count=$(rg -o '<h1[ >]' "$file" | wc -l | tr -d ' ')
    [ "$h1_count" -gt 1 ] && printf '%s\n' "$file"
  done <"$article_manifest"
  true
} | wc -l | tr -d ' ')
structured_data_present=$({
  while IFS= read -r file; do
    [ -n "$file" ] || continue
    rg -q 'type=application/ld\+json|type="application/ld\+json"' "$file" && printf '%s\n' "$file"
  done <"$html_manifest"
  true
} | wc -l | tr -d ' ')
missing_structured_data=$({
  while IFS= read -r file; do
    [ -n "$file" ] || continue
    rg -q 'type=application/ld\+json|type="application/ld\+json"' "$file" || printf '%s\n' "$file"
  done <"$non_alias_manifest"
  true
} | wc -l | tr -d ' ')
sitemap_entries=$(rg -o '<url>' "$site_dir/sitemap.xml" | wc -l | tr -d ' ')
sitemap_has_404=$(rg -c 'https://www\.sglavoie\.com/404\.html' "$site_dir/sitemap.xml" || true)
sitemap_has_404=${sitemap_has_404:-0}

if [ -d "$image_root" ]; then
  large_image_assets=$(find "$image_root" -type f \
    \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.gif' -o -iname '*.webp' -o -iname '*.avif' \) \
    -size +"${image_threshold_bytes}"c | wc -l | tr -d ' ')
  large_image_listing=$(find "$image_root" -type f \
    \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.gif' -o -iname '*.webp' -o -iname '*.avif' \) \
    -size +"${image_threshold_bytes}"c \
    -exec stat -f '%z %N' {} + | sort -nr)
else
  large_image_assets=0
  large_image_listing=""
fi

printf 'html_total=%s\n' "$(count_lines "$html_manifest")"
printf 'non_alias_html_total=%s\n' "$(count_lines "$non_alias_manifest")"
printf 'article_pages_total=%s\n' "$(count_lines "$article_manifest")"
printf 'duplicate_description_pages=%s\n' "$(duplicate_description_pages)"
printf 'duplicate_description_values=%s\n' "$duplicate_description_values"
printf 'missing_primary_canonicals=%s\n' "$missing_primary_canonicals"
printf 'toc_leaks=%s\n' "$toc_leaks"
printf 'multi_h1_article_pages=%s\n' "$multi_h1_article_pages"
printf 'structured_data_present=%s\n' "$structured_data_present"
printf 'missing_structured_data=%s\n' "$missing_structured_data"
printf 'sitemap_entries=%s\n' "$sitemap_entries"
printf 'sitemap_has_404=%s\n' "$sitemap_has_404"
printf 'large_image_threshold_bytes=%s\n' "$image_threshold_bytes"
printf 'large_image_assets=%s\n' "$large_image_assets"

printf 'top_large_images:\n'
if [ -n "$large_image_listing" ]; then
  printf '%s\n' "$large_image_listing" | head -n 10
fi
