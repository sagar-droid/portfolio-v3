import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { routes } from './routes'
import '@fontsource/playfair-display/latin-400.css'
import '@fontsource/playfair-display/latin-500.css'
import '@fontsource/playfair-display/latin-400-italic.css'
import '@fontsource/playfair-display/latin-500-italic.css'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import './index.css'

const router = createBrowserRouter(routes)
const app = (
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)

const root = document.getElementById('root')!
// Pages are prerendered at build time → hydrate them; in dev the root only holds the
// <!--app-html--> placeholder comment → render from scratch.
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
