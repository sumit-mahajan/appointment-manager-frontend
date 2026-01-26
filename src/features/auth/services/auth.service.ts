import { apiClient } from '@/shared/lib/api-client'
import { API_ENDPOINTS } from '@/shared/constants/api.constants'
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types'
import type { ApiResponse } from '@/shared/types/api.types'

export const authService = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.LOGIN, credentials)
  },

  register: async (userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.REGISTER, userData)
  },

  me: async (): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.get<AuthResponse>(API_ENDPOINTS.ME)
  },
}
