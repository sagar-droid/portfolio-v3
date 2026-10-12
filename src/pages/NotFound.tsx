import { Header } from '../components/Chrome'
import { Painting, Pill } from '../components/ui'
import { useLocation } from 'react-router'
import { useHead } from '../hooks/useHead'

export default function NotFound() {
  useHead(useLocation().pathname)

  return (
    <div className="relative">
      <Header />
      <Painting src="/img/temeraire.webp" credit="J. M. W. Turner, The Fighting Temeraire, 1839">
        <div className="notched flex w-full max-w-[400px] flex-col items-start gap-6 bg-ink p-8 text-paper">
          <p className="label">404</p>
          <h1 className="font-serif text-heading-lg font-medium tracking-display">
            Lost <em>at</em> sea.
          </h1>
          <p className="text-body-sm text-putty">This room of the gallery doesn't exist.</p>
          <Pill to="/" inverse>
            Back to the gallery
          </Pill>
        </div>
      </Painting>
    </div>
  )
}
