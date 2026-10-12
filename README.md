# Sagar Adhikari — Portfolio

React + Tailwind CSS v4 portfolio in a "Renaissance gallery" style: putty canvas, ink rooms, serif display type, classical paintings.

## Run

```sh
nvm use          # Node 26 (see .nvmrc)
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build → dist/
```

## Editing content

| What | Where |
|------|-------|
| Name, bio, experience, skills, contact links | `src/data/profile.ts` |
| Projects and their case studies | `src/data/projects.ts` |
| Colours, fonts, type scale, radii | `@theme` in `src/index.css` |
| Paintings / screenshots | `public/img/`, `public/shots/` |

Each project gets its own page at `/work/<slug>`, with these sections: The Making, My Work, Difficulties and Outcome.
A project with `draft: true` shows a "draft copy" badge in `npm run dev` only. Set it to `false` once you've reviewed the text.

## SEO & GEO

`npm run build` does three things:

1. Builds the client bundle with Vite.
2. Prerenders every route to static HTML (`scripts/prerender.mjs`, using `src/entry-server.tsx`). Search engines and AI crawlers that don't run JavaScript still get the full content.
3. Generates `sitemap.xml`, `robots.txt`, `llms.txt` and `llms-full.txt` from the same data files.

| What | Where |
|------|-------|
| Titles, descriptions, Open Graph tags, JSON-LD (Person, ProfilePage, TechArticle, BreadcrumbList) | `src/seo.ts` |
| Site URL used in canonical links, the sitemap and JSON-LD | `VITE_SITE_URL` env var (default `https://sagar-adhikari-portfolio.vercel.app`) |
| AI crawler rules | `public/robots.txt` |
| Social preview images (1200×630) | `public/og/`, regenerate with `npm run og` (macOS, uses `sips`) |

Run `npm run og` after changing a project's title, summary or painting, then commit the PNGs.

## Deploy

On Vercel, each route is served from its prerendered `index.html`. Unknown URLs get `404.html` with a real 404 status.
`/assets/*` is cached for one year (the filenames are content-hashed). Images are cached for one week.
