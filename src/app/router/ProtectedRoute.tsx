import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { ROUTES } from '@/shared/constants/app.constants'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireClinic?: boolean
}

export function ProtectedRoute({ children, requireClinic = false }: ProtectedRouteProps) {
  const { isAuthenticated, hasClinic } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH} replace />
  }

  if (requireClinic && !hasClinic()) {
    return <Navigate to={ROUTES.ONBOARDING} replace />
  }

  return <>{children}</>
}
