import { useQuery } from '@tanstack/react-query'
import { clinicService } from '../services/clinic.service'
import { QUERY_KEYS } from '@/shared/constants/app.constants'

export function useSearchClinics(searchQuery: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.CLINICS, 'search', searchQuery],
    queryFn: () => clinicService.searchClinics({ name: searchQuery }),
    enabled: searchQuery.length >= 2, // Only search if query is at least 2 chars
    staleTime: 1000 * 30, // 30 seconds
  })
}
