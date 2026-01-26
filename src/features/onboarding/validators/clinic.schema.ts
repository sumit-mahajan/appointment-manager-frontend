import { z } from 'zod'

export const createClinicSchema = z.object({
  name: z
    .string()
    .min(1, 'Clinic name is required')
    .min(2, 'Clinic name must be at least 2 characters')
    .max(100, 'Clinic name must not exceed 100 characters'),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional(),
})

export type CreateClinicFormData = z.infer<typeof createClinicSchema>
