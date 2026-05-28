import { useEffect, useState } from 'react'
import { API_BASE_URL, API_ENDPOINTS } from '@/shared/constants/api.constants'

type ServerStatus = 'checking' | 'ready' | 'waking'

const WAKE_THRESHOLD_MS = 1500

/**
 * Pings /health on load. If the backend is cold (>1.5s), shows a wake-up state.
 */
export function useServerStatus() {
  const [status, setStatus] = useState<ServerStatus>('checking')

  useEffect(() => {
    let cancelled = false

    fetch(`${API_BASE_URL}${API_ENDPOINTS.HEALTH}`)
      .then((res) => {
        if (cancelled) return
        setStatus('ready')
        if (!res.ok) return
      })
      .catch(() => {
        if (!cancelled) setStatus('ready')
      })

    const timer = setTimeout(() => {
      if (!cancelled) setStatus((s) => (s === 'checking' ? 'waking' : s))
    }, WAKE_THRESHOLD_MS)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [])

  return { isWaking: status === 'waking', isChecking: status === 'checking' }
}
