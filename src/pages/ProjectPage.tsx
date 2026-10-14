import { Link, Navigate, useParams } from 'react-router'
import { motion } from 'motion/react'
import { SplitWords, useParallax } from '../components/motion'
import { DraftNotice, Footer, Header } from '../components/Chrome'
import { Reveal } from '../components/Reveal'
import { Painting, Pill, QuoteCard, Room, SectionHeader, SectionLabels, StatPair, Vignette } from '../components/ui'
import { getNextProject, getProject, projectNumber } from '../data/projects'
import { useHead } from '../hooks/useHead'

export default function ProjectPage() {
  const { slug } = useParams()
  const project = getProject(slug)
  const [plateRef, plateScale] = useParallax<HTMLDivElement>(0.86, 1, ['start end', 'start 0.35'])
  useHead(`/work/${slug}`)

  if (!project) return <Navigate to="/404" replace />

  const no = projectNumber(project.slug)
  const next = getNextProject(project.slug)

  return (
    <>
      {project.draft && <DraftNotice />}

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-putty px-4 pb-24 pt-32 md:px-10 md:pb-[120px] md:pt-[140px]">
        <Header back />
        <SectionLabels left={`No. ${no}`} right={project.category} className="top-24" />

        <Reveal className="mx-auto flex max-w-[1120px] flex-col items-center gap-7 pt-6 text-center">
          <h1 className="font-serif text-section font-medium uppercase tracking-display">
            <SplitWords key={project.slug} text={project.title} onMount delay={0.6} />
          </h1>
          <p className="max-w-[40ch] text-subheading tracking-[-0.11px]">{project.summary}</p>
          <StatPair
            items={[`ROLE: ${project.role.toUpperCase()}`, ...(project.years ? [`YEARS: ${project.years}`] : [])]}
            className="justify-center"
          />
          <Pill href={project.url}>Visit live site ↗</Pill>
        </Reveal>
      </section>

      {/* ============ PLATE: SCREENSHOT ============ */}
      <section className="bg-putty px-4 pb-24 md:px-10 md:pb-[120px]">
        <motion.div ref={plateRef} style={{ scale: plateScale }} className="mx-auto max-w-[1120px] origin-top">
          <figure className="rounded-card bg-bone p-3 md:p-6">
            <img
              src={project.screenshot}
              alt={`${project.title} screenshot`}
              className="w-full rounded-[4px] border border-vellum"
              width={800}
              height={410}
            />
            <figcaption className="mt-4 flex flex-col justify-between gap-1 text-xs text-graphite md:flex-row">
              <span>
                <span className="text-ink">Fig. 1</span> · {project.title}, live site
              </span>
              <span className="label font-normal">{project.stack.join(' · ')}</span>
            </figcaption>
          </figure>
        </motion.div>

        <Reveal className="mx-auto mt-24 grid max-w-[1120px] gap-6 md:grid-cols-[1fr_2fr]">
          <p className="label">Overview</p>
          <p className="text-subheading leading-[1.45] tracking-[-0.11px]">{project.overview}</p>
        </Reveal>
      </section>

      {/* ============ I. THE MAKING ============ */}
      <Room dark>
        <SectionLabels left="I." right="How it was made" />
        <SectionHeader text="The Making" />
        <ol className="mx-auto mt-24 grid max-w-[1120px] gap-x-7 gap-y-14 md:grid-cols-3">
          {project.process.map((step, i) => (
            <li key={step.title}>
              <Reveal
                className="flex flex-col gap-4 border-t border-graphite pt-6"
                style={{ transitionDelay: `${i * 140}ms` }}
              >
                <span className="label text-putty">Step {String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-serif text-heading-sm">{step.title}</h3>
                <p className="text-body-sm text-putty">{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Room>

      {/* ============ II. MY WORK ============ */}
      <Room>
        <SectionLabels left="II." right="What I did" />
        <SectionHeader text="My Work" />
        <Reveal className="mx-auto mt-24 max-w-[900px] rounded-card bg-bone p-6 [--hex-fill:var(--color-bone)]">
          <p className="label mb-2">Contributions</p>
          <ul>
            {project.contributions.map((c, i) => (
              <motion.li
                key={c}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: i * 0.07, duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
                className="flex gap-4 border-t border-vellum py-5 first:border-t-0"
              >
                <span className="hex mt-1.5 shrink-0" aria-hidden="true" />
                <span className="text-body-sm md:text-base">{c}</span>
              </motion.li>
            ))}
          </ul>
        </Reveal>
      </Room>

      {/* ============ III. DIFFICULTIES ============ */}
      <Room dark>
        <SectionLabels left="III." right="What was hard" />
        <SectionHeader text="Difficulties" />
        <div className="mx-auto mt-24 max-w-[1120px] border-b border-graphite">
          {project.challenges.map((c, i) => (
            <Reveal
              key={c.title}
              className="grid gap-6 border-t border-graphite py-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-14 md:py-14"
            >
              <div className="flex flex-col gap-3">
                <span className="label text-putty">No. {String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-serif text-[34px] leading-[1.05] tracking-display md:text-heading-lg">{c.title}</h3>
              </div>
              <div className="flex flex-col gap-6">
                <div>
                  <p className="label mb-2 text-putty">The difficulty</p>
                  <p className="text-body-sm md:text-base">{c.problem}</p>
                </div>
                <div>
                  <p className="label mb-2 text-putty">How I solved it</p>
                  <p className="text-body-sm md:text-base">{c.solution}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Room>

      {/* ============ PAINTING + QUOTE ============ */}
      <Painting src={project.painting.src} credit={project.painting.credit} className="min-h-[75vh]">
        {project.quote && (
          <QuoteCard
            quote={project.quote.text}
            author={project.quote.author}
            role={project.quote.role}
          />
        )}
      </Painting>

      {/* ============ IV. OUTCOME ============ */}
      <Room className="text-center">
        <SectionLabels left="IV." right="Outcome" />
        <Reveal className="mx-auto flex max-w-[900px] flex-col items-center gap-10">
          <p className="label">Outcome</p>
          <p className="font-serif text-heading-lg font-medium tracking-display">
            <SplitWords key={project.slug} text={project.outcome} />
          </p>
          <Pill href={project.url}>Visit {project.title} ↗</Pill>
        </Reveal>
      </Room>

      {/* ============ NEXT ============ */}
      <section className="bg-ink px-4 py-24 text-paper md:px-10 md:py-[120px]">
        <Link
          to={`/work/${next.slug}`}
          className="group mx-auto flex max-w-[1120px] flex-col items-center gap-8 text-center no-underline"
        >
          <span className="label text-putty">Next work · No. {projectNumber(next.slug)}</span>
          <Vignette src={next.screenshot} alt={`${next.title} screenshot`} className="size-32 md:size-40" />
          <span className="font-serif text-section font-medium uppercase tracking-display group-hover:italic">
            {next.title}
          </span>
          <span className="text-xs underline-offset-[3px] group-hover:underline">Read the case study →</span>
        </Link>
      </section>

      <Footer />
    </>
  )
}
