import { create } from 'zustand'

type OnboardingStep = 'choice' | 'create' | 'join'

interface OnboardingState {
  currentStep: OnboardingStep
  selectedClinicId: string | null

  setStep: (step: OnboardingStep) => void
  setSelectedClinic: (clinicId: string | null) => void
  reset: () => void
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  currentStep: 'choice',
  selectedClinicId: null,

  setStep: (step) => set({ currentStep: step }),
  setSelectedClinic: (clinicId) => set({ selectedClinicId: clinicId }),
  reset: () => set({ currentStep: 'choice', selectedClinicId: null }),
}))
