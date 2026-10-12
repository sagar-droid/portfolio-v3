/**
 * Generate 1200×630 Open Graph images into public/og/ (home + one per project).
 * Run with `npm run og` whenever titles, summaries or paintings change; the PNGs are
 * committed, so the production build doesn't need this (or macOS `sips`).
 */
import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const { projects, profile } = await import(join(root, 'dist-server/entry-server.js'))

const font = (pkg, file) => readFile(join(root, 'node_modules/@fontsource', pkg, 'files', file))
const fonts = [
  { name: 'Playfair', data: await font('playfair-display', 'playfair-display-latin-500-normal.woff'), weight: 500, style: 'normal' },
  { name: 'Playfair', data: await font('playfair-display', 'playfair-display-latin-400-italic.woff'), weight: 400, style: 'italic' },
  { name: 'Inter', data: await font('inter', 'inter-latin-400-normal.woff'), weight: 400, style: 'normal' },
  { name: 'Inter', data: await font('inter', 'inter-latin-500-normal.woff'), weight: 500, style: 'normal' },
]

/* WebP → JPEG data URI (satori/resvg want PNG or JPEG) */
const tmp = await mkdtemp(join(tmpdir(), 'og-'))
function imageData(publicPath) {
  const src = join(root, 'public', publicPath)
  const out = join(tmp, `${publicPath.replace(/\W/g, '_')}.jpg`)
  execFileSync('sips', ['-s', 'format', 'jpeg', '-Z', '760', src, '--out', out], { stdio: 'ignore' })
  return readFile(out).then((b) => `data:image/jpeg;base64,${b.toString('base64')}`)
}

const h = (type, style, ...children) => ({ type, props: { style, children: children.flat() } })
const PUTTY = '#c4c3b6'
const INK = '#000000'
const GRAPHITE = '#595855'

const monogram = h(
  'div',
  { display: 'flex', width: 44, height: 44, borderRadius: 999, border: `2px solid ${INK}`, alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair', fontSize: 22, paddingBottom: 3 },
  profile.firstName[0],
)

function projectCard(p, i) {
  const size = p.title.length > 12 ? 88 : 108
  return h(
    'div',
    // satori adds padding outside width/height: 1088×518 + 56px padding = 1200×630
    { display: 'flex', width: 1088, height: 518, background: PUTTY, padding: 56, color: INK },
    h(
      'div',
      { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 640, flexShrink: 0 },
      h('div', { display: 'flex', fontFamily: 'Inter', fontWeight: 500, fontSize: 20, letterSpacing: 2.5 },
        `CASE STUDY · NO. ${String(i + 1).padStart(2, '0')} · ${p.category.toUpperCase()}`),
      h(
        'div',
        { display: 'flex', flexDirection: 'column', gap: 20 },
        h('div', { display: 'flex', fontFamily: 'Playfair', fontWeight: 500, fontSize: size, lineHeight: 0.92, letterSpacing: -1.5, textTransform: 'uppercase' }, p.title),
        h('div', { display: 'flex', fontFamily: 'Inter', fontSize: 26, lineHeight: 1.35 }, p.summary),
        h('div', { display: 'flex', fontFamily: 'Inter', fontWeight: 500, fontSize: 17, letterSpacing: 1.5, color: GRAPHITE }, p.stack.slice(0, 4).join(' · ').toUpperCase()),
      ),
      h(
        'div',
        { display: 'flex', alignItems: 'center', gap: 16 },
        monogram,
        h('div', { display: 'flex', fontFamily: 'Inter', fontWeight: 500, fontSize: 18, letterSpacing: 2 }, `${profile.name.toUpperCase()} — ${profile.role.toUpperCase()}`),
      ),
    ),
    h(
      'div',
      { display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
      h('img', { width: 380, height: 380, borderRadius: 999, objectFit: 'cover', flexShrink: 0 }),
    ),
  )
}

async function renderPng(tree, file, imgSrc) {
  // attach image sources (kept out of the style-only h() helper)
  const attach = (node) => {
    if (!node || typeof node !== 'object') return
    if (node.type === 'img' && !node.props.src) node.props = { ...node.props, src: imgSrc, width: node.props.style.width, height: node.props.style.height }
    ;[].concat(node.props?.children ?? []).forEach(attach)
  }
  attach(tree)
  const svg = await satori(tree, { width: 1200, height: 630, fonts })
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()
  await writeFile(join(root, 'public/og', file), png)
  console.log(`  og/${file}`)
}

await mkdir(join(root, 'public/og'), { recursive: true })

// Home
{
  const portrait = await imageData(profile.portrait.replace(/^\//, ''))
  const tree = h(
    'div',
    { display: 'flex', flexDirection: 'column', width: 1200, height: 630, background: PUTTY, color: INK, position: 'relative', overflow: 'hidden' },
    h(
      'div',
      { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, paddingTop: 80 },
      h('div', { display: 'flex', alignItems: 'baseline', fontFamily: 'Playfair', fontWeight: 500, fontSize: 60, letterSpacing: -0.5 }, 'FRONTEND',
        h('span', { fontStyle: 'italic', fontWeight: 400, marginLeft: 16 }, 'Developer')),
      h('div', { display: 'flex', gap: 28, fontFamily: 'Inter', fontWeight: 500, fontSize: 22, letterSpacing: 1 },
        h('span', {}, `EXPERIENCE: ${profile.experience} YRS`), h('span', {}, `PROJECTS: ${projects.length}`), h('span', {}, 'REACT · NEXT.JS · TS')),
    ),
    h('img', { position: 'absolute', top: 44, left: 56, width: 110, height: 110, borderRadius: 999, objectFit: 'cover' }),
    h('div', { display: 'flex', position: 'absolute', left: 0, right: 0, bottom: -95, justifyContent: 'center', fontFamily: 'Playfair', fontWeight: 500, fontSize: 420, letterSpacing: -4, lineHeight: 1 },
      profile.firstName),
  )
  await renderPng(tree, 'home.png', portrait)
}

// Projects
for (const [i, p] of projects.entries()) {
  const painting = await imageData(p.painting.src.replace(/^\//, ''))
  await renderPng(projectCard(p, i), `${p.slug}.png`, painting)
}

await rm(tmp, { recursive: true, force: true })
