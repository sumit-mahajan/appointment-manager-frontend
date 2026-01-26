export const APP_NAME = 'Appointment Manager'

export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  ONBOARDING: '/onboarding',
  DASHBOARD: '/dashboard',
  JOIN_REQUESTS: '/join-requests',
  PATIENTS: '/patients',
  APPOINTMENTS: '/appointments',
  APPOINTMENTS_NEW: '/appointments/new',
  SETTINGS: '/settings',
} as const

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
} as const

export const QUERY_KEYS = {
  USER: ['user'],
  CLINICS: ['clinics'],
  CLINIC_STAFF: ['clinic', 'staff'],
  JOIN_REQUESTS: ['clinic', 'join-requests'],
  PATIENTS: ['patients'],
  APPOINTMENTS: ['appointments'],
  SLOTS: ['slots'],
} as const
