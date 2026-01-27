import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants/app.constants'
import { appointmentService } from '../services/appointment.service'

export const useCheckAvailability = (
  start: string, 
  end: string, 
  enabled: boolean = true,
  excludeAppointmentId?: string
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.SLOTS, 'availability', start, end, excludeAppointmentId],
    queryFn: () => appointmentService.checkAvailability(start, end, excludeAppointmentId),
    enabled: enabled && !!start && !!end,
    staleTime: 10000, // Cache for 10 seconds
  })
}
