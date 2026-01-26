import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { MainLayout } from '@/shared/components/layout/MainLayout'
import { ROUTES } from '@/shared/constants/app.constants'

export default function NotFoundPage() {
  return (
    <MainLayout showFooter={false}>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="text-center space-y-6">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="text-3xl font-semibold text-gray-900">Page Not Found</h2>
          <p className="text-lg text-gray-600 max-w-md">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to={ROUTES.HOME}>
            <Button size="lg" className="flex items-center space-x-2">
              <Home className="h-5 w-5" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  )
}
