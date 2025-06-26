import React from 'react';
import { ToothGroup } from '../types/tooth';

interface ToothChartProps {
  selectedGroups: ToothGroup[];
  tempSelection: number[];
  selectedRestorationType?: 'separate' | 'joint' | 'bridge' | null;
  onToothClick: (toothNumber: number) => void;
  isToothSelected: (toothNumber: number) => boolean;
}

const ToothChart = ({
  selectedGroups,
  tempSelection,
  selectedRestorationType,
  onToothClick,
  isToothSelected
}: ToothChartProps) => {
  // Palmer notation mapping function
  const getPalmerNotation = (fdiNumber: number): string => {
    const mapping: Record<number, string> = {
      // Upper Right (Quadrant 1): 11-18 -> 1-8 (from center outward)
      11: '1', 12: '2', 13: '3', 14: '4', 15: '5', 16: '6', 17: '7', 18: '8',
      // Upper Left (Quadrant 2): 21-28 -> 1-8 (from center outward)
      21: '1', 22: '2', 23: '3', 24: '4', 25: '5', 26: '6', 27: '7', 28: '8',
      // Lower Left (Quadrant 3): 31-38 -> 1-8 (from center outward)
      31: '1', 32: '2', 33: '3', 34: '4', 35: '5', 36: '6', 37: '7', 38: '8',
      // Lower Right (Quadrant 4): 41-48 -> 1-8 (from center outward)
      41: '1', 42: '2', 43: '3', 44: '4', 45: '5', 46: '6', 47: '7', 48: '8'
    };
    return mapping[fdiNumber] || fdiNumber.toString();
  };

  // Helper function to determine if tooth is upper or lower jaw
  const isUpperJaw = (toothNumber: number): boolean => {
    return toothNumber >= 11 && toothNumber <= 28;
  };

  // Helper function to separate teeth by jaw
  const separateTeethByJaw = (teeth: number[]) => {
    const upperTeeth = teeth.filter(tooth => isUpperJaw(tooth));
    const lowerTeeth = teeth.filter(tooth => !isUpperJaw(tooth));
    return { upperTeeth, lowerTeeth };
  };

  // Get tooth positions for connecting lines
  const getToothPosition = (toothNumber: number): { x: number; y: number } => {
    const positions: Record<number, { x: number; y: number }> = {
      // Upper teeth (y = 22 for center position)
      11: { x: 186, y: 42 }, 12: { x: 154, y: 51 }, 13: { x: 131, y: 71 }, 14: { x: 116, y: 96 },
      15: { x: 102, y: 133 }, 16: { x: 89, y: 165 }, 17: { x: 77, y: 212 }, 18: { x: 72, y: 260 },
      
      21: { x: 224, y: 42 }, 22: { x: 256, y: 51 }, 23: { x: 279, y: 71 }, 24: { x: 294, y: 96 },
      25: { x: 308, y: 133 }, 26: { x: 321, y: 165 }, 27: { x: 333, y: 212 }, 28: { x: 338, y: 260 },
      
      // Lower teeth (y adjusted for lower position)
      31: { x: 224, y: 580 }, 32: { x: 256, y: 571 }, 33: { x: 279, y: 551 }, 34: { x: 294, y: 526 },
      35: { x: 308, y: 489 }, 36: { x: 321, y: 457 }, 37: { x: 333, y: 410 }, 38: { x: 338, y: 362 },
      
      41: { x: 186, y: 580 }, 42: { x: 154, y: 571 }, 43: { x: 131, y: 551 }, 44: { x: 116, y: 526 },
      45: { x: 102, y: 489 }, 46: { x: 89, y: 457 }, 47: { x: 77, y: 410 }, 48: { x: 72, y: 362 }
    };
    return positions[toothNumber] || { x: 0, y: 0 };
  };

  // Get tooth fill color based on selection state
  const getToothFillColor = (toothNumber: number): string => {
    // Check if tooth is in a saved group
    const savedGroup = selectedGroups.find(group => group.teeth.includes(toothNumber));
    if (savedGroup) {
      const colors = {
        separate: '#3B82F6', // blue
        joint: '#10B981',    // green  
        bridge: '#F59E0B'    // orange
      };
      return colors[savedGroup.type];
    }

    // Check if tooth is in temp selection
    if (tempSelection.includes(toothNumber)) {
      if (selectedRestorationType) {
        const colors = {
          separate: '#3B82F6', // blue
          joint: '#10B981',    // green
          bridge: '#F59E0B'    // orange
        };
        return colors[selectedRestorationType];
      }
      return '#11AB93'; // default teal for temp selection
    }

    return 'white'; // default
  };

  // Render visual overlay for a group of teeth (separated by jaw)
  const renderJawGroupOverlay = (teeth: number[], type: 'separate' | 'joint' | 'bridge', color: string, isTemp: boolean = false) => {
    if (teeth.length === 0) return null;

    const positions = teeth.map(tooth => getToothPosition(tooth));
    const minX = Math.min(...positions.map(p => p.x));
    const maxX = Math.max(...positions.map(p => p.x));
    const minY = Math.min(...positions.map(p => p.y));
    const maxY = Math.max(...positions.map(p => p.y));

    if (type === 'separate') {
      // Individual circles for separate
      return (
        <g>
          {positions.map((pos, index) => (
            <circle
              key={`${isTemp ? 'temp' : 'saved'}-separate-${teeth[index]}`}
              cx={pos.x}
              cy={pos.y}
              r={isTemp ? "28" : "25"}
              fill="none"
              stroke={color}
              strokeWidth={isTemp ? "3" : "2"}
              strokeDasharray={isTemp ? "8,4" : "5,3"}
              opacity={isTemp ? "0.8" : "0.7"}
            />
          ))}
        </g>
      );
    } else if (type === 'joint') {
      // Rounded rectangle for joint
      const padding = isTemp ? 35 : 30;
      return (
        <rect
          x={minX - padding}
          y={minY - padding}
          width={maxX - minX + (padding * 2)}
          height={maxY - minY + (padding * 2)}
          fill="none"
          stroke={color}
          strokeWidth={isTemp ? "4" : "3"}
          rx={isTemp ? "20" : "15"}
          ry={isTemp ? "20" : "15"}
          strokeDasharray={isTemp ? "10,5" : ""}
          opacity={isTemp ? "0.9" : "0.8"}
        />
      );
    } else if (type === 'bridge') {
      // Connecting line with bridge pillars
      const sortedPositions = positions.sort((a, b) => a.x - b.x);
      const pathData = sortedPositions.reduce((path, pos, index) => {
        if (index === 0) return `M ${pos.x} ${pos.y}`;
        return `${path} L ${pos.x} ${pos.y}`;
      }, '');

      return (
        <g>
          {/* Main bridge line */}
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth={isTemp ? "6" : "4"}
            opacity={isTemp ? "0.9" : "0.8"}
          />
          {/* Bridge pillars */}
          {sortedPositions.map((pos, index) => (
            <g key={`bridge-pillar-${teeth[index]}`}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isTemp ? "12" : "8"}
                fill={color}
                opacity={isTemp ? "0.8" : "0.7"}
              />
              <line
                x1={pos.x}
                y1={pos.y - (isTemp ? 20 : 15)}
                x2={pos.x}
                y2={pos.y + (isTemp ? 20 : 15)}
                stroke={color}
                strokeWidth={isTemp ? "4" : "3"}
                opacity={isTemp ? "0.7" : "0.6"}
              />
            </g>
          ))}
        </g>
      );
    }

    return null;
  };

  // Render temp selection overlay for bridge/joint (separated by jaw)
  const renderTempSelectionOverlay = () => {
    if (tempSelection.length < 2 || !selectedRestorationType) return null;

    const { upperTeeth, lowerTeeth } = separateTeethByJaw(tempSelection);
    
    const colors = {
      separate: '#3B82F6',
      joint: '#10B981',
      bridge: '#F59E0B'
    };

    const color = colors[selectedRestorationType];

    return (
      <g>
        {/* Upper jaw group */}
        {renderJawGroupOverlay(upperTeeth, selectedRestorationType, color, true)}
        {/* Lower jaw group */}
        {renderJawGroupOverlay(lowerTeeth, selectedRestorationType, color, true)}
      </g>
    );
  };

  // Generate connecting elements for saved tooth groups (separated by jaw)
  const renderSavedGroupConnections = () => {
    return selectedGroups.flatMap((group) => {
      if (group.teeth.length < 2) return [];

      const { upperTeeth, lowerTeeth } = separateTeethByJaw(group.teeth);
      
      const colors = {
        separate: '#3B82F6',
        joint: '#10B981',
        bridge: '#F59E0B'
      };

      const color = colors[group.type];
      const overlays = [];

      // Create overlay for upper teeth if any exist
      if (upperTeeth.length > 0) {
        overlays.push(
          <g key={`${group.groupId}-upper`}>
            {renderJawGroupOverlay(upperTeeth, group.type, color, false)}
          </g>
        );
      }

      // Create overlay for lower teeth if any exist
      if (lowerTeeth.length > 0) {
        overlays.push(
          <g key={`${group.groupId}-lower`}>
            {renderJawGroupOverlay(lowerTeeth, group.type, color, false)}
          </g>
        );
      }

      return overlays;
    });
  };

  return (
    <div className="flex justify-center my-0 py-0">
      <div className="w-full max-w-lg">
        <svg viewBox="0 0 400 750" className="w-full h-auto mx-0 py-0">
          {/* Quadrant Labels */}
          <text x="50" y="12" fill="#666" textAnchor="middle" className="text-xs font-medium">(Upper Right)</text>
          <text x="350" y="12" fill="#666" textAnchor="middle" className="text-xs font-medium">(Upper Left)</text>
          <text x="50" y="640" fill="#666" textAnchor="middle" className="text-xs font-medium">(Lower Right)</text>
          <text x="350" y="640" fill="#666" textAnchor="middle" className="text-xs font-medium">(Lower Left)</text>

          {/* Upper Jaw Teeth */}
          <g transform="translate(50, 20)">
            {/* Tooth 11 */}
            <path d="M128.916 1.84693C128.19 1.91791 127.465 2.00255 126.743 2.11123C125.307 2.32786 123.874 2.63728 122.512 3.1563C121.225 3.64685 119.992 4.33775 119.012 5.32662C118.779 5.56173 118.565 5.84565 118.375 6.11921C118.17 6.4142 118.007 6.73803 117.875 7.07258C117.607 7.75166 117.461 8.47251 117.322 9.18782C117.285 9.37894 117.248 9.57265 117.244 9.76821C117.241 9.92605 117.268 10.082 117.258 10.2403C117.202 11.1452 117.35 12.0661 117.51 12.9548C118.188 16.7106 119.854 20.1999 121.512 23.5953C124.554 29.8239 127.925 36.4147 133.9 39.8272C136.016 41.0356 138.493 41.7898 140.881 41.3421C145.593 40.4593 148.276 35.4854 150.087 30.9902C153.037 23.6656 155.487 15.7021 153.993 7.93723C153.666 6.24192 153.12 4.52221 151.959 3.25794C149.777 0.883183 146.159 0.771914 142.959 0.893535C138.271 1.07135 133.587 1.38928 128.916 1.84693Z" 
              fill={getToothFillColor(11)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(11)} 
            />
            <text x="136" y="22" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(11)}</text>

            {/* Tooth 12 */}
            <path d="M115.527 14.4549C116.553 16.0814 117.202 18.0684 117.755 19.9337C119.204 24.8171 119.548 29.9817 119.382 35.0562C119.208 40.3554 119.035 48.2878 112.725 49.9853C110.431 50.6023 107.995 49.887 105.818 48.9295C98.5724 45.7426 92.5856 39.7177 89.3913 32.3975C86.9698 26.8481 88.6025 21.3219 93.1916 17.4769C96.0385 15.0918 99.5247 13.6427 103.006 12.3903C105.421 11.5212 107.964 10.7186 110.506 11.0484C112.861 11.3537 114.415 12.693 115.527 14.4549Z" 
              fill={getToothFillColor(12)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(12)} 
            />
            <text x="104" y="31" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(12)}</text>

            {/* Tooth 13 */}
            <path d="M92.5018 41.3085C95.2389 46.2447 97.0839 51.6508 98.3547 57.1644C98.8805 59.4456 99.311 61.8149 98.8972 64.1194C98.4835 66.4243 97.0591 68.6741 94.8744 69.4404C93.4679 69.9339 91.9271 69.772 90.456 69.5432C83.8435 68.514 77.3021 66.1629 72.1336 61.8592C69.1987 59.4153 66.667 56.1885 66.0577 52.3894C65.613 49.618 66.2358 46.7438 67.4442 44.2167C68.6522 41.6897 70.4206 39.4779 72.335 37.4473C73.8385 35.8522 75.4731 34.3314 77.4294 33.3636C78.7345 32.7178 80.1942 32.3393 81.6522 32.3892C82.5887 32.4209 83.5786 32.4897 84.4342 32.9096C86.6357 33.9898 88.5446 35.6252 90.0587 37.5579C90.9785 38.7327 91.7772 40.0018 92.5018 41.3085Z" 
              fill={getToothFillColor(13)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(13)} 
            />
            <text x="81" y="51" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(13)}</text>

            {/* Tooth 14 */}
            <path d="M84.1115 79.3365C84.9028 81.1231 85.6052 82.9799 85.815 84.9266C86.0247 86.8733 85.7004 88.9372 84.5865 90.5378C83.7277 91.7722 82.4565 92.6583 81.1124 93.3107C76.971 95.3199 72.1736 95.2552 67.5903 94.9705C62.8177 94.6744 57.8115 94.0959 53.9127 91.2916C51.8703 89.8229 50.2321 87.7834 49.2269 85.4593C48.089 82.8273 47.7712 79.8962 47.8464 77.0238C47.9241 74.0517 48.4225 71.0481 49.7115 68.3772C51.0005 65.7064 53.1382 63.386 55.8603 62.2758C57.2431 61.7117 58.7317 61.4703 60.2115 61.287C61.413 61.138 62.6279 61.0426 63.8381 61.1184C65.0104 61.192 66.0769 61.5143 67.1904 61.8663C68.8038 62.376 70.2559 63.0385 71.7044 63.9349C73.5034 65.0484 75.1486 66.4058 76.6299 67.9229C78.1305 69.4593 79.4651 71.1583 80.6501 72.9545C81.8381 74.7552 82.8776 76.6549 83.7846 78.6152C83.8955 78.8544 84.0042 79.0951 84.1115 79.3365Z" 
              fill={getToothFillColor(14)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(14)} 
            />
            <text x="66" y="76" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(14)}</text>

            {/* Tooth 15 */}
            <path d="M65.1418 100.746C68.62 103.998 71.1809 108.443 71.4888 113.228C71.7967 118.013 69.5712 123.064 65.4491 125.421C62.9965 126.824 60.1164 127.21 57.3096 127.44C53.8814 127.72 50.3905 127.802 47.0441 126.996C41.0704 125.557 35.8155 121.09 33.6727 115.26C31.5296 109.43 32.7058 102.402 36.8571 97.8176C39.5946 94.7948 43.5678 92.9967 47.5991 92.7964C51.6339 92.596 55.2471 94.4207 58.7413 96.2709C61.0435 97.4904 63.2293 98.9573 65.1418 100.746Z" 
              fill={getToothFillColor(15)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(15)} 
            />
            <text x="52" y="113" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(15)}</text>

            {/* Tooth 16 */}
            <path d="M49.4867 164.965C43.6141 169.001 35.8187 169.706 29.0795 167.452C24.057 165.773 19.2023 161.968 18.4215 156.667C17.8279 152.636 19.6726 148.711 20.8087 144.802C21.2279 143.359 21.5534 141.892 21.9 140.431C22.9179 136.143 24.4343 130.863 28.1641 128.154C31.3653 125.829 35.7228 125.861 39.5256 126.9C46.966 128.933 53.3491 134.604 56.3117 141.812C58.7138 147.657 58.3643 153.804 55.0037 159.167C53.7212 161.214 52.0772 163.033 50.157 164.482C49.9373 164.648 49.7137 164.809 49.4867 164.965Z" 
              fill={getToothFillColor(16)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(16)} 
            />
            <text x="39" y="145" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(16)}</text>

            {/* Tooth 17 */}
            <path d="M47.2475 200.67C46.6039 203.798 45.5455 206.951 43.413 209.306C41.9722 210.896 40.1122 212.04 38.1828 212.957C33.67 215.102 28.6321 216.1 23.6541 215.838C19.6721 215.628 15.6657 214.585 12.3543 212.335C9.04288 210.084 6.48966 206.541 5.89896 202.545C5.54433 200.146 5.89019 197.704 6.23607 195.303C6.89353 190.737 7.55137 186.171 8.20883 181.606C8.50144 179.575 8.80499 177.507 9.68939 175.66C11.7833 171.289 16.8419 169.004 21.6372 168.964C26.4324 168.924 31.0405 170.738 35.4242 172.707C37.9989 173.864 40.5748 175.102 42.7613 176.901C44.9946 178.739 46.693 181.155 47.3056 184.029C48.0459 187.502 48.2407 191.139 48.0335 194.679C47.9156 196.692 47.6536 198.696 47.2475 200.67Z" 
              fill={getToothFillColor(17)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(17)} 
            />
            <text x="27" y="192" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(17)}</text>

            {/* Tooth 18 */}
            <path d="M44.112 236.83C43.3126 241.888 43.3312 242.048 42.3235 246.097C41.9977 247.406 41.7299 251.309 40.4182 253.798C38.1511 258.099 32.9293 259.816 28.2271 260.854C24.0112 261.784 19.6443 262.262 15.3792 261.603C4.53765 259.928 1.53458 255.227 0.359756 247.321C-0.186061 243.646 -0.0510812 239.86 0.64542 236.211C2.1632 228.258 2.36022 224.148 7.20143 220.554C10.681 217.972 15.2862 217.54 19.5874 217.869C24.3911 218.236 29.5231 218.851 33.9305 220.818C36.1743 221.82 38.3335 223.017 40.373 224.396C42.1243 225.58 43.6526 227.583 44.1039 229.662C44.6093 231.991 44.5101 234.312 44.112 236.83Z" 
              fill={getToothFillColor(18)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(18)} 
            />
            <text x="22" y="240" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(18)}</text>

            {/* Upper Left Quadrant - Teeth 21-28 */}
            {/* Tooth 21 */}
            <path d="M181.369 1.84693C182.095 1.91791 182.82 2.00255 183.542 2.11123C184.978 2.32786 186.411 2.63728 187.773 3.1563C189.06 3.64685 190.292 4.33775 191.273 5.32662C191.506 5.56173 191.72 5.84565 191.91 6.11921C192.115 6.4142 192.278 6.73803 192.409 7.07258C192.677 7.75166 192.823 8.47251 192.963 9.18782C193 9.37894 193.036 9.57265 193.04 9.76821C193.043 9.92605 193.017 10.082 193.027 10.2403C193.083 11.1452 192.935 12.0661 192.774 12.9548C192.097 16.7106 190.43 20.1999 188.772 23.5953C185.73 29.8239 182.359 36.4147 176.384 39.8272C174.268 41.0356 171.792 41.7898 169.403 41.3421C164.691 40.4593 162.008 35.4854 160.198 30.9902C157.248 23.6656 154.796 15.7021 156.292 7.93723C156.618 6.24192 157.164 4.52221 158.326 3.25794C160.507 0.883183 164.125 0.771914 167.325 0.893535C172.014 1.07135 176.698 1.38928 181.369 1.84693Z" 
              fill={getToothFillColor(21)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(21)} 
            />
            <text x="174" y="22" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(21)}</text>

            {/* Tooth 22 */}
            <path d="M194.761 14.4549C193.734 16.0814 193.085 18.0684 192.532 19.9337C191.084 24.8171 190.739 29.9817 190.906 35.0562C191.079 40.3554 191.252 48.2878 197.563 49.9853C199.856 50.6023 202.292 49.887 204.469 48.9295C211.715 45.7426 217.702 39.7177 220.896 32.3975C223.317 26.8481 221.685 21.3219 217.096 17.4769C214.249 15.0918 210.763 13.6427 207.282 12.3903C204.866 11.5212 202.324 10.7186 199.781 11.0484C197.426 11.3537 195.872 12.693 194.761 14.4549Z" 
              fill={getToothFillColor(22)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(22)} 
            />
            <text x="206" y="31" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(22)}</text>

            {/* Tooth 23 */}
            <path d="M217.786 41.3085C215.048 46.2447 213.203 51.6508 211.933 57.1644C211.407 59.4456 210.976 61.8149 211.39 64.1194C211.804 66.4239 213.228 68.6741 215.413 69.4404C216.819 69.9339 218.36 69.772 219.831 69.5432C226.444 68.514 232.985 66.1629 238.154 61.8592C241.089 59.4153 243.62 56.1885 244.23 52.3894C244.674 49.618 244.052 46.7438 242.843 44.2167C241.635 41.6897 239.867 39.4779 237.952 37.4473C236.449 35.8522 234.814 34.3314 232.858 33.3636C231.553 32.7178 230.093 32.3393 228.635 32.3892C227.699 32.4209 226.709 32.4897 225.853 32.9096C223.652 33.9898 221.743 35.6252 220.229 37.5579C219.308 38.7327 218.51 40.0018 217.786 41.3085Z" 
              fill={getToothFillColor(23)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(23)} 
            />
            <text x="229" y="51" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(23)}</text>

            {/* Tooth 24 */}
            <path d="M226.176 79.3365C225.384 81.1231 224.682 82.9799 224.472 84.9266C224.262 86.8733 224.587 88.9372 225.701 90.5378C226.559 91.7722 227.831 92.6583 229.175 93.3107C233.316 95.3199 238.114 95.2552 242.697 94.9705C247.469 94.6744 252.476 94.0959 256.374 91.2916C258.417 89.8229 260.055 87.7834 261.06 85.4593C262.198 82.8273 262.516 79.8962 262.44 77.0238C262.363 74.0517 261.864 71.0481 260.575 68.3772C259.286 65.7064 257.149 63.386 254.426 62.2758C253.044 61.7117 251.555 61.4703 250.075 61.287C248.874 61.138 247.659 61.0426 246.449 61.1184C245.276 61.192 244.21 61.5143 243.096 61.8663C241.483 62.376 240.031 63.0385 238.582 63.9349C236.783 65.0484 235.138 66.4058 233.657 67.9229C232.156 69.4593 230.822 71.1583 229.637 72.9545C228.449 74.7552 227.41 76.6549 226.502 78.6152C226.391 78.8544 226.283 79.0951 226.176 79.3365Z" 
              fill={getToothFillColor(24)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(24)} 
            />
            <text x="244" y="76" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(24)}</text>

            {/* Tooth 25 */}
            <path d="M245.145 100.746C241.667 103.998 239.106 108.443 238.798 113.228C238.49 118.013 240.715 123.064 244.837 125.421C247.29 126.824 250.17 127.21 252.977 127.44C256.405 127.72 259.896 127.802 263.242 126.996C269.216 125.557 274.471 121.09 276.614 115.26C278.757 109.43 277.58 102.402 273.429 97.8176C270.692 94.7948 266.718 92.9967 262.687 92.7964C258.652 92.596 255.039 94.4207 251.545 96.2709C249.243 97.4904 247.057 98.9573 245.145 100.746Z" 
              fill={getToothFillColor(25)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(25)} 
            />
            <text x="258" y="113" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(25)}</text>

            {/* Tooth 26 */}
            <path d="M260.801 164.965C266.673 169.001 274.469 169.706 281.208 167.452C286.23 165.773 291.085 161.968 291.866 156.667C292.459 152.636 290.615 148.711 289.479 144.802C289.059 143.359 288.734 141.892 288.387 140.431C287.369 136.143 285.853 130.863 282.123 128.154C278.922 125.829 274.565 125.861 270.762 126.9C263.321 128.933 256.938 134.604 253.976 141.812C251.573 147.657 251.923 153.804 255.284 159.167C256.566 161.214 258.21 163.033 260.13 164.482C260.35 164.648 260.574 164.809 260.801 164.965Z" 
              fill={getToothFillColor(26)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(26)} 
            />
            <text x="271" y="145" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(26)}</text>

            {/* Tooth 27 */}
            <path d="M263.039 200.67C263.683 203.798 264.741 206.951 266.874 209.306C268.314 210.896 270.175 212.04 272.104 212.957C276.617 215.102 281.655 216.1 286.633 215.838C290.615 215.628 294.621 214.585 297.933 212.335C301.244 210.084 303.797 206.541 304.388 202.545C304.743 200.146 304.397 197.704 304.051 195.303C303.393 190.737 302.736 186.171 302.078 181.606C301.786 179.575 301.482 177.507 300.598 175.66C298.504 171.289 293.445 169.004 288.65 168.964C283.855 168.924 279.247 170.738 274.863 172.707C272.288 173.864 269.712 175.102 267.526 176.901C265.292 178.739 263.594 181.155 262.981 184.029C262.241 187.502 262.046 191.139 262.254 194.679C262.371 196.692 262.633 198.696 263.039 200.67Z" 
              fill={getToothFillColor(27)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(27)} 
            />
            <text x="283" y="192" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(27)}</text>

            {/* Tooth 28 */}
            <path d="M266.175 236.83C266.975 241.888 266.956 242.048 267.964 246.097C268.29 247.406 268.558 251.309 269.869 253.798C272.136 258.099 277.358 259.816 282.06 260.854C286.276 261.784 290.643 262.262 294.908 261.603C305.75 259.928 308.753 255.227 309.928 247.321C310.474 243.646 310.339 239.86 309.642 236.211C308.124 228.258 307.927 224.148 303.086 220.554C299.606 217.972 295.001 217.54 290.7 217.869C285.896 218.236 280.764 218.851 276.357 220.818C274.113 221.82 271.954 223.017 269.914 224.396C268.163 225.58 266.635 227.583 266.183 229.662C265.678 231.991 265.777 234.312 266.175 236.83Z" 
              fill={getToothFillColor(28)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(28)} 
            />
            <text x="288" y="240" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(28)}</text>
          </g>

          {/* Bite Line */}
          <line x1="80" y1="30" x2="320" y2="325" stroke="#ddd" strokeWidth="1" strokeDasharray="3,2" />
          <rect x="170" y="317" width="60" height="16" rx="8" fill="white" stroke="#e5e5e5" strokeWidth="0.5" />
          <text x="200" y="325" fill="#666" textAnchor="middle" dominantBaseline="middle" className="text-xs font-medium">
            Bite Line
          </text>

          {/* Lower Jaw Teeth */}
          <g transform="translate(50, 340)">
            {/* Tooth 31 */}
            <path d="M181.369 260.153C182.095 260.082 182.820 259.997 183.542 259.889C184.978 259.672 186.411 259.363 187.773 258.844C189.060 258.353 190.292 257.662 191.273 256.673C191.506 256.438 191.720 256.154 191.910 255.881C192.115 255.586 192.278 255.262 192.409 254.927C192.677 254.248 192.823 253.527 192.963 252.812C193 252.621 193.036 252.427 193.04 252.232C193.043 252.074 193.017 251.918 193.027 251.760C193.083 250.855 192.935 249.934 192.774 249.045C192.097 245.289 190.430 241.800 188.772 238.405C185.730 232.176 182.359 225.585 176.384 222.173C174.268 220.964 171.792 220.210 169.403 220.658C164.691 221.541 162.008 226.515 160.198 231.010C157.248 238.334 154.796 246.298 156.292 254.063C156.618 255.758 157.164 257.478 158.326 258.742C160.507 261.117 164.125 261.228 167.325 261.106C172.014 260.929 176.698 260.611 181.369 260.153Z" 
              fill={getToothFillColor(31)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(31)} 
            />
            <text x="174" y="240" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(31)}</text>

            {/* Tooth 32 */}
            <path d="M194.761 247.545C193.734 245.919 193.085 243.932 192.532 242.066C191.084 237.183 190.739 232.018 190.906 226.944C191.079 221.645 191.252 213.712 197.563 212.015C199.856 211.398 202.292 212.113 204.469 213.07C211.715 216.257 217.702 222.282 220.896 229.602C223.317 235.152 221.685 240.678 217.096 244.523C214.249 246.908 210.763 248.357 207.282 249.61C204.866 250.479 202.324 251.281 199.781 250.952C197.426 250.646 195.872 249.307 194.761 247.545Z" 
              fill={getToothFillColor(32)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(32)} 
            />
            <text x="206" y="231" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(32)}</text>

            {/* Tooth 33 */}
            <path d="M217.786 220.691C215.048 215.755 213.203 210.349 211.933 204.836C211.407 202.554 210.976 200.185 211.39 197.881C211.804 195.576 213.228 193.326 215.413 192.56C216.819 192.066 218.36 192.228 219.831 192.457C226.444 193.486 232.985 195.837 238.154 200.141C241.089 202.585 243.62 205.812 244.23 209.611C244.674 212.382 244.052 215.256 242.843 217.783C241.635 220.31 239.867 222.522 237.952 224.553C236.449 226.148 234.814 227.669 232.858 228.636C231.553 229.282 230.093 229.661 228.635 229.611C227.699 229.579 226.709 229.51 225.853 229.09C223.652 228.01 221.743 226.375 220.229 224.442C219.308 223.267 218.51 221.998 217.786 220.691Z" 
              fill={getToothFillColor(33)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(33)} 
            />
            <text x="229" y="211" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(33)}</text>

            {/* Tooth 34 */}
            <path d="M226.176 182.664C225.384 180.877 224.682 179.02 224.472 177.073C224.262 175.127 224.587 173.063 225.701 171.462C226.559 170.228 227.831 169.342 229.175 168.689C233.316 166.68 238.114 166.745 242.697 167.029C247.469 167.326 252.476 167.904 256.374 170.708C258.417 172.177 260.055 174.217 261.06 176.541C262.198 179.173 262.516 182.104 262.44 184.976C262.363 187.948 261.864 190.952 260.575 193.623C259.286 196.294 257.149 198.614 254.426 199.724C253.044 200.288 251.555 200.53 250.075 200.713C248.874 200.862 247.659 200.957 246.449 200.882C245.276 200.808 244.21 200.486 243.096 200.134C241.483 199.624 240.031 198.962 238.582 198.065C236.783 196.952 235.138 195.594 233.657 194.077C232.156 192.541 230.822 190.842 229.637 189.046C228.449 187.245 227.41 185.345 226.502 183.385C226.391 183.146 226.283 182.905 226.176 182.664Z" 
              fill={getToothFillColor(34)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(34)} 
            />
            <text x="244" y="186" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(34)}</text>

            {/* Tooth 35 */}
            <path d="M245.145 161.254C241.667 158.002 239.106 153.557 238.798 148.772C238.49 143.987 240.715 138.936 244.837 136.579C247.29 135.176 250.17 134.79 252.977 134.56C256.405 134.28 259.896 134.198 263.242 135.004C269.216 136.443 274.471 140.91 276.614 146.74C278.757 152.57 277.58 159.598 273.429 164.182C270.692 167.205 266.718 169.003 262.687 169.204C258.652 169.404 255.039 167.579 251.545 165.729C249.243 164.51 247.057 163.043 245.145 161.254Z" 
              fill={getToothFillColor(35)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(35)} 
            />
            <text x="258" y="149" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(35)}</text>

            {/* Tooth 36 */}
            <path d="M260.801 97.0352C266.673 92.9988 274.469 92.2938 281.208 94.5477C286.23 96.2275 291.085 100.032 291.866 105.333C292.459 109.364 290.615 113.289 289.479 117.198C289.059 118.641 288.734 120.108 288.387 121.569C287.369 125.857 285.853 131.137 282.123 133.846C278.922 136.171 274.565 136.139 270.762 135.1C263.321 133.067 256.938 127.396 253.976 120.188C251.573 114.343 251.923 108.196 255.284 102.833C256.566 100.786 258.21 98.9675 260.13 97.5184C260.35 97.352 260.574 97.1912 260.801 97.0352Z" 
              fill={getToothFillColor(36)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(36)} 
            />
            <text x="271" y="117" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(36)}</text>

            {/* Tooth 37 */}
            <path d="M263.039 61.3303C263.683 58.2018 264.741 55.0488 266.874 52.6944C268.314 51.1041 270.175 49.96 272.104 49.0432C276.617 46.8984 281.655 45.8995 286.633 46.1624C290.615 46.3723 294.621 47.4152 297.933 49.6653C301.244 51.9155 303.797 55.4591 304.388 59.4545C304.743 61.8541 304.397 64.2965 304.051 66.6971C303.393 71.2629 302.736 75.8287 302.078 80.3941C301.786 82.4251 301.482 84.4934 300.598 86.3399C298.504 90.7109 293.445 92.9962 288.65 93.0365C283.855 93.0764 279.247 91.2624 274.863 89.2932C272.288 88.1365 269.712 86.8981 267.526 85.0989C265.292 83.2609 263.594 80.8451 262.981 77.9706C262.241 74.4983 262.046 70.8615 262.254 67.3211C262.371 65.3083 262.633 63.3043 263.039 61.3303Z" 
              fill={getToothFillColor(37)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(37)} 
            />
            <text x="283" y="70" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(37)}</text>

            {/* Tooth 38 */}
            <path d="M266.175 23.1701C266.975 18.1119 266.956 17.9522 267.964 13.9025C268.29 12.5935 268.558 8.69087 269.869 6.20226C272.136 1.90115 277.358 0.183693 282.06 -0.853597C286.276 -1.78369 290.643 -2.26166 294.908 -1.60291C305.75 0.071693 308.753 4.77274 309.928 12.6792C310.474 16.3545 310.339 20.14 309.642 23.789C308.124 31.742 307.927 35.852 303.086 39.4456C299.606 42.0284 295.001 42.4599 290.7 42.1308C285.896 41.7638 280.764 41.1494 276.357 39.1816C274.113 38.1798 271.954 36.9832 269.914 35.604C268.163 34.4199 266.635 32.4174 266.183 30.3384C265.678 28.0095 265.777 25.6879 266.175 23.1701Z" 
              fill={getToothFillColor(38)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(38)} 
            />
            <text x="288" y="22" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(38)}</text>

            {/* Lower Right Quadrant - Teeth 48-41 */}
            {/* Tooth 41 */}
            <path d="M128.916 260.153C128.19 260.082 127.465 259.997 126.743 259.889C125.307 259.672 123.874 259.363 122.512 258.844C121.225 258.353 119.992 257.662 119.012 256.673C118.779 256.438 118.565 256.154 118.375 255.881C118.17 255.586 118.007 255.262 117.875 254.927C117.607 254.248 117.461 253.527 117.322 252.812C117.285 252.621 117.248 252.427 117.244 252.232C117.241 252.074 117.268 251.918 117.258 251.76C117.202 250.855 117.35 249.934 117.51 249.045C118.188 245.289 119.854 241.8 121.512 238.405C124.554 232.176 127.925 225.585 133.9 222.173C136.016 220.964 138.493 220.21 140.881 220.658C145.593 221.541 148.276 226.515 150.087 231.01C153.037 238.334 155.487 246.298 153.993 254.063C153.666 255.758 153.12 257.478 151.959 258.742C149.777 261.117 146.159 261.228 142.959 261.106C138.271 260.929 133.587 260.611 128.916 260.153Z" 
              fill={getToothFillColor(41)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(41)} 
            />
            <text x="136" y="240" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(41)}</text>

            {/* Tooth 42 */}
            <path d="M115.527 247.545C116.553 245.919 117.202 243.932 117.755 242.066C119.204 237.183 119.548 232.018 119.382 226.944C119.208 221.645 119.035 213.712 112.725 212.015C110.431 211.398 107.995 212.113 105.818 213.07C98.5724 216.257 92.5856 222.282 89.3913 229.602C86.9698 235.152 88.6025 240.678 93.1916 244.523C96.0385 246.908 99.5247 248.357 103.006 249.61C105.421 250.479 107.964 251.281 110.506 250.952C112.861 250.646 114.415 249.307 115.527 247.545Z" 
              fill={getToothFillColor(42)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(42)} 
            />
            <text x="104" y="231" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(42)}</text>

            {/* Tooth 43 */}
            <path d="M92.5018 220.691C95.2389 215.755 97.0839 210.349 98.3547 204.836C98.8805 202.554 99.311 200.185 98.8972 197.881C98.4835 195.576 97.0591 193.326 94.8744 192.56C93.4679 192.066 91.9271 192.228 90.456 192.457C83.8435 193.486 77.3021 195.837 72.1336 200.141C69.1987 202.585 66.667 205.812 66.0577 209.611C65.613 212.382 66.2358 215.256 67.4442 217.783C68.6522 220.31 70.4206 222.522 72.335 224.553C73.8385 226.148 75.4731 227.669 77.4294 228.636C78.7345 229.282 80.1942 229.661 81.6522 229.611C82.5887 229.579 83.5786 229.51 84.4342 229.09C86.6357 228.01 88.5446 226.375 90.0587 224.442C90.9785 223.267 91.7772 221.998 92.5018 220.691Z" 
              fill={getToothFillColor(43)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(43)} 
            />
            <text x="81" y="211" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(43)}</text>

            {/* Tooth 44 */}
            <path d="M84.1115 182.664C84.9028 180.877 85.6052 179.02 85.815 177.073C86.0247 175.127 85.7004 173.063 84.5865 171.462C83.7277 170.228 82.4565 169.342 81.1124 168.689C76.971 166.68 72.1736 166.745 67.5903 167.029C62.8177 167.326 57.8115 167.904 53.9127 170.708C51.8703 172.177 50.2321 174.217 49.2269 176.541C48.089 179.173 47.7712 182.104 47.8464 184.976C47.9241 187.948 48.4225 190.952 49.7115 193.623C51.0005 196.294 53.1382 198.614 55.8603 199.724C57.2431 200.288 58.7317 200.53 60.2115 200.713C61.413 200.862 62.6279 200.957 63.8381 200.882C65.0104 200.808 66.0769 200.486 67.1904 200.134C68.8038 199.624 70.2559 198.962 71.7044 198.065C73.5034 196.952 75.1486 195.594 76.6299 194.077C78.1305 192.541 79.4651 190.842 80.6501 189.046C81.8381 187.245 82.8776 185.345 83.7846 183.385C83.8955 183.146 84.0042 182.905 84.1115 182.664Z" 
              fill={getToothFillColor(44)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(44)} 
            />
            <text x="66" y="186" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(44)}</text>

            {/* Tooth 45 */}
            <path d="M65.1418 161.254C68.62 158.002 71.1809 153.557 71.4888 148.772C71.7967 143.987 69.5712 138.936 65.4491 136.579C62.9965 135.176 60.1164 134.79 57.3096 134.56C53.8814 134.28 50.3905 134.198 47.0441 135.004C41.0704 136.443 35.8155 140.91 33.6727 146.74C31.5296 152.57 32.7058 159.598 36.8571 164.182C39.5946 167.205 43.5678 169.003 47.5991 169.204C51.6339 169.404 55.2471 167.579 58.7413 165.729C61.0435 164.51 63.2293 163.043 65.1418 161.254Z" 
              fill={getToothFillColor(45)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(45)} 
            />
            <text x="52" y="149" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(45)}</text>

            {/* Tooth 46 */}
            <path d="M49.4867 97.0352C43.6141 92.9988 35.8187 92.2938 29.0795 94.5477C24.057 96.2275 19.2023 100.032 18.4215 105.333C17.8279 109.364 19.6726 113.289 20.8087 117.198C21.2279 118.641 21.5534 120.108 21.9 121.569C22.9179 125.857 24.4343 131.137 28.1641 133.846C31.3653 136.171 35.7228 136.139 39.5256 135.1C46.966 133.067 53.3491 127.396 56.3117 120.188C58.7138 114.343 58.3643 108.196 55.0037 102.833C53.7212 100.786 52.0772 98.9675 50.157 97.5184C49.9373 97.352 49.7137 97.1912 49.4867 97.0352Z" 
              fill={getToothFillColor(46)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(46)} 
            />
            <text x="39" y="117" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(46)}</text>

            {/* Tooth 47 */}
            <path d="M47.2475 61.3303C46.6039 58.2018 45.5455 55.0488 43.413 52.6944C41.9722 51.1041 40.1122 49.96 38.1828 49.0432C33.67 46.8984 28.6321 45.8995 23.6541 46.1624C19.6721 46.3723 15.6657 47.4152 12.3543 49.6653C9.04288 51.9155 6.48966 55.4591 5.89896 59.4545C5.54433 61.8541 5.89019 64.2965 6.23607 66.6971C6.89353 71.2629 7.55137 75.8287 8.20883 80.3941C8.50144 82.4251 8.80499 84.4934 9.68939 86.3399C11.7833 90.7109 16.8419 92.9962 21.6372 93.0365C26.4324 93.0764 31.0405 91.2624 35.4242 89.2932C37.9989 88.1365 40.5748 86.8981 42.7613 85.0989C44.9946 83.2609 46.693 80.8451 47.3056 77.9706C48.0459 74.4983 48.2407 70.8615 48.0335 67.3211C47.9156 65.3083 47.6536 63.3043 47.2475 61.3303Z" 
              fill={getToothFillColor(47)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(47)} 
            />
            <text x="27" y="70" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(47)}</text>

            {/* Tooth 48 */}
            <path d="M44.112 25.1701C43.3126 20.1119 43.3312 19.9522 42.3235 15.9025C41.9977 14.5935 41.7299 10.6909 40.4182 8.20226C38.1511 3.90115 32.9293 2.18369 28.2271 1.1464C24.0112 0.216311 19.6443 -0.261663 15.3792 0.397088C4.53765 2.07169 1.53458 6.77274 0.359756 14.6792C-0.186061 18.3545 -0.0510812 22.14 0.64542 25.789C2.1632 33.742 2.36022 37.852 7.20143 41.4456C10.681 44.0284 15.2862 44.4599 19.5874 44.1308C24.3911 43.7638 29.5231 43.1494 33.9305 41.1816C36.1743 40.1798 38.3335 38.9832 40.373 37.604C42.1243 36.4199 43.6526 34.4174 44.1039 32.3384C44.6093 30.0095 44.5101 27.6879 44.112 25.1701Z" 
              fill={getToothFillColor(48)} 
              stroke="#000" 
              strokeWidth="0.8" 
              className="cursor-pointer transition-all duration-200 hover:opacity-80" 
              onClick={() => onToothClick(48)} 
            />
            <text x="22" y="22" textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">{getPalmerNotation(48)}</text>
          </g>

          {/* Render saved group connections first (behind temp selection) */}
          {renderSavedGroupConnections()}
          
          {/* Render temp selection overlay on top */}
          {renderTempSelectionOverlay()}
        </svg>
      </div>
    </div>
  );
};

export default ToothChart;
