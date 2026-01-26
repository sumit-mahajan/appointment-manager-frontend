import { apiClient } from '@/shared/lib/api-client'
import { API_ENDPOINTS } from '@/shared/constants/api.constants'
import type { JoinRequest, UpdateJoinRequestRequest, JoinRequestStatus } from '../types/join-request.types'
import type { ApiResponse } from '@/shared/types/api.types'

export const joinRequestService = {
  listJoinRequests: async (status?: JoinRequestStatus): Promise<ApiResponse<JoinRequest[]>> => {
    const params = status ? { status } : {}
    return apiClient.get<JoinRequest[]>(API_ENDPOINTS.CLINIC_JOIN_REQUESTS, params)
  },

  updateJoinRequest: async (requestId: string, data: UpdateJoinRequestRequest): Promise<ApiResponse<JoinRequest>> => {
    return apiClient.patch<JoinRequest>(API_ENDPOINTS.CLINIC_JOIN_REQUEST_UPDATE(requestId), data)
  },
}
