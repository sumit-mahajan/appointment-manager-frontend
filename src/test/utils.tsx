import { ReactElement, ReactNode } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

// Mock data for tests
export const mockUser = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  contact: '+1234567890',
  clinic_id: 'clinic-1',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
}

export const mockUserNoClinic = {
  ...mockUser,
  id: 'user-2',
  clinic_id: null,
}

// Create a fresh QueryClient for each test
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

interface AllTheProvidersProps {
  children: ReactNode
  queryClient?: QueryClient
}

function AllTheProviders({ children, queryClient }: AllTheProvidersProps) {
  const client = queryClient || createTestQueryClient()

  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  )
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
}

export function renderWithProviders(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const { queryClient, ...renderOptions } = options || {}

  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders queryClient={queryClient}>{children}</AllTheProviders>
    ),
    ...renderOptions,
  })
}

// Helper to setup localStorage with auth token
export function setupAuthenticatedUser(hasClinic = true) {
  const user = hasClinic ? mockUser : mockUserNoClinic
  const token = generateMockToken(user)
  localStorage.setItem('auth_token', token)
  return { user, token }
}

// Helper to generate a mock JWT token
export function generateMockToken(user: any): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(
    JSON.stringify({
      user_id: user.id,
      email: user.email,
      name: user.name,
      clinic_id: user.clinic_id,
      clinic_name: user.clinic_id ? 'Test Clinic' : null,
      role: user.clinic_id ? 'OWNER' : null,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    })
  )
  const signature = 'mock-signature'
  return `${header}.${payload}.${signature}`
}

// Helper to clear auth
export function clearAuth() {
  localStorage.removeItem('auth_token')
}

// Mock factory functions for test data
export const testData = {
  user: (overrides = {}) => ({
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    contact: '+1234567890',
    clinic_id: 'clinic-1',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    ...overrides,
  }),
  
  clinic: (overrides = {}) => ({
    id: 'clinic-1',
    name: 'Test Clinic',
    address: '123 Main St',
    contact: '+1234567890',
    email: 'clinic@example.com',
    owner_id: 'user-1',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    ...overrides,
  }),
  
  patient: (overrides = {}) => ({
    id: 'patient-1',
    name: 'John Doe',
    email: 'john@example.com',
    contact: '+1234567890',
    date_of_birth: '1990-01-01',
    clinic_id: 'clinic-1',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    ...overrides,
  }),
  
  appointment: (overrides = {}) => ({
    id: 'apt-1',
    patient_id: 'patient-1',
    clinic_id: 'clinic-1',
    scheduled_at: '2024-01-15T10:00:00.000Z',
    duration: 30,
    status: 'SCHEDULED',
    notes: 'Test appointment',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    patient: {
      id: 'patient-1',
      name: 'John Doe',
      email: 'john@example.com',
      contact: '+1234567890',
    },
    ...overrides,
  }),
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
