import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { FormField, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form'
import { useRegister } from '../hooks/useRegister'
import { registerSchema, type RegisterFormData } from '../validators/auth.schema'

export function RegisterForm() {
  const { mutate: register, isPending, error } = useRegister()

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (data: RegisterFormData) => {
    register(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{(error as any).message || 'Registration failed. Please try again.'}</p>
        </div>
      )}

      <FormField name="name" error={errors.name?.message}>
        <FormLabel>Full Name</FormLabel>
        <FormControl>
          <Input
            type="text"
            placeholder="John Doe"
            {...registerField('name')}
            disabled={isPending}
          />
        </FormControl>
        <FormMessage />
      </FormField>

      <FormField name="email" error={errors.email?.message}>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input
            type="email"
            placeholder="you@example.com"
            {...registerField('email')}
            disabled={isPending}
          />
        </FormControl>
        <FormMessage />
      </FormField>

      <FormField name="contact" error={errors.contact?.message}>
        <FormLabel>Contact Number</FormLabel>
        <FormControl>
          <Input
            type="tel"
            placeholder="+1234567890"
            {...registerField('contact')}
            disabled={isPending}
          />
        </FormControl>
        <FormMessage />
      </FormField>

      <FormField name="password" error={errors.password?.message}>
        <FormLabel>Password</FormLabel>
        <FormControl>
          <Input
            type="password"
            placeholder="••••••••"
            {...registerField('password')}
            disabled={isPending}
          />
        </FormControl>
        <FormMessage />
      </FormField>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  )
}
