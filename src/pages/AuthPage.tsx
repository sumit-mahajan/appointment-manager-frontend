import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MainLayout } from '@/shared/components/layout/MainLayout'
import { AuthTabs } from '@/features/auth/components/AuthTabs'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { ROUTES } from '@/shared/constants/app.constants'

export default function AuthPage() {
  const navigate = useNavigate()
  const { isAuthenticated, hasClinic } = useAuthStore()

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      if (hasClinic()) {
        navigate(ROUTES.DASHBOARD)
      } else {
        navigate(ROUTES.ONBOARDING)
      }
    }
  }, [isAuthenticated, hasClinic, navigate])

  return (
    <MainLayout showFooter={false}>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12 bg-gradient-to-b from-green-50 to-white">
        <AuthTabs />
      </div>
    </MainLayout>
  )
}
