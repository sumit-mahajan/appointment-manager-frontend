import { QueryProvider } from './QueryProvider'
import { AuthInitializer } from '@/features/auth/components/AuthInitializer'

interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <AuthInitializer />
      {children}
    </QueryProvider>
  )
}
