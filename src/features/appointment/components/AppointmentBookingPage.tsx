import { useNavigate } from 'react-router-dom'
import { toast } from '@/shared/lib/toast'
import { MainLayout } from '@/shared/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { AppointmentBookingForm } from './AppointmentBookingForm'
import { ROUTES } from '@/shared/constants/app.constants'

export function AppointmentBookingPage() {
  const navigate = useNavigate()

  const handleSuccess = () => {
    toast.success('Appointment booked successfully!', {
      description: 'The appointment has been added to your schedule.',
      duration: 3000,
    })
    navigate(ROUTES.DASHBOARD)
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Book Appointment</CardTitle>
            <CardDescription>
              Schedule a new appointment for a patient
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AppointmentBookingForm onSuccess={handleSuccess} />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
