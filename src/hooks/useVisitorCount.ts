import { useEffect, useState } from 'react'
import { site } from '../content/site'

const SESSION_KEY = 'wood-shop-visit-recorded'
const CACHE_KEY = 'wood-shop-visitor-count'

export function useVisitorCount() {
  const [count, setCount] = useState<number | null>(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) return Number.parseInt(cached, 10)
    } catch {
      /* ignore */
    }
    return null
  })

  useEffect(() => {
    const { namespace, key } = site.visitorCount
    const base = `https://api.countapi.xyz`
    const already = sessionStorage.getItem(SESSION_KEY)
    const endpoint = already
      ? `${base}/get/${namespace}/${key}`
      : `${base}/hit/${namespace}/${key}`

    fetch(endpoint)
      .then((res) => res.json())
      .then((data: { value?: number }) => {
        if (typeof data.value !== 'number') return
        setCount(data.value)
        try {
          localStorage.setItem(CACHE_KEY, String(data.value))
          if (!already) sessionStorage.setItem(SESSION_KEY, '1')
        } catch {
          /* ignore */
        }
      })
      .catch(() => {
        /* keep cached count if any */
      })
  }, [])

  return count
}
