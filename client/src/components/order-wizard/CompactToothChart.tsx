import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ToothGroup {
  groupId: string;
  teeth: number[];
  type: 'separate' | 'joint' | 'bridge';
  productType: 'implant' | 'crown-bridge';
  notes: string;
  material: string;
  shade: string;
  warning?: string;
  occlusalStaining?: string;
  ponticDesign?: string;
  products?: Array<{
    id: string;
    name: string;
    category: string;
    material: string;
    description: string;
    quantity: number;
  }>;
}

interface CompactToothChartProps {
  toothGroups: ToothGroup[];
  className?: string;
}

const CompactToothChart = ({ toothGroups, className = '' }: CompactToothChartProps) => {
  // Define tooth positions for upper and lower jaw
  const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  // Create a map of selected teeth with their details
  const selectedTeethMap = new Map();
  toothGroups.forEach(group => {
    group.teeth.forEach(tooth => {
      selectedTeethMap.set(tooth, {
        type: group.type,
        material: group.material,
        shade: group.shade,
        groupId: group.groupId
      });
    });
  });

  const renderTooth = (toothNumber: number) => {
    const isSelected = selectedTeethMap.has(toothNumber);
    const toothInfo = selectedTeethMap.get(toothNumber);
    
    return (
      <div
        key={toothNumber}
        className={`
          w-6 h-8 flex items-center justify-center text-xs font-medium border rounded
          ${isSelected 
            ? toothInfo.type === 'separate' 
              ? 'bg-blue-500 text-white border-blue-600' 
              : toothInfo.type === 'joint'
              ? 'bg-green-500 text-white border-green-600'
              : 'bg-orange-500 text-white border-orange-600'
            : 'bg-gray-100 text-gray-600 border-gray-300'
          }
          print:w-5 print:h-6 print:text-xs
        `}
        title={isSelected ? `${toothInfo.material} - ${toothInfo.shade}` : `Tooth ${toothNumber}`}
      >
        {toothNumber}
      </div>
    );
  };

  return (
    <div className={`bg-white border rounded-lg p-3 print:p-2 ${className}`}>
      <div className="text-center mb-2">
        <h4 className="text-sm font-semibold text-gray-700 print:text-xs">Selected Teeth</h4>
      </div>
      
      {/* Upper Jaw */}
      <div className="mb-2">
        <div className="text-xs text-gray-500 mb-1 print:text-xs">Upper</div>
        <div className="flex justify-center gap-1">
          {upperTeeth.map(renderTooth)}
        </div>
      </div>
      
      {/* Lower Jaw */}
      <div className="mb-3">
        <div className="text-xs text-gray-500 mb-1 print:text-xs">Lower</div>
        <div className="flex justify-center gap-1">
          {lowerTeeth.map(renderTooth)}
        </div>
      </div>
      
      {/* Legend */}
      {toothGroups.length > 0 && (
        <div className="space-y-1 print:space-y-0.5">
          <div className="text-xs font-medium text-gray-700 print:text-xs">Legend:</div>
          <div className="flex flex-wrap gap-2 print:gap-1">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded print:w-2 print:h-2"></div>
              <span className="text-xs text-gray-600 print:text-xs">Separate</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded print:w-2 print:h-2"></div>
              <span className="text-xs text-gray-600 print:text-xs">Joint</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-500 rounded print:w-2 print:h-2"></div>
              <span className="text-xs text-gray-600 print:text-xs">Bridge</span>
            </div>
          </div>
          
          {/* Restoration Details */}
          <div className="space-y-1 print:space-y-0.5">
            {toothGroups.map((group, index) => (
              <div key={group.groupId} className="text-xs text-gray-600 print:text-xs">
                <span className="font-medium">Teeth {group.teeth.join(', ')}:</span> {group.material} ({group.shade})
                {group.type === 'bridge' && <span className="text-orange-600"> - Bridge</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactToothChart;