import React, { useEffect, useState } from 'react';
import { Activity, Check, Package, ClipboardCheck, Wrench, ThumbsUp, Truck, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LifecycleStage {
  id: string;
  title: string;
  date?: string;
  time?: string;
  person?: string;
  role?: string;
  icon: React.ReactNode;
  status: 'completed' | 'current' | 'pending';
}

interface OrderLifecycleProgressProps {
  order: any;
}

const OrderLifecycleProgress = ({ order }: OrderLifecycleProgressProps) => {
  const [stages, setStages] = useState<LifecycleStage[]>([]);

  useEffect(() => {
    async function fetchStages() {
      const res = await fetch('/api/lifecycle-stages');
      const data = await res.json();
      // Map API data to LifecycleStage type and set status
      const mappedStages = data.map((stage: any, index: number) => {
        let status: 'completed' | 'current' | 'pending' = 'pending';
        const normalizedStatus = order.status?.toLowerCase() || '';
        // Example status logic (customize as needed)
        if (normalizedStatus === 'completed' || normalizedStatus === 'delivered') {
          status = 'completed';
        } else if (index === 0) {
          status = 'current';
        }
        return {
          id: stage.id,
          title: stage.title,
          date: stage.date,
          time: stage.time,
          person: stage.person,
          role: stage.role,
          icon: <span>{stage.icon}</span>, // You may want to map icon string to a React component
          status,
        };
      });
      setStages(mappedStages);
    }
    fetchStages();
  }, [order.status]);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-teal-600" />
        <h3 className="text-xl font-semibold text-gray-900">Order Lifecycle Progress</h3>
      </div>
      
      <div className="relative">
        {/* Progress visualization */}
        <div className="relative h-10 mb-6">
          {/* Progress line - dashed teal */}
          <div className="absolute top-5 left-5 right-5 h-0.5 border-t border-dashed border-teal-600"></div>
          
          {/* Stage circles positioned absolutely */}
          <div className="relative h-10">
            {stages.map((stage, index) => {
              const leftPosition = `${(index / (stages.length - 1)) * 100}%`;
              return (
                <div 
                  key={stage.id} 
                  className="absolute transform -translate-x-1/2" 
                  style={{ left: leftPosition }}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2",
                    stage.status === 'completed' && "bg-teal-600 border-teal-600",
                    stage.status === 'current' && "bg-white border-teal-600",
                    stage.status === 'pending' && "bg-gray-300 border-gray-300"
                  )}>
                    {stage.status === 'completed' ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <div className={cn(
                        "w-5 h-5 flex items-center justify-center",
                        stage.status === 'current' ? "text-teal-600" : "text-white"
                      )}>
                        {stage.icon}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Stage information */}
        <div className="flex justify-between">
          {stages.map((stage, index) => (
            <div key={`${stage.id}-info`} className="flex flex-col items-center text-center" style={{ flex: '1 1 0%' }}>
              <div className="text-sm font-semibold text-teal-600 mb-2">
                {stage.title}
              </div>
              
              {stage.date && (
                <div className="text-xs text-gray-900 font-medium">
                  {stage.date}
                </div>
              )}
              
              {stage.time && (
                <div className="text-xs text-gray-900 font-medium">
                  {stage.time}
                </div>
              )}
              
              {stage.person && (
                <div className="text-xs text-gray-600 mt-1">
                  {stage.person}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderLifecycleProgress;