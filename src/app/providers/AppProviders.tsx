import { QueryProvider } from './QueryProvider'
import { AuthInitializer } from '@/features/auth/components/AuthInitializer'
import { Toaster } from '@/shared/components/ui/sonner'

interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <AuthInitializer />
      {children}
      <Toaster />
    </QueryProvider>
  )
}
