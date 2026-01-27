import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants/app.constants'
import { appointmentService } from '../services/appointment.service'

export const useAppointments = () => {
  return useQuery({
    queryKey: QUERY_KEYS.APPOINTMENTS,
    queryFn: () => appointmentService.listAppointments(),
  })
}
