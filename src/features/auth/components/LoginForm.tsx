import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { FormField, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form'
import { useLogin } from '../hooks/useLogin'
import { loginSchema, type LoginFormData } from '../validators/auth.schema'

export function LoginForm() {
  const { mutate: login, isPending, error } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    login(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{(error as any).message || 'Login failed. Please try again.'}</p>
        </div>
      )}

      <FormField name="email" error={errors.email?.message}>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input
            type="email"
            placeholder="you@example.com"
            {...register('email')}
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
            {...register('password')}
            disabled={isPending}
          />
        </FormControl>
        <FormMessage />
      </FormField>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  )
}
