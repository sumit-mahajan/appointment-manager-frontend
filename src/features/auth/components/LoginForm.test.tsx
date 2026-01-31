import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'
import { renderWithProviders } from '@/test/utils'
import * as useLoginModule from '../hooks/useLogin'

// Mock the useLogin hook
vi.mock('../hooks/useLogin')

describe('LoginForm', () => {
  const mockLogin = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mock implementation
    vi.mocked(useLoginModule.useLogin).mockReturnValue({
      mutate: mockLogin,
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
      data: undefined,
      isIdle: true,
      variables: undefined,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      status: 'idle',
      submittedAt: 0,
      reset: vi.fn(),
      mutateAsync: vi.fn(),
      isPaused: false,
    } as any)
  })

  it('should render email and password fields', () => {
    renderWithProviders(<LoginForm />)
    
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/••••••••/)).toBeInTheDocument()
  })

  it('should render submit button', () => {
    renderWithProviders(<LoginForm />)
    
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('should display validation error for short password', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)
    
    const emailInput = screen.getByPlaceholderText(/you@example.com/i)
    const passwordInput = screen.getByPlaceholderText(/••••••••/)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, '12345')
    await user.click(submitButton)
    
    expect(await screen.findByText(/at least 6 characters/i)).toBeInTheDocument()
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('should call login mutation with valid credentials', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)
    
    const emailInput = screen.getByPlaceholderText(/you@example.com/i)
    const passwordInput = screen.getByPlaceholderText(/••••••••/)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('should disable fields while submitting', () => {
    vi.mocked(useLoginModule.useLogin).mockReturnValue({
      mutate: mockLogin,
      isPending: true,
      error: null,
      isError: false,
      isSuccess: false,
      data: undefined,
      isIdle: false,
      variables: undefined,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      status: 'pending',
      submittedAt: Date.now(),
      reset: vi.fn(),
      mutateAsync: vi.fn(),
      isPaused: false,
    } as any)
    
    renderWithProviders(<LoginForm />)
    
    const emailInput = screen.getByPlaceholderText(/you@example.com/i)
    const passwordInput = screen.getByPlaceholderText(/••••••••/)
    const submitButton = screen.getByRole('button', { name: /signing in/i })
    
    expect(emailInput).toBeDisabled()
    expect(passwordInput).toBeDisabled()
    expect(submitButton).toBeDisabled()
  })

  it('should display loading state during submission', () => {
    vi.mocked(useLoginModule.useLogin).mockReturnValue({
      mutate: mockLogin,
      isPending: true,
      error: null,
      isError: false,
      isSuccess: false,
      data: undefined,
      isIdle: false,
      variables: undefined,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      status: 'pending',
      submittedAt: Date.now(),
      reset: vi.fn(),
      mutateAsync: vi.fn(),
      isPaused: false,
    } as any)
    
    renderWithProviders(<LoginForm />)
    
    expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument()
  })

  it('should display API error messages', () => {
    const mockError = {
      message: 'Invalid credentials',
    }
    
    vi.mocked(useLoginModule.useLogin).mockReturnValue({
      mutate: mockLogin,
      isPending: false,
      error: mockError,
      isError: true,
      isSuccess: false,
      data: undefined,
      isIdle: false,
      variables: undefined,
      context: undefined,
      failureCount: 1,
      failureReason: mockError,
      status: 'error',
      submittedAt: Date.now(),
      reset: vi.fn(),
      mutateAsync: vi.fn(),
      isPaused: false,
    } as any)
    
    renderWithProviders(<LoginForm />)
    
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
  })

  it('should display generic error message when error has no message', () => {
    const mockError = {}
    
    vi.mocked(useLoginModule.useLogin).mockReturnValue({
      mutate: mockLogin,
      isPending: false,
      error: mockError,
      isError: true,
      isSuccess: false,
      data: undefined,
      isIdle: false,
      variables: undefined,
      context: undefined,
      failureCount: 1,
      failureReason: mockError,
      status: 'error',
      submittedAt: Date.now(),
      reset: vi.fn(),
      mutateAsync: vi.fn(),
      isPaused: false,
    } as any)
    
    renderWithProviders(<LoginForm />)
    
    expect(screen.getByText(/login failed.*try again/i)).toBeInTheDocument()
  })

  it('should allow typing in email field', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)
    
    const emailInput = screen.getByPlaceholderText(/you@example.com/i) as HTMLInputElement
    
    await user.type(emailInput, 'test@example.com')
    
    expect(emailInput.value).toBe('test@example.com')
  })

  it('should allow typing in password field', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)
    
    const passwordInput = screen.getByPlaceholderText(/••••••••/) as HTMLInputElement
    
    await user.type(passwordInput, 'secretpassword')
    
    expect(passwordInput.value).toBe('secretpassword')
  })

  it('should mask password input', () => {
    renderWithProviders(<LoginForm />)
    
    const passwordInput = screen.getByPlaceholderText(/••••••••/) as HTMLInputElement
    
    expect(passwordInput.type).toBe('password')
  })

  it('should show empty email error when submitting without email', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)
    
    const passwordInput = screen.getByPlaceholderText(/••••••••/)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
  })

  it('should show empty password error when submitting without password', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)
    
    const emailInput = screen.getByPlaceholderText(/you@example.com/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)
    
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument()
  })
})
