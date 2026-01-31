# Testing Guide

This frontend application has a comprehensive testing setup using industry-standard tools.

## Test Stack

- **Test Runner**: [Vitest](https://vitest.dev/) - Fast, Vite-native test runner
- **Component Testing**: [React Testing Library](https://testing-library.com/react) - User-centric component testing
- **User Interactions**: [@testing-library/user-event](https://testing-library.com/docs/user-event/intro) - Realistic user interactions
- **DOM Assertions**: [@testing-library/jest-dom](https://testing-library.com/docs/ecosystem-jest-dom/) - Enhanced DOM matchers

## Running Tests

```bash
# Run tests in watch mode (default)
npm test

# Run tests once (CI mode)
npm test -- --run

# Open Vitest UI
npm run test:ui

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test LoginForm

# Run tests matching pattern
npm test -- auth
```

## Test Coverage

### Current Test Coverage: **136 tests passing** ✅

#### 1. **Utilities & Pure Functions** (17 tests)
- `src/shared/lib/utils.test.ts` - 9 tests for `cn()` classname utility
- `src/shared/hooks/useDebounce.test.ts` - 8 tests for debounce hook

#### 2. **Validation Schemas** (40 tests)
- `src/features/auth/validators/auth.schema.test.ts` - 25 tests
  - Login schema validation (email, password)
  - Registration schema validation (name, email, password, contact)
- `src/features/onboarding/validators/clinic.schema.test.ts` - 15 tests
  - Clinic creation validation

#### 3. **Service Layer** (19 tests)
- `src/features/auth/services/auth.service.test.ts` - 7 tests
  - login(), register(), me() methods
- `src/features/appointment/services/appointment.service.test.ts` - 12 tests
  - createAppointment(), checkAvailability(), listAppointments(), updateAppointment()

#### 4. **State Management (Zustand)** (31 tests)
- `src/features/auth/store/auth.store.test.ts` - 15 tests
  - Authentication state, token management
  - setAuth(), logout(), updateUser(), getRole(), hasClinic()
- `src/features/onboarding/store/onboarding.store.test.ts` - 16 tests
  - Onboarding flow state management
  - setStep(), setSelectedClinic(), reset()

#### 5. **Component Tests** (29 tests)
- `src/features/auth/components/LoginForm.test.tsx` - 13 tests
  - Form rendering, validation, submission
  - Loading states, error display
- `src/features/auth/components/RegisterForm.test.tsx` - 16 tests
  - All form fields validation
  - Registration flow, error handling

## Test Structure

### Directory Layout

```
src/
├── test/
│   ├── setup.ts              # Global test setup
│   └── utils.tsx             # Custom render utilities with test data
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── LoginForm.test.tsx
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── auth.service.test.ts
│   │   ├── store/
│   │   │   ├── auth.store.ts
│   │   │   └── auth.store.test.ts
│   │   └── validators/
│   │       ├── auth.schema.ts
│   │       └── auth.schema.test.ts
│   └── [other features follow same pattern]
└── shared/
    ├── lib/
    │   ├── utils.ts
    │   └── utils.test.ts
    └── hooks/
        ├── useDebounce.ts
        └── useDebounce.test.ts
```

## Writing Tests

### Test Utilities

#### Custom Render Function

```typescript
import { renderWithProviders, screen } from '@/test/utils'

test('renders component', () => {
  renderWithProviders(<MyComponent />)
  expect(screen.getByText('Hello')).toBeInTheDocument()
})
```

The `renderWithProviders()` function automatically wraps components with:
- QueryClientProvider (React Query)
- BrowserRouter (React Router)

#### Test Data Factories

```typescript
import { testData } from '@/test/utils'

const user = testData.user({ name: 'Custom Name' })
const clinic = testData.clinic({ address: 'Custom Address' })
const patient = testData.patient()
const appointment = testData.appointment()
```

#### Auth Helpers

```typescript
import { setupAuthenticatedUser, clearAuth } from '@/test/utils'

// Setup authenticated user with clinic
setupAuthenticatedUser(true)

// Setup authenticated user without clinic
setupAuthenticatedUser(false)

// Clear auth state
clearAuth()
```

### Testing Patterns

#### 1. Testing Pure Utilities

```typescript
import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn utility', () => {
  it('should merge class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
  })
})
```

#### 2. Testing Zod Schemas

```typescript
import { describe, it, expect } from 'vitest'
import { loginSchema } from './auth.schema'

describe('loginSchema', () => {
  it('should validate correct credentials', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('should reject invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'invalid',
      password: 'password123',
    })
    expect(result.success).toBe(false)
  })
})
```

#### 3. Testing Services (with mocked apiClient)

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from './auth.service'
import { apiClient } from '@/shared/lib/api-client'

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

  it('should call login endpoint', async () => {
    const mockResponse = { success: true, data: { token: 'test' } }
    vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

    const result = await authService.login({ 
      email: 'test@example.com', 
      password: 'pass' 
    })

    expect(apiClient.post).toHaveBeenCalled()
    expect(result).toEqual(mockResponse)
  })
})
```

#### 4. Testing Zustand Stores

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './auth.store'

describe('authStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.getState().logout()
  })

  it('should set authentication', () => {
    const { setAuth } = useAuthStore.getState()
    
    setAuth(mockToken)
    
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
  })
})
```

#### 5. Testing Components

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'
import { renderWithProviders } from '@/test/utils'

vi.mock('../hooks/useLogin')

describe('LoginForm', () => {
  it('should submit with valid data', async () => {
    const user = userEvent.setup()
    const mockLogin = vi.fn()
    
    vi.mocked(useLogin).mockReturnValue({
      mutate: mockLogin,
      isPending: false,
      // ... other required fields
    })

    renderWithProviders(<LoginForm />)
    
    await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com')
    await user.type(screen.getByPlaceholderText(/password/i), 'pass123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'pass123',
      })
    })
  })
})
```

## API Mocking Strategies

The tests use different mocking strategies depending on the test type:

### Service Layer Tests

Service tests directly mock the `apiClient` module using Vitest:

```typescript
vi.mock('@/shared/lib/api-client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
  },
}))

test('should call API with correct data', async () => {
  vi.mocked(apiClient.post).mockResolvedValue({ success: true, data: {...} })
  
  const result = await authService.login({ email, password })
  
  expect(apiClient.post).toHaveBeenCalledWith('/auth/login', { email, password })
})
```

### Component Tests

Component tests mock the React hooks (like `useLogin`, `useRegister`) instead of API calls:

```typescript
vi.mock('../hooks/useLogin')

test('handles form submission', async () => {
  const mockLogin = vi.fn()
  vi.mocked(useLogin).mockReturnValue({
    mutate: mockLogin,
    isPending: false,
    // ...
  })
  
  // Test component behavior...
})
```

## Best Practices

### ✅ DO

- **Test user behavior**, not implementation details
- Use **accessible queries** (getByRole, getByLabelText) over getByTestId
- Write **descriptive test names**: "should navigate to dashboard after successful login"
- **Mock external dependencies** (API calls, navigation, timers)
- **Clean up** after each test (done automatically in setup.ts)
- Use **AAA pattern**: Arrange, Act, Assert
- Test **error states** and edge cases

### ❌ DON'T

- Don't test implementation details (internal state, private methods)
- Don't test library code (React Query, React Hook Form)
- Don't use `getByTestId` unless necessary (prefer semantic queries)
- Don't forget to await async operations
- Don't share mutable state between tests

## Common Testing Scenarios

### Testing Forms

```typescript
// Fill out form
await user.type(screen.getByLabelText(/email/i), 'test@example.com')

// Submit form
await user.click(screen.getByRole('button', { name: /submit/i }))

// Assert validation
expect(await screen.findByText(/error message/i)).toBeInTheDocument()
```

### Testing Async Operations

```typescript
// Wait for element to appear
expect(await screen.findByText('Success')).toBeInTheDocument()

// Wait for condition
await waitFor(() => {
  expect(mockFn).toHaveBeenCalled()
})
```

### Testing Loading States

```typescript
// Mock pending state
vi.mocked(useQuery).mockReturnValue({
  data: undefined,
  isLoading: true,
  // ...
})

expect(screen.getByText(/loading/i)).toBeInTheDocument()
```

## Debugging Tests

### View Test Output

```bash
npm run test:ui  # Opens interactive UI
```

### Debug Individual Test

```typescript
import { screen } from '@testing-library/react'

test('debug test', () => {
  renderWithProviders(<MyComponent />)
  screen.debug()  // Prints DOM to console
})
```

### Check What's Rendered

```typescript
// Log all accessible elements
screen.logTestingPlaygroundURL()
```

## CI/CD Integration

Tests are fast enough to run in CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm test -- --run

- name: Generate coverage
  run: npm run test:coverage
```

## Coverage Goals

- **Utilities**: 90%+ coverage
- **Validation Schemas**: 100% coverage
- **Services**: 80%+ coverage
- **Stores**: 90%+ coverage
- **Critical Components**: 70%+ coverage
- **Overall**: 70%+ coverage

## What's Tested

### ✅ High Value Tests (Completed)
- ✅ Pure utilities (cn, useDebounce)
- ✅ All Zod validation schemas
- ✅ Auth service layer
- ✅ Appointment service layer
- ✅ Auth store (Zustand)
- ✅ Onboarding store (Zustand)
- ✅ LoginForm component
- ✅ RegisterForm component

### 📝 Future Test Candidates
- Calendar components (CalendarView, CustomEventCard)
- Patient components (PatientAutocomplete, CreatePatientModal)
- Onboarding wizard flow
- Protected routes
- Layout components (Navbar, MainLayout)
- Integration tests for full user flows

## Troubleshooting

### Tests Timing Out

If tests timeout, check for:
- Missing `await` before async operations
- Unmocked API calls or hooks
- Infinite loops in components

### Mock Issues

Ensure:
- All external dependencies are mocked (API client, hooks, etc.)
- Mocks are cleared between tests (done automatically in setup.ts)
- Mock implementations match the expected interface

### Component Not Rendering

Check that:
- All providers are wrapped (use `renderWithProviders`)
- Required props are provided
- Dependencies are mocked

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
