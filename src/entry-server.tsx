/**
 * Server entry used only at build time by scripts/prerender.mjs to turn each
 * route into static HTML, so crawlers and AI engines that don't run JS see content.
 */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router'
import { routes } from './routes'
import { SITE_URL } from './seo'

export async function render(path: string) {
  const handler = createStaticHandler(routes)
  const context = await handler.query(new Request(`${SITE_URL}${path}`))
  if (context instanceof Response) throw new Error(`Unexpected redirect while prerendering ${path}`)
  const router = createStaticRouter(handler.dataRoutes, context)
  return renderToString(
    <StrictMode>
      <StaticRouterProvider router={router} context={context} hydrate={false} />
    </StrictMode>,
  )
}

export { getHead, headToHtml, routePaths, SITE_URL, canonical } from './seo'
export { projects } from './data/projects'
export { profile } from './data/profile'
