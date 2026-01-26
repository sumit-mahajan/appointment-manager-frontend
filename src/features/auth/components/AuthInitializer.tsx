import { useAuthStore } from '../store/auth.store'
import { useCheckUserStatus } from '../hooks/useCheckUserStatus'

/**
 * Component that checks user status on app initialization
 * Calls /me endpoint if user is authenticated but has no clinic
 * This handles the case where a join request was approved while user was offline
 */
export function AuthInitializer() {
  const { isAuthenticated, user } = useAuthStore()
  
  // Only check status if authenticated and no clinic
  const shouldCheck = isAuthenticated && user && !user.clinic_id
  
  useCheckUserStatus(!!shouldCheck)

  // No UI needed - this is just for side effects
  return null
}
