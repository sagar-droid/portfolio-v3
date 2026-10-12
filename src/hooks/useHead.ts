import { useEffect } from 'react'
import { applyHead, getHead } from '../seo'

/** Keep <title>, meta, canonical and JSON-LD in sync with the current route. */
export function useHead(path: string) {
  useEffect(() => {
    applyHead(getHead(path))
  }, [path])
}
