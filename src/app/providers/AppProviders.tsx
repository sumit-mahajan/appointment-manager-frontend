import { QueryProvider } from './QueryProvider'
import { AuthInitializer } from '@/features/auth/components/AuthInitializer'
import { ServerWakeBanner } from '@/shared/components/layout/ServerWakeBanner'
import { Toaster } from '@/shared/components/ui/sonner'

interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <ServerWakeBanner />
      <AuthInitializer />
      {children}
      <Toaster />
    </QueryProvider>
  )
}
