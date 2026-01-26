import { useQuery } from '@tanstack/react-query'
import { authService } from '../services/auth.service'
import { useAuthStore } from '../store/auth.store'
import { QUERY_KEYS } from '@/shared/constants/app.constants'

export function useCheckUserStatus(enabled: boolean = true) {
  const setAuth = useAuthStore((state) => state.setAuth)

  return useQuery({
    queryKey: [...QUERY_KEYS.USER, 'status'],
    queryFn: async () => {
      const response = await authService.me()
      if (response.success && response.data) {
        // Update auth store with fresh token
        setAuth(response.data.token)
        return response.data
      }
      throw new Error('Failed to fetch user status')
    },
    enabled,
    staleTime: 0, // Always fetch fresh data
    refetchInterval: false, // Don't auto-refetch
  })
}
