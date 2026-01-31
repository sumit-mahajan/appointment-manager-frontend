import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appointmentService } from './appointment.service'
import { apiClient } from '@/shared/lib/api-client'
import { API_ENDPOINTS } from '@/shared/constants/api.constants'

// Mock the apiClient
vi.mock('@/shared/lib/api-client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
  },
}))

describe('appointmentService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createAppointment', () => {
    it('should call apiClient.post with correct endpoint and data', async () => {
      const appointmentData = {
        patientId: 'patient-1',
        start: '2024-01-15T10:00:00.000Z',
        end: '2024-01-15T10:30:00.000Z',
        durationInMinutes: 30,
      }

      const mockResponse = {
        success: true,
        data: {
          appointment_id: 'apt-1',
          patient_id: 'patient-1',
          clinic_id: 'clinic-1',
          start_datetime: appointmentData.start,
          end_datetime: appointmentData.end,
          duration_in_minutes: appointmentData.durationInMinutes,
          status: 'pending',
          is_emergency: false,
          is_follow_up_pending: false,
          did_show_up: false,
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
          created_by: 'user-1',
          modified_by: 'user-1',
        },
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

      const result = await appointmentService.createAppointment(appointmentData)

      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.APPOINTMENTS, appointmentData)
      expect(apiClient.post).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockResponse)
    })

    it('should handle creation errors', async () => {
      const appointmentData = {
        patientId: 'patient-1',
        start: '2024-01-15T10:00:00.000Z',
        end: '2024-01-15T10:30:00.000Z',
        durationInMinutes: 30,
      }

      const mockError = {
        message: 'Time slot already booked',
        statusCode: 400,
      }

      vi.mocked(apiClient.post).mockRejectedValue(mockError)

      await expect(appointmentService.createAppointment(appointmentData)).rejects.toEqual(mockError)
    })
  })

  describe('checkAvailability', () => {
    it('should call apiClient.get with correct URL parameters', async () => {
      const start = '2024-01-15T10:00:00.000Z'
      const end = '2024-01-15T10:30:00.000Z'

      const mockResponse = {
        success: true,
        data: {
          available: true,
        },
      }

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const result = await appointmentService.checkAvailability(start, end)

      const expectedUrl = `${API_ENDPOINTS.SLOTS_AVAILABILITY}?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
      expect(apiClient.get).toHaveBeenCalledWith(expectedUrl)
      expect(apiClient.get).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockResponse)
    })

    it('should include excludeAppointmentId parameter when provided', async () => {
      const start = '2024-01-15T10:00:00.000Z'
      const end = '2024-01-15T10:30:00.000Z'
      const excludeId = 'apt-123'

      const mockResponse = {
        success: true,
        data: {
          available: true,
        },
      }

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      await appointmentService.checkAvailability(start, end, excludeId)

      const expectedUrl = `${API_ENDPOINTS.SLOTS_AVAILABILITY}?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&excludeAppointmentId=${encodeURIComponent(excludeId)}`
      expect(apiClient.get).toHaveBeenCalledWith(expectedUrl)
    })

    it('should handle unavailable slots', async () => {
      const start = '2024-01-15T10:00:00.000Z'
      const end = '2024-01-15T10:30:00.000Z'

      const mockResponse = {
        success: true,
        data: {
          available: false,
        },
      }

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const result = await appointmentService.checkAvailability(start, end)

      expect(result.data?.available).toBe(false)
    })

    it('should properly encode special characters in dates', async () => {
      const start = '2024-01-15T10:00:00+05:30'
      const end = '2024-01-15T10:30:00+05:30'

      vi.mocked(apiClient.get).mockResolvedValue({ success: true, data: { available: true } })

      await appointmentService.checkAvailability(start, end)

      const expectedUrl = `${API_ENDPOINTS.SLOTS_AVAILABILITY}?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
      expect(apiClient.get).toHaveBeenCalledWith(expectedUrl)
    })
  })

  describe('listAppointments', () => {
    it('should call apiClient.get with correct endpoint', async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            appointment_id: 'apt-1',
            patient_id: 'patient-1',
            clinic_id: 'clinic-1',
            start_datetime: '2024-01-15T10:00:00.000Z',
            end_datetime: '2024-01-15T10:30:00.000Z',
            duration_in_minutes: 30,
            status: 'confirm',
            is_emergency: false,
            is_follow_up_pending: false,
            did_show_up: false,
            created_at: '2024-01-01T00:00:00.000Z',
            updated_at: '2024-01-01T00:00:00.000Z',
            created_by: 'user-1',
            modified_by: 'user-1',
            patient: {
              id: 'patient-1',
              name: 'John Doe',
              email: 'john@example.com',
              contact: '+1234567890',
            },
          },
        ],
      }

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const result = await appointmentService.listAppointments()

      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.APPOINTMENTS)
      expect(apiClient.get).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockResponse)
    })

    it('should return empty array when no appointments exist', async () => {
      const mockResponse = {
        success: true,
        data: [],
      }

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const result = await appointmentService.listAppointments()

      expect(result.data).toEqual([])
    })

    it('should handle list errors', async () => {
      const mockError = {
        message: 'Unauthorized',
        statusCode: 401,
      }

      vi.mocked(apiClient.get).mockRejectedValue(mockError)

      await expect(appointmentService.listAppointments()).rejects.toEqual(mockError)
    })
  })

  describe('updateAppointment', () => {
    it('should call apiClient.patch with correct endpoint and data', async () => {
      const appointmentId = 'apt-1'
      const updateData = {
        status: 'confirm' as const,
        didShowUp: true,
      }

      const mockResponse = {
        success: true,
        data: {
          appointment_id: appointmentId,
          patient_id: 'patient-1',
          clinic_id: 'clinic-1',
          start_datetime: '2024-01-15T10:00:00.000Z',
          end_datetime: '2024-01-15T10:30:00.000Z',
          duration_in_minutes: 30,
          status: 'confirm',
          is_emergency: false,
          is_follow_up_pending: false,
          did_show_up: true,
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
          created_by: 'user-1',
          modified_by: 'user-1',
        },
      }

      vi.mocked(apiClient.patch).mockResolvedValue(mockResponse)

      const result = await appointmentService.updateAppointment(appointmentId, updateData)

      expect(apiClient.patch).toHaveBeenCalledWith(
        API_ENDPOINTS.APPOINTMENT_UPDATE(appointmentId),
        updateData
      )
      expect(apiClient.patch).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockResponse)
    })

    it('should handle partial updates', async () => {
      const appointmentId = 'apt-1'
      const updateData = {
        isEmergency: true,
      }

      const mockResponse = {
        success: true,
        data: {
          appointment_id: appointmentId,
          patient_id: 'patient-1',
          clinic_id: 'clinic-1',
          start_datetime: '2024-01-15T10:00:00.000Z',
          end_datetime: '2024-01-15T10:30:00.000Z',
          duration_in_minutes: 30,
          status: 'pending',
          is_emergency: true,
          is_follow_up_pending: false,
          did_show_up: false,
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
          created_by: 'user-1',
          modified_by: 'user-1',
        },
      }

      vi.mocked(apiClient.patch).mockResolvedValue(mockResponse)

      const result = await appointmentService.updateAppointment(appointmentId, updateData)

      expect(result.data?.is_emergency).toBe(updateData.isEmergency)
    })

    it('should handle update errors', async () => {
      const appointmentId = 'apt-1'
      const updateData = {
        status: 'confirm' as const,
      }

      const mockError = {
        message: 'Appointment not found',
        statusCode: 404,
      }

      vi.mocked(apiClient.patch).mockRejectedValue(mockError)

      await expect(
        appointmentService.updateAppointment(appointmentId, updateData)
      ).rejects.toEqual(mockError)
    })
  })
})
