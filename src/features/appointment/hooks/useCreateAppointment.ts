import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants/app.constants'
import { appointmentService } from '../services/appointment.service'
import type { CreateAppointmentRequest } from '../types/appointment.types'

export const useCreateAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAppointmentRequest) => appointmentService.createAppointment(data),
    onSuccess: () => {
      // Invalidate appointment queries to refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APPOINTMENTS })
    },
  })
}
