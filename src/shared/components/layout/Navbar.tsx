import { Link, useNavigate } from 'react-router-dom'
import { Building2, LogOut, User, Bell } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
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

  // Extract first name from full name
  const firstName = user?.name?.split(' ')[0] || user?.name || 'User'

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {firstName}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
