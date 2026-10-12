import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { useLocation, useOutlet, type RouteObject } from 'react-router'
import { AnimatePresence, MotionConfig } from 'motion/react'
import { PageTransition } from './components/motion'
import { scrollToTarget, startSmoothScroll } from './lib/smoothScroll'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProjectPage from './pages/ProjectPage'

/** On mount (behind the curtain): jump to #hash target, or to the top. */
function Page({ children }: { children: ReactNode }) {
  const { hash } = useLocation()
  useLayoutEffect(() => {
    const el = hash ? document.getElementById(hash.slice(1)) : null
    scrollToTarget(el ?? 0, true)
  }, [])
  return <PageTransition>{children}</PageTransition>
}

function Layout() {
  const location = useLocation()
  const outlet = useOutlet()
  const prevPath = useRef(location.pathname)

  useEffect(() => startSmoothScroll(), [])

  // Router links to a #section on the page we're already on glide there
  useEffect(() => {
    if (prevPath.current === location.pathname && location.hash) {
      const el = document.getElementById(location.hash.slice(1))
      if (el) scrollToTarget(el)
    }
    prevPath.current = location.pathname
  }, [location.pathname, location.hash])

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        <Page key={location.pathname}>{outlet}</Page>
      </AnimatePresence>
    </MotionConfig>
  )
}

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/work/:slug', element: <ProjectPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]
