import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MainLayout } from '@/shared/components/layout/MainLayout'
import { OnboardingWizard } from '@/features/onboarding/components/OnboardingWizard'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { ROUTES } from '@/shared/constants/app.constants'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { hasClinic } = useAuthStore()

  useEffect(() => {
    // Redirect if user already has a clinic
    if (hasClinic()) {
      navigate(ROUTES.DASHBOARD)
    }
  }, [hasClinic, navigate])

  return (
    <MainLayout showFooter={false}>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12 bg-gradient-to-b from-green-50 to-white">
        <OnboardingWizard />
      </div>
    </MainLayout>
  )
}
