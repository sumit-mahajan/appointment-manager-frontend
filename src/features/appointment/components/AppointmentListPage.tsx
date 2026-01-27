import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { MainLayout } from '@/shared/components/layout/MainLayout'
import { AppointmentCard } from './AppointmentCard'
import { AppointmentDrawer } from './AppointmentDrawer'
import { useAppointments } from '../hooks/useAppointments'
import type { AppointmentWithPatient } from '../types/appointment.types'
import { ROUTES } from '@/shared/constants/app.constants'

export const AppointmentListPage = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithPatient | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const { data: appointmentsResponse, isLoading, isError, error } = useAppointments()
  
  const appointments = appointmentsResponse?.data || []

  const handleCardClick = (appointment: AppointmentWithPatient) => {
    setSelectedAppointment(appointment)
    setDrawerOpen(true)
  }

  const handleDrawerClose = (open: boolean) => {
    setDrawerOpen(open)
    if (!open) {
      // Clear selected appointment after drawer closes
      setTimeout(() => setSelectedAppointment(null), 300)
    }
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Appointments</h1>
            <p className="text-muted-foreground mt-1">Manage your clinic appointments</p>
          </div>
          <Link to={ROUTES.APPOINTMENTS_NEW}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Book New
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <p className="text-red-600 font-medium">Failed to load appointments</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {error instanceof Error ? error.message : 'An error occurred'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !isError && appointments.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>No Appointments Yet</CardTitle>
              <CardDescription>
                Get started by booking your first appointment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={ROUTES.APPOINTMENTS_NEW}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Book Your First Appointment
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Appointments List */}
        {!isLoading && !isError && appointments.length > 0 && (
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.appointment_id}
                appointment={appointment}
                onClick={() => handleCardClick(appointment)}
              />
            ))}
          </div>
        )}

        {/* Appointment Drawer */}
        <AppointmentDrawer
          open={drawerOpen}
          onOpenChange={handleDrawerClose}
          appointment={selectedAppointment}
        />
      </div>
    </MainLayout>
  )
}
