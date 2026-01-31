import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from './auth.service'
import { apiClient } from '@/shared/lib/api-client'
import { API_ENDPOINTS } from '@/shared/constants/api.constants'
import type { LoginRequest, RegisterRequest } from '../types/auth.types'

// Mock the apiClient
vi.mock('@/shared/lib/api-client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should call apiClient.post with correct endpoint and credentials', async () => {
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      }

      const mockResponse = {
        success: true,
        data: {
          token: 'mock-token',
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            contact: '+1234567890',
            clinic_id: 'clinic-1',
            created_at: '2024-01-01T00:00:00.000Z',
            updated_at: '2024-01-01T00:00:00.000Z',
          },
        },
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

      const result = await authService.login(credentials)

      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.LOGIN, credentials)
      expect(apiClient.post).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockResponse)
    })

    it('should handle login errors', async () => {
      const credentials: LoginRequest = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      }

      const mockError = {
        message: 'Invalid credentials',
        statusCode: 401,
      }

      vi.mocked(apiClient.post).mockRejectedValue(mockError)

      await expect(authService.login(credentials)).rejects.toEqual(mockError)
      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.LOGIN, credentials)
    })
  })

  describe('register', () => {
    it('should call apiClient.post with correct endpoint and user data', async () => {
      const userData: RegisterRequest = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        contact: '+1234567890',
      }

      const mockResponse = {
        success: true,
        data: {
          token: 'mock-token',
          user: {
            id: '2',
            email: userData.email,
            name: userData.name,
            contact: userData.contact,
            clinic_id: null,
            created_at: '2024-01-01T00:00:00.000Z',
            updated_at: '2024-01-01T00:00:00.000Z',
          },
        },
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

      const result = await authService.register(userData)

      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.REGISTER, userData)
      expect(apiClient.post).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockResponse)
    })

    it('should handle registration errors', async () => {
      const userData: RegisterRequest = {
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'password123',
        contact: '+1234567890',
      }

      const mockError = {
        message: 'Email already exists',
        statusCode: 400,
      }

      vi.mocked(apiClient.post).mockRejectedValue(mockError)

      await expect(authService.register(userData)).rejects.toEqual(mockError)
      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.REGISTER, userData)
    })
  })

  describe('me', () => {
    it('should call apiClient.get with correct endpoint', async () => {
      const mockResponse = {
        success: true,
        data: {
          token: 'current-token',
          user: {
            id: '1',
            email: 'current@example.com',
            name: 'Current User',
            contact: '+1234567890',
            clinic_id: 'clinic-1',
            created_at: '2024-01-01T00:00:00.000Z',
            updated_at: '2024-01-01T00:00:00.000Z',
          },
        },
      }

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const result = await authService.me()

      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.ME)
      expect(apiClient.get).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockResponse)
    })

    it('should handle unauthorized errors', async () => {
      const mockError = {
        message: 'Unauthorized',
        statusCode: 401,
      }

      vi.mocked(apiClient.get).mockRejectedValue(mockError)

      await expect(authService.me()).rejects.toEqual(mockError)
      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.ME)
    })

    it('should handle network errors', async () => {
      const mockError = {
        message: 'Network error',
        statusCode: 0,
      }

      vi.mocked(apiClient.get).mockRejectedValue(mockError)

      await expect(authService.me()).rejects.toEqual(mockError)
    })
  })
})
