export interface Clinic {
  id: string
  name: string
  description: string | null
  owner_id: string
  created_at: string
  updated_at: string
}

export interface CreateClinicRequest {
  name: string
  description?: string
}

export interface CreateClinicResponse {
  clinic: Clinic
  token: string
}

export interface JoinClinicRequest {
  clinicId: string
}

export interface SearchClinicsParams {
  name: string
}
