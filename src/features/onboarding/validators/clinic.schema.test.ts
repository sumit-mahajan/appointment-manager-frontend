import { describe, it, expect } from 'vitest'
import { createClinicSchema } from './clinic.schema'

describe('createClinicSchema', () => {
  describe('name validation', () => {
    it('should accept valid clinic name', () => {
      const result = createClinicSchema.safeParse({
        name: 'Main Street Clinic',
      })
      expect(result.success).toBe(true)
    })

    it('should reject empty name', () => {
      const result = createClinicSchema.safeParse({
        name: '',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Clinic name is required')
      }
    })

    it('should reject name shorter than 2 characters', () => {
      const result = createClinicSchema.safeParse({
        name: 'A',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Clinic name must be at least 2 characters')
      }
    })

    it('should reject name longer than 100 characters', () => {
      const longName = 'A'.repeat(101)
      const result = createClinicSchema.safeParse({
        name: longName,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Clinic name must not exceed 100 characters')
      }
    })

    it('should accept name with exactly 100 characters', () => {
      const name = 'A'.repeat(100)
      const result = createClinicSchema.safeParse({
        name,
      })
      expect(result.success).toBe(true)
    })

    it('should accept name with exactly 2 characters', () => {
      const result = createClinicSchema.safeParse({
        name: 'AB',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('description validation', () => {
    it('should accept valid description', () => {
      const result = createClinicSchema.safeParse({
        name: 'Test Clinic',
        description: 'A comprehensive healthcare facility providing excellent patient care.',
      })
      expect(result.success).toBe(true)
    })

    it('should accept missing description (optional field)', () => {
      const result = createClinicSchema.safeParse({
        name: 'Test Clinic',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.description).toBeUndefined()
      }
    })

    it('should accept empty description', () => {
      const result = createClinicSchema.safeParse({
        name: 'Test Clinic',
        description: '',
      })
      expect(result.success).toBe(true)
    })

    it('should reject description longer than 500 characters', () => {
      const longDescription = 'A'.repeat(501)
      const result = createClinicSchema.safeParse({
        name: 'Test Clinic',
        description: longDescription,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Description must not exceed 500 characters')
      }
    })

    it('should accept description with exactly 500 characters', () => {
      const description = 'A'.repeat(500)
      const result = createClinicSchema.safeParse({
        name: 'Test Clinic',
        description,
      })
      expect(result.success).toBe(true)
    })
  })

  describe('complete validation', () => {
    it('should validate complete clinic data with description', () => {
      const validData = {
        name: 'Sunrise Medical Center',
        description: 'A state-of-the-art medical facility serving the community since 1995.',
      }
      const result = createClinicSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should validate clinic data without description', () => {
      const validData = {
        name: 'Sunrise Medical Center',
      }
      const result = createClinicSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe(validData.name)
        expect(result.data.description).toBeUndefined()
      }
    })

    it('should handle special characters in name', () => {
      const validData = {
        name: "St. Mary's Health & Wellness Clinic",
        description: 'Providing care with compassion.',
      }
      const result = createClinicSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should handle unicode characters', () => {
      const validData = {
        name: 'Clinique médicale de santé',
        description: 'Une clinique moderne avec des services de qualité.',
      }
      const result = createClinicSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })
})
