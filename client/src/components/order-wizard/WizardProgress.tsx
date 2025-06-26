
import React from 'react';
import { cn } from '@/lib/utils';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface WizardProgressProps {
  steps: Step[];
  currentStep: number;
}

const WizardProgress = ({ steps, currentStep }: WizardProgressProps) => {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.number;
        const isCurrent = currentStep === step.number;
        const isUpcoming = currentStep < step.number;

        return (
          <div key={step.number} className="flex items-center">
            {/* Step Number Circle */}
            <div className="flex-shrink-0 relative">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all duration-200",
                isCompleted 
                  ? "bg-[#11AB93] border-[#11AB93] text-white" 
                  : isCurrent
                  ? "bg-[#11AB93] border-[#11AB93] text-white ring-2 ring-[#11AB93]/20"
                  : "bg-white border-gray-300 text-gray-600"
              )}>
                <span className="text-xs font-semibold">{step.number + 1}</span>
              </div>
              
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className={cn(
                  "absolute top-8 left-4 w-px h-8 transition-all duration-200",
                  isCompleted ? "bg-[#11AB93]" : "bg-gray-200"
                )} />
              )}
            </div>

            {/* Step Content */}
            <div className="ml-3 min-w-0 flex-1">
              <p className={cn(
                "text-sm font-medium transition-colors duration-200",
                isCompleted ? "text-[#11AB93]" :
                isCurrent ? "text-[#11AB93]" :
                "text-gray-600"
              )}>
                {step.title}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WizardProgress;
