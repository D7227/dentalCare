import React from 'react';

interface ToothGroup {
  groupId: string;
  teeth: number[];
  type: 'individual' | 'joint' | 'bridge';
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

interface DentalArchChartProps {
  toothGroups: ToothGroup[];
  className?: string;
  onToothClick?: (toothNumber: number) => void;
}

// Helper: assign each tooth to the highest-priority group (bridge > joint > individual)
function getToothGroupMap(toothGroups: ToothGroup[]) {
  const toothMap = new Map<number, { type: 'individual' | 'joint' | 'bridge'; material: string; shade: string; notes: string }>();
  // Priority: bridge > joint > individual
  const priority = { bridge: 3, joint: 2, individual: 1 };
  toothGroups.forEach(group => {
    group.teeth.forEach(tooth => {
      const existing = toothMap.get(tooth);
      const groupType = group.type as 'individual' | 'joint' | 'bridge';
      if (!existing || priority[groupType] > priority[existing.type]) {
        toothMap.set(tooth, {
          type: groupType,
          material: group.material,
          shade: group.shade,
          notes: group.notes
        });
      }
    });
  });
  return toothMap;
}

const DentalArchChart = ({ toothGroups, className = '', onToothClick }: DentalArchChartProps) => {
  // Use deduplicated, prioritized tooth map
  const selectedTeethMap = getToothGroupMap(toothGroups);

  const getToothColor = (toothNumber: number) => {
    if (!selectedTeethMap.has(toothNumber)) {
      return '#f3f4f6'; // Gray for unselected
    }
    const toothInfo = selectedTeethMap.get(toothNumber);
    if (!toothInfo) return '#f3f4f6';
    switch (toothInfo.type) {
      case 'individual': return '#10b981'; // Green
      case 'joint': return '#3b82f6'; // Blue
      case 'bridge': return '#f59e0b'; // Orange
      default: return '#6b7280'; // Gray
    }
  };

  // Create proper dental arch tooth component
  const ToothCircle = ({ x, y, toothNumber }: { x: number; y: number; toothNumber: number }) => {
    const isSelected = selectedTeethMap.has(toothNumber);
    return (
      <g
        onClick={() => onToothClick?.(toothNumber)}
        style={{ cursor: onToothClick ? 'pointer' : 'default' }}
        className={onToothClick ? 'hover:opacity-80' : ''}
      >
        <circle
          cx={x}
          cy={y}
          r="16"
          fill={getToothColor(toothNumber)}
          stroke={isSelected ? '#374151' : '#d1d5db'}
          strokeWidth="2"
        />
        <text
          x={x}
          y={y + 4}
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
    <div className={`bg-white border-2 border-dashed border-green-300 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-green-700">Adding: Crown & Bridge</h4>
        <button className="text-xs text-green-600 border border-green-300 px-2 py-1 rounded hover:bg-green-50">
          Change
        </button>
      </div>
      
      <svg width="320" height="400" viewBox="0 0 320 400" className="mx-auto">
        {/* Position labels */}
        <text x="80" y="15" textAnchor="middle" fontSize="10" fill="#6b7280">(Upper Right)</text>
        <text x="240" y="15" textAnchor="middle" fontSize="10" fill="#6b7280">(Upper Left)</text>
        <text x="80" y="390" textAnchor="middle" fontSize="10" fill="#6b7280">(Lower Right)</text>
        <text x="240" y="390" textAnchor="middle" fontSize="10" fill="#6b7280">(Lower Left)</text>
        
        {/* Upper arch - anatomical curve */}
        {/* Upper right quadrant (18-11) */}
        <ToothCircle x={70} y={60} toothNumber={18} />
        <ToothCircle x={88} y={48} toothNumber={17} />
        <ToothCircle x={108} y={38} toothNumber={16} />
        <ToothCircle x={128} y={32} toothNumber={15} />
        <ToothCircle x={145} y={28} toothNumber={14} />
        <ToothCircle x={158} y={26} toothNumber={13} />
        <ToothCircle x={168} y={25} toothNumber={12} />
        <ToothCircle x={175} y={24} toothNumber={11} />
        
        {/* Upper left quadrant (21-28) */}
        <ToothCircle x={185} y={24} toothNumber={21} />
        <ToothCircle x={192} y={25} toothNumber={22} />
        <ToothCircle x={202} y={26} toothNumber={23} />
        <ToothCircle x={215} y={28} toothNumber={24} />
        <ToothCircle x={232} y={32} toothNumber={25} />
        <ToothCircle x={252} y={38} toothNumber={26} />
        <ToothCircle x={272} y={48} toothNumber={27} />
        <ToothCircle x={290} y={60} toothNumber={28} />
        
        {/* Bite line */}
        <line x1="50" y1="200" x2="310" y2="200" stroke="#9ca3af" strokeWidth="1" strokeDasharray="5,5" />
        <text x="180" y="195" textAnchor="middle" fontSize="10" fill="#6b7280">Bite Line</text>
        
        {/* Lower arch - anatomical curve */}
        {/* Lower right quadrant (48-41) */}
        <ToothCircle x={70} y={340} toothNumber={48} />
        <ToothCircle x={88} y={328} toothNumber={47} />
        <ToothCircle x={108} y={318} toothNumber={46} />
        <ToothCircle x={128} y={312} toothNumber={45} />
        <ToothCircle x={145} y={308} toothNumber={44} />
        <ToothCircle x={158} y={306} toothNumber={43} />
        <ToothCircle x={168} y={305} toothNumber={42} />
        <ToothCircle x={175} y={304} toothNumber={41} />
        
        {/* Lower left quadrant (31-38) */}
        <ToothCircle x={185} y={304} toothNumber={31} />
        <ToothCircle x={192} y={305} toothNumber={32} />
        <ToothCircle x={202} y={306} toothNumber={33} />
        <ToothCircle x={215} y={308} toothNumber={34} />
        <ToothCircle x={232} y={312} toothNumber={35} />
        <ToothCircle x={252} y={318} toothNumber={36} />
        <ToothCircle x={272} y={328} toothNumber={37} />
        <ToothCircle x={290} y={340} toothNumber={38} />
      </svg>
      
      {/* Legend */}
      <div className="mt-4 flex justify-center">
        <div className="flex items-center space-x-4 text-xs">
          <span className="text-sm font-medium text-gray-700">Legend:</span>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Individual</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Joint</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600">Bridge</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DentalArchChart;