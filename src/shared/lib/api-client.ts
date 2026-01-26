import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '@/shared/constants/api.constants'
import { LOCAL_STORAGE_KEYS } from '@/shared/constants/app.constants'
import type { ApiResponse } from '@/shared/types/api.types'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => {
        return response
      },
      (error: AxiosError<ApiResponse>) => {
        if (error.response) {
          // Handle 401 Unauthorized - clear token and redirect to auth
          if (error.response.status === 401) {
            localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN)
            // Only redirect if not already on auth page
            if (!window.location.pathname.includes('/auth')) {
              window.location.href = '/auth'
            }
          }

          // Return structured error
          return Promise.reject({
            message: error.response.data?.error || 'An error occurred',
            statusCode: error.response.status,
            details: error.response.data?.details,
          })
        } else if (error.request) {
          return Promise.reject({
            message: 'No response from server. Please check your connection.',
            statusCode: 0,
          })
        } else {
          return Promise.reject({
            message: error.message || 'An unexpected error occurred',
            statusCode: 0,
          })
        }
      }
    )
  }

  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, { params })
    return response.data
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data)
    return response.data
  }

  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data)
    return response.data
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url)
    return response.data
  }
}

export const apiClient = new ApiClient()
