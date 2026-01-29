import { useState, useMemo, useEffect } from 'react'
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { AppointmentWithPatient, CalendarEvent } from '../types/appointment.types'
import { Button } from '@/shared/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './calendar-styles.css'
import { CustomEventCard } from './CustomEventCard.tsx'

// Set up the date-fns localizer
const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

interface CalendarViewProps {
  appointments: AppointmentWithPatient[]
  onEventClick: (appointment: AppointmentWithPatient) => void
}

// Custom toolbar component
const CustomToolbar = ({ 
  label, 
  onNavigate, 
  view, 
  onView 
}: {
  label: string
  onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY') => void
  view: View
  onView: (view: View) => void
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 pb-4 border-b">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigate('PREV')}
          className="flex-shrink-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          onClick={() => onNavigate('TODAY')}
          size="sm"
          className="flex-shrink-0"
        >
          Today
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigate('NEXT')}
          className="flex-shrink-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <h2 className="text-base sm:text-xl font-semibold ml-2 sm:ml-4 truncate">{label}</h2>
      </div>
      <div className="flex gap-2 w-full sm:w-auto justify-end">
        <Button
          variant={view === 'day' ? 'default' : 'outline'}
          onClick={() => onView('day')}
          size="sm"
        >
          Day
        </Button>
        <Button
          variant={view === 'week' ? 'default' : 'outline'}
          onClick={() => onView('week')}
          size="sm"
        >
          Week
        </Button>
      </div>
    </div>
  )
}

export const CalendarView = ({ appointments, onEventClick }: CalendarViewProps) => {
  // Detect mobile screen and set default view accordingly
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const [view, setView] = useState<View>(isMobile ? 'day' : 'week')
  const [date, setDate] = useState(new Date())
  
  // Update view when screen size changes
  useEffect(() => {
    setView(isMobile ? 'day' : 'week')
  }, [isMobile])

  // Transform appointments to calendar events
  const events = useMemo<CalendarEvent[]>(() => {
    return appointments.map(apt => {
      const startDate = new Date(apt.start_datetime)
      const endDate = apt.end_datetime 
        ? new Date(apt.end_datetime)
        : new Date(startDate.getTime() + apt.duration_in_minutes * 60000)

      return {
        id: apt.appointment_id,
        title: apt.patients?.name || 'Unknown Patient',
        start: startDate,
        end: endDate,
        resource: apt,
        duration: apt.duration_in_minutes,
        status: apt.status || 'pending',
        isEmergency: apt.is_emergency || false,
      }
    })
  }, [appointments])

  const handleSelectEvent = (event: CalendarEvent) => {
    onEventClick(event.resource)
  }

  const handleNavigate = (newDate: Date) => {
    setDate(newDate)
  }

  const handleViewChange = (newView: View) => {
    setView(newView)
  }

  return (
    <div className="calendar-container h-[calc(100vh-12rem)] bg-card rounded-lg border p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={handleViewChange}
        date={date}
        onNavigate={handleNavigate}
        views={['day', 'week']}
        onSelectEvent={handleSelectEvent}
        components={{
          toolbar: CustomToolbar,
          event: CustomEventCard,
        }}
        step={15}
        timeslots={4}
        min={new Date(2026, 0, 1, 8, 0, 0)}
        max={new Date(2026, 0, 1, 20, 0, 0)}
        scrollToTime={new Date(2026, 0, 1, 8, 0, 0)}
        showMultiDayTimes
        defaultView={isMobile ? 'day' : 'week'}
        popup
        selectable={false}
      />
    </div>
  )
}
