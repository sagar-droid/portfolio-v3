/**
 * Every project, and the case study shown at /work/:slug.
 *
 * `draft: true` shows a small "draft copy" notice on the page in dev mode only
 * (never in production). Rewrite the copy in your own words, then set it to false.
 */

export type Painting = { src: string; credit: string }

export type Project = {
  slug: string
  title: string
  category: 'Web App' | 'Website' | 'Tool'
  url: string
  screenshot: string
  painting: Painting
  featured?: boolean
  years?: string
  role: string
  stack: string[]
  /** One line for cards and the catalogue */
  summary: string
  /** Opening paragraph of the case study */
  overview: string
  /** I. The Making — how it was built */
  process: { title: string; body: string }[]
  /** II. My Work — what I personally did */
  contributions: string[]
  /** III. Difficulties — what was hard and how I solved it */
  challenges: { title: string; problem: string; solution: string }[]
  /** IV. Outcome */
  outcome: string
  draft: boolean
}

export const projects: Project[] = [
  {
    slug: 'veda-inventory',
    title: 'Veda Inventory',
    category: 'Web App',
    url: 'https://inventory.ingrails.com/',
    screenshot: '/shots/veda-inventory.webp',
    painting: { src: '/img/milkmaid.webp', credit: 'Johannes Vermeer, The Milkmaid, c. 1658' },
    role: 'Frontend Developer · Ingrails',
    stack: ['React', 'React Query', 'REST APIs'],
    summary: 'An enterprise inventory system, part of the Veda product suite.',
    overview:
      'Veda Inventory helps organisations keep track of their stock: what they have, where it is and how it moves. My job was the React frontend. The aim was screens that stay fast and readable even with large amounts of data in them.',
    process: [
      {
        title: 'Learning the domain',
        body: 'Before building any screens, I walked through the inventory flows with the backend team and product owners. That way the UI followed how people actually record and look up stock.',
      },
      {
        title: 'A shared component base',
        body: 'Tables, filters, forms and modals were built as reusable pieces, so every module looks and behaves the same.',
      },
      {
        title: 'Data layer with React Query',
        body: 'All server data goes through React Query. Caching, background refetching and loading or error states are handled in one consistent place instead of being rewritten on every screen.',
      },
    ],
    contributions: [
      'Built the inventory screens and the data tables, with filtering, sorting and pagination.',
      'Connected the UI to the REST API through React Query hooks.',
      'Made the layouts responsive so the app works on tablets and smaller laptops as well as desktops.',
      'Kept the code clean and reusable, with performance and accessibility in mind.',
    ],
    challenges: [
      {
        title: 'Large tables that stay responsive',
        problem: 'Inventory lists can run to thousands of rows. Filtering and sorting on the client made the interface feel slow.',
        solution: 'I moved paging and filtering to the server, cached each query with React Query, and memoised the row components so typing in a filter no longer re-renders the whole table.',
      },
      {
        title: 'Consistency across many modules',
        problem: 'Each new screen was at risk of slightly different spacing, validation and empty states.',
        solution: 'I pulled the repeated patterns into shared components, so new screens are assembled from parts that already work.',
      },
    ],
    outcome:
      'A consistent, responsive inventory frontend that the team can extend module by module without starting from scratch.',
    draft: true,
  },

  {
    slug: 'veda-academics',
    title: 'Veda Academics',
    category: 'Web App',
    url: 'https://ingrails.com/login',
    screenshot: '/shots/academics.webp',
    painting: { src: '/img/hare.webp', credit: 'Albrecht Dürer, Young Hare, 1502' },
    featured: true,
    role: 'Frontend Developer · Ingrails',
    stack: ['React', 'Lit Components', 'PHP', 'CodeIgniter'],
    summary: 'An academic management application for schools and colleges.',
    overview:
      'Veda Academics is the school-management product at the centre of the Veda suite. It is a mature PHP and CodeIgniter application, extended with React and Lit web components. I look after its frontend, keeping it fast, responsive and up to date as new features ship.',
    process: [
      {
        title: 'Working inside a mature codebase',
        body: 'The app has a long history in PHP and CodeIgniter. New work has to fit the existing pages instead of replacing them.',
      },
      {
        title: 'Modern islands',
        body: 'New, interactive parts of the UI are built as React views or Lit web components and mounted inside the server-rendered pages.',
      },
      {
        title: 'Continuous care',
        body: 'Performance passes, UI/UX polish and bug fixes go out alongside new features, so the product improves steadily rather than in large rewrites.',
      },
    ],
    contributions: [
      'Own and maintain the Academics frontend: performance, UI/UX and code quality.',
      'Build new interface features with React and Lit Components.',
      'Work closely with the backend developers, designers and product owners on each feature.',
      'Keep the app responsive and working across browsers and devices.',
    ],
    challenges: [
      {
        title: 'Three UI technologies in one app',
        problem: 'PHP views, React and Lit components all live on the same pages. Without care, state and styling get tangled.',
        solution: 'I kept each component self-contained. Data goes in through attributes or props and comes out through events, so the pieces don’t need to know about each other.',
      },
      {
        title: 'Changing a product people use every day',
        problem: 'Schools rely on Academics every day, so a UI change can’t interrupt their work.',
        solution: 'I made small, incremental changes, tested them against real flows, and avoided big-bang redesigns.',
      },
    ],
    outcome:
      'A long-lived product that keeps getting faster and easier to use, without disrupting the schools that depend on it.',
    draft: true,
  },

  {
    slug: 'veda-payroll',
    title: 'Veda Payroll',
    category: 'Web App',
    url: 'https://hr.ingrails.com/login',
    screenshot: '/shots/payroll.webp',
    painting: { src: '/img/ambassadors.webp', credit: 'Hans Holbein the Younger, The Ambassadors, 1533' },
    years: '2025 — 2026',
    role: 'Developer (frontend + backend) · Ingrails',
    stack: ['React', 'React Query', 'Laravel', 'pdf.js', 'pdf-lib', 'Mammoth'],
    summary: 'An HR and payroll platform: salaries, tax, payslips, statutory reports and contracts.',
    overview:
      'Veda Payroll is a multi-tenant HR and payroll product. Each organisation gets its own database. Admins manage employees, salaries, tax, leave, loans and advances, and generate payslips and statutory PF and SSF reports. It is a large, mature codebase with many contributors. I joined in 2025 and built new modules end to end, in the React frontend and the Laravel backend.',
    process: [
      {
        title: 'Following the existing architecture',
        body: 'On the frontend, data flows through shared React Query CRUD hooks over an axios instance. On the backend, Laravel controllers delegate to repositories and services. New features follow the same patterns so the codebase stays predictable.',
      },
      {
        title: 'Building modules end to end',
        body: 'Each feature, such as contracts, salary revisions or consultant tax, needed a backend model, an API and a frontend. I shipped them as complete slices.',
      },
      {
        title: 'Documents in the browser',
        body: 'The contract module renders PDFs with pdf.js, imports DOCX templates with Mammoth, and writes the finished documents with pdf-lib.',
      },
    ],
    contributions: [
      'Built the contract management module: templates, a visual PDF field placer, contract generation, and automatic termination when a user is disabled.',
      'Added consultant tax at a flat rate, alongside the existing tax and CIT rules.',
      'Built single-employee payslip generation and the salary revision flow.',
      'Updated the SSF and PF statutory reports.',
      'Added CIT and bulk-edit filters and fixed salary-adjustment issues.',
    ],
    challenges: [
      {
        title: 'Placing fields on a PDF precisely',
        problem: 'Admins needed to mark where names, dates and signatures go on an uploaded contract. The PDF renders at different sizes on different screens, so pixel positions broke as soon as the zoom or window changed.',
        solution: 'I render each page to a canvas with pdf.js and let admins click to drop a field, then drag and resize it. Positions are stored as fractions of the page size, so a field lands in the same spot at any scale and maps exactly when pdf-lib fills the final document.',
      },
      {
        title: 'Turning Word templates into contracts',
        problem: 'HR teams already had their contracts as .docx files and didn’t want to rebuild them.',
        solution: 'Templates are imported with Mammoth, which converts DOCX to HTML, so existing documents become reusable templates without retyping.',
      },
      {
        title: 'Shipping safely in a large, shared codebase',
        problem: 'With over a thousand commits and many contributors, a payroll change can quietly affect salaries or reports elsewhere.',
        solution: 'I kept each change within the existing repository, service and query-hook patterns, kept features in focused commits, and checked report output against expected figures before shipping.',
      },
    ],
    outcome:
      'Organisations can now create, fill and manage employee contracts inside Payroll, alongside flat-rate consultant tax, single payslips, salary revisions and updated statutory reports.',
    draft: true,
  },

  {
    slug: 'kanooniastra',
    title: 'Kanooniastra',
    category: 'Website',
    url: 'https://kanooniastra.com/',
    screenshot: '/shots/kanooniastra.webp',
    painting: { src: '/img/pearl.webp', credit: 'Johannes Vermeer, Girl with a Pearl Earring, c. 1665' },
    featured: true,
    role: 'Frontend Developer',
    stack: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'AOS'],
    summary: 'A legal-tech platform with a fast, animated marketing front end.',
    overview:
      'Kanooniastra is a legal-tech platform. The website has to explain a serious product clearly while still feeling modern. I built the front end in Next.js and Tailwind CSS, with motion that supports the content instead of distracting from it.',
    process: [
      {
        title: 'Content first',
        body: 'Legal content is dense, so I began with the typography and the reading order before adding anything decorative.',
      },
      {
        title: 'Building with Next.js and Tailwind',
        body: 'Pages are statically optimised by Next.js. Tailwind keeps spacing and type consistent across every section.',
      },
      {
        title: 'Motion as the final layer',
        body: 'Framer Motion and AOS add scroll and entrance animations once the layout already works well without them.',
      },
    ],
    contributions: [
      'Built the full marketing site in Next.js and Tailwind CSS.',
      'Designed and implemented the scroll and entrance animations.',
      'Made every section responsive, from small phones to wide desktops.',
      'Tuned images and loading for good Core Web Vitals.',
    ],
    challenges: [
      {
        title: 'Animation without the performance cost',
        problem: 'Scroll animations can hurt loading scores and feel janky on lower-end phones.',
        solution: 'I animated only opacity and transform, kept above-the-fold content static so it paints immediately, and respected the user’s reduced-motion setting.',
      },
      {
        title: 'Making legal text approachable',
        problem: 'Long blocks of legal copy are hard to scan.',
        solution: 'I used a clear type scale, generous spacing and short sections with strong headings, so visitors can find what they need quickly.',
      },
    ],
    outcome: 'A fast, polished site that presents a serious legal product with clarity and a bit of life.',
    draft: true,
  },

  {
    slug: 'united-academy',
    title: 'United Academy',
    category: 'Website',
    url: 'https://academy.united.edu.np/',
    screenshot: '/shots/united-academy.webp',
    painting: { src: '/img/hunters.webp', credit: 'Pieter Bruegel the Elder, Hunters in the Snow, 1565' },
    years: '2024 — 2026',
    role: 'Frontend Developer · Ingrails',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'React Query', 'Zustand', 'Headless CMS'],
    summary: 'The college’s official website: around 55 pages driven by a headless CMS.',
    overview:
      'United Academy’s website covers programs, admissions, news, notices, faculty, results and more, across roughly 55 pages. All content comes from the Veda headless CMS. I’ve been the main contributor since January 2024, with the most commits of anyone on the project, and I built many of its features as well as the work on reliability and SEO.',
    process: [
      {
        title: 'Static pages that stay fresh',
        body: 'Pages are built with getStaticProps and incremental static regeneration. They load like static HTML but update within seconds when editors change content in the CMS.',
      },
      {
        title: 'A typed content layer',
        body: 'Typed axios clients fetch from the CMS content API, React Query handles client-side data, and a small Zustand store drives the navigation menu.',
      },
      {
        title: 'Server features through API routes',
        body: 'Next.js API routes handle the contact form (with nodemailer), exam results from Google Sheets, and student login.',
      },
    ],
    contributions: [
      'Built the student login: reCAPTCHA v3, a server-side proxy and a signed cookie session that protects the results page.',
      'Built the faculty and staff pages, research resources, the API-driven footer and site search.',
      'Made page meta tags dynamic for every CMS slug, and maintained the sitemap and robots.txt.',
      'Moved site images to S3 and served them through next/image.',
      'Did ongoing work across programs, news, notices, the academic calendar and admissions pages.',
    ],
    challenges: [
      {
        title: 'Staying online when the CMS doesn’t',
        problem: 'If the content API went down during a build or revalidation, pages could break for visitors.',
        solution: 'Pages use ISR with a short revalidate window and fall back to safe empty data when a request fails, so visitors still get a working page.',
      },
      {
        title: 'Protecting student results',
        problem: 'Results are private, but the site is public and static-first. Login had to resist bots and avoid exposing tokens to the browser.',
        solution: 'Login goes through a Next.js API route that verifies reCAPTCHA v3, proxies the credentials, and sets a signed, HTTP-only cookie with a two-hour session. The results page checks that cookie on the server.',
      },
      {
        title: 'SEO for content nobody hard-codes',
        problem: 'News, blogs and program pages are created by editors, so titles and descriptions can’t be written by hand in the code.',
        solution: 'Meta tags are generated from each slug’s CMS data, and a dynamic sitemap lists every page. Blog HTML from the CMS is sanitised before rendering.',
      },
      {
        title: 'Heavy images',
        problem: 'Galleries and news posts carried large images that slowed pages down.',
        solution: 'I moved images to S3 and served them through next/image with remote patterns, which gives responsive sizes and lazy loading.',
      },
    ],
    outcome:
      'A fast, reliable college website that editors update without a developer, with secure student results and SEO that keeps up with new content automatically.',
    draft: true,
  },

  {
    slug: 'excel-json',
    title: 'Excel-Json',
    category: 'Tool',
    url: 'https://excel-json-puce.vercel.app/',
    screenshot: '/shots/excel-json.webp',
    painting: { src: '/img/wanderer.webp', credit: 'Caspar David Friedrich, Wanderer above the Sea of Fog, c. 1818' },
    featured: true,
    role: 'Designer & Developer · Side project',
    stack: ['Next.js', 'Tailwind CSS'],
    summary: 'A developer utility that converts Excel files to JSON in a few seconds.',
    overview:
      'Developers often get data as spreadsheets but need it as JSON. Excel-Json is a small, focused tool for that: drop in a file, get clean JSON back, and copy or download it.',
    process: [
      {
        title: 'One job, done well',
        body: 'The whole interface is built around a single action: drop a file in, get JSON out. No accounts and no setup.',
      },
      {
        title: 'Conversion in the browser',
        body: 'The file is parsed on the client, so data never has to leave the user’s machine.',
      },
      {
        title: 'Deployed on Vercel',
        body: 'A Next.js app on Vercel, so it is quick to load and easy to update.',
      },
    ],
    contributions: [
      'Designed and built the whole tool.',
      'Built the file upload, parsing and JSON output with copy and download.',
      'Made it responsive and keyboard friendly.',
    ],
    challenges: [
      {
        title: 'Messy real-world spreadsheets',
        problem: 'Real sheets have blank rows, merged headers and inconsistent column names, which produce messy JSON.',
        solution: 'I clean up headers into consistent keys and skip empty rows, so the output is usable straight away.',
      },
      {
        title: 'Keeping it fast with bigger files',
        problem: 'Large sheets can freeze the page while they are converted.',
        solution: 'I kept the conversion work light and the UI simple, and showed clear progress and error states.',
      },
    ],
    outcome: 'A small, dependable tool that turns spreadsheet data into JSON in seconds.',
    draft: true,
  },

  {
    slug: 'camera-gallery',
    title: 'Camera Gallery',
    category: 'Web App',
    url: 'https://gallery-app-gamma-beryl.vercel.app/',
    screenshot: '/shots/gallery_project.webp',
    painting: { src: '/img/rembrandt.webp', credit: 'Rembrandt van Rijn, Self-Portrait' },
    role: 'Designer & Developer · Side project',
    stack: ['React', 'TypeScript', 'Tailwind CSS'],
    summary: 'A modern photography showcase app.',
    overview:
      'Camera Gallery is a photography showcase built with React and TypeScript. The goal was to let the photos lead: a clean grid, quick browsing, and nothing in the interface competing with the images.',
    process: [
      {
        title: 'Typed from the start',
        body: 'TypeScript models for photos and albums kept the components honest as the app grew.',
      },
      {
        title: 'A layout that fits every photo',
        body: 'A responsive grid built in Tailwind CSS handles portrait and landscape images without awkward crops.',
      },
      {
        title: 'Performance tuning',
        body: 'Lazy loading and reserved image space keep scrolling smooth and the page stable.',
      },
    ],
    contributions: [
      'Designed and built the app in React, TypeScript and Tailwind CSS.',
      'Built the responsive gallery grid and the image viewing experience.',
      'Optimised image loading for speed and layout stability.',
    ],
    challenges: [
      {
        title: 'Lots of large images',
        problem: 'Loading every photo up front made the first load slow.',
        solution: 'Images below the fold are lazy-loaded, so the first screen appears quickly and the rest arrive as you scroll.',
      },
      {
        title: 'Layout shift',
        problem: 'Images popping in made the grid jump around (poor CLS).',
        solution: 'I reserved space with fixed aspect ratios before each image loads, so the layout stays still.',
      },
    ],
    outcome: 'A calm, fast gallery that puts the photography first.',
    draft: true,
  },
]

export const featuredProjects = projects.filter((p) => p.featured)

export function getProject(slug: string | undefined) {
  return projects.find((p) => p.slug === slug)
}

export function getNextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug)
  return projects[(i + 1) % projects.length]
}

export const projectNumber = (slug: string) =>
  String(projects.findIndex((p) => p.slug === slug) + 1).padStart(2, '0')
