import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { clinicService } from '../services/clinic.service'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { ROUTES } from '@/shared/constants/app.constants'
import { queryClient } from '@/shared/lib/query-client'
import type { CreateClinicRequest } from '../types/clinic.types'

export function useCreateClinic() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: (data: CreateClinicRequest) => clinicService.createClinic(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Update auth store with fresh token that includes clinic_id
        setAuth(response.data.token)

        queryClient.invalidateQueries()
        navigate(ROUTES.DASHBOARD)
      }
    },
  })
}
