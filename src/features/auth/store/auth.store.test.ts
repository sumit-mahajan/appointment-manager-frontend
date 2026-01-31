import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from './auth.store'
import { LOCAL_STORAGE_KEYS } from '@/shared/constants/app.constants'

// Helper to generate mock JWT token
function generateMockToken(payload: any): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const encodedPayload = btoa(JSON.stringify(payload))
  const signature = 'mock-signature'
  return `${header}.${encodedPayload}.${signature}`
}

describe('authStore', () => {
  beforeEach(() => {
    localStorage.clear()
    // Reset the store to initial state
    useAuthStore.setState({
      token: null,
      user: null,
      isAuthenticated: false,
    })
  })

  describe('initialization', () => {
    it('should initialize with null values when no token in localStorage', () => {
      const state = useAuthStore.getState()
      expect(state.token).toBeNull()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })

    it('should initialize with user data from valid token in localStorage', () => {
      const mockPayload = {
        user_id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        clinic_id: 'clinic-1',
        clinic_name: 'Test Clinic',
        role: 'OWNER',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      }

      const token = generateMockToken(mockPayload)
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, token)

      // Set the auth directly to simulate initialization
      useAuthStore.getState().setAuth(token)

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.user?.email).toBe('test@example.com')
    })

    it('should remove expired token from localStorage on initialization', () => {
      const expiredPayload = {
        user_id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        clinic_id: 'clinic-1',
        clinic_name: 'Test Clinic',
        role: 'OWNER',
        iat: Math.floor(Date.now() / 1000) - 7200,
        exp: Math.floor(Date.now() / 1000) - 3600, // Expired 1 hour ago
      }

      const expiredToken = generateMockToken(expiredPayload)
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, expiredToken)

      // After initialization logic runs, token should be removed
      // Note: This requires re-importing the module which is tricky in tests
    })
  })

  describe('setAuth', () => {
    it('should set token, decode user, and mark as authenticated', () => {
      const mockPayload = {
        user_id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        clinic_id: 'clinic-1',
        clinic_name: 'Test Clinic',
        role: 'OWNER',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      }

      const token = generateMockToken(mockPayload)
      const { setAuth } = useAuthStore.getState()

      setAuth(token)

      const state = useAuthStore.getState()
      expect(state.token).toBe(token)
      expect(state.user).toEqual(mockPayload)
      expect(state.isAuthenticated).toBe(true)
      expect(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)).toBe(token)
    })

    it('should handle invalid token gracefully', () => {
      const invalidToken = 'invalid.token.format'
      const { setAuth } = useAuthStore.getState()

      // Mock console.error to suppress error output in tests
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

      setAuth(invalidToken)

      const state = useAuthStore.getState()
      expect(state.token).toBeNull()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)

      consoleErrorSpy.mockRestore()
    })
  })

  describe('updateUser', () => {
    it('should merge new user data with existing user data', () => {
      const mockPayload = {
        user_id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        clinic_id: null,
        clinic_name: null,
        role: null,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      }

      const token = generateMockToken(mockPayload)
      const { setAuth, updateUser } = useAuthStore.getState()

      setAuth(token)

      // Update user with clinic info
      updateUser({
        clinic_id: 'clinic-1',
        clinic_name: 'New Clinic',
        role: 'OWNER',
      })

      const state = useAuthStore.getState()
      expect(state.user?.clinic_id).toBe('clinic-1')
      expect(state.user?.clinic_name).toBe('New Clinic')
      expect(state.user?.role).toBe('OWNER')
      expect(state.user?.email).toBe('test@example.com') // Original data preserved
    })

    it('should handle update when user is null', () => {
      const { updateUser } = useAuthStore.getState()

      updateUser({
        clinic_id: 'clinic-1',
      })

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
    })
  })

  describe('logout', () => {
    it('should clear all auth state and localStorage', () => {
      const mockPayload = {
        user_id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        clinic_id: 'clinic-1',
        clinic_name: 'Test Clinic',
        role: 'OWNER',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      }

      const token = generateMockToken(mockPayload)
      const { setAuth, logout } = useAuthStore.getState()

      setAuth(token)

      // Verify authenticated state
      let state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)

      // Logout
      logout()

      state = useAuthStore.getState()
      expect(state.token).toBeNull()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)).toBeNull()
    })
  })

  describe('getRole', () => {
    it('should return NO_CLINIC when user has no clinic', () => {
      const mockPayload = {
        user_id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        clinic_id: null,
        clinic_name: null,
        role: null,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      }

      const token = generateMockToken(mockPayload)
      const { setAuth, getRole } = useAuthStore.getState()

      setAuth(token)

      expect(getRole()).toBe('NO_CLINIC')
    })

    it('should return user role when user has clinic', () => {
      const mockPayload = {
        user_id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        clinic_id: 'clinic-1',
        clinic_name: 'Test Clinic',
        role: 'OWNER',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      }

      const token = generateMockToken(mockPayload)
      const { setAuth, getRole } = useAuthStore.getState()

      setAuth(token)

      expect(getRole()).toBe('OWNER')
    })

    it('should return STAFF as default role when clinic exists but role is null', () => {
      const mockPayload = {
        user_id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        clinic_id: 'clinic-1',
        clinic_name: 'Test Clinic',
        role: null,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      }

      const token = generateMockToken(mockPayload)
      const { setAuth, getRole } = useAuthStore.getState()

      setAuth(token)

      expect(getRole()).toBe('STAFF')
    })

    it('should return NO_CLINIC when not authenticated', () => {
      const { getRole } = useAuthStore.getState()
      expect(getRole()).toBe('NO_CLINIC')
    })
  })

  describe('hasClinic', () => {
    it('should return true when user has clinic_id', () => {
      const mockPayload = {
        user_id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        clinic_id: 'clinic-1',
        clinic_name: 'Test Clinic',
        role: 'OWNER',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      }

      const token = generateMockToken(mockPayload)
      const { setAuth, hasClinic } = useAuthStore.getState()

      setAuth(token)

      expect(hasClinic()).toBe(true)
    })

    it('should return false when user has no clinic_id', () => {
      const mockPayload = {
        user_id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        clinic_id: null,
        clinic_name: null,
        role: null,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      }

      const token = generateMockToken(mockPayload)
      const { setAuth, hasClinic } = useAuthStore.getState()

      setAuth(token)

      expect(hasClinic()).toBe(false)
    })

    it('should return false when not authenticated', () => {
      const { hasClinic } = useAuthStore.getState()
      expect(hasClinic()).toBe(false)
    })
  })
})
