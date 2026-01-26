export interface User {
  id: string
  name: string
  email: string
  contact: string
  clinic_id: string | null
  created_at: string
  updated_at: string
}

export interface DecodedToken {
  user_id: string
  email: string
  name: string
  clinic_id: string | null
  role: 'OWNER' | 'STAFF' | null
  iat: number
  exp: number
}

export type UserRole = 'OWNER' | 'STAFF' | 'NO_CLINIC'
