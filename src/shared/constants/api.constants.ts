export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ME: '/auth/me',

  // Clinic
  CLINICS: '/clinics',
  CLINIC_SEARCH: '/clinics/search',
  CLINIC_JOIN: (id: string) => `/clinics/${id}/join`,
  CLINIC_JOIN_REQUESTS: '/clinic/join-requests',
  CLINIC_JOIN_REQUEST_UPDATE: (id: string) => `/clinic/join-requests/${id}`,
  CLINIC_STAFF: '/clinic/staff',

  // Patients
  PATIENTS: '/patients',

  // Appointments
  APPOINTMENTS: '/appointments',
  APPOINTMENT_UPDATE: (id: string) => `/appointments/${id}`,
  APPOINTMENT_QUEUE: '/appointments/queue',
  SLOTS_AVAILABILITY: '/slots/availability',

  // AI
  AI_CHAT: '/ai/chat',

  // Health
  HEALTH: '/health',
} as const
