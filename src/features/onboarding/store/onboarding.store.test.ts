import { describe, it, expect, beforeEach } from 'vitest'
import { useOnboardingStore } from './onboarding.store'

describe('onboardingStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useOnboardingStore.getState().reset()
  })

  describe('initial state', () => {
    it('should initialize with choice step', () => {
      const state = useOnboardingStore.getState()
      expect(state.currentStep).toBe('choice')
    })

    it('should initialize with null selected clinic', () => {
      const state = useOnboardingStore.getState()
      expect(state.selectedClinicId).toBeNull()
    })
  })

  describe('setStep', () => {
    it('should update current step to create', () => {
      const { setStep } = useOnboardingStore.getState()

      setStep('create')

      const state = useOnboardingStore.getState()
      expect(state.currentStep).toBe('create')
    })

    it('should update current step to join', () => {
      const { setStep } = useOnboardingStore.getState()

      setStep('join')

      const state = useOnboardingStore.getState()
      expect(state.currentStep).toBe('join')
    })

    it('should update current step back to choice', () => {
      const { setStep } = useOnboardingStore.getState()

      setStep('create')
      setStep('choice')

      const state = useOnboardingStore.getState()
      expect(state.currentStep).toBe('choice')
    })

    it('should allow multiple step changes', () => {
      const { setStep } = useOnboardingStore.getState()

      setStep('create')
      expect(useOnboardingStore.getState().currentStep).toBe('create')

      setStep('join')
      expect(useOnboardingStore.getState().currentStep).toBe('join')

      setStep('choice')
      expect(useOnboardingStore.getState().currentStep).toBe('choice')
    })
  })

  describe('setSelectedClinic', () => {
    it('should set selected clinic ID', () => {
      const { setSelectedClinic } = useOnboardingStore.getState()
      const clinicId = 'clinic-123'

      setSelectedClinic(clinicId)

      const state = useOnboardingStore.getState()
      expect(state.selectedClinicId).toBe(clinicId)
    })

    it('should update selected clinic ID', () => {
      const { setSelectedClinic } = useOnboardingStore.getState()

      setSelectedClinic('clinic-1')
      expect(useOnboardingStore.getState().selectedClinicId).toBe('clinic-1')

      setSelectedClinic('clinic-2')
      expect(useOnboardingStore.getState().selectedClinicId).toBe('clinic-2')
    })

    it('should set selected clinic to null', () => {
      const { setSelectedClinic } = useOnboardingStore.getState()

      setSelectedClinic('clinic-1')
      setSelectedClinic(null)

      const state = useOnboardingStore.getState()
      expect(state.selectedClinicId).toBeNull()
    })

    it('should maintain selected clinic across step changes', () => {
      const { setStep, setSelectedClinic } = useOnboardingStore.getState()
      const clinicId = 'clinic-123'

      setSelectedClinic(clinicId)
      setStep('join')

      const state = useOnboardingStore.getState()
      expect(state.selectedClinicId).toBe(clinicId)
      expect(state.currentStep).toBe('join')
    })
  })

  describe('reset', () => {
    it('should reset to initial state', () => {
      const { setStep, setSelectedClinic, reset } = useOnboardingStore.getState()

      // Change state
      setStep('create')
      setSelectedClinic('clinic-123')

      // Verify state changed
      let state = useOnboardingStore.getState()
      expect(state.currentStep).toBe('create')
      expect(state.selectedClinicId).toBe('clinic-123')

      // Reset
      reset()

      // Verify state reset
      state = useOnboardingStore.getState()
      expect(state.currentStep).toBe('choice')
      expect(state.selectedClinicId).toBeNull()
    })

    it('should reset from join step', () => {
      const { setStep, setSelectedClinic, reset } = useOnboardingStore.getState()

      setStep('join')
      setSelectedClinic('clinic-456')

      reset()

      const state = useOnboardingStore.getState()
      expect(state.currentStep).toBe('choice')
      expect(state.selectedClinicId).toBeNull()
    })

    it('should work when already in initial state', () => {
      const { reset } = useOnboardingStore.getState()

      reset()

      const state = useOnboardingStore.getState()
      expect(state.currentStep).toBe('choice')
      expect(state.selectedClinicId).toBeNull()
    })
  })

  describe('integration scenarios', () => {
    it('should handle complete onboarding flow for creating clinic', () => {
      const { setStep, reset } = useOnboardingStore.getState()

      // Start at choice
      expect(useOnboardingStore.getState().currentStep).toBe('choice')

      // User chooses to create clinic
      setStep('create')
      expect(useOnboardingStore.getState().currentStep).toBe('create')

      // Complete onboarding
      reset()
      expect(useOnboardingStore.getState().currentStep).toBe('choice')
    })

    it('should handle complete onboarding flow for joining clinic', () => {
      const { setStep, setSelectedClinic, reset } = useOnboardingStore.getState()

      // User chooses to join clinic
      setStep('join')

      // User selects a clinic
      setSelectedClinic('clinic-789')

      const state = useOnboardingStore.getState()
      expect(state.currentStep).toBe('join')
      expect(state.selectedClinicId).toBe('clinic-789')

      // Complete onboarding
      reset()

      const finalState = useOnboardingStore.getState()
      expect(finalState.currentStep).toBe('choice')
      expect(finalState.selectedClinicId).toBeNull()
    })

    it('should handle user changing mind mid-flow', () => {
      const { setStep, setSelectedClinic } = useOnboardingStore.getState()

      // User starts with join
      setStep('join')
      setSelectedClinic('clinic-1')

      // User changes mind and goes back to choice
      setStep('choice')

      // Selected clinic should still be set
      expect(useOnboardingStore.getState().selectedClinicId).toBe('clinic-1')

      // User decides to create instead
      setStep('create')

      const state = useOnboardingStore.getState()
      expect(state.currentStep).toBe('create')
      expect(state.selectedClinicId).toBe('clinic-1') // Still preserved
    })
  })
})
