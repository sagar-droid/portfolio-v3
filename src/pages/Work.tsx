import { useState } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { Footer, Header } from '../components/Chrome'
import { easeGallery, SplitWords } from '../components/motion'
import { Reveal } from '../components/Reveal'
import { Room, SectionLabels } from '../components/ui'
import { projectNumber, projects, type Project } from '../data/projects'
import { useHead } from '../hooks/useHead'

type Filter = 'All' | Project['category']

const filters: Filter[] = [
  'All',
  ...Array.from(new Set(projects.map((p) => p.category))),
]

const count = (f: Filter) => (f === 'All' ? projects.length : projects.filter((p) => p.category === f).length)

export default function Work() {
  useHead('/work')
  const [filter, setFilter] = useState<Filter>('All')
  const shown = filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-putty px-4 pb-20 pt-32 md:px-10 md:pb-24 md:pt-[140px]">
        <Header />
        <SectionLabels left="Catalogue" right={`${projects.length} works`} className="top-24" />

        <Reveal className="mx-auto flex max-w-[1120px] flex-col items-center gap-7 pt-6 text-center">
          <h1 className="font-serif text-section font-medium uppercase tracking-display">
            <SplitWords text="All *Works*" onMount delay={0.6} />
          </h1>
          <p className="max-w-[44ch] text-subheading tracking-[-0.11px]">
            Every project, newest first: web apps, websites and tools, each with a case study on how it was built.
          </p>

          <div role="group" aria-label="Filter by type" className="flex flex-wrap justify-center gap-2">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`rounded-pill border px-[17px] py-[9px] text-xs leading-tight transition-colors duration-300 ${
                  filter === f ? 'border-ink bg-ink text-paper' : 'border-ink/30 hover:border-ink'
                }`}
              >
                {f} <span className="opacity-60">{count(f)}</span>
              </button>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ============ GRID ============ */}
      <Room dark flush>
        <motion.ol layout className="mx-auto grid max-w-[1120px] gap-x-7 gap-y-16 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {shown.map((p) => (
              <motion.li
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.6, ease: easeGallery }}
              >
                <WorkCard project={p} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ol>
      </Room>

      <Footer />
    </>
  )
}

function WorkCard({ project: p }: { project: Project }) {
  return (
    <Link to={`/work/${p.slug}`} className="group flex flex-col gap-5 no-underline">
      <figure className="overflow-hidden rounded-card bg-graphite/40 p-2 md:p-3">
        <img
          src={p.screenshot}
          alt={`${p.title} screenshot`}
          width={800}
          height={410}
          loading="lazy"
          decoding="async"
          className="aspect-[800/410] w-full rounded-[4px] object-cover object-top transition-transform duration-700 ease-gallery group-hover:scale-[1.03]"
        />
      </figure>
      <div className="flex items-baseline gap-4 border-t border-graphite pt-5">
        <span className="text-xs font-medium tracking-[0.04em] text-putty">{projectNumber(p.slug)}</span>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h2 className="font-serif text-[30px] leading-none tracking-display group-hover:italic md:text-[36px]">
            {p.title}
          </h2>
          <p className="label font-normal text-putty">
            {p.category} · {p.stack.slice(0, 3).join(', ')}
            {p.years ? ` · ${p.years}` : ''}
          </p>
          <p className="text-body-sm text-putty">{p.summary}</p>
        </div>
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>
  )
}
