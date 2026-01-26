import { Check } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  steps: string[]
}

export function StepIndicator({ currentStep, totalSteps, steps }: StepIndicatorProps) {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep

          return (
            <div key={stepNumber} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors',
                    isCompleted && 'bg-primary border-primary text-white',
                    isCurrent && 'border-primary text-primary bg-primary/10',
                    !isCompleted && !isCurrent && 'border-gray-300 text-gray-400'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="font-semibold">{stepNumber}</span>
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs mt-2 font-medium',
                    isCurrent ? 'text-primary' : 'text-gray-500'
                  )}
                >
                  {step}
                </span>
              </div>
              {stepNumber < totalSteps && (
                <div
                  className={cn(
                    'h-0.5 flex-1 mx-2 transition-colors',
                    stepNumber < currentStep ? 'bg-primary' : 'bg-gray-300'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
