import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { API_BASE_URL, API_ENDPOINTS } from '@/shared/constants/api.constants'
import { toast } from 'sonner'

function buildTimeOptions(): string[] {
  const slots: string[] = []
  for (let hour = 8; hour <= 18; hour++) {
    for (const minute of [0, 30]) {
      if (hour === 18 && minute === 30) break
      slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`)
    }
  }
  return slots
}

const TIME_SLOTS = buildTimeOptions()

interface PublicBookingFormProps {
  clinicId: string
  clinicContact?: string | null
}

export function PublicBookingForm({ clinicId, clinicContact }: PublicBookingFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [preferredDate, setPreferredDate] = useState('')
  const [preferredTime, setPreferredTime] = useState('09:00')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PUBLIC_BOOK}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinicId,
          name: name.trim(),
          phone: phone.trim(),
          preferredDate,
          preferredTime,
          notes: notes.trim() || undefined,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Booking failed')
      return json
    },
    onSuccess: () => {
      setSubmitted(true)
      toast.success('Request submitted — the clinic will confirm shortly.')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  if (submitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Request received</CardTitle>
          <CardDescription>
            Your appointment request is pending. The clinic will contact you at{' '}
            {phone} to confirm.
            {clinicContact && (
              <>
                {' '}
                For changes or another booking, call{' '}
                <a href={`tel:${clinicContact}`} className="font-medium text-primary">
                  {clinicContact}
                </a>
                .
              </>
            )}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book an appointment</CardTitle>
        <CardDescription>
          One appointment per patient online.
          {clinicContact ? (
            <>
              {' '}
              To reschedule, cancel, or book again, call{' '}
              <a href={`tel:${clinicContact}`} className="font-medium text-primary">
                {clinicContact}
              </a>
              .
            </>
          ) : (
            ' To change an existing booking, please call the clinic.'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            mutation.mutate()
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 000 0000"
              required
            />
            <p className="text-xs text-muted-foreground">
              We match you by phone at this clinic only. You can hold one future
              appointment at a time.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Preferred date</Label>
              <Input
                id="date"
                type="date"
                value={preferredDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setPreferredDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Preferred time</Label>
              <select
                id="time"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                required
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">
              Notes <span className="text-muted-foreground">(optional)</span>
            </Label>
            <textarea
              id="notes"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything the clinic should know before your visit"
              maxLength={500}
            />
          </div>

          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? 'Submitting…' : 'Request appointment'}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Requests are reviewed by the clinic before confirmation. 30-minute slots.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
