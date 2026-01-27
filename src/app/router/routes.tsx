import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/app.constants'
import { ProtectedRoute } from './ProtectedRoute'

// Pages (lazy loaded for code splitting)
import { lazy, Suspense } from 'react'

const LandingPage = lazy(() => import('@/pages/LandingPage'))
const AuthPage = lazy(() => import('@/pages/AuthPage'))
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const JoinRequestsPage = lazy(() => import('@/pages/JoinRequestsPage'))
const AppointmentListPage = lazy(() => import('@/pages/AppointmentListPage'))
const BookAppointmentPage = lazy(() => import('@/pages/BookAppointmentPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
)

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: (
      <Suspense fallback={<PageLoader />}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.AUTH,
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.ONBOARDING,
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <OnboardingPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.DASHBOARD,
    element: (
      <ProtectedRoute requireClinic>
        <Suspense fallback={<PageLoader />}>
          <DashboardPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.JOIN_REQUESTS,
    element: (
      <ProtectedRoute requireClinic>
        <Suspense fallback={<PageLoader />}>
          <JoinRequestsPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.APPOINTMENTS,
    element: (
      <ProtectedRoute requireClinic>
        <Suspense fallback={<PageLoader />}>
          <AppointmentListPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.APPOINTMENTS_NEW,
    element: (
      <ProtectedRoute requireClinic>
        <Suspense fallback={<PageLoader />}>
          <BookAppointmentPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
])
