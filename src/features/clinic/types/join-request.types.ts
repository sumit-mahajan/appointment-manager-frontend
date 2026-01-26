export interface JoinRequest {
  request_id: string
  user_id: string
  clinic_id: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
  // Extended with user info
  user?: {
    user_id: string
    name: string
    email: string
    contact: string | null
  }
}

export interface UpdateJoinRequestRequest {
  status: 'approved' | 'rejected'
}

export type JoinRequestStatus = 'pending' | 'approved' | 'rejected'
