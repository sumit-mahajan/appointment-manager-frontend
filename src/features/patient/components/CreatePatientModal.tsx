import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from '@/shared/lib/toast'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { FormField, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form'
import { useCreatePatient } from '../hooks/useCreatePatient'
import type { Patient } from '../types/patient.types'

const createPatientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contact: z.string().min(1, 'Phone number is required'),
})

type CreatePatientFormData = z.infer<typeof createPatientSchema>

interface CreatePatientModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialQuery?: string
  onSuccess?: (patient: Patient) => void
}

export function CreatePatientModal({ 
  open, 
  onOpenChange, 
  initialQuery = '',
  onSuccess 
}: CreatePatientModalProps) {
  const { mutate: createPatient, isPending, reset } = useCreatePatient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset: resetForm,
  } = useForm<CreatePatientFormData>({
    resolver: zodResolver(createPatientSchema),
  })

  // Auto-fill the search query into the appropriate field
  useEffect(() => {
    if (open && initialQuery) {
      // Check if query looks like a phone number (contains mostly digits)
      const isPhone = /^\+?\d[\d\s\-()]+$/.test(initialQuery.trim())
      
      if (isPhone) {
        setValue('contact', initialQuery)
      } else {
        setValue('name', initialQuery)
      }
    }
  }, [open, initialQuery, setValue])

  // Reset form and error when modal closes
  useEffect(() => {
    if (!open) {
      resetForm()
      reset()
    }
  }, [open, resetForm, reset])

  const onSubmit = (data: CreatePatientFormData) => {
    createPatient(data, {
      onSuccess: (response) => {
        toast.success('Patient created successfully!', {
          description: `${data.name} has been added to your clinic.`,
        })
        onOpenChange(false)
        resetForm()
        if (onSuccess) {
          onSuccess(response.data!)
        }
      },
      onError: (error: any) => {
        toast.error('Failed to create patient', {
          description: error?.message || 'Please try again.',
        })
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Patient</DialogTitle>
          <DialogDescription>
            Add a new patient to your clinic
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField name="name" error={errors.name?.message}>
            <FormLabel>Patient Name</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="John Doe"
                {...register('name')}
                disabled={isPending}
              />
            </FormControl>
            <FormMessage />
          </FormField>

          <FormField name="contact" error={errors.contact?.message}>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="+1 (555) 123-4567"
                {...register('contact')}
                disabled={isPending}
              />
            </FormControl>
            <FormMessage />
          </FormField>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Patient
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
