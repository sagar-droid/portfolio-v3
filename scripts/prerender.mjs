/**
 * Post-build: render every route to static HTML with its own <head>, then
 * write sitemap.xml, robots.txt, llms.txt and llms-full.txt.
 *
 * Runs after `vite build` (client → dist/) and `vite build --ssr` (→ dist-server/).
 */
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const server = await import(join(root, 'dist-server/entry-server.js'))
const { render, getHead, headToHtml, routePaths, SITE_URL, canonical, projects, profile } = server

// Preload the two fonts used above the fold (hero serif + body sans) to speed up LCP
const assets = await readdir(join(dist, 'assets'))
const preloads = [/^playfair-display-latin-500-normal-.*\.woff2$/, /^inter-latin-400-normal-.*\.woff2$/]
  .map((re) => assets.find((f) => re.test(f)))
  .filter(Boolean)
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join('\n    ')

const template = (await readFile(join(dist, 'index.html'), 'utf8')).replace('<!--app-head-->', `${preloads}\n    <!--app-head-->`)

async function writePage(path, file) {
  const html = await render(path)
  const page = template
    .replace(/<!--app-head-->[\s\S]*?<!--\/app-head-->/, headToHtml(getHead(path)))
    .replace('<!--app-html-->', html)
  const out = join(dist, file)
  await mkdir(dirname(out), { recursive: true })
  await writeFile(out, page)
  console.log(`  prerendered ${path.padEnd(28)} → ${file}`)
}

/* ---------- HTML pages ---------- */
for (const path of routePaths) {
  await writePage(path, path === '/' ? 'index.html' : `${path.slice(1)}/index.html`)
}
await writePage('/404', '404.html')

/* ---------- sitemap.xml ---------- */
const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${routePaths
  .map((p) => {
    const project = projects.find((x) => `/work/${x.slug}` === p)
    const image = project ? `${SITE_URL}${project.screenshot}` : `${SITE_URL}${profile.portrait}`
    return `  <url>
    <loc>${canonical(p)}</loc>
    <lastmod>${today}</lastmod>
    <image:image><image:loc>${image}</image:loc></image:image>
  </url>`
  })
  .join('\n')}
</urlset>
`
await writeFile(join(dist, 'sitemap.xml'), sitemap)

/* ---------- robots.txt (fill in the site URL) ---------- */
const robots = await readFile(join(dist, 'robots.txt'), 'utf8')
await writeFile(join(dist, 'robots.txt'), robots.replaceAll('__SITE_URL__', SITE_URL))

/* ---------- llms.txt + llms-full.txt (generative-engine friendly summaries) ---------- */
const skills = profile.capabilities.map((c) => `- **${c.label}**: ${c.body}`).join('\n')
const experience = profile.experience_list
  .map((x) => `- **${x.title}**, ${x.company} (${x.period.replace(/—\s*$/, '— present').toLowerCase()}): ${x.detail}`)
  .join('\n')
const contact = [
  `- Email: ${profile.email}`,
  ...profile.links.map((l) => `- ${l.label}: ${l.href}`),
  `- Website: ${SITE_URL}/`,
].join('\n')

const intro = `# ${profile.name} — ${profile.role}

> ${profile.name} is a ${profile.role.toLowerCase()} with ${profile.experience} years of experience building fast, accessible web applications with React, Next.js and TypeScript. ${profile.firstName} currently works at Ingrails on the Veda App product suite.

${profile.bio.join('\n\n')}

## Skills
${skills}

## Experience
${experience}
`

const llms = `${intro}
## Projects (case studies)
${projects
  .map((p) => `- [${p.title}](${canonical(`/work/${p.slug}`)}): ${p.summary} Stack: ${p.stack.join(', ')}. Live: ${p.url}`)
  .join('\n')}

## Contact
${contact}

## More
- [Full case studies in plain text](${SITE_URL}/llms-full.txt)
- [Sitemap](${SITE_URL}/sitemap.xml)
`

const full = `${intro}
## Case studies
${projects
  .map(
    (p) => `
### ${p.title}
- URL: ${canonical(`/work/${p.slug}`)}
- Live site: ${p.url}
- Type: ${p.category}
- Role: ${p.role}${p.years ? `\n- Years: ${p.years}` : ''}
- Stack: ${p.stack.join(', ')}

${p.overview}

#### How it was made
${p.process.map((s, i) => `${i + 1}. **${s.title}**: ${s.body}`).join('\n')}

#### What I did
${p.contributions.map((c) => `- ${c}`).join('\n')}

#### Difficulties and how I solved them
${p.challenges.map((c) => `- **${c.title}**. Problem: ${c.problem} Solution: ${c.solution}`).join('\n')}

#### Outcome
${p.outcome}
`,
  )
  .join('')}
## Contact
${contact}
`

await writeFile(join(dist, 'llms.txt'), llms)
await writeFile(join(dist, 'llms-full.txt'), full)
console.log('  wrote sitemap.xml, robots.txt, llms.txt, llms-full.txt')

await rm(join(root, 'dist-server'), { recursive: true, force: true })
