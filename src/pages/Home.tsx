import { Link } from 'react-router'
import { Catalogue } from '../components/Catalogue'
import { Footer } from '../components/Chrome'
import { Hero, IndexCard } from '../components/Hero'
import { ScrollMarquee, SplitWords } from '../components/motion'
import { Reveal } from '../components/Reveal'
import { Painting, Pill, Room, SectionHeader, SectionLabels, StatPair, Vignette, ghostLink } from '../components/ui'
import { profile } from '../data/profile'
import { featuredProjects, projects } from '../data/projects'
import { useHead } from '../hooks/useHead'


export default function Home() {
  useHead('/')

  return (
    <>
      <Hero />

      {/* ============ PAINTING + INDEX CARD ============ */}
      <Painting src="/img/landscape.webp" credit="Thomas Cole, The Oxbow, 1836">
        <IndexCard />
      </Painting>

      {/* ============ SELECTED WORKS ============ */}
      <Room id="works" dark>
        <SectionLabels left="I." right="2023 — 2026" />
        <SectionHeader text="Selected Works" />

        <div className="mx-auto mt-24 grid max-w-[1120px] gap-x-7 gap-y-16 md:grid-cols-3">
          {featuredProjects.map((p, i) => (
            <Reveal key={p.slug} style={{ transitionDelay: `${i * 140}ms` }}>
              <Link to={`/work/${p.slug}`} className="group flex flex-col items-center gap-5 text-center no-underline">
                <h3 className="font-serif text-subheading tracking-[-0.11px]">{p.title}</h3>
                <Vignette src={p.painting.src} alt={p.painting.credit} className="size-[min(240px,70vw)]" />
                <span className="hex transition-opacity group-hover:after:opacity-0" aria-hidden="true" />
                <p className="label">{[p.category, ...p.stack.slice(0, 2)].join(' · ')}</p>
                <p className="max-w-[30ch] text-body-sm text-putty">{p.summary}</p>
                <span className="text-xs underline-offset-[3px] group-hover:underline">Read the case study →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Room>

      {/* ============ CATALOGUE ============ */}
      <Room id="catalogue" dark flush>
        <SectionLabels left="II." right={`Catalogue · ${projects.length} works`} />
        <div className="pt-10">
          <Catalogue />
        </div>
      </Room>

      {/* ============ STACK MARQUEE ============ */}
      <section className="flex flex-col gap-1 overflow-hidden bg-putty pt-16 md:pt-24">
        <ScrollMarquee
          items={['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Lit']}
          className="font-serif text-section font-medium uppercase tracking-display"
        />
        <ScrollMarquee
          reverse
          items={['Laravel', 'PHP', 'Web Vitals', 'Accessibility', 'Motion']}
          className="font-serif text-section italic tracking-display text-graphite"
        />
      </section>

      {/* ============ ABOUT ============ */}
      <Room id="about">
        <SectionLabels left="III." right="About" />
        <div className="mx-auto grid max-w-[1120px] items-center gap-14 md:grid-cols-[5fr_7fr]">
          <Reveal className="justify-self-center">
            <Vignette src={profile.portrait} alt={`Portrait of ${profile.name}`} className="size-[min(380px,80vw)]" />
          </Reveal>
          <Reveal className="flex flex-col gap-5">
            <h2 className="mb-4 max-w-[16ch] font-serif text-heading-lg font-medium tracking-display">
              <SplitWords text="Interfaces that are *fast,* accessible and built to last." />
            </h2>
            {profile.bio.map((para) => (
              <p key={para.slice(0, 20)} className="max-w-[52ch] text-body-sm">
                {para}
              </p>
            ))}
            <StatPair
              items={[`YEARS: ${profile.experience}`, `PROJECTS: 50+`, 'FOCUS: UI · A11Y · PERF']}
              className="mt-4"
            />
          </Reveal>
        </div>
      </Room>

      {/* ============ RECORD ============ */}
      <Room id="record" flush>
        <SectionLabels left="IV." right="Record" />
        <div className="pt-10">
          <SectionHeader text="Record" />
        </div>

        <div className="mx-auto mt-24 flex max-w-[1120px] flex-col gap-7">
          <Reveal className="rounded-card bg-bone p-6">
            <p className="label mb-2">Experience</p>
            <ul>
              {profile.experience_list.map((x) => (
                <li
                  key={x.title}
                  className="grid gap-1 border-t border-vellum py-5 first:border-t-0 md:grid-cols-[130px_minmax(0,1fr)_minmax(0,1.4fr)] md:items-baseline md:gap-4"
                >
                  <span className="text-xs font-medium tracking-[0.04em] text-graphite">{x.period}</span>
                  <span className="font-serif text-heading-sm leading-[1.2]">{x.title}</span>
                  <span className="text-body-sm text-graphite">
                    <span className="text-ink">{x.company}.</span> {x.detail}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="grid gap-7 md:grid-cols-2">
            {profile.capabilities.map((c) => (
              <Reveal key={c.label} className="flex flex-col gap-2.5 rounded-card bg-bone p-6">
                <p className="label">{c.label}</p>
                <h3 className="font-serif text-heading-sm">{c.title}</h3>
                <p className="text-body-sm text-graphite">{c.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Room>

      <Painting src="/img/adam.webp" credit="Michelangelo, The Creation of Adam, c. 1512" className="min-h-[70vh]" />

      {/* ============ CONTACT ============ */}
      <Room id="contact" dark className="flex flex-col items-center gap-10 text-center">
        <SectionLabels left="V." right="Contact" />
        <SectionHeader className="max-w-[12ch]" text="Let's make something *worth* showing." />
        <Reveal className="flex flex-col items-center gap-10">
          <p className="max-w-[44ch] text-body-sm text-putty">
            I'm always open to new projects, creative ideas and chances to help bring your vision to life.
          </p>
          <Pill href={`mailto:${profile.email}`} inverse>
            {profile.email}
          </Pill>
          <ul className="flex flex-wrap justify-center gap-x-7 gap-y-4">
            {profile.links.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className={ghostLink}>
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href={profile.phoneHref} className={ghostLink}>
                {profile.phone}
              </a>
            </li>
          </ul>
        </Reveal>
      </Room>

      <Footer />
    </>
  )
}
