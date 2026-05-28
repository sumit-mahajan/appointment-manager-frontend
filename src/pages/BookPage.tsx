import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { MainLayout } from '@/shared/components/layout/MainLayout'
import { PublicBookingForm } from '@/features/booking/components/PublicBookingForm'
import { ClinicSelectList } from '@/features/booking/components/ClinicSelectList'
import { API_BASE_URL, API_ENDPOINTS } from '@/shared/constants/api.constants'
import { ROUTES } from '@/shared/constants/app.constants'

export default function BookPage() {
  const [params] = useSearchParams()
  const clinicId = params.get('clinic') ?? ''

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-clinic', clinicId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PUBLIC_CLINIC(clinicId)}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Clinic not found')
      return json.data as {
        clinic_id: string
        name: string
        address: string | null
        contact: string | null
      }
    },
    enabled: !!clinicId,
  })

  return (
    <MainLayout>
      <div className="mx-auto max-w-lg px-4 py-12">
        {!clinicId ? (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold tracking-tight">Book an appointment</h1>
              <p className="mt-2 text-muted-foreground">
                Choose a clinic to continue
              </p>
            </div>
            <ClinicSelectList />
          </>
        ) : (
          <>
            <Link
              to={ROUTES.BOOK}
              className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              All clinics
            </Link>

            {isLoading && (
              <p className="text-center text-muted-foreground">Loading…</p>
            )}
            {isError && (
              <div className="text-center space-y-4">
                <p className="text-destructive">Clinic not found.</p>
                <Link to={ROUTES.BOOK} className="text-sm text-primary hover:underline">
                  Back to clinic list
                </Link>
              </div>
            )}
            {data && (
              <>
                <h1 className="mb-2 text-2xl font-bold">{data.name}</h1>
                {data.address && (
                  <p className="mb-6 text-sm text-muted-foreground">{data.address}</p>
                )}
                <PublicBookingForm
                  clinicId={data.clinic_id}
                  clinicContact={data.contact}
                />
              </>
            )}
          </>
        )}
      </div>
    </MainLayout>
  )
}
