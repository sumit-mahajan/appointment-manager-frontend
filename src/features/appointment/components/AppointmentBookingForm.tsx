import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from '@/shared/lib/toast'
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { FormField, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form'
import { PatientAutocomplete } from '@/features/patient/components/PatientAutocomplete'
import { CreatePatientModal } from '@/features/patient/components/CreatePatientModal'
import { useCreateAppointment } from '../hooks/useCreateAppointment'
import { useCheckAvailability } from '../hooks/useCheckAvailability'
import { useDebounce } from '@/shared/hooks/useDebounce'
import type { Patient } from '@/features/patient/types/patient.types'

const appointmentSchema = z.object({
  patientId: z.string().min(1, 'Please select a patient'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  duration: z.number().min(15, 'Duration must be at least 15 minutes'),
  isEmergency: z.boolean(),
})

type AppointmentFormData = z.infer<typeof appointmentSchema>

// Generate time slots from 9:00 AM to 9:00 PM in 15-minute intervals
const generateTimeSlots = () => {
  const slots: string[] = []
  for (let hour = 9; hour <= 21; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      if (hour === 21 && minute > 0) break // Stop at 9:00 PM
      const h = hour.toString().padStart(2, '0')
      const m = minute.toString().padStart(2, '0')
      slots.push(`${h}:${m}`)
    }
  }
  return slots
}

const TIME_SLOTS = generateTimeSlots()
const DURATIONS = [15, 30, 45, 60, 90]

interface AppointmentBookingFormProps {
  onSuccess?: () => void
}

export function AppointmentBookingForm({ onSuccess }: AppointmentBookingFormProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showCreatePatient, setShowCreatePatient] = useState(false)
  const [createPatientQuery, setCreatePatientQuery] = useState('')
  const [checkAvailability, setCheckAvailability] = useState(false)

  const { mutate: createAppointment, isPending, reset: resetMutation } = useCreateAppointment()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset: resetForm,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: '',
      date: '',
      time: '',
      duration: 30,
      isEmergency: false,
    },
  })

  const date = watch('date')
  const time = watch('time')
  const duration = watch('duration')
  const isEmergency = watch('isEmergency')

  // Calculate start and end datetime
  const startDatetime = date && time ? (() => {
    const d = new Date(`${date}T${time}:00`)
    return isNaN(d.getTime()) ? '' : d.toISOString()
  })() : ''
  const endDatetime = startDatetime && duration 
    ? new Date(new Date(startDatetime).getTime() + duration * 60000).toISOString()
    : ''

  // Debounce the datetime to avoid too many API calls
  const debouncedStart = useDebounce(startDatetime, 500)
  const debouncedEnd = useDebounce(endDatetime, 500)

  // Check availability when datetime changes
  const { data: availabilityData, isLoading: isCheckingAvailability } = useCheckAvailability(
    debouncedStart,
    debouncedEnd,
    checkAvailability && !isEmergency
  )

  // Enable availability check when date, time, and duration are set
  useEffect(() => {
    if (date && time && duration) {
      setCheckAvailability(true)
    } else {
      setCheckAvailability(false)
    }
  }, [date, time, duration])

  // Update patient ID when patient is selected
  useEffect(() => {
    if (selectedPatient) {
      setValue('patientId', selectedPatient.patient_id)
    } else {
      setValue('patientId', '')
    }
  }, [selectedPatient, setValue])

  const handleCreatePatientClick = (query: string) => {
    setCreatePatientQuery(query)
    setShowCreatePatient(true)
  }

  const handlePatientCreated = (patient: Patient) => {
    setSelectedPatient(patient)
  }

  const onSubmit = (data: AppointmentFormData) => {
    const startDate = new Date(`${data.date}T${data.time}:00`)
    if (isNaN(startDate.getTime())) {
      toast.error('Invalid date or time')
      return
    }
    const start = startDate.toISOString()
    const appointmentData = {
      patientId: data.patientId,
      start,
      end: new Date(new Date(start).getTime() + data.duration * 60000).toISOString(),
      durationInMinutes: data.duration,
      isEmergency: data.isEmergency,
    }

    createAppointment(appointmentData, {
      onSuccess: () => {
        resetForm()
        setSelectedPatient(null)
        resetMutation()
        if (onSuccess) {
          onSuccess()
        }
      },
      onError: (error: any) => {
        toast.error('Failed to book appointment', {
          description: error?.message || 'Please try again.',
        })
      },
    })
  }

  const isAvailable = availabilityData?.data?.available ?? true
  const hasConflict = !isAvailable && !isEmergency
  const canSubmit = !isPending && (!hasConflict || isEmergency) && !isCheckingAvailability

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Patient Selection */}
        <FormField name="patientId" error={errors.patientId?.message}>
          <FormLabel>Patient</FormLabel>
          <FormControl>
            <PatientAutocomplete
              value={selectedPatient}
              onChange={setSelectedPatient}
              onCreateClick={handleCreatePatientClick}
            />
          </FormControl>
          <FormMessage />
        </FormField>

        {/* Date Picker */}
        <FormField name="date" error={errors.date?.message}>
          <FormLabel>Date</FormLabel>
          <FormControl>
            <Input
              type="date"
              min={today}
              {...register('date')}
              disabled={isPending}
            />
          </FormControl>
          <FormMessage />
        </FormField>

        {/* Time and Duration Row */}
        <div className="grid grid-cols-2 gap-4">
          <FormField name="time" error={errors.time?.message}>
            <FormLabel>Time</FormLabel>
            <FormControl>
              <select
                {...register('time')}
                disabled={isPending}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select time</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormField>

          <FormField name="duration" error={errors.duration?.message}>
            <FormLabel>Duration (minutes)</FormLabel>
            <FormControl>
              <select
                {...register('duration', { valueAsNumber: true })}
                disabled={isPending}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {DURATIONS.map((dur) => (
                  <option key={dur} value={dur}>
                    {dur} min
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormField>
        </div>

        {/* Availability Status */}
        {checkAvailability && !isEmergency && (
          <div className="rounded-md p-3">
            {isCheckingAvailability ? (
              <div className="flex items-center space-x-2 text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Checking availability...</span>
              </div>
            ) : isAvailable ? (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Time slot is available</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-amber-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Time slot conflicts with existing appointment</span>
              </div>
            )}
          </div>
        )}

        {/* Emergency Checkbox */}
        <div className="flex items-start space-x-3 rounded-md border border-gray-200 p-4">
          <input
            type="checkbox"
            id="isEmergency"
            {...register('isEmergency')}
            disabled={isPending}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
          <div className="flex-1">
            <label htmlFor="isEmergency" className="text-sm font-medium cursor-pointer">
              Mark as Emergency
            </label>
            <p className="text-sm text-gray-500 mt-1">
              Emergency appointments can be booked even if the time slot conflicts with existing appointments
            </p>
          </div>
        </div>

        {/* Emergency Override Message */}
        {isEmergency && hasConflict && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              <strong>Emergency override enabled.</strong> This appointment will be booked despite the time conflict.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={!canSubmit}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Book Appointment
        </Button>
      </form>

      {/* Create Patient Modal */}
      <CreatePatientModal
        open={showCreatePatient}
        onOpenChange={setShowCreatePatient}
        initialQuery={createPatientQuery}
        onSuccess={handlePatientCreated}
      />
    </>
  )
}
