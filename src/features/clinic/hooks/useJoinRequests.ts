import { useQuery } from '@tanstack/react-query'
import { joinRequestService } from '../services/join-request.service'
import { QUERY_KEYS } from '@/shared/constants/app.constants'
import type { JoinRequestStatus } from '../types/join-request.types'

export function useJoinRequests(status?: JoinRequestStatus, enabled: boolean = true) {
  return useQuery({
    queryKey: [...QUERY_KEYS.JOIN_REQUESTS, status],
    queryFn: async () => {
      const response = await joinRequestService.listJoinRequests(status)
      if (response.success && response.data) {
        return response.data
      }
      throw new Error('Failed to fetch join requests')
    },
    enabled,
  })
}
