import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

let lenis: Lenis | null = null

/** Start Lenis smooth scrolling. Returns a cleanup function. */
export function startSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

  lenis = new Lenis({ autoRaf: true, lerp: 0.09, stopInertiaOnNavigate: true })

  // Same-page "#section" links glide instead of jumping
  const onClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return
    const target = document.getElementById(a.hash.slice(1))
    if (!target) return
    e.preventDefault()
    scrollToTarget(target)
    history.replaceState(history.state, '', a.hash)
  }
  document.addEventListener('click', onClick)

  return () => {
    document.removeEventListener('click', onClick)
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToTarget(target: HTMLElement | number, immediate = false) {
  if (lenis) {
    lenis.scrollTo(target, { immediate, force: true, duration: immediate ? 0 : 1.4 })
  } else if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: immediate ? 'instant' : 'smooth' })
  } else {
    target.scrollIntoView({ behavior: immediate ? 'instant' : 'smooth' })
  }
}
