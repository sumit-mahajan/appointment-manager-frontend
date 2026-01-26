import type { User } from '@/shared/types/common.types'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  contact: string
}

export interface AuthResponse {
  token: string
  user: User
}
