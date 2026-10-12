import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { motion } from 'motion/react'
import { IrisImage, Magnetic, SplitWords, useParallax } from './motion'

/* ---------- Pill button (primary CTA) — magnetic, with a sliding fill on hover ---------- */
type PillProps = {
  children: ReactNode
  inverse?: boolean
  className?: string
} & ({ to: string; href?: never } | { href: string; to?: never })

export function Pill({ children, inverse, className = '', to, href }: PillProps) {
  const cls = `group/pill relative inline-block overflow-hidden rounded-pill px-[17px] py-[9px] text-xs leading-tight ${
    inverse ? 'bg-paper text-ink' : 'bg-ink text-paper'
  } ${className}`
  const inner = (
    <>
      <span
        aria-hidden="true"
        className={`absolute inset-0 translate-y-full rounded-pill transition-transform duration-500 ease-gallery group-hover/pill:translate-y-0 ${
          inverse ? 'bg-putty' : 'bg-graphite'
        }`}
      />
      <span className="relative">{children}</span>
    </>
  )
  const external = href?.startsWith('http')
  return (
    <Magnetic>
      {to ? (
        <Link to={to} className={cls}>
          {inner}
        </Link>
      ) : (
        <a href={href} className={cls} {...(external && { target: '_blank', rel: 'noopener noreferrer' })}>
          {inner}
        </a>
      )}
    </Magnetic>
  )
}

/* ---------- Ghost text link ---------- */
export const ghostLink = 'text-xs no-underline underline-offset-[3px] hover:underline rounded-link'

/* ---------- Stat pair row ---------- */
export function StatPair({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <p className={`flex flex-wrap gap-x-7 gap-y-2 text-base font-medium tracking-[0.02em] ${className}`}>
      {items.map((s) => (
        <span key={s}>{s}</span>
      ))}
    </p>
  )
}

/* ---------- Corner labels at the top of a section ---------- */
export function SectionLabels({ left, right, className = 'top-10' }: { left: string; right: string; className?: string }) {
  return (
    <div className={`label absolute inset-x-4 flex justify-between font-normal md:inset-x-10 ${className}`}>
      <span>{left}</span>
      <span>{right}</span>
    </div>
  )
}

/* ---------- Big centred serif section title; words rise out of a mask ---------- */
export function SectionHeader({ text, className = '' }: { text: string; className?: string }) {
  return (
    <h2
      className={`mx-auto max-w-[14ch] text-center font-serif text-section font-medium uppercase tracking-display ${className}`}
    >
      <SplitWords text={text} />
    </h2>
  )
}

/* ---------- Section wrapper: light putty room or dark ink room ---------- */
export function Room({
  id,
  dark,
  flush,
  className = '',
  children,
}: {
  id?: string
  dark?: boolean
  flush?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className={`relative px-4 md:px-10 ${flush ? 'pt-24 md:pt-16' : 'pt-32 md:pt-[168px]'} pb-24 md:pb-[168px] ${
        dark ? 'bg-ink text-paper [--hex-fill:var(--color-ink)]' : 'bg-putty text-ink'
      } ${className}`}
    >
      {children}
    </section>
  )
}

/* ---------- Full-bleed painting with parallax and a museum wall label ---------- */
export function Painting({
  src,
  credit,
  className = 'min-h-svh',
  children,
}: {
  src: string
  credit: string
  className?: string
  children?: ReactNode
}) {
  const [ref, y] = useParallax<HTMLElement>('-12%', '12%')

  return (
    <section
      ref={ref}
      className={`relative grid place-items-center overflow-hidden bg-ash px-4 py-24 md:px-10 ${className}`}
      aria-label={children ? undefined : credit}
    >
      <motion.img
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        style={{ y }}
        className="absolute inset-x-0 -top-[15%] h-[130%] w-full object-cover"
      />
      <div className="relative z-[1] grid w-full place-items-center">{children}</div>
      <p className="absolute inset-x-4 bottom-5 z-[1] text-center md:inset-x-auto md:right-10 md:text-right">
        <span className="rounded-link bg-ink px-2 py-1 text-xs tracking-[0.02em] text-paper">{credit}</span>
      </p>
    </section>
  )
}

/* ---------- Circular image crop (irises open on scroll) ---------- */
export const Vignette = IrisImage
