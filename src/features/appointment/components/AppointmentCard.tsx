import { Card } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Clock, AlertCircle } from 'lucide-react'
import type { AppointmentWithPatient } from '../types/appointment.types'
import { format } from 'date-fns'

interface AppointmentCardProps {
  appointment: AppointmentWithPatient
  onClick: () => void
}

export const AppointmentCard = ({ appointment, onClick }: AppointmentCardProps) => {
  const patientName = appointment.patients?.name || 'Unknown Patient'
  
  const formattedDateTime = format(
    new Date(appointment.start_datetime),
    "EEE, MMM d, yyyy 'at' h:mm a"
  )

  const getStatusBadgeVariant = (status: string | null) => {
    switch (status) {
      case 'confirm':
        return 'default' // green
      case 'cancel':
        return 'destructive' // red
      case 'pending':
      default:
        return 'secondary' // yellow/gray
    }
  }

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case 'confirm':
        return 'Confirmed'
      case 'cancel':
        return 'Cancelled'
      case 'pending':
      default:
        return 'Pending'
    }
  }

  return (
    <Card 
      className="p-4 cursor-pointer hover:bg-accent transition-colors"
      onClick={onClick}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{patientName}</h3>
            <p className="text-sm text-muted-foreground">{formattedDateTime}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {appointment.duration_in_minutes} min
          </Badge>
          
          <Badge variant={getStatusBadgeVariant(appointment.status)}>
            {getStatusLabel(appointment.status)}
          </Badge>
          
          {appointment.is_emergency && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Emergency
            </Badge>
          )}
        </div>
      </div>
    </Card>
  )
}
