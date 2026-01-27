import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants/app.constants'
import { appointmentService } from '../services/appointment.service'
import type { UpdateAppointmentRequest } from '../types/appointment.types'
import { toast } from '@/shared/lib/toast'

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAppointmentRequest }) =>
      appointmentService.updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APPOINTMENTS })
      toast.success('Appointment updated successfully')
    },
    onError: () => {
      toast.error('Failed to update appointment')
    },
  })
}
