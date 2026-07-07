# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # dev server with live reload (http://localhost:8080)
npm run build      # production build → _site/
npm run debug      # verbose build with Eleventy internals logged
npm run benchmark  # measure build performance
```

There is no test suite. Verify changes by running `npm start` and checking the browser.

## Architecture

This is an [Eleventy v3](https://www.11ty.dev/) static site (ESM, Node ≥ 18). The build reads from `content/` and writes to `_site/`.

**Key directories:**

| Path | Purpose |
|------|---------|
| `content/` | All pages and posts (Eleventy `input` dir) |
| `content/blog/` | Blog posts — any file with `tags: posts` appears in the blog collection |
| `_includes/layouts/` | Three Nunjucks layouts: `base.njk` → `home.njk` / `post.njk` |
| `_data/` | Global data: `metadata.js` (site title, URL, author) and `eleventyDataSchema.js` (Zod schema for front matter validation) |
| `_config/filters.js` | All custom Eleventy filters (dates, `head`, `filterTagList`, etc.) |
| `css/` | Source CSS — watched during dev; bundled per-page via `eleventy-plugin-bundle` |
| `public/` | Static assets copied verbatim to `_site/` root |

**Configuration entrypoint:** `eleventy.config.js` — registers all plugins, passthrough copy, CSS/JS bundles, the draft preprocessor, and image transforms.

**Data cascade:** `content/content.11tydata.js` sets `layout: layouts/home.njk` as the default for all content. `content/blog/blog.11tydata.js` overrides to `layout: layouts/post.njk` and adds `tags: posts` for every post in that directory.

**Drafts:** Set `draft: true` in front matter. Drafts render during `--serve` but are excluded from production builds. The `draft` field is validated by Zod in `_data/eleventyDataSchema.js` — it must be boolean.

**Image optimization:** `@11ty/eleventy-img` runs as a transform. Place images alongside content files; reference them with standard `<img>` tags and Eleventy will automatically generate AVIF/WebP variants and rewrite the markup.

**Navigation:** Use `eleventyNavigation: { key: "…", order: N }` in front matter to add a page to the top-level nav (consumed by `pluginNavigation`).

**Feed:** Atom feed auto-generated at `/feed/feed.xml` from the `posts` collection (last 10 posts). Feed metadata is hardcoded in `eleventy.config.js` — update it there alongside `_data/metadata.js` when customising the site.

**Deployment:** Netlify (`netlify.toml`) and Vercel (`vercel.json`) configs are present. Build command is `npm run build`; publish directory is `_site/`.
