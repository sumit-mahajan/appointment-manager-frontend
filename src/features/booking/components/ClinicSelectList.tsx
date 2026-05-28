import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Building2, ChevronRight, MapPin } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { API_BASE_URL, API_ENDPOINTS } from '@/shared/constants/api.constants'
import { ROUTES } from '@/shared/constants/app.constants'

export interface PublicClinicSummary {
  clinic_id: string
  name: string
  address: string | null
  contact: string | null
}

export function ClinicSelectList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-clinics'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PUBLIC_CLINICS}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to load clinics')
      return json.data as PublicClinicSummary[]
    },
  })

  if (isLoading) {
    return <p className="text-center text-muted-foreground py-8">Loading clinics…</p>
  }

  if (isError) {
    return (
      <p className="text-center text-destructive py-8">
        Could not load clinics. Please try again later.
      </p>
    )
  }

  if (!data?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No clinics available</CardTitle>
          <CardDescription>
            There are no clinics accepting online bookings right now.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {data.map((clinic) => (
        <Link
          key={clinic.clinic_id}
          to={`${ROUTES.BOOK}?clinic=${clinic.clinic_id}`}
          className="block group"
        >
          <Card className="transition-colors hover:border-primary/50 hover:bg-muted/30">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {clinic.name}
                </p>
                {clinic.address && (
                  <p className="mt-0.5 flex items-start gap-1 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{clinic.address}</span>
                  </p>
                )}
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
