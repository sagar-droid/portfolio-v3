import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, type PanInfo } from 'motion/react'

export type Slide = {
  src: string
  alt: string
  caption: ReactNode
  width: number
  height: number
}

const spring = { type: 'spring', stiffness: 260, damping: 34 } as const
const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Image slider for the case-study plates.
 * Swipe / drag, arrow buttons or ← → keys. The frame keeps one fixed 16:10 size,
 * and each image is scaled to fit inside it and centred, so the page never jumps
 * and screenshots of different shapes are never cropped.
 */
export function Slider({ slides, label, note }: { slides: Slide[]; label: string; note?: ReactNode }) {
  const reduce = useReducedMotion()
  const viewportRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [width, setWidth] = useState(0)
  const x = useMotionValue(0)
  const count = slides.length

  // Track the viewport width so slides can be positioned in pixels (needed for dragging)
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Keep the track aligned with the current slide when the width changes
  useEffect(() => {
    x.set(-index * width)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width])

  const goTo = useCallback(
    (i: number) => {
      const next = Math.max(0, Math.min(count - 1, i))
      setIndex(next)
      animate(x, -next * width, reduce ? { duration: 0 } : spring)
    },
    [count, width, x, reduce],
  )

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = width * 0.18
    if (info.offset.x < -threshold || info.velocity.x < -500) goTo(index + 1)
    else if (info.offset.x > threshold || info.velocity.x > 500) goTo(index - 1)
    else goTo(index)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      goTo(index + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goTo(index - 1)
    }
  }

  return (
    <figure role="region" aria-roledescription="carousel" aria-label={label} className="rounded-card bg-bone p-3 md:p-6">
      <div
        ref={viewportRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative aspect-[16/10] overflow-hidden rounded-[4px] border border-vellum bg-paper"
      >
        <motion.ul
          className="flex h-full cursor-grab active:cursor-grabbing"
          style={{ x }}
          drag={count > 1 ? 'x' : false}
          dragConstraints={{ left: -(count - 1) * width, right: 0 }}
          dragElastic={0.12}
          dragMomentum={false}
          onDragEnd={onDragEnd}
        >
          {slides.map((s, i) => (
            <li
              key={s.src}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i !== index}
              className="h-full w-full shrink-0"
            >
              <img
                src={s.src}
                alt={s.alt}
                width={s.width}
                height={s.height}
                className="block h-full w-full select-none object-contain"
                draggable={false}
                // Eager: slides sit off to the side inside overflow:hidden, where lazy images may never load
                decoding="async"
              />
            </li>
          ))}
        </motion.ul>
      </div>

      <figcaption className="mt-4 flex flex-col gap-3 text-xs text-graphite md:flex-row md:items-center md:justify-between">
        <span aria-live="polite">
          <span className="text-ink">Fig. {index + 1}</span> · {slides[index].caption}
        </span>

        {count > 1 && (
          <span className="flex items-center gap-4">
            <span className="label font-normal tabular-nums">
              <span className="text-ink">{pad(index + 1)}</span> / {pad(count)}
            </span>
            <span className="flex gap-2">
              <ArrowButton dir="prev" disabled={index === 0} onClick={() => goTo(index - 1)} />
              <ArrowButton dir="next" disabled={index === count - 1} onClick={() => goTo(index + 1)} />
            </span>
          </span>
        )}
      </figcaption>

      {count > 1 && (
        <div className="mt-3 flex gap-1.5" aria-hidden="true">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              tabIndex={-1}
              onClick={() => goTo(i)}
              className="group/dot h-4 flex-1 cursor-pointer"
            >
              <span
                className={`block h-px w-full transition-colors duration-500 ${
                  i === index ? 'bg-ink' : 'bg-ash/40 group-hover/dot:bg-graphite'
                }`}
              />
            </button>
          ))}
        </div>
      )}

      {note && <p className="label mt-3 font-normal text-xs text-graphite">{note}</p>}
    </figure>
  )
}

function ArrowButton({ dir, disabled, onClick }: { dir: 'prev' | 'next'; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'prev' ? 'Previous image' : 'Next image'}
      className="grid size-9 cursor-pointer place-items-center rounded-full border border-ink text-sm text-ink transition-colors duration-300 hover:bg-ink hover:text-paper disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
    >
      {dir === 'prev' ? '←' : '→'}
    </button>
  )
}
