export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  details?: any
}

export interface ApiError {
  message: string
  statusCode?: number
  details?: any
}
