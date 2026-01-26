import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
import { useAuthStore } from '../store/auth.store'
import { ROUTES } from '@/shared/constants/app.constants'
import type { LoginRequest } from '../types/auth.types'

export function useLogin() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const hasClinic = useAuthStore((state) => state.hasClinic)

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (response) => {
      if (response.success && response.data) {
        setAuth(response.data.token)

        // Navigate based on clinic status
        if (hasClinic()) {
          navigate(ROUTES.DASHBOARD)
        } else {
          navigate(ROUTES.ONBOARDING)
        }
      }
    },
  })
}
