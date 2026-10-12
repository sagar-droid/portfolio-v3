import { useEffect, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useVelocity } from 'motion/react'
import { Link } from 'react-router'
import { projects, projectNumber } from '../data/projects'
import { Reveal } from './Reveal'

const PREVIEW_W = 360
const PREVIEW_H = 202

/** Numbered list of every project. On desktop a screenshot follows the cursor. */
export function Catalogue() {
  const [active, setActive] = useState<string | null>(null)

  // Preview follows the cursor on a spring and tilts with horizontal speed
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 260, damping: 28, mass: 0.6 })
  const y = useSpring(my, { stiffness: 260, damping: 28, mass: 0.6 })
  const rotate = useTransform(useVelocity(x), [-2000, 0, 2000], [-10, 0, 10], { clamp: true })
  const [canHover, setCanHover] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (min-width: 768px)')
    const update = () => setCanHover(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const move = (e: MouseEvent) => {
    mx.set(Math.min(e.clientX + 24, window.innerWidth - PREVIEW_W - 16))
    my.set(Math.min(Math.max(e.clientY - PREVIEW_H / 2, 16), window.innerHeight - PREVIEW_H - 16))
  }

  const enter = (e: MouseEvent, shot: string) => {
    move(e)
    if (!active) {
      // Appear at the cursor instead of flying in from the corner
      x.jump(mx.get())
      y.jump(my.get())
    }
    setActive(shot)
  }

  return (
    <>
      <ol onMouseLeave={() => setActive(null)} className="group/list mx-auto max-w-[1120px] border-b border-graphite">
        {projects.map((p) => (
          <li key={p.slug}>
            <Reveal>
              <Link
                to={`/work/${p.slug}`}
                onMouseEnter={(e) => enter(e, p.screenshot)}
                onMouseMove={canHover ? move : undefined}
                className="group grid grid-cols-[32px_minmax(0,1fr)_20px] items-baseline gap-x-4 gap-y-2 border-t border-graphite py-5 no-underline transition-opacity duration-300 md:grid-cols-[48px_minmax(0,1fr)_minmax(0,1fr)_24px] md:py-7 md:group-hover/list:opacity-40 md:hover:opacity-100! md:focus-visible:opacity-100!"
              >
                <span className="text-xs font-medium tracking-[0.04em] text-putty">{projectNumber(p.slug)}</span>
                <span className="font-serif text-[34px] leading-none tracking-display group-hover:italic md:text-heading-lg">
                  {p.title}
                </span>
                <span className="label col-start-2 col-end-4 row-start-2 font-normal text-putty md:col-auto md:row-auto">
                  {p.category} · {p.stack.slice(0, 3).join(', ')}
                </span>
                <span aria-hidden="true" className="col-start-3 row-start-1 justify-self-end md:col-start-4">
                  →
                </span>
                <img
                  src={p.screenshot}
                  alt=""
                  loading="lazy"
                  className="col-span-full mt-2 w-full rounded-card md:hidden"
                />
              </Link>
            </Reveal>
          </li>
        ))}
      </ol>

      {canHover && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-20"
          style={{ x, y, rotate, width: PREVIEW_W, height: PREVIEW_H }}
        >
          <AnimatePresence>
            {active && (
              <motion.div
                key={active}
                className="absolute inset-0 overflow-hidden rounded-card bg-ash"
                initial={{ opacity: 0, scale: 0.85, clipPath: 'inset(50% 0 50% 0 round 9px)' }}
                animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0 0% 0 round 9px)' }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
              >
                <img src={active} alt="" className="size-full object-cover object-top" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  )
}
