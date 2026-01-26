import { create } from 'zustand'
import { jwtDecode } from 'jwt-decode'
import { LOCAL_STORAGE_KEYS } from '@/shared/constants/app.constants'
import type { DecodedToken, UserRole } from '@/shared/types/common.types'

interface AuthState {
  token: string | null
  user: DecodedToken | null
  isAuthenticated: boolean

  // Actions
  setAuth: (token: string) => void
  updateUser: (userData: Partial<DecodedToken>) => void
  logout: () => void

  // Getters
  getRole: () => UserRole
  hasClinic: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Initialize from localStorage
  const storedToken = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)
  let initialUser: DecodedToken | null = null

  if (storedToken) {
    try {
      const decoded = jwtDecode<DecodedToken>(storedToken)
      // Check if token is expired
      if (decoded.exp && decoded.exp * 1000 > Date.now()) {
        initialUser = decoded
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)
      }
    } catch (error) {
      console.error('Error decoding token:', error)
      localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)
    }
  }

  return {
    token: initialUser ? storedToken : null,
    user: initialUser,
    isAuthenticated: !!initialUser,

    setAuth: (token: string) => {
      try {
        const decoded = jwtDecode<DecodedToken>(token)
        localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, token)
        set({
          token,
          user: decoded,
          isAuthenticated: true,
        })
      } catch (error) {
        console.error('Error setting auth:', error)
      }
    },

    updateUser: (userData: Partial<DecodedToken>) => {
      set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null,
      }))
    },

    logout: () => {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)
      set({
        token: null,
        user: null,
        isAuthenticated: false,
      })
    },

    getRole: (): UserRole => {
      const state = get()
      if (!state.user || !state.user.clinic_id) {
        return 'NO_CLINIC'
      }
      return state.user.role || 'STAFF'
    },

    hasClinic: (): boolean => {
      const state = get()
      return !!state.user?.clinic_id
    },
  }
})
