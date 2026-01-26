import { useMutation } from '@tanstack/react-query'
import { joinRequestService } from '../services/join-request.service'
import { queryClient } from '@/shared/lib/query-client'
import { QUERY_KEYS } from '@/shared/constants/app.constants'
import type { UpdateJoinRequestRequest } from '../types/join-request.types'

export function useUpdateJoinRequest() {
  return useMutation({
    mutationFn: ({ requestId, data }: { requestId: string; data: UpdateJoinRequestRequest }) =>
      joinRequestService.updateJoinRequest(requestId, data),
    onSuccess: () => {
      // Invalidate all join requests queries to refresh the list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOIN_REQUESTS })
    },
  })
}
