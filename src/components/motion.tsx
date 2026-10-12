import { useRef, type MouseEvent, type ReactNode, type RefObject } from 'react'
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type UseScrollOptions,
} from 'motion/react'

export const easeGallery = [0.2, 0.7, 0.2, 1] as const
export const easeCurtain = [0.76, 0, 0.24, 1] as const

/* ---------- Parallax: map an element's pass through the viewport to a range ---------- */
export function useParallax<T extends HTMLElement>(
  from: string | number,
  to: string | number,
  offset: UseScrollOptions['offset'] = ['start end', 'end start'],
): [RefObject<T | null>, MotionValue<string | number>] {
  const ref = useRef<T>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset })
  const value = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [from, to])
  return [ref, value]
}

/* ---------- Words slide up out of a mask. Wrap words in *asterisks* for italics. ---------- */
const wordParent = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const wordChild = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.9, ease: easeGallery } },
}

export function SplitWords({
  text,
  className = '',
  delay = 0,
  onMount = false,
}: {
  text: string
  className?: string
  delay?: number
  /** Animate immediately instead of when scrolled into view */
  onMount?: boolean
}) {
  const words = text.split(' ')
  const trigger = onMount
    ? { animate: 'show' as const }
    : { whileInView: 'show' as const, viewport: { once: true, amount: 0.4 } }

  return (
    <motion.span
      className={className}
      initial="hidden"
      {...trigger}
      variants={wordParent}
      transition={{ delayChildren: delay }}
    >
      {words.map((w, i) => {
        const italic = w.startsWith('*') && w.replace(/[.,!?]$/, '').endsWith('*')
        const clean = w.replace(/\*/g, '')
        return (
          <span key={i} className="-my-[0.12em] inline-block overflow-hidden py-[0.12em] align-top">
            <motion.span className="inline-block" variants={wordChild}>
              {italic ? <em className="normal-case">{clean}</em> : clean}
            </motion.span>
            {i < words.length - 1 && ' '}
          </span>
        )
      })}
    </motion.span>
  )
}

/* ---------- Circle that irises open when it scrolls into view ---------- */
export function IrisImage({ src, alt, className = 'size-60' }: { src: string; alt: string; className?: string }) {
  // Observe the unclipped wrapper: browsers count an element's own clip-path when
  // measuring intersection, so a circle(0%) element would never register as in view.
  const [ref, scale] = useParallax<HTMLSpanElement>(1.25, 1, ['start end', 'center center'])
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <span ref={ref} className={`block ${className}`}>
      <motion.span
        className="block size-full overflow-hidden rounded-full bg-ash"
        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
        animate={{ clipPath: inView ? 'circle(71% at 50% 50%)' : 'circle(0% at 50% 50%)' }}
        // Opens past the edge (71% ≈ corner) so rounded-full alone shapes the circle — two
        // clips at the same radius leave anti-aliased slivers of the background showing
        transition={{ duration: 1.2, ease: easeCurtain }}
      >
        <motion.img
          src={src}
          alt={alt}
          style={{ scale }}
          className="size-full object-cover transition-[filter] duration-700 group-hover:brightness-110"
        />
      </motion.span>
    </span>
  )
}

/* ---------- Magnetic hover: element leans toward the cursor ---------- */
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  const spring = { stiffness: 220, damping: 14, mass: 0.4 }
  const x = useSpring(0, spring)
  const y = useSpring(0, spring)

  const onMove = (e: MouseEvent) => {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span ref={ref} className="inline-block" style={{ x, y }} onMouseMove={onMove} onMouseLeave={reset}>
      {children}
    </motion.span>
  )
}

/* ---------- A strip of large type that slides sideways as you scroll ---------- */
export function ScrollMarquee({
  items,
  reverse,
  className = '',
}: {
  items: string[]
  reverse?: boolean
  className?: string
}) {
  const [ref, x] = useParallax<HTMLDivElement>(reverse ? '-35%' : '0%', reverse ? '0%' : '-35%')
  const row = [...items, ...items, ...items]
  return (
    <div ref={ref} className="overflow-hidden whitespace-nowrap" aria-hidden="true">
      <motion.div style={{ x }} className={`inline-flex items-center gap-10 pr-10 ${className}`}>
        {row.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-10">
            {item}
            <span className="hex" />
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ---------- Page wrapper: ink curtain wipes on enter and exit ---------- */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div exit={{ opacity: 1 }} transition={{ duration: 0.7 }}>
      {/* lifts away on enter */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[70] origin-top bg-ink"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.9, ease: easeCurtain, delay: 0.1 }}
      />
      {/* rises on exit */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[70] origin-bottom bg-ink"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.6, ease: easeCurtain }}
      />
      {children}
    </motion.div>
  )
}
