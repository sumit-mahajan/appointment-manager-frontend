import { apiClient } from '@/shared/lib/api-client'
import { API_ENDPOINTS } from '@/shared/constants/api.constants'
import type { Appointment, CreateAppointmentRequest, AvailabilityCheck } from '../types/appointment.types'
import type { ApiResponse } from '@/shared/types/api.types'

export const appointmentService = {
  createAppointment: async (data: CreateAppointmentRequest): Promise<ApiResponse<Appointment>> => {
    return apiClient.post<Appointment>(API_ENDPOINTS.APPOINTMENTS, data)
  },

  checkAvailability: async (start: string, end: string): Promise<ApiResponse<AvailabilityCheck>> => {
    return apiClient.get<AvailabilityCheck>(
      `${API_ENDPOINTS.SLOTS_AVAILABILITY}?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
    )
  },
}
