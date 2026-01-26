import { useState } from 'react'
import { Search, Building2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useSearchClinics } from '../hooks/useSearchClinics'
import { useJoinClinic } from '../hooks/useJoinClinic'

interface JoinClinicStepProps {
  onBack: () => void
}

export function JoinClinicStep({ onBack }: JoinClinicStepProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [requestSent, setRequestSent] = useState(false)
  const debouncedSearch = useDebounce(searchQuery, 500)

  const { data: searchResults, isLoading: isSearching } = useSearchClinics(debouncedSearch)
  const { mutate: joinClinic, isPending: isJoining, error: joinError } = useJoinClinic()

  const handleJoin = (clinicId: string) => {
    joinClinic(clinicId, {
      onSuccess: () => {
        setRequestSent(true)
      },
    })
  }

  if (requestSent) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Request Sent!</CardTitle>
          <CardDescription>
            Your join request has been submitted
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-center text-gray-600">
            The clinic owner will review your request. You'll be notified once it's approved.
          </p>
          <Button variant="outline" className="w-full" onClick={onBack}>
            Back to Options
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Search className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Join Existing Clinic</CardTitle>
        <CardDescription>
          Search for and request to join a clinic
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {joinError && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{(joinError as any).message || 'Failed to send join request.'}</p>
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for clinics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="min-h-[200px] space-y-2">
          {isSearching && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {!isSearching && searchQuery.length > 0 && searchQuery.length < 2 && (
            <p className="text-sm text-gray-500 text-center py-8">
              Type at least 2 characters to search
            </p>
          )}

          {!isSearching && debouncedSearch.length >= 2 && searchResults?.data && (
            <>
              {searchResults.data.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  No clinics found matching "{debouncedSearch}"
                </p>
              ) : (
                <div className="space-y-2">
                  {searchResults.data.map((clinic) => (
                    <div
                      key={clinic.id}
                      className="border rounded-lg p-4 hover:border-primary transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {clinic.name}
                            </h3>
                            {clinic.description && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {clinic.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleJoin(clinic.id)}
                          disabled={isJoining}
                          className="ml-2 flex-shrink-0"
                        >
                          Join
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <Button variant="outline" className="w-full" onClick={onBack}>
          Back
        </Button>
      </CardContent>
    </Card>
  )
}
