import { CalendarEvent } from '../types/appointment.types'
import { cn } from '@/shared/lib/utils'

interface CustomEventCardProps {
  event: CalendarEvent
}

export const CustomEventCard = ({ event }: CustomEventCardProps) => {
  const { title, duration, status, isEmergency } = event

  // Status-based color classes
  const getStatusColor = () => {
    switch (status) {
      case 'confirm':
        return 'bg-green-100 border-green-500 text-green-900 dark:bg-green-950 dark:text-green-100'
      case 'cancel':
        return 'bg-gray-100 border-gray-400 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
      case 'pending':
      default:
        return 'bg-yellow-100 border-yellow-500 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100'
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
      <div className="flex items-center justify-between gap-1 h-full">
        <div className="font-semibold truncate flex-1 min-w-0">{title}</div>
        <div className="text-[10px] opacity-80 flex-shrink-0 whitespace-nowrap">{duration}m</div>
      </div>
    </div>
  )
}
