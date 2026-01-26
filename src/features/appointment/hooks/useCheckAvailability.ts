import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants/app.constants'
import { appointmentService } from '../services/appointment.service'

export const useCheckAvailability = (start: string, end: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.SLOTS, 'availability', start, end],
    queryFn: () => appointmentService.checkAvailability(start, end),
    enabled: enabled && !!start && !!end,
    staleTime: 10000, // Cache for 10 seconds
  })
}
