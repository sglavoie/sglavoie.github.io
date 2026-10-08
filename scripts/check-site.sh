#!/usr/bin/env bash
# Checks the posts' front matter (check-front-matter.py), then builds the
# site into a throwaway directory and fails on anything that shouldn't
# ship: build warnings (broken internal links, see
# render-link.html), SEO regressions (seo-validate.py), and inline scripts
# the CSP would block, redirects to missing pages, broken internal links,
# unlinked post files and lost heading ids (build-validate.py). A second
# build, with drafts, checks that the feature fixture still shows every
# feature of a post (check-fixture.py).
# Run by the pre-commit hook; pass a directory to keep the build for
# inspection.
set -euo pipefail

cd "$(dirname "$0")/.."

# The drafts build is always thrown away; the other is kept when named.
drafts=$(mktemp -d)
if [[ $# -gt 0 ]]; then
  destination=$1
  trap 'rm -rf "$drafts"' EXIT
else
  destination=$(mktemp -d)
  trap 'rm -rf "$destination" "$drafts"' EXIT
fi

./scripts/check-front-matter.py
# Warnings and errors go to stderr; the build summary on stdout is noise here.
hugo --minify --panicOnWarning --destination "$destination" >/dev/null
./scripts/seo-validate.py "$destination"
./scripts/build-validate.py "$destination"
hugo --minify --panicOnWarning --buildDrafts --destination "$drafts" >/dev/null
./scripts/check-fixture.py "$drafts"
