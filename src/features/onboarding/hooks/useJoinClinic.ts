import { useMutation } from '@tanstack/react-query'
import { clinicService } from '../services/clinic.service'

export function useJoinClinic() {
  return useMutation({
    mutationFn: (clinicId: string) => clinicService.joinClinic(clinicId),
  })
}
