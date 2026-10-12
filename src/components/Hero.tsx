import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { profile } from '../data/profile'
import { Header } from './Chrome'
import { easeCurtain, easeGallery, SplitWords, useParallax } from './motion'
import { Pill, StatPair } from './ui'

/* ---------- Hero: letters of the wordmark rise in, then drift on scroll ---------- */
export function Hero() {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const wordmarkY = useTransform(scrollY, [0, 900], reduce ? [0, 0] : [0, 260])
  const clusterY = useTransform(scrollY, [0, 500], reduce ? [0, 0] : [0, -90])
  const clusterOpacity = useTransform(scrollY, [0, 420], [1, 0])

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.8, ease: easeGallery },
  })

  return (
    <section id="top" className="relative flex min-h-svh flex-col items-center overflow-hidden bg-putty">
      <Header />

      <motion.div
        style={{ y: clusterY, opacity: clusterOpacity }}
        className="relative z-[1] mt-[max(22vh,120px)] flex flex-col items-center gap-5 px-4 text-center"
      >
        <h1 className="font-serif text-heading-lg font-medium uppercase tracking-[-0.47px]">
          {/* The visible wordmark is decorative, so the name lives in the h1 for crawlers and screen readers */}
          <span className="sr-only">{profile.name}, </span>
          <SplitWords text="Frontend *Developer*" onMount delay={0.75} />
        </h1>
        <motion.div {...fadeUp(1.05)}>
          <StatPair
            items={[`EXPERIENCE: ${profile.experience} YRS`, `PROJECTS: 50+`]}
            className="justify-center"
          />
        </motion.div>
        <motion.div {...fadeUp(1.2)}>
          <Pill href="#works">View my work</Pill>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        style={{ x: '-50%', y: wordmarkY }}
        className="pointer-events-none absolute bottom-[-0.12em] left-1/2 select-none whitespace-nowrap font-serif text-display font-medium tracking-display"
      >
        {profile.firstName.split('').map((ch, i) => (
          <span key={i} className="-my-[0.15em] inline-block overflow-hidden py-[0.15em] align-top">
            <motion.span
              className="inline-block"
              initial={{ y: '105%' }}
              animate={{ y: '0%' }}
              transition={{ delay: 0.45 + i * 0.07, duration: 1.2, ease: easeCurtain }}
            >
              {ch}
            </motion.span>
          </span>
        ))}
      </motion.div>
    </section>
  )
}

/* ---------- Index card that floats against the painting's parallax ---------- */
const index = [
  { no: 'I.', label: 'Selected Works', hash: '#works' },
  { no: 'II.', label: 'Catalogue', hash: '#catalogue' },
  { no: 'III.', label: 'About', hash: '#about' },
  { no: 'IV.', label: 'Record', hash: '#record' },
  { no: 'V.', label: 'Contact', hash: '#contact' },
]

export function IndexCard() {
  const [ref, y] = useParallax<HTMLDivElement>('18%', '-18%')
  // Observe the unclipped outer wrapper (a clipped element never counts as "in view")
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const show = inView ? 'show' : 'hidden'

  return (
    <motion.div ref={ref} style={{ y }} className="w-full max-w-[400px]">
      {/* Reveal clip lives on its own layer so it doesn't replace the notched corners */}
      <motion.div
        initial={{ clipPath: 'inset(50% 0% 50% 0%)' }}
        animate={{ clipPath: inView ? 'inset(0% 0% 0% 0%)' : 'inset(50% 0% 50% 0%)' }}
        transition={{ duration: 1.1, ease: easeCurtain }}
      >
        <nav
          aria-label="Index"
          className="notched relative flex min-h-[340px] flex-col gap-7 bg-ink p-7 text-paper [--notch:20px] md:aspect-square md:p-8 md:[--notch:28px]"
        >
          <p className="label">Index</p>
          <ol className="group/idx flex flex-col gap-2.5">
            {index.map((i, n) => (
              <motion.li
                key={i.hash}
                initial="hidden"
                animate={show}
                variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } }}
                transition={{ delay: 0.5 + n * 0.08, duration: 0.7, ease: easeGallery }}
              >
                <a
                  href={i.hash}
                  className="flex items-baseline gap-4 font-serif text-[28px] leading-[1.1] tracking-display no-underline transition-[opacity,transform] duration-300 ease-gallery hover:translate-x-2 hover:italic md:text-[34px] md:group-hover/idx:opacity-45 md:hover:opacity-100!"
                >
                  <span className="min-w-[26px] font-sans text-xs not-italic text-putty">{i.no}</span>
                  {i.label}
                </a>
              </motion.li>
            ))}
          </ol>
          <span className="absolute bottom-7 left-7 flex items-center gap-2 text-micro tracking-[0.12em] md:left-8">
            SCROLL
            <motion.span
              aria-hidden="true"
              className="block h-px w-6 origin-left bg-paper"
              animate={{ scaleX: [0, 1, 1], opacity: [1, 1, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </nav>
      </motion.div>
    </motion.div>
  )
}
