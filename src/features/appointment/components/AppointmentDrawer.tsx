import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
} from '@/shared/components/ui/sheet'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Label } from '@/shared/components/ui/label'
import { 
  Phone, 
  Calendar, 
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import type { AppointmentWithPatient } from '../types/appointment.types'
import { useUpdateAppointment } from '../hooks/useUpdateAppointment'
import { useCheckAvailability } from '../hooks/useCheckAvailability'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { Loader2 } from 'lucide-react'

interface AppointmentDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: AppointmentWithPatient | null
}

const rescheduleSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  duration: z.number().min(15, 'Duration must be at least 15 minutes'),
  isEmergency: z.boolean(),
})

type RescheduleFormData = z.infer<typeof rescheduleSchema>

// Generate time slots from 9:00 AM to 9:00 PM in 15-minute intervals
const generateTimeSlots = () => {
  const slots: string[] = []
  for (let hour = 9; hour <= 21; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      if (hour === 21 && minute > 0) break
      const h = hour.toString().padStart(2, '0')
      const m = minute.toString().padStart(2, '0')
      slots.push(`${h}:${m}`)
    }
  }
  return slots
}

const TIME_SLOTS = generateTimeSlots()
const DURATIONS = [15, 30, 45, 60, 90]

export const AppointmentDrawer = ({ open, onOpenChange, appointment }: AppointmentDrawerProps) => {
  const { mutate: updateAppointment, isPending } = useUpdateAppointment()
  const [checkAvailability, setCheckAvailability] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<RescheduleFormData>({
    resolver: zodResolver(rescheduleSchema),
    defaultValues: {
      date: '',
      time: '',
      duration: 30,
    },
  })

  // Reset form when appointment changes
  useEffect(() => {
    if (appointment) {
      const startDate = new Date(appointment.start_datetime)
      const dateStr = format(startDate, 'yyyy-MM-dd')
      const timeStr = format(startDate, 'HH:mm')
      
      reset({
        date: dateStr,
        time: timeStr,
        duration: appointment.duration_in_minutes,
        isEmergency: appointment.is_emergency || false,
      })
      setCheckAvailability(true)
    }
  }, [appointment, reset])

  const date = watch('date')
  const time = watch('time')
  const duration = watch('duration')
  const isEmergencyChecked = watch('isEmergency')

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

  // Check availability when datetime changes (exclude current appointment from conflict check)
  // Skip check if emergency is selected
  const { data: availabilityData, isLoading: isCheckingAvailability } = useCheckAvailability(
    debouncedStart,
    debouncedEnd,
    checkAvailability && !isEmergencyChecked,
    appointment?.appointment_id
  )

  if (!appointment) return null

  const patientName = appointment.patients?.name || 'Unknown Patient'
  const patientContact = appointment.patients?.contact || 'No contact'
  const formattedDateTime = format(new Date(appointment.start_datetime), "EEE, MMM d, yyyy 'at' h:mm a")
  
  const isAppointmentPast = new Date(appointment.start_datetime) < new Date()
  const canShowUp = isAppointmentPast && appointment.status === 'confirm' && !appointment.did_show_up

  const handleStatusChange = (status: 'pending' | 'confirm' | 'cancel') => {
    updateAppointment(
      { 
        id: appointment.appointment_id, 
        data: { status } 
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        }
      }
    )
  }

  const handleMarkShowedUp = () => {
    updateAppointment(
      { 
        id: appointment.appointment_id, 
        data: { didShowUp: true } 
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        }
      }
    )
  }


  const onSubmitReschedule = (data: RescheduleFormData) => {
    const start = new Date(`${data.date}T${data.time}:00`).toISOString()
    const end = new Date(new Date(start).getTime() + data.duration * 60000).toISOString()

    updateAppointment(
      {
        id: appointment.appointment_id,
        data: {
          start,
          end,
          durationInMinutes: data.duration,
          isEmergency: data.isEmergency,
        }
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        }
      }
    )
  }

  const getStatusBadgeVariant = (status: string | null) => {
    switch (status) {
      case 'confirm': return 'default'
      case 'cancel': return 'destructive'
      case 'pending':
      default: return 'secondary'
    }
  }

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case 'confirm': return 'Confirmed'
      case 'cancel': return 'Cancelled'
      case 'pending':
      default: return 'Pending'
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-12">
          <SheetTitle className="text-xl">Update Appointment</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Patient and Appointment Info */}
          <div className="space-y-2 pb-4 border-b">
            <div className="flex items-center justify-between">
              <span className="font-medium">{patientName}</span>
              <Badge variant={getStatusBadgeVariant(appointment.status)}>
                {getStatusLabel(appointment.status)}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                <span>{patientContact}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formattedDateTime}</span>
              </div>
            </div>
          </div>

          {/* Status Actions */}
          <div className="flex flex-wrap gap-2">
            {appointment.status !== 'confirm' && (
              <Button
                size="sm"
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50"
                onClick={() => handleStatusChange('confirm')}
                disabled={isPending}
              >
                Confirm
              </Button>
            )}
            
            {appointment.status !== 'cancel' && (
              <Button
                size="sm"
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50"
                onClick={() => handleStatusChange('cancel')}
                disabled={isPending}
              >
                Cancel
              </Button>
            )}
            
            {appointment.status !== 'pending' && (
              <Button
                size="sm"
                variant="outline"
                className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                onClick={() => handleStatusChange('pending')}
                disabled={isPending}
              >
                Set Pending
              </Button>
            )}
            
            {canShowUp && (
              <Button
                size="sm"
                variant="outline"
                className="border-purple-500 text-purple-600 hover:bg-purple-50"
                onClick={handleMarkShowedUp}
                disabled={isPending}
              >
                Mark Showed Up
              </Button>
            )}
          </div>

          {/* Reschedule Form */}
          <div className="space-y-4 pt-4 border-t">
            
            <form onSubmit={handleSubmit(onSubmitReschedule)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-xs text-muted-foreground">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register('date')}
                  />
                  {errors.date && (
                    <p className="text-xs text-destructive">{errors.date.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time" className="text-xs text-muted-foreground">Time</Label>
                  <select
                    id="time"
                    {...register('time')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  {errors.time && (
                    <p className="text-xs text-destructive">{errors.time.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Duration</Label>
                <div className="flex gap-2">
                  {DURATIONS.map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => reset({ date, time, duration: dur, isEmergency: isEmergencyChecked })}
                      className={`flex-1 py-2 px-3 rounded-md border text-sm font-medium transition-colors ${
                        duration === dur
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-input hover:bg-accent'
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              {/* Emergency Checkbox */}
              <div className="flex items-center space-x-2 py-2">
                <Checkbox
                  id="isEmergency"
                  checked={isEmergencyChecked}
                  onCheckedChange={(checked) => reset({ date, time, duration, isEmergency: checked as boolean })}
                />
                <Label
                  htmlFor="isEmergency"
                  className="text-sm leading-none cursor-pointer"
                >
                  Emergency (skip availability check)
                </Label>
              </div>

              {/* Availability Indicator */}
              {debouncedStart && debouncedEnd && !isEmergencyChecked && (
                <div className="flex items-center gap-2 text-xs py-2">
                  {isCheckingAvailability ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                      <span className="text-muted-foreground">Checking...</span>
                    </>
                  ) : availabilityData?.data?.available ? (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span className="text-green-600">Available</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3 text-red-600" />
                      <span className="text-red-600">Not available</span>
                    </>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isPending || (isCheckingAvailability && !isEmergencyChecked) || (!isEmergencyChecked && !availabilityData?.data?.available)}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
