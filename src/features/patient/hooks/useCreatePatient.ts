import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants/app.constants'
import { patientService } from '../services/patient.service'
import type { CreatePatientRequest } from '../types/patient.types'

export const useCreatePatient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePatientRequest) => patientService.createPatient(data),
    onSuccess: () => {
      // Invalidate patient queries to refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PATIENTS })
    },
  })
}
