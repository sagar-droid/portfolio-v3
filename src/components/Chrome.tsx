import { Link } from 'react-router'
import { profile } from '../data/profile'
import { ghostLink } from './ui'

/* ---------- Minimal header: logo mark + one text link ---------- */
export function Header({ back }: { back?: boolean }) {
  return (
    <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-5 md:px-10">
      <Link
        to="/"
        aria-label={`${profile.name} — home`}
        className="grid size-8 place-items-center rounded-full border-[1.5px] border-ink pb-0.5 font-serif text-[17px] font-medium leading-none no-underline"
      >
        {profile.firstName[0]}
      </Link>
      <nav className="flex gap-6">
        {back && (
          <Link to={{ pathname: '/', hash: '#catalogue' }} className={ghostLink}>
            ← All works
          </Link>
        )}
        <Link to={{ pathname: '/', hash: '#contact' }} className={ghostLink}>
          Get in touch
        </Link>
      </nav>
    </header>
  )
}

/* ---------- Footer ---------- */
export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between gap-4 bg-chalk px-4 py-7 text-center text-xs text-graphite [--hex-fill:var(--color-chalk)] md:flex-row md:px-10 md:text-left">
      <span>
        © {new Date().getFullYear()} {profile.name}
      </span>
      <span className="inline-flex gap-1.5 text-ink" aria-hidden="true">
        <span className="hex" />
        <span className="hex" />
        <span className="hex" />
      </span>
      <span>Paintings in the public domain, via Wikimedia Commons</span>
    </footer>
  )
}

/* ---------- Dev-only reminder that a page still has placeholder copy ---------- */
export function DraftNotice() {
  if (!import.meta.env.DEV) return null
  return (
    <p className="fixed bottom-4 left-4 z-50 rounded-pill bg-ink px-4 py-2 text-xs text-paper">
      Draft copy · edit in <code>src/data/projects.ts</code> (only visible in dev)
    </p>
  )
}
