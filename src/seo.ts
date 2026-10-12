/**
 * SEO + GEO metadata for every route.
 * Used by the prerender script (static <head> in each HTML file) and by the
 * client (head updates on client-side navigation) so both always agree.
 */
import { profile } from './data/profile'
import { getProject, projects, type Project } from './data/projects'

export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://sagar-adhikari-portfolio.vercel.app').replace(/\/$/, '')
export const SITE_NAME = `${profile.name} — Portfolio`

export type Head = {
  title: string
  description: string
  path: string
  image: string
  imageAlt: string
  type: 'website' | 'profile' | 'article'
  noindex?: boolean
  jsonLd?: object
}

export const canonical = (path: string) => (path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`)

const skills = [
  'React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Lit Components', 'Framer Motion',
  'Core Web Vitals', 'Web Accessibility (WCAG 2.1)', 'Responsive Design', 'Laravel', 'PHP', 'CodeIgniter', 'REST APIs',
]

const personId = `${SITE_URL}/#person`

function person() {
  return {
    '@type': 'Person',
    '@id': personId,
    name: profile.name,
    givenName: 'Sagar',
    familyName: 'Adhikari',
    url: `${SITE_URL}/`,
    image: `${SITE_URL}${profile.portrait}`,
    jobTitle: profile.role,
    description: `${profile.name} is a ${profile.role.toLowerCase()} with ${profile.experience} years of experience building fast, accessible web applications with React, Next.js and TypeScript.`,
    email: `mailto:${profile.email}`,
    worksFor: { '@type': 'Organization', name: 'Ingrails', url: 'https://ingrails.com/' },
    hasOccupation: {
      '@type': 'Occupation',
      name: profile.role,
      skills: skills.join(', '),
    },
    knowsAbout: skills,
    sameAs: profile.links.map((l) => l.href),
  }
}

export const caseStudyPath = (p: Project) => `/work/${p.slug}`

function homeHead(): Head {
  return {
    title: `${profile.name} — Frontend Developer (React, Next.js, TypeScript)`,
    description: `${profile.name} is a frontend developer with ${profile.experience} years of experience building fast, accessible web apps in React, Next.js and TypeScript. Case studies: ${projects
      .slice(0, 4)
      .map((p) => p.title)
      .join(', ')} and more.`,
    path: '/',
    image: `${SITE_URL}/og/home.png`,
    imageAlt: `${profile.name}, ${profile.role}`,
    type: 'profile',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url: `${SITE_URL}/`,
          name: SITE_NAME,
          inLanguage: 'en',
          publisher: { '@id': personId },
        },
        {
          '@type': 'ProfilePage',
          '@id': `${SITE_URL}/#profile`,
          url: `${SITE_URL}/`,
          name: `${profile.name} — ${profile.role}`,
          isPartOf: { '@id': `${SITE_URL}/#website` },
          mainEntity: { '@id': personId },
          dateModified: new Date().toISOString().slice(0, 10),
        },
        person(),
        {
          '@type': 'ItemList',
          name: `Projects by ${profile.name}`,
          numberOfItems: projects.length,
          itemListElement: projects.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: canonical(caseStudyPath(p)),
            name: p.title,
          })),
        },
      ],
    },
  }
}

function projectHead(p: Project): Head {
  const path = caseStudyPath(p)
  const url = canonical(path)
  return {
    title: `${p.title} — Case Study by ${profile.name}`,
    description: `${p.summary} How ${p.title} was built with ${p.stack.slice(0, 3).join(', ')}, what I worked on, and the hardest problems I solved.`,
    path,
    image: `${SITE_URL}/og/${p.slug}.png`,
    imageAlt: `${p.title}, a case study by ${profile.name}`,
    type: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'TechArticle',
          '@id': `${url}#article`,
          headline: `${p.title}: how it was built`,
          description: p.overview,
          url,
          image: `${SITE_URL}/og/${p.slug}.png`,
          inLanguage: 'en',
          author: { '@id': personId },
          publisher: { '@id': personId },
          keywords: p.stack.join(', '),
          articleSection: ['The Making', 'My Work', 'Difficulties', 'Outcome'],
          about: {
            '@type': p.category === 'Website' ? 'WebSite' : 'WebApplication',
            name: p.title,
            url: p.url,
            ...(p.category !== 'Website' && { applicationCategory: p.category === 'Tool' ? 'DeveloperApplication' : 'BusinessApplication', operatingSystem: 'Web' }),
          },
        },
        { ...person(), '@id': personId },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Work', item: `${SITE_URL}/#catalogue` },
            { '@type': 'ListItem', position: 3, name: p.title, item: url },
          ],
        },
      ],
    },
  }
}

export function getHead(path: string): Head {
  if (path === '/') return homeHead()
  const match = path.match(/^\/work\/([^/]+)$/)
  const project = match && getProject(match[1])
  if (project) return projectHead(project)
  return {
    title: `Not found — ${profile.name}`,
    description: 'This page does not exist.',
    path,
    image: `${SITE_URL}/og/home.png`,
    imageAlt: profile.name,
    type: 'website',
    noindex: true,
  }
}

/** All indexable routes (for prerendering + sitemap) */
export const routePaths = ['/', ...projects.map(caseStudyPath)]

/* ---------- Head tags as data, rendered to HTML (server) or DOM (client) ---------- */
type Tag = { key: string; tag: 'meta' | 'link'; attrs: Record<string, string> }

export function headTags(h: Head): Tag[] {
  const url = canonical(h.path)
  const m = (key: string, attrs: Record<string, string>): Tag => ({ key, tag: 'meta', attrs })
  return [
    m('description', { name: 'description', content: h.description }),
    m('robots', { name: 'robots', content: h.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large' }),
    { key: 'canonical', tag: 'link', attrs: { rel: 'canonical', href: url } },
    m('og:type', { property: 'og:type', content: h.type }),
    m('og:site_name', { property: 'og:site_name', content: SITE_NAME }),
    m('og:title', { property: 'og:title', content: h.title }),
    m('og:description', { property: 'og:description', content: h.description }),
    m('og:url', { property: 'og:url', content: url }),
    m('og:image', { property: 'og:image', content: h.image }),
    m('og:image:width', { property: 'og:image:width', content: '1200' }),
    m('og:image:height', { property: 'og:image:height', content: '630' }),
    m('og:image:alt', { property: 'og:image:alt', content: h.imageAlt }),
    m('twitter:card', { name: 'twitter:card', content: 'summary_large_image' }),
    m('twitter:title', { name: 'twitter:title', content: h.title }),
    m('twitter:description', { name: 'twitter:description', content: h.description }),
    m('twitter:image', { name: 'twitter:image', content: h.image }),
  ]
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

export function headToHtml(h: Head) {
  const tags = headTags(h)
    .map((t) => `<${t.tag} data-head="${t.key}" ${Object.entries(t.attrs).map(([k, v]) => `${k}="${esc(v)}"`).join(' ')} />`)
    .join('\n    ')
  const ld = h.jsonLd
    ? `\n    <script type="application/ld+json" data-head="ld">${JSON.stringify(h.jsonLd).replace(/</g, '\\u003c')}</script>`
    : ''
  return `<title>${esc(h.title)}</title>\n    ${tags}${ld}`
}

/** Client: update the live <head> to match a route */
export function applyHead(h: Head) {
  document.title = h.title
  for (const t of headTags(h)) {
    let el = document.head.querySelector<HTMLElement>(`[data-head="${t.key}"]`)
    if (!el) {
      el = document.createElement(t.tag)
      el.dataset.head = t.key
      document.head.appendChild(el)
    }
    for (const [k, v] of Object.entries(t.attrs)) el.setAttribute(k, v)
  }
  let ld = document.head.querySelector<HTMLScriptElement>('script[data-head="ld"]')
  if (h.jsonLd) {
    if (!ld) {
      ld = document.createElement('script')
      ld.type = 'application/ld+json'
      ld.dataset.head = 'ld'
      document.head.appendChild(ld)
    }
    ld.textContent = JSON.stringify(h.jsonLd)
  } else ld?.remove()
}
