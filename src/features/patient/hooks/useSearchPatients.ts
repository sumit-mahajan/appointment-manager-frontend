import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants/app.constants'
import { patientService } from '../services/patient.service'

export const useSearchPatients = (query: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.PATIENTS, 'search', query],
    queryFn: () => patientService.searchPatients(query),
    enabled: query.length >= 2, // Only search if query has at least 2 characters
    staleTime: 30000, // Cache for 30 seconds
  })
}
