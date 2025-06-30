import React from 'react';
import { ToothGroup } from '../types/tooth';

interface SelectedTooth {
  prescriptionType: 'implant' | 'crown-bridge';
  toothNumber: number;
  type: 'abutment' | 'pontic';
}

interface SelectedTeethViewerProps {
  selectedTeeth: SelectedTooth[];
  toothGroups: ToothGroup[];
}

const allTeeth = [
  18, 17, 16, 15, 14, 13, 12, 11,
  21, 22, 23, 24, 25, 26, 27, 28,
  48, 47, 46, 45, 44, 43, 42, 41,
  31, 32, 33, 34, 35, 36, 37, 38
];

const getToothType = (
  toothNumber: number,
  selectedTeeth: SelectedTooth[],
  toothGroups: ToothGroup[]
): 'abutment' | 'pontic' | null => {
  const selectedTooth = selectedTeeth.find(tooth => tooth.toothNumber === toothNumber);
  if (selectedTooth) return selectedTooth.type;
  for (const group of toothGroups) {
    if (group.teeth.includes(toothNumber)) {
      if (group.pontics && group.pontics.includes(toothNumber)) return 'pontic';
      return 'abutment';
    }
  }
  return null;
};

const getToothFillColor = (
  toothNumber: number,
  selectedTeeth: SelectedTooth[],
  toothGroups: ToothGroup[]
): string => {
  const selectedTooth = selectedTeeth.find(tooth => tooth.toothNumber === toothNumber);
  if (selectedTooth) {
    return selectedTooth.type === 'pontic' ? '#9333EA' : '#3B82F6'; // purple for pontic, blue for abutment
  }
  const type = getToothType(toothNumber, selectedTeeth, toothGroups);
  if (!type) return 'white';
  const group = toothGroups.find(g => g.teeth.includes(toothNumber));
  if (group) {
    if (type === 'pontic') return '#9333EA'; // purple for pontics
    return group.type === 'joint' ? '#10B981' : '#F59E0B'; // green for joint, orange for bridge
  }
  return type === 'pontic' ? '#9333EA' : '#3B82F6'; // fallback
};

const getToothStrokeColor = (
  toothNumber: number,
  selectedTeeth: SelectedTooth[],
  toothGroups: ToothGroup[]
): string => {
  const selectedTooth = selectedTeeth.find(tooth => tooth.toothNumber === toothNumber);
  if (selectedTooth) {
    return selectedTooth.type === 'pontic' ? '#7C3AED' : '#1D4ED8'; // purple for pontic, blue for abutment
  }
  const type = getToothType(toothNumber, selectedTeeth, toothGroups);
  if (!type) return '#000';
  const group = toothGroups.find(g => g.teeth.includes(toothNumber));
  if (group) {
    if (type === 'pontic') return '#7C3AED';
    return group.type === 'joint' ? '#059669' : '#D97706';
  }
  return type === 'pontic' ? '#7C3AED' : '#1D4ED8'; // fallback
};

const getToothPosition = (toothNumber: number): { x: number; y: number } => {
  const positions: Record<number, { x: number; y: number }> = {
    11: { x: 186, y: 42 }, 12: { x: 154, y: 51 }, 13: { x: 131, y: 71 }, 14: { x: 116, y: 96 },
    15: { x: 102, y: 133 }, 16: { x: 89, y: 165 }, 17: { x: 77, y: 212 }, 18: { x: 72, y: 260 },
    21: { x: 224, y: 42 }, 22: { x: 256, y: 51 }, 23: { x: 279, y: 71 }, 24: { x: 294, y: 96 },
    25: { x: 308, y: 133 }, 26: { x: 321, y: 165 }, 27: { x: 333, y: 212 }, 28: { x: 338, y: 260 },
    31: { x: 224, y: 580 }, 32: { x: 256, y: 571 }, 33: { x: 279, y: 551 }, 34: { x: 294, y: 526 },
    35: { x: 308, y: 489 }, 36: { x: 321, y: 457 }, 37: { x: 333, y: 410 }, 38: { x: 338, y: 362 },
    41: { x: 186, y: 580 }, 42: { x: 154, y: 571 }, 43: { x: 131, y: 551 }, 44: { x: 116, y: 526 },
    45: { x: 102, y: 489 }, 46: { x: 89, y: 457 }, 47: { x: 77, y: 410 }, 48: { x: 72, y: 362 }
  };
  return positions[toothNumber] || { x: 0, y: 0 };
};

const getDotPosition = (toothNumber: number): { x: number; y: number } => {
  const toothPos = getToothPosition(toothNumber);
  const isUpperJaw = toothNumber >= 11 && toothNumber <= 28;
  if (toothNumber >= 15 && toothNumber <= 18) {
    const customPositions: Record<number, { x: number; y: number }> = {
      15: { x: 70, y: 115 }, 16: { x: 58, y: 155 }, 17: { x: 45, y: 210 }, 18: { x: 40, y: 260 }
    };
    return customPositions[toothNumber];
  }
  if (toothNumber >= 25 && toothNumber <= 28) {
    const customPositions: Record<number, { x: number; y: number }> = {
      25: { x: 340, y: 115 }, 26: { x: 352, y: 155 }, 27: { x: 365, y: 210 }, 28: { x: 370, y: 260 }
    };
    return customPositions[toothNumber];
  }
  if (toothNumber >= 35 && toothNumber <= 38) {
    const customPositions: Record<number, { x: number; y: number }> = {
      35: { x: 340, y: 507 }, 36: { x: 352, y: 467 }, 37: { x: 365, y: 412 }, 38: { x: 370, y: 362 }
    };
    return customPositions[toothNumber];
  }
  if (toothNumber >= 45 && toothNumber <= 48) {
    const customPositions: Record<number, { x: number; y: number }> = {
      45: { x: 70, y: 507 }, 46: { x: 58, y: 467 }, 47: { x: 45, y: 412 }, 48: { x: 40, y: 362 }
    };
    return customPositions[toothNumber];
  }
  const upperArchCenter = { x: 205, y: 150 };
  const lowerArchCenter = { x: 205, y: 470 };
  const archCenter = isUpperJaw ? upperArchCenter : lowerArchCenter;
  const dx = toothPos.x - archCenter.x;
  const dy = toothPos.y - archCenter.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const unitX = dx / distance;
  const unitY = dy / distance;
  const dotDistance = distance + 35;
  return {
    x: archCenter.x + (unitX * dotDistance),
    y: archCenter.y + (unitY * dotDistance)
  };
};

const areTeethStrictlyAdjacent = (tooth1: number, tooth2: number): boolean => {
  const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
  const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28];
  const lowerLeft = [31, 32, 33, 34, 35, 36, 37, 38];
  const lowerRight = [41, 42, 43, 44, 45, 46, 47, 48];
  const checkQuadrantAdjacency = (quadrant: number[]) => {
    const index1 = quadrant.indexOf(tooth1);
    const index2 = quadrant.indexOf(tooth2);
    if (index1 !== -1 && index2 !== -1) {
      return Math.abs(index1 - index2) === 1;
    }
    return false;
  };
  if (checkQuadrantAdjacency(upperRight)) return true;
  if (checkQuadrantAdjacency(upperLeft)) return true;
  if (checkQuadrantAdjacency(lowerLeft)) return true;
  if (checkQuadrantAdjacency(lowerRight)) return true;
  if ((tooth1 === 11 && tooth2 === 21) || (tooth1 === 21 && tooth2 === 11)) return true;
  if ((tooth1 === 31 && tooth2 === 41) || (tooth1 === 41 && tooth2 === 31)) return true;
  if ((tooth1 === 32 && tooth2 === 42) || (tooth1 === 42 && tooth2 === 32)) return true;
  return false;
};

const generateConnectionLines = (toothGroups: ToothGroup[]) => {
  return toothGroups.map(group => {
    if (group.teeth.length < 2) return null;
    const lines = [];
    const sortedTeeth = group.teeth.slice().sort((a, b) => a - b);
    for (let i = 0; i < sortedTeeth.length - 1; i++) {
      const tooth1 = sortedTeeth[i];
      const tooth2 = sortedTeeth[i + 1];
      if (areTeethStrictlyAdjacent(tooth1, tooth2)) {
        const pos1 = getDotPosition(tooth1);
        const pos2 = getDotPosition(tooth2);
        const lineColor = group.type === 'joint' ? '#10B981' : '#F59E0B';
        const strokeWidth = group.type === 'bridge' ? '4' : '3';
        const lineId = `${group.groupId}-${tooth1}-${tooth2}`;
        lines.push(
          <line
            key={lineId}
            x1={pos1.x}
            y1={pos1.y}
            x2={pos2.x}
            y2={pos2.y}
            stroke={lineColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="drop-shadow-sm transition-all duration-200"
          />
        );
      }
    }
    // Special handling for cross-quadrant connections
    if (group.teeth.includes(11) && group.teeth.includes(21)) {
      const existingLine = lines.find(line => 
        line.key === `${group.groupId}-11-21` || line.key === `${group.groupId}-21-11`
      );
      if (!existingLine && areTeethStrictlyAdjacent(11, 21)) {
        const pos1 = getDotPosition(11);
        const pos2 = getDotPosition(21);
        const lineColor = group.type === 'joint' ? '#10B981' : '#F59E0B';
        const strokeWidth = group.type === 'bridge' ? '4' : '3';
        const lineId = `${group.groupId}-11-21`;
        lines.push(
          <line
            key={lineId}
            x1={pos1.x}
            y1={pos1.y}
            x2={pos2.x}
            y2={pos2.y}
            stroke={lineColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="drop-shadow-sm transition-all duration-200"
          />
        );
      }
    }
    if (group.teeth.includes(31) && group.teeth.includes(41)) {
      const existingLine = lines.find(line => 
        line.key === `${group.groupId}-31-41` || line.key === `${group.groupId}-41-31`
      );
      if (!existingLine && areTeethStrictlyAdjacent(31, 41)) {
        const pos1 = getDotPosition(31);
        const pos2 = getDotPosition(41);
        const lineColor = group.type === 'joint' ? '#10B981' : '#F59E0B';
        const strokeWidth = group.type === 'bridge' ? '4' : '3';
        const lineId = `${group.groupId}-31-41`;
        lines.push(
          <line
            key={lineId}
            x1={pos1.x}
            y1={pos1.y}
            x2={pos2.x}
            y2={pos2.y}
            stroke={lineColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="drop-shadow-sm transition-all duration-200"
          />
        );
      }
    }
    return lines;
  }).filter(Boolean).flat();
};

const SelectedTeethViewer: React.FC<SelectedTeethViewerProps> = ({ selectedTeeth, toothGroups }) => {
  return (
    <div className="flex justify-center my-0 py-0 w-full px-2 md:px-0" style={{ width: '100%', maxWidth: 420, overflowX: 'auto' }}>
      <div className="w-full" style={{ aspectRatio: '400/650', maxWidth: 400, margin: '0 auto', position: 'relative' }}>
        <svg
          viewBox="0 0 400 650"
          className="w-full h-auto mx-0 py-0"
          style={{ userSelect: 'none', width: '100%', height: 'auto', display: 'block', maxWidth: 400 }}
        >
          {/* Render group connection lines */}
          {generateConnectionLines(toothGroups)}
          {/* Render all teeth as circles with color */}
          {allTeeth.map(toothNumber => {
            const pos = getToothPosition(toothNumber);
            return (
              <circle
                key={toothNumber}
                cx={pos.x}
                cy={pos.y}
                r={16}
                fill={getToothFillColor(toothNumber, selectedTeeth, toothGroups)}
                stroke={getToothStrokeColor(toothNumber, selectedTeeth, toothGroups)}
                strokeWidth={2}
              />
            );
          })}
          {/* Render tooth numbers */}
          {allTeeth.map(toothNumber => {
            const pos = getToothPosition(toothNumber);
            return (
              <text
                key={`label-${toothNumber}`}
                x={pos.x}
                y={pos.y + 4}
                textAnchor="middle"
                className="text-xs fill-gray-800 pointer-events-none font-medium"
                style={{ fontSize: 12 }}
              >
                {toothNumber}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default SelectedTeethViewer; 