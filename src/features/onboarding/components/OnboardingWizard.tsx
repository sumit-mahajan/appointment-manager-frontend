import { useState } from 'react'
import { Building2, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { APP_NAME } from '@/shared/constants/app.constants'
import { StepIndicator } from './StepIndicator'
import { CreateClinicStep } from './CreateClinicStep'
import { JoinClinicStep } from './JoinClinicStep'

type WizardStep = 'choice' | 'create' | 'join'

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('choice')

  const getStepNumber = () => {
    switch (currentStep) {
      case 'choice':
        return 1
      case 'create':
      case 'join':
        return 2
      default:
        return 1
    }
  }

  if (currentStep === 'create') {
    return (
      <div className="space-y-8">
        <StepIndicator
          currentStep={getStepNumber()}
          totalSteps={2}
          steps={['Choose', 'Setup']}
        />
        <CreateClinicStep onBack={() => setCurrentStep('choice')} />
      </div>
    )
  }

  if (currentStep === 'join') {
    return (
      <div className="space-y-8">
        <StepIndicator
          currentStep={getStepNumber()}
          totalSteps={2}
          steps={['Choose', 'Setup']}
        />
        <JoinClinicStep onBack={() => setCurrentStep('choice')} />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <StepIndicator
        currentStep={getStepNumber()}
        totalSteps={2}
        steps={['Choose', 'Setup']}
      />
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to {APP_NAME}</CardTitle>
          <CardDescription>
            Let's get you set up. Choose how you'd like to proceed:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <button
            onClick={() => setCurrentStep('create')}
            className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group text-left"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary/10 group-hover:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  Create New Clinic
                </h3>
                <p className="text-sm text-gray-600">
                  Start your own clinic and become the owner. You'll have full control over settings and staff.
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setCurrentStep('join')}
            className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group text-left"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary/10 group-hover:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  Join Existing Clinic
                </h3>
                <p className="text-sm text-gray-600">
                  Search for and request to join an existing clinic as a staff member.
                </p>
              </div>
            </div>
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
