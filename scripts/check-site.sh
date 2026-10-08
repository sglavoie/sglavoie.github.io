#!/usr/bin/env bash
# Builds the site into a throwaway directory and fails on anything that
# shouldn't ship: build warnings (broken internal links, see
# render-link.html) and SEO regressions (seo-validate.py). Run by the
# pre-commit hook; pass a directory to keep the build for inspection.
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ $# -gt 0 ]]; then
  destination=$1
else
  destination=$(mktemp -d)
  trap 'rm -rf "$destination"' EXIT
fi

hugo --minify --panicOnWarning --quiet --destination "$destination"
./scripts/seo-validate.py "$destination"
