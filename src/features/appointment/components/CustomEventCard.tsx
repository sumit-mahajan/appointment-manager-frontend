import { CalendarEvent } from '../types/appointment.types'
import { cn } from '@/shared/lib/utils'

interface CustomEventCardProps {
  event: CalendarEvent
}

export const CustomEventCard = ({ event }: CustomEventCardProps) => {
  const { title, duration, status, isEmergency, bookedVia } = event
  const isPatientBooking = bookedVia === 'patient'

  const getStatusColor = () => {
    switch (status) {
      case 'confirm':
        return 'bg-green-100 border-green-500 text-green-900 dark:bg-green-950 dark:text-green-100'
      case 'cancel':
        return 'bg-gray-100 border-gray-400 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
      case 'pending':
      default:
        return isPatientBooking
          ? 'bg-blue-50 border-blue-500 text-blue-900 dark:bg-blue-950 dark:text-blue-100'
          : 'bg-yellow-100 border-yellow-500 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100'
    }
  }

  return (
    <div
      className={cn(
        'h-full p-1.5 rounded border-l-4 text-xs overflow-hidden cursor-pointer transition-all hover:shadow-md',
        getStatusColor(),
        isEmergency && 'ring-2 ring-red-500 ring-offset-1'
      )}
    >
      <div className="flex flex-col gap-0.5 h-full min-w-0">
        <div className="flex items-center justify-between gap-1">
          <div className="font-semibold truncate flex-1 min-w-0">{title}</div>
          <div className="text-[10px] opacity-80 flex-shrink-0 whitespace-nowrap">{duration}m</div>
        </div>
        {isPatientBooking && (
          <span className="inline-flex w-fit rounded px-1 py-0 text-[9px] font-semibold uppercase tracking-wide bg-blue-600/15 text-blue-800 dark:text-blue-200">
            Patient
          </span>
        )}
      </div>
    </div>
  )
}
