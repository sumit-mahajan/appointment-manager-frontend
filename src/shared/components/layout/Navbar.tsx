import { Link, useNavigate } from 'react-router-dom'
import { Building2, LogOut, User, Bell } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useJoinRequests } from '@/features/clinic/hooks/useJoinRequests'
import { ROUTES, APP_NAME } from '@/shared/constants/app.constants'

export function Navbar() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout, getRole } = useAuthStore()
  const isOwner = getRole() === 'OWNER'

  // Only fetch pending requests if user is owner
  const { data: pendingRequests } = useJoinRequests('pending', isOwner)
  const pendingCount = pendingRequests?.length || 0

  const handleLogout = () => {
    logout()
    navigate(ROUTES.HOME)
  }

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to={ROUTES.HOME} className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">{APP_NAME}</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to={ROUTES.DASHBOARD}>
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                
                {/* Show notification icon only for owners */}
                {isOwner && (
                  <Link to={ROUTES.JOIN_REQUESTS}>
                    <Button variant="ghost" size="sm" className="relative">
                      <Bell className="h-5 w-5" />
                      {pendingCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {pendingCount}
                        </span>
                      )}
                    </Button>
                  </Link>
                )}
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-md">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {user?.name}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center space-x-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to={ROUTES.AUTH}>
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to={ROUTES.AUTH}>
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
