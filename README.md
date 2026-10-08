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

This builds the site into a throwaway directory with `--panicOnWarning`, then runs `./scripts/seo-validate.py` on it. `render-link.html` warns about Markdown links to site paths with no page or static file, fragments with no matching heading, and bare domains missing `https://`, so any of them fails the check. Pass a directory to keep the build. The pre-commit hook runs it whenever content, layouts, assets, static files or `hugo.toml` change (`pre-commit install` once to enable the hooks).

### Writing posts

- **Callouts:** GitHub-style alerts, `> [!NOTE]`, `> [!TIP] Optional title`, `> [!IMPORTANT]`, `> [!WARNING]` or `> [!CAUTION]`, render as callouts.
- **Series:** posts sharing a `series: "Name"` front matter value list each other, oldest first, under the post header.
- **Feeds:** the home page publishes full-text RSS, Atom and JSON feeds under `/feeds/`, and every tag and category its own RSS feed at `feed.xml`.
- **Images:** keep them in `static/images/posts/` and link them as Markdown or `<img>` tags. Hugo serves PNGs and JPEGs as WebP in widths sized for the column (`partials/responsive-images.html`), so there's no need to make WebP copies by hand. Images shown smaller than their size open full size on click.
- **Code:** a fenced block takes `{title="file.go"}` for a file name, `{hl_lines="2-4"}` to highlight lines and `{wrap=true}` to wrap long lines.
- **Offline:** a service worker (`static/sw.js`) keeps pages readers have opened, and `/offline/` lists them when there's no connection. It isn't registered under `hugo server`.

### SEO baseline audit

```bash
baseline_dir=/tmp/sglavoie-seo-baseline-public
hugo --minify --destination "$baseline_dir"
./scripts/seo-audit.sh "$baseline_dir"
```

This audits rendered HTML plus `static/images/posts` and reports the current counts for duplicate descriptions, missing canonicals, literal `[TOC]` output, multi-`h1` article pages, missing JSON-LD, sitemap coverage, and large image assets. Override the large-image threshold with `SEO_IMAGE_LARGE_BYTES`.

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
