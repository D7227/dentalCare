
import React from 'react';
import { cn } from '@/lib/utils';
import { ProgressViewProps } from './types';
import { Check } from 'lucide-react';

const DesktopProgressView = ({ stages, progressPercentage }: ProgressViewProps) => {
  return (
    <div className="hidden lg:block">
      <div className="relative">
        {/* Progress Line Background */}
        <div className="absolute top-12 left-12 right-12 h-1 bg-gray-200 rounded-full z-0">
          <div 
            className="h-full bg-[#11AB93] rounded-full transition-all duration-700 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {/* Stages Grid */}
        <div className="grid grid-cols-9 gap-2 relative z-10">
          {stages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div key={stage.id} className="flex flex-col items-center">
                {/* Icon Circle */}
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm",
                  stage.status === 'completed' 
                    ? "bg-[#11AB93] border-[#11AB93] text-white" 
                    : stage.status === 'current'
                    ? "bg-[#11AB93] border-[#11AB93] text-white shadow-lg ring-4 ring-[#11AB93]/20"
                    : "bg-white border-gray-300 text-gray-400"
                )}>
                  {stage.status === 'completed' ? (
                    <Check className="h-5 w-5" fill="currentColor" />
                  ) : (
                    <Icon className={cn("h-5 w-5", stage.status === 'current' && "fill-current")} />
                  )}
                </div>
                
                {/* Stage Info */}
                <div className="mt-4 text-center max-w-[120px]">
                  <p className={cn(
                    "text-sm font-semibold mb-1",
                    stage.status === 'completed' ? 'text-[#11AB93]' :
                    stage.status === 'current' ? 'text-[#11AB93]' :
                    'text-gray-500'
                  )}>
                    {stage.title}
                  </p>
                  
                  {stage.timestamp && (
                    <p className="text-xs text-gray-600 mb-2 font-medium">{stage.timestamp}</p>
                  )}
                  
                  <div className="space-y-1">
                    <p className="text-xs text-gray-700 font-medium">{stage.role}</p>
                    <p className="text-xs text-gray-500">{stage.person}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DesktopProgressView;
