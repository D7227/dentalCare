
import React from 'react';
import { cn } from '@/lib/utils';
import { ProgressViewProps } from './types';
import { Check } from 'lucide-react';

const MobileProgressView = ({ stages }: ProgressViewProps) => {
  return (
    <div className="block md:hidden">
      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-4 min-w-max px-2">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <div key={stage.id} className="flex items-center min-w-0">
                <div className="flex flex-col items-center min-w-[80px]">
                  {/* Icon Circle */}
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm",
                    stage.status === 'completed' 
                      ? "bg-[#11AB93] border-[#11AB93] text-white" 
                      : stage.status === 'current'
                      ? "bg-[#11AB93] border-[#11AB93] text-white shadow-lg ring-2 ring-[#11AB93]/20"
                      : "bg-white border-gray-300 text-gray-400"
                  )}>
                    {stage.status === 'completed' ? (
                      <Check className="h-3 w-3" fill="currentColor" />
                    ) : (
                      <Icon className={cn("h-3 w-3", stage.status === 'current' && "fill-current")} />
                    )}
                  </div>
                  
                  {/* Stage Info */}
                  <div className="mt-2 text-center">
                    <p className={cn(
                      "text-xs font-semibold mb-1 leading-tight",
                      stage.status === 'completed' ? 'text-[#11AB93]' :
                      stage.status === 'current' ? 'text-[#11AB93]' :
                      'text-gray-500'
                    )}>
                      {stage.title}
                    </p>
                    
                    {stage.timestamp && (
                      <p className="text-xs text-gray-600 mb-1 font-medium leading-tight">{stage.timestamp}</p>
                    )}
                    
                    <div className="space-y-0.5">
                      <p className="text-xs text-gray-700 font-medium leading-tight">{stage.role}</p>
                      <p className="text-xs text-gray-500 leading-tight">{stage.person}</p>
                    </div>
                  </div>
                </div>
                
                {/* Connection Arrow */}
                {index < stages.length - 1 && (
                  <div className="flex items-center mx-2">
                    <div className={cn(
                      "w-6 h-0.5 transition-all duration-300",
                      stage.status === 'completed' ? "bg-[#11AB93]" : "bg-gray-200"
                    )} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Scrollbar hide styles */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default MobileProgressView;
