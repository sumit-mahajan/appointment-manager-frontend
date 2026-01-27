export interface Appointment {
  appointment_id: string
  clinic_id: string | null
  patient_id: string | null
  created_by: string | null
  modified_by: string | null
  start_datetime: string
  end_datetime: string | null
  duration_in_minutes: number
  status: string | null
  is_emergency: boolean | null
  is_follow_up_pending: boolean | null
  did_show_up: boolean | null
  created_at: string | null
  updated_at: string | null
}

export interface CreateAppointmentRequest {
  patientId: string
  start: string
  end: string
  durationInMinutes: number
  isEmergency?: boolean
  isFollowUpPending?: boolean
}

export interface AvailabilityCheck {
  available: boolean
}

export interface UpdateAppointmentRequest {
  status?: 'pending' | 'confirm' | 'cancel'
  start?: string
  end?: string
  durationInMinutes?: number
  didShowUp?: boolean
  isEmergency?: boolean
}

export interface AppointmentWithPatient extends Appointment {
  patients?: {
    patient_id: string
    name: string
    contact: string | null
  }
}
