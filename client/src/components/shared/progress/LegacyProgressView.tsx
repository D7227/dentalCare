
import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LegacyProgressViewProps {
  steps: any[];
  className?: string;
}

const LegacyProgressView = ({ steps, className }: LegacyProgressViewProps) => {
  return (
    <div className={cn('space-y-4', className)}>
      {steps.map((step) => (
        <div key={step.id} className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {step.status === 'completed' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : step.status === 'current' ? (
              <Clock className="h-5 w-5 text-blue-600 animate-pulse" />
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
            )}
          </div>
          <div className="flex-1">
            <p className={cn(
              'text-sm font-medium',
              step.status === 'completed' ? 'text-green-600' :
              step.status === 'current' ? 'text-blue-600' :
              'text-gray-400'
            )}>
              {step.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LegacyProgressView;
