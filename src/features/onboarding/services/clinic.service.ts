import { apiClient } from '@/shared/lib/api-client'
import { API_ENDPOINTS } from '@/shared/constants/api.constants'
import type { CreateClinicRequest, CreateClinicResponse, Clinic, SearchClinicsParams } from '../types/clinic.types'
import type { ApiResponse } from '@/shared/types/api.types'

export const clinicService = {
  createClinic: async (data: CreateClinicRequest): Promise<ApiResponse<CreateClinicResponse>> => {
    return apiClient.post<CreateClinicResponse>(API_ENDPOINTS.CLINICS, data)
  },

  searchClinics: async (params: SearchClinicsParams): Promise<ApiResponse<Clinic[]>> => {
    return apiClient.get<Clinic[]>(API_ENDPOINTS.CLINIC_SEARCH, params)
  },

  joinClinic: async (clinicId: string): Promise<ApiResponse<any>> => {
    return apiClient.post(API_ENDPOINTS.CLINIC_JOIN(clinicId))
  },
}
