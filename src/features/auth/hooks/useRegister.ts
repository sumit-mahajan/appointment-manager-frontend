import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
import { useAuthStore } from '../store/auth.store'
import { ROUTES } from '@/shared/constants/app.constants'
import type { RegisterRequest } from '../types/auth.types'

export function useRegister() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: (userData: RegisterRequest) => authService.register(userData),
    onSuccess: (response) => {
      if (response.success && response.data) {
        setAuth(response.data.token)
        // New users always go to onboarding
        navigate(ROUTES.ONBOARDING)
      }
    },
  })
}
