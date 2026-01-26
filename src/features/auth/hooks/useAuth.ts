import { useAuthStore } from '../store/auth.store'

export function useAuth() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const logout = useAuthStore((state) => state.logout)
  const getRole = useAuthStore((state) => state.getRole)
  const hasClinic = useAuthStore((state) => state.hasClinic)

  return {
    isAuthenticated,
    user,
    token,
    logout,
    getRole,
    hasClinic: hasClinic(),
  }
}
