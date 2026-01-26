import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Building2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { FormField, FormLabel, FormControl, FormMessage, FormDescription } from '@/shared/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useCreateClinic } from '../hooks/useCreateClinic'
import { createClinicSchema, type CreateClinicFormData } from '../validators/clinic.schema'

interface CreateClinicStepProps {
  onBack: () => void
}

export function CreateClinicStep({ onBack }: CreateClinicStepProps) {
  const { mutate: createClinic, isPending, error } = useCreateClinic()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateClinicFormData>({
    resolver: zodResolver(createClinicSchema),
  })

  const onSubmit = (data: CreateClinicFormData) => {
    createClinic(data)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Create Your Clinic</CardTitle>
        <CardDescription>
          Set up your clinic and become the owner
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{(error as any).message || 'Failed to create clinic. Please try again.'}</p>
            </div>
          )}

          <FormField name="name" error={errors.name?.message}>
            <FormLabel>Clinic Name</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Downtown Medical Center"
                {...register('name')}
                disabled={isPending}
              />
            </FormControl>
            <FormMessage />
          </FormField>

          <FormField name="description" error={errors.description?.message}>
            <FormLabel>Description (Optional)</FormLabel>
            <FormControl>
              <textarea
                placeholder="Brief description of your clinic..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register('description')}
                disabled={isPending}
              />
            </FormControl>
            <FormDescription>
              Help others understand what your clinic specializes in
            </FormDescription>
            <FormMessage />
          </FormField>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onBack}
              disabled={isPending}
            >
              Back
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Clinic'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
