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

## Deploy

`vercel.json` rewrites every route to `index.html`, so `/work/<slug>` URLs work on Vercel.
