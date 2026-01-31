import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema } from './auth.schema'

describe('loginSchema', () => {
  describe('email validation', () => {
    it('should accept valid email addresses', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      })
      expect(result.success).toBe(true)
    })

    it('should reject empty email', () => {
      const result = loginSchema.safeParse({
        email: '',
        password: 'password123',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email is required')
      }
    })

    it('should reject invalid email format', () => {
      const result = loginSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid email address')
      }
    })

    it('should reject email without domain', () => {
      const result = loginSchema.safeParse({
        email: 'test@',
        password: 'password123',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('password validation', () => {
    it('should accept valid password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      })
      expect(result.success).toBe(true)
    })

    it('should reject empty password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password is required')
      }
    })

    it('should reject password shorter than 6 characters', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '12345',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must be at least 6 characters')
      }
    })

    it('should accept password with exactly 6 characters', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '123456',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('complete validation', () => {
    it('should validate correct credentials', () => {
      const validData = {
        email: 'user@example.com',
        password: 'securePassword123',
      }
      const result = loginSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })
  })
})

describe('registerSchema', () => {
  describe('name validation', () => {
    it('should accept valid name', () => {
      const result = registerSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        contact: '+1234567890',
      })
      expect(result.success).toBe(true)
    })

    it('should reject empty name', () => {
      const result = registerSchema.safeParse({
        name: '',
        email: 'john@example.com',
        password: 'password123',
        contact: '+1234567890',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name is required')
      }
    })

    it('should reject name shorter than 2 characters', () => {
      const result = registerSchema.safeParse({
        name: 'A',
        email: 'john@example.com',
        password: 'password123',
        contact: '+1234567890',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name must be at least 2 characters')
      }
    })

    it('should reject name longer than 100 characters', () => {
      const longName = 'A'.repeat(101)
      const result = registerSchema.safeParse({
        name: longName,
        email: 'john@example.com',
        password: 'password123',
        contact: '+1234567890',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name must not exceed 100 characters')
      }
    })

    it('should accept name with exactly 100 characters', () => {
      const name = 'A'.repeat(100)
      const result = registerSchema.safeParse({
        name,
        email: 'john@example.com',
        password: 'password123',
        contact: '+1234567890',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('email validation', () => {
    it('should accept valid email', () => {
      const result = registerSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        contact: '+1234567890',
      })
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const result = registerSchema.safeParse({
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
        contact: '+1234567890',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid email address')
      }
    })
  })

  describe('password validation', () => {
    it('should accept valid password', () => {
      const result = registerSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        contact: '+1234567890',
      })
      expect(result.success).toBe(true)
    })

    it('should reject password shorter than 6 characters', () => {
      const result = registerSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: '12345',
        contact: '+1234567890',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must be at least 6 characters')
      }
    })

    it('should reject password longer than 100 characters', () => {
      const longPassword = 'A'.repeat(101)
      const result = registerSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: longPassword,
        contact: '+1234567890',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must not exceed 100 characters')
      }
    })
  })

  describe('contact validation', () => {
    it('should accept valid phone numbers with country code', () => {
      const validNumbers = [
        '+1234567890',
        '+12345678901',
      ]

      validNumbers.forEach((contact) => {
        const result = registerSchema.safeParse({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          contact,
        })
        expect(result.success).toBe(true)
      })
    })

    it('should accept valid phone numbers without country code', () => {
      const validNumbers = [
        '1234567890',
        '123-456-7890',
        '(123) 456-7890',
      ]

      validNumbers.forEach((contact) => {
        const result = registerSchema.safeParse({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          contact,
        })
        expect(result.success).toBe(true)
      })
    })

    it('should reject empty contact', () => {
      const result = registerSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        contact: '',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Contact number is required')
      }
    })

    it('should reject invalid phone numbers', () => {
      const invalidNumbers = [
        'abc',
        'phone-number',
      ]

      invalidNumbers.forEach((contact) => {
        const result = registerSchema.safeParse({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          contact,
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Please enter a valid contact number')
        }
      })
    })
  })

  describe('complete validation', () => {
    it('should validate complete registration data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securePassword123',
        contact: '+1234567890',
      }
      const result = registerSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should return all validation errors at once', () => {
      const result = registerSchema.safeParse({
        name: '',
        email: 'invalid',
        password: '123',
        contact: 'abc',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        // Should have errors for all fields
        expect(result.error.issues.length).toBeGreaterThan(1)
      }
    })
  })
})
