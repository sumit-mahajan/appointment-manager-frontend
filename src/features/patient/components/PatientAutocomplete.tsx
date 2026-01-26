import { useState, useRef, useEffect } from 'react'
import { Search, Loader2, Plus, CheckCircle2 } from 'lucide-react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useSearchPatients } from '../hooks/useSearchPatients'
import { Input } from '@/shared/components/ui/input'
import { cn } from '@/shared/lib/utils'
import type { Patient } from '../types/patient.types'

interface PatientAutocompleteProps {
  value: Patient | null
  onChange: (patient: Patient | null) => void
  onCreateClick: (query: string) => void
}

export function PatientAutocomplete({ value, onChange, onCreateClick }: PatientAutocompleteProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)
  
  const debouncedSearch = useDebounce(searchQuery, 500)
  const { data: searchResults, isLoading } = useSearchPatients(debouncedSearch)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Update input value when patient is selected externally
  useEffect(() => {
    if (value) {
      setInputValue(value.name)
      setSearchQuery('')
      setShowDropdown(false)
    }
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setInputValue(query)
    setSearchQuery(query)
    setShowDropdown(true)
    
    // Clear selected patient if user starts typing again
    if (value) {
      onChange(null)
    }
  }

  const handlePatientSelect = (patient: Patient) => {
    onChange(patient)
    setInputValue(patient.name)
    setSearchQuery('')
    setShowDropdown(false)
  }

  const handleCreateNew = () => {
    setShowDropdown(false)
    onCreateClick(searchQuery)
  }

  const patients = searchResults?.data || []
  const hasResults = patients.length > 0
  const showResults = showDropdown && debouncedSearch.length >= 2

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search patient by name or phone..."
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          className={cn("pl-10", value && "pr-10")}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        )}
        {value && !isLoading && (
          <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-600" />
        )}
      </div>

      {showResults && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {hasResults ? (
            <div className="py-1">
              {patients.map((patient) => (
                <button
                  key={patient.patient_id}
                  type="button"
                  onClick={() => handlePatientSelect(patient)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                >
                  <div className="font-medium text-gray-900">{patient.name}</div>
                  {patient.contact && (
                    <div className="text-sm text-gray-500">{patient.contact}</div>
                  )}
                </button>
              ))}
            </div>
          ) : !isLoading ? (
            <div className="py-4 px-4 text-center">
              <p className="text-sm text-gray-500 mb-3">No patients found</p>
              <button
                type="button"
                onClick={handleCreateNew}
                className={cn(
                  "inline-flex items-center space-x-2 px-4 py-2 rounded-md",
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                  "text-sm font-medium transition-colors"
                )}
              >
                <Plus className="h-4 w-4" />
                <span>Create New Patient</span>
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
