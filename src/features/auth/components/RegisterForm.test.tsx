import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RegisterForm } from './RegisterForm'
import { renderWithProviders } from '@/test/utils'
import * as useRegisterModule from '../hooks/useRegister'

// Mock the useRegister hook
vi.mock('../hooks/useRegister')

describe('RegisterForm', () => {
  const mockRegister = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mock implementation
    vi.mocked(useRegisterModule.useRegister).mockReturnValue({
      mutate: mockRegister,
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

  it('should render all required fields', () => {
    renderWithProviders(<RegisterForm />)
    
    expect(screen.getByPlaceholderText(/john doe/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/\+1234567890/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/••••••••/)).toBeInTheDocument()
  })

  it('should render submit button', () => {
    renderWithProviders(<RegisterForm />)
    
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('should validate name length', async () => {
    const user = userEvent.setup()
    renderWithProviders(<RegisterForm />)
    
    const nameInput = screen.getByPlaceholderText(/john doe/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })
    
    await user.type(nameInput, 'A')
    await user.click(submitButton)
    
    expect(await screen.findByText(/at least 2 characters/i)).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('should validate password requirements', async () => {
    const user = userEvent.setup()
    renderWithProviders(<RegisterForm />)
    
    const passwordInput = screen.getByPlaceholderText(/••••••••/)
    const submitButton = screen.getByRole('button', { name: /create account/i })
    
    await user.type(passwordInput, '12345')
    await user.click(submitButton)
    
    expect(await screen.findByText(/at least 6 characters/i)).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('should validate contact number format', async () => {
    const user = userEvent.setup()
    renderWithProviders(<RegisterForm />)
    
    const contactInput = screen.getByPlaceholderText(/\+1234567890/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })
    
    await user.type(contactInput, 'invalid')
    await user.click(submitButton)
    
    expect(await screen.findByText(/valid contact number/i)).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('should call register mutation with valid data', async () => {
    const user = userEvent.setup()
    renderWithProviders(<RegisterForm />)
    
    const nameInput = screen.getByPlaceholderText(/john doe/i)
    const emailInput = screen.getByPlaceholderText(/you@example.com/i)
    const contactInput = screen.getByPlaceholderText(/\+1234567890/i)
    const passwordInput = screen.getByPlaceholderText(/••••••••/)
    const submitButton = screen.getByRole('button', { name: /create account/i })
    
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(contactInput, '1234567890')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        contact: '1234567890',
        password: 'password123',
      })
    })
  })

  it('should disable all fields while submitting', () => {
    vi.mocked(useRegisterModule.useRegister).mockReturnValue({
      mutate: mockRegister,
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
    
    renderWithProviders(<RegisterForm />)
    
    const nameInput = screen.getByPlaceholderText(/john doe/i)
    const emailInput = screen.getByPlaceholderText(/you@example.com/i)
    const contactInput = screen.getByPlaceholderText(/\+1234567890/i)
    const passwordInput = screen.getByPlaceholderText(/••••••••/)
    const submitButton = screen.getByRole('button', { name: /creating account/i })
    
    expect(nameInput).toBeDisabled()
    expect(emailInput).toBeDisabled()
    expect(contactInput).toBeDisabled()
    expect(passwordInput).toBeDisabled()
    expect(submitButton).toBeDisabled()
  })

  it('should display loading state during submission', () => {
    vi.mocked(useRegisterModule.useRegister).mockReturnValue({
      mutate: mockRegister,
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
    
    renderWithProviders(<RegisterForm />)
    
    expect(screen.getByRole('button', { name: /creating account/i })).toBeInTheDocument()
  })

  it('should display API error messages', () => {
    const mockError = {
      message: 'Email already exists',
    }
    
    vi.mocked(useRegisterModule.useRegister).mockReturnValue({
      mutate: mockRegister,
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
    
    renderWithProviders(<RegisterForm />)
    
    expect(screen.getByText(/email already exists/i)).toBeInTheDocument()
  })

  it('should display generic error message when error has no message', () => {
    const mockError = {}
    
    vi.mocked(useRegisterModule.useRegister).mockReturnValue({
      mutate: mockRegister,
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
    
    renderWithProviders(<RegisterForm />)
    
    expect(screen.getByText(/registration failed.*try again/i)).toBeInTheDocument()
  })

  it('should show validation errors for all empty fields', async () => {
    const user = userEvent.setup()
    renderWithProviders(<RegisterForm />)
    
    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)
    
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument()
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
    expect(await screen.findByText(/contact number is required/i)).toBeInTheDocument()
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument()
  })

  it('should accept valid phone number without country code', async () => {
    const user = userEvent.setup()
    renderWithProviders(<RegisterForm />)
    
    const nameInput = screen.getByPlaceholderText(/john doe/i)
    const emailInput = screen.getByPlaceholderText(/you@example.com/i)
    const contactInput = screen.getByPlaceholderText(/\+1234567890/i)
    const passwordInput = screen.getByPlaceholderText(/••••••••/)
    const submitButton = screen.getByRole('button', { name: /create account/i })
    
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(contactInput, '1234567890')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled()
    })
  })

  it('should mask password input', () => {
    renderWithProviders(<RegisterForm />)
    
    const passwordInput = screen.getByPlaceholderText(/••••••••/) as HTMLInputElement
    
    expect(passwordInput.type).toBe('password')
  })

  it('should allow typing in all fields', async () => {
    const user = userEvent.setup()
    renderWithProviders(<RegisterForm />)
    
    const nameInput = screen.getByPlaceholderText(/john doe/i) as HTMLInputElement
    const emailInput = screen.getByPlaceholderText(/you@example.com/i) as HTMLInputElement
    const contactInput = screen.getByPlaceholderText(/\+1234567890/i) as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText(/••••••••/) as HTMLInputElement
    
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(contactInput, '1234567890')
    await user.type(passwordInput, 'secretpass')
    
    expect(nameInput.value).toBe('John Doe')
    expect(emailInput.value).toBe('john@example.com')
    expect(contactInput.value).toBe('1234567890')
    expect(passwordInput.value).toBe('secretpass')
  })

  it('should validate name is not too long', async () => {
    const user = userEvent.setup()
    renderWithProviders(<RegisterForm />)
    
    const nameInput = screen.getByPlaceholderText(/john doe/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })
    
    const longName = 'A'.repeat(101)
    await user.type(nameInput, longName)
    await user.click(submitButton)
    
    expect(await screen.findByText(/not exceed 100 characters/i)).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('should validate password is not too long', async () => {
    const user = userEvent.setup()
    renderWithProviders(<RegisterForm />)
    
    const passwordInput = screen.getByPlaceholderText(/••••••••/)
    const submitButton = screen.getByRole('button', { name: /create account/i })
    
    const longPassword = 'A'.repeat(101)
    await user.type(passwordInput, longPassword)
    await user.click(submitButton)
    
    expect(await screen.findByText(/not exceed 100 characters/i)).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled()
  })
})
