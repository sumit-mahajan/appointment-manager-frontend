import { Loader2 } from 'lucide-react'
import { useServerStatus } from '@/shared/hooks/useServerStatus'

export function ServerWakeBanner() {
  const { isWaking } = useServerStatus()

  if (!isWaking) return null

  return (
    <div
      role="status"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 border-b border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary"
    >
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      <span>Waking up the server…</span>
    </div>
  )
}
