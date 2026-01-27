import { apiClient } from '@/shared/lib/api-client'
import { API_ENDPOINTS } from '@/shared/constants/api.constants'
import type { Appointment, CreateAppointmentRequest, AvailabilityCheck, UpdateAppointmentRequest, AppointmentWithPatient } from '../types/appointment.types'
import type { ApiResponse } from '@/shared/types/api.types'

export const appointmentService = {
  createAppointment: async (data: CreateAppointmentRequest): Promise<ApiResponse<Appointment>> => {
    return apiClient.post<Appointment>(API_ENDPOINTS.APPOINTMENTS, data)
  },

  checkAvailability: async (
    start: string, 
    end: string, 
    excludeAppointmentId?: string
  ): Promise<ApiResponse<AvailabilityCheck>> => {
    let url = `${API_ENDPOINTS.SLOTS_AVAILABILITY}?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
    if (excludeAppointmentId) {
      url += `&excludeAppointmentId=${encodeURIComponent(excludeAppointmentId)}`
    }
    return apiClient.get<AvailabilityCheck>(url)
  },

  listAppointments: async (): Promise<ApiResponse<AppointmentWithPatient[]>> => {
    return apiClient.get<AppointmentWithPatient[]>(API_ENDPOINTS.APPOINTMENTS)
  },

  updateAppointment: async (
    id: string, 
    data: UpdateAppointmentRequest
  ): Promise<ApiResponse<Appointment>> => {
    return apiClient.patch<Appointment>(
      API_ENDPOINTS.APPOINTMENT_UPDATE(id), 
      data
    )
  },
}
