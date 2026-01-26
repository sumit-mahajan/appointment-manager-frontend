export interface Patient {
  patient_id: string
  name: string
  contact: string | null
  clinic_id: string | null
  created_by: string | null
  modified_by: string | null
  created_at: string | null
}

export interface CreatePatientRequest {
  name: string
  contact: string
}

export interface PatientSearchResult {
  patient_id: string
  name: string
  contact: string | null
}
