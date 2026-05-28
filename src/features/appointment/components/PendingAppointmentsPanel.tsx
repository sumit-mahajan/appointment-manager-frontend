import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { appointmentService } from '@/features/appointment/services/appointment.service'
import { QUERY_KEYS } from '@/shared/constants/app.constants'
import type { AppointmentWithPatient } from '@/features/appointment/types/appointment.types'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface PendingAppointmentsPanelProps {
  appointments: AppointmentWithPatient[]
}

function isPatientBooking(appt: AppointmentWithPatient) {
  return appt.booked_via === 'patient'
}

export function PendingAppointmentsPanel({ appointments }: PendingAppointmentsPanelProps) {
  const queryClient = useQueryClient()

  const pending = appointments
    .filter((a) => a.status === 'pending')
    .sort((a, b) => {
      const aPatient = isPatientBooking(a) ? 0 : 1
      const bPatient = isPatientBooking(b) ? 0 : 1
      if (aPatient !== bPatient) return aPatient - bPatient
      return new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime()
    })

  const patientPendingCount = pending.filter(isPatientBooking).length

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: 'confirm' | 'cancel'
    }) => appointmentService.updateAppointment(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APPOINTMENTS })
      toast.success('Appointment updated')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  if (pending.length === 0) return null

  return (
    <Card className="mb-6 border-amber-200 bg-amber-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex flex-wrap items-center gap-2">
          Pending requests
          <Badge variant="secondary">{pending.length}</Badge>
          {patientPendingCount > 0 && (
            <Badge className="bg-blue-600 hover:bg-blue-600">
              {patientPendingCount} online
            </Badge>
          )}
        </CardTitle>
        {patientPendingCount > 0 && (
          <CardDescription>
            Online patient bookings are listed first — confirm these before other pending slots.
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {pending.map((appt) => (
          <div
            key={appt.appointment_id}
            className={`flex flex-col gap-2 rounded-lg border bg-background p-3 sm:flex-row sm:items-center sm:justify-between ${
              isPatientBooking(appt) ? 'border-blue-300 ring-1 ring-blue-200' : ''
            }`}
          >
            <div>
              <p className="font-medium flex flex-wrap items-center gap-2">
                {appt.patients?.name || 'Unknown patient'}
                {isPatientBooking(appt) && (
                  <Badge variant="outline" className="border-blue-500 text-blue-700 text-xs">
                    Patient
                  </Badge>
                )}
                {appt.patients?.contact && (
                  <span className="text-sm font-normal text-muted-foreground">
                    {appt.patients.contact}
                  </span>
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(appt.start_datetime), 'PPP p')}
                {appt.reason && (
                  <span className="block text-xs mt-0.5 italic">{appt.reason}</span>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() =>
                  updateMutation.mutate({
                    id: appt.appointment_id,
                    status: 'confirm',
                  })
                }
                disabled={updateMutation.isPending}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  updateMutation.mutate({
                    id: appt.appointment_id,
                    status: 'cancel',
                  })
                }
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
