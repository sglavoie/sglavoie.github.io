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
