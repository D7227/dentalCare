import React from 'react';

interface ToothGroup {
  groupId: string;
  teeth: number[];
  type: 'joint' | 'separate' | 'bridge';
  notes: string;
  material: string;
  shade: string;
}

interface ToothChartSVGProps {
  toothGroups: ToothGroup[];
  className?: string;
  onToothClick?: (toothNumber: number) => void;
}

const ToothChartSVG = ({ toothGroups, className = '', onToothClick }: ToothChartSVGProps) => {
  // Tooth numbering: Upper (18-11, 21-28), Lower (48-41, 31-38)
  const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
  const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28];
  const lowerRight = [48, 47, 46, 45, 44, 43, 42, 41];
  const lowerLeft = [31, 32, 33, 34, 35, 36, 37, 38];

  // Create map of selected teeth
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

  const getToothColor = (toothNumber: number) => {
    if (!selectedTeethMap.has(toothNumber)) return '#f3f4f6'; // Gray for unselected
    
    const toothInfo = selectedTeethMap.get(toothNumber);
    switch (toothInfo.type) {
      case 'joint': return '#3b82f6'; // Blue
      case 'separate': return '#10b981'; // Green
      case 'bridge': return '#f59e0b'; // Amber
      default: return '#6b7280'; // Gray
    }
  };

  const ToothRect = ({ x, y, toothNumber }: { x: number; y: number; toothNumber: number }) => {
    const isSelected = selectedTeethMap.has(toothNumber);
    return (
      <g
        onClick={() => onToothClick?.(toothNumber)}
        style={{ cursor: onToothClick ? 'pointer' : 'default' }}
        className={onToothClick ? 'hover:opacity-80' : ''}
      >
        <rect
          x={x}
          y={y}
          width="20"
          height="24"
          fill={getToothColor(toothNumber)}
          stroke={isSelected ? '#374151' : '#e5e7eb'}
          strokeWidth="1"
          rx="2"
        />
        <text
          x={x + 10}
          y={y + 16}
          textAnchor="middle"
          fontSize="10"
          fill={isSelected ? 'white' : '#374151'}
          fontWeight={isSelected ? 'bold' : 'normal'}
        >
          {toothNumber}
        </text>
      </g>
    );
  };

  return (
    <div className={`bg-white border rounded-lg p-4 ${className}`}>
      <h4 className="text-sm font-semibold text-gray-700 mb-3 text-center">Selected Teeth</h4>
      
      <svg width="100%" height="120" viewBox="0 0 360 120" className="mx-auto">
        {/* Upper Jaw */}
        <text x="180" y="15" textAnchor="middle" fontSize="11" fill="#6b7280" fontWeight="500">
          Upper Jaw
        </text>
        
        {/* Upper Right Quadrant */}
        {upperRight.map((tooth, index) => (
          <ToothRect
            key={tooth}
            x={140 - (index * 22)}
            y={20}
            toothNumber={tooth}
          />
        ))}
        
        {/* Upper Left Quadrant */}
        {upperLeft.map((tooth, index) => (
          <ToothRect
            key={tooth}
            x={180 + (index * 22)}
            y={20}
            toothNumber={tooth}
          />
        ))}

        {/* Lower Jaw */}
        <text x="180" y="85" textAnchor="middle" fontSize="11" fill="#6b7280" fontWeight="500">
          Lower Jaw
        </text>
        
        {/* Lower Right Quadrant */}
        {lowerRight.map((tooth, index) => (
          <ToothRect
            key={tooth}
            x={140 - (index * 22)}
            y={90}
            toothNumber={tooth}
          />
        ))}
        
        {/* Lower Left Quadrant */}
        {lowerLeft.map((tooth, index) => (
          <ToothRect
            key={tooth}
            x={180 + (index * 22)}
            y={90}
            toothNumber={tooth}
          />
        ))}
      </svg>

      {/* Legend */}
      {toothGroups.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="text-xs font-medium text-gray-700">Legend:</div>
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Joint</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Separate</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-amber-500 rounded"></div>
              <span>Bridge</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToothChartSVG;