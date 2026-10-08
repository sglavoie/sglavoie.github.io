# Source code for [sglavoie.com](https://www.sglavoie.com/)

This repository contains the source code for my personal website, a blog describing my learning path in all things related to computer science.

Please feel free to reuse any of the code you find useful.

## Toolchain

The site is generated with **[Hugo](https://gohugo.io/)** (extended), a fast static-site generator written in Go. Content is authored in Markdown and rendered to static HTML/CSS/JS at build time. Client-side search is provided by **[Pagefind](https://pagefind.app/)**.

Required Hugo version is pinned in [`hugo.toml`](./hugo.toml) and via the `HUGO_VERSION` environment variable on Cloudflare Pages. See the [Hugo install docs](https://gohugo.io/installation/) for setup.

The site is deployed to **[Cloudflare Pages](https://pages.cloudflare.com/)**, which automatically builds and publishes on every push to `main`.

## How to use

### Develop locally (fast iteration, no search)

```bash
hugo server
```

Then open <http://localhost:1313/>. Live-reloads on content changes.

Search is **not** available in this mode: `hugo server` serves from memory and never writes `public/`, so Pagefind has nothing to index. Use the preview command below when search needs to be exercised.

### Preview production build locally (with search)

```bash
hugo --minify && npx -y pagefind --site public --serve
```

Then open <http://localhost:1414/>. This produces a full production-like build and serves it via Pagefind's static server, so search works end-to-end. There is no live reload — re-run the command after content changes.

### Production build

```bash
hugo --minify && npx -y pagefind --site public
```

The built site is written to `public/`. Cloudflare Pages runs this exact command (build command in dashboard) with output directory `public`.

### Check links and SEO

```bash
./scripts/check-site.sh
```

This first runs `./scripts/check-front-matter.py`, which fails on a post missing its title, date, slug, summary, description, single category or tags, on a misspelled front matter key, on a `lastmod` before the `date` or either not a date, on two posts with the same title or slug, on a tag, category or series spelled two ways (differing only in case, punctuation or a plural), and on an `image` that isn't in `static/`. It then builds the site into a throwaway directory with `--panicOnWarning`, and runs `./scripts/seo-validate.py` and `./scripts/build-validate.py` on it. `render-link.html` warns about Markdown links to site paths with no page or static file, fragments with no matching heading, and bare domains missing `https://`, so any of them fails the check. `render-codeblock.html` warns about a code block language written other than its usual name (`txt` for `text`, `sh` for `bash`...). `build-validate.py` fails on an inline script the Content-Security-Policy would block, on a `static/_redirects` rule that points at a page that isn't built or repeats an earlier source, on a post heading that skips a level (an `h4` straight after an `h2`), on any link or image to the site (Markdown, raw HTML or a template) whose file or `#fragment` isn't in the build, on a file of `static/images/posts/` or `static/files/` that nothing links to, on an image in the text of a post or page with no alt text, and on a post heading id listed in `scripts/heading-ids.txt` that's gone, since links from elsewhere may point at it. After renaming a heading, keep its old id with `<a id="old-id"></a>` in the section, or drop it from the list; `./scripts/build-validate.py --record-headings <built-site-dir>` rewrites the list from a build, which the check suggests when new headings aren't in it yet. Pass a directory to keep the build. The pre-commit hook runs it whenever content, layouts, assets, static files or `hugo.toml` change (`pre-commit install` once to enable the hooks). Another hook, `scripts/check-lastmod.py`, fails when a staged post's text changed but its `lastmod` didn't; commit with `SKIP=check-lastmod` for a fix too small to date.

### Check external links

```bash
./scripts/check-external-links.py [--redirects] [built-site-dir]
```

Checks every external link in a build (it builds one when no directory is given) and fails on the broken ones: 4xx and 5xx answers, hosts that no longer exist, timeouts. `--redirects` also lists links that moved permanently, with where they go now. Sites that refuse scripted requests (LinkedIn, rate limits, bot walls) are listed as unverified rather than broken. It goes over the network and takes a few minutes, so it isn't part of the pre-commit hook.

### Response headers and scripts

Cloudflare's `_headers` file is generated from `layouts/index.headers`, so its Content-Security-Policy can carry the hashes of the two scripts that must run inline (the saved theme, and the table of contents' open state), both in `assets/js/inline/` and written into pages by `partials/inline-script.html`. Everything else goes in the bundle under `assets/js/`, where `main.js` starts each part; page-specific parts return early on other pages.

### Writing posts

- **Callouts:** GitHub-style alerts, `> [!NOTE]`, `> [!TIP] Optional title`, `> [!IMPORTANT]`, `> [!WARNING]` or `> [!CAUTION]`, render as callouts.
- **Series:** posts sharing a `series: "Name"` front matter value list each other, oldest first, under the post header. `series` is a taxonomy: the name links to the series' page at `/series/<slug>/`, which lists its posts oldest first and has its own RSS feed, and `/topics/` lists every series. Give a new series a `content/series/<slug>/_index.md` with its `title` (as written) and `description`.
- **Feeds:** the home page publishes full-text RSS, Atom and JSON feeds under `/feeds/`, and every tag, category and series its own RSS feed at `feed.xml`.
- **Images:** keep them in `static/images/posts/` and link them as Markdown or `<img>` tags. Hugo serves PNGs and JPEGs as WebP in widths sized for the column (`partials/responsive-images.html`), so there's no need to make WebP copies by hand. Images shown smaller than their size open full size on click.
- **Code:** a fenced block takes `{title="file.go"}` for a file name, `{hl_lines="2-4"}` to highlight lines and `{wrap=true}` to wrap long lines. Readers can wrap any other block that scrolls sideways with its "Wrap" button. In shell blocks, a leading `$ ` is a prompt: readers can't select it, and the copy button copies only the commands, leaving out the prompts and the output.
- **Offline:** a service worker (`static/sw.js`) keeps pages readers have opened, and `/offline/` lists them when there's no connection, with when each was saved and how far into each post the reader got. A saved page read offline opens with a note saying when it was saved. It isn't registered under `hugo server`.
- **Older posts:** a post last updated more than `stale_after_years` (in `hugo.toml`) before the build opens with a note that details may have changed. Set `lastmod` in the front matter when revising a post; book summaries and posts with `evergreen: true` never get the note.
- **Footnotes:** `[^1]` references show their note beside them on hover or focus.
- **Reading position:** posts remember the section a reader left them at, in their browser, and offer to go back to it; finishing the post forgets it. Lists of posts (home page, archives, tag and category pages, related posts) mark the ones read to the end as "Read" and the others started with how far the reader got. On narrow screens, the section bar shows the minutes left.
- **New since the last visit:** lists of posts other than related posts mark the ones a reader hasn't opened as "New" or "Updated" when they were published or revised since that reader's previous visit (page views more than 30 minutes apart), and a post finished before its last revision as "Revised since read". Visits compare the newest post and revision dates of the builds the reader saw, set on `<html>` by `partials/newest-dates.html`, so a post dated before it went live still counts as new. A first visit marks nothing.
- **Collapsible sections:** posts with a table of contents and a reading time of 15 minutes or more get a button beside each `##` heading that collapses its section, and "Collapse all sections" in the table of contents, which leaves an outline. Sections start expanded, links to anything in a collapsed one expand it, and a printout has every section.
- **Passage links:** with text selected in a post, the `c` shortcut and the share button give a link to that passage (`#:~:text=`), which browsers scroll to and highlight.
- **Search:** results filter by category (chips) and by tag (a menu); posts carry both as Pagefind filters. The arrow keys move from the query down the results and back.
- **Random post:** `g` then `r`, or `/random/`, opens a post at random.
- **Archives:** `/archives/?category=<slug>` and `/archives/?tag=<slug>` filter the list; tag and category pages link to it as "By year".
- **Tables:** with three rows or more, a table's column headers sort it, ascending, descending, then back to the order of the post.
- **Revisions:** a post's "Updated" date links to its history on GitHub, and the home page lists the three posts revised last ("Recently revised"), marking those a reader finished before the revision.
- **Learning logs:** pages with `learning_log: true` (the yearly learning progress) open with links to the other years, a calendar with a square per day logged, shaded by its entries and linking to it, and a filter that keeps the matching entries (`?q=` fills it). They're read from the `## Month` and `### day` headings.
- **By the numbers:** `/stats/` (linked from the archives) counts posts, words and reading time, per year, category and tag, and lists the longest posts, all at build time.
- **Linked from:** a post lists the pages whose text links to it, newest first, above its related posts, which leave those pages out.
- **Skip link:** the first Tab on any page offers "Skip to content", which moves focus past the header to `<main id="main">`.
- **Fixing a post:** each post links to its file on GitHub to suggest an edit, and to a new issue to report a problem (`params.repo` in `hugo.toml`).

### SEO baseline audit

```bash
baseline_dir=/tmp/sglavoie-seo-baseline-public
hugo --minify --destination "$baseline_dir"
./scripts/seo-audit.sh "$baseline_dir"
```

This audits rendered HTML plus `static/images/posts` and reports the current counts for duplicate descriptions, missing canonicals, literal `[TOC]` output, multi-`h1` article pages, missing JSON-LD, sitemap coverage, large image assets, and tags used by a single post (`single_post_tags`), whose page and search filter lead nowhere new. Override the large-image threshold with `SEO_IMAGE_LARGE_BYTES`.

### SEO regression validation

```bash
validation_dir=/tmp/sglavoie-seo-validate-public
hugo --minify --destination "$validation_dir"
./scripts/seo-audit.sh "$validation_dir"
./scripts/seo-validate.py "$validation_dir"
npx -y pagefind --site "$validation_dir"
```

This keeps the metric snapshot from `seo-audit.sh`, then fails fast on SEO regressions: exactly one canonical per non-alias HTML page, source-accurate and unique post descriptions, exactly one `og:title`, no literal `[TOC]`, valid JSON-LD on the home page and posts, and no `/404.html` entry in `sitemap.xml`. The final Pagefind command exercises the production search indexing path against the same rendered output.

### Final SEO QA before deploy

Use the regression validation commands above, then manually inspect representative outputs from the same rendered build:

- Home page: `/`
- Newest post: `/posts/book-summary-philosophy-software-design-2nd-edition/`
- Legacy redirect rule: `/posts/2018/12/23/bash-history-cleaner/` -> `/posts/bash-history-cleaner/`
- Tag page: `/tags/git/`
- Category page: `/categories/learnings/`
- RSS feed: `/feeds/sglavoie.rss.xml`

Expected results:

- `./scripts/seo-validate.py` must exit successfully. Any failure is a release blocker.
- `./scripts/seo-audit.sh` is informational for site-wide counts. Duplicate descriptions on list-style pages and missing JSON-LD outside the home page and post pages are metrics to watch, not deployment blockers by themselves.
- `npx -y pagefind --site "$validation_dir"` should complete without errors so the production search index path is exercised before deploy.

After deployment, verify in Google Search Console:

- `https://www.sglavoie.com/sitemap.xml` is fetchable and up to date.
- URL Inspection shows the correct canonical for the home page and newest post.
- Coverage reports stay clean after the new deployment.
- The legacy `/posts/2018/12/23/bash-history-cleaner/` URL resolves as a `301` to `/posts/bash-history-cleaner/` on the live site.
