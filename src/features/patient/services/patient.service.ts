import { apiClient } from '@/shared/lib/api-client'
import { API_ENDPOINTS } from '@/shared/constants/api.constants'
import type { Patient, CreatePatientRequest } from '../types/patient.types'
import type { ApiResponse } from '@/shared/types/api.types'

export const patientService = {
  searchPatients: async (query: string): Promise<ApiResponse<Patient[]>> => {
    return apiClient.get<Patient[]>(`${API_ENDPOINTS.PATIENTS}?q=${encodeURIComponent(query)}`)
  },

  createPatient: async (data: CreatePatientRequest): Promise<ApiResponse<Patient>> => {
    return apiClient.post<Patient>(API_ENDPOINTS.PATIENTS, data)
  },
}
