import React from 'react';
import { ToothGroup } from '../types/tooth';

interface ShadeGuideIconsProps {
  selectedGroups: ToothGroup[];
  onShadePartClick: (toothType: 'posterior' | 'anterior', partIndex: number) => void;
  selectedPart?: {
    type: 'posterior' | 'anterior';
    index: number;
  };
}

const ShadeGuideIcons = ({ selectedGroups, onShadePartClick, selectedPart }: ShadeGuideIconsProps) => {
  const hasPosteriorTeeth = selectedGroups.some(group =>
    group.teeth.some(tooth => {
      return (tooth >= 14 && tooth <= 18) || (tooth >= 24 && tooth <= 28) ||
             (tooth >= 34 && tooth <= 38) || (tooth >= 44 && tooth <= 48);
    })
  );

  const hasAnteriorTeeth = selectedGroups.some(group =>
    group.teeth.some(tooth => {
      return (tooth >= 11 && tooth <= 13) || (tooth >= 21 && tooth <= 23) ||
             (tooth >= 31 && tooth <= 33) || (tooth >= 41 && tooth <= 43);
    })
  );

  return (
    <div className="space-y-6">
      <h3 className="text-base font-semibold text-gray-800">Shade Guide</h3>

      {hasPosteriorTeeth && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Posterior</h4>
          <div className="flex items-center gap-4 flex-wrap">
            {[0, 1, 2].map((index) => (
              <svg
                key={`posterior-${index}`}
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="20"
                viewBox="0 0 60 20"
                fill="none"
                onClick={() => onShadePartClick('posterior', index)}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                <path
                  d={
                    index === 0
                      ? "M28.6 18.1C28.6 18.1 11.5 18.5 1 14.5C1 14.5 0.5 9.0 3.4 5.0C6.4 1.0 10.6 -0.5 16.8 2.9C23.0 6.3 26.9 9.5 33.0 6.8C39.2 4.1 45.6 1.2 49.3 1.0C53.0 0.7 58.8 3.7 58.1 12.7C58.1 12.7 52.0 17.8 28.6 18.1Z"
                      : index === 1
                      ? "M55.4 14.8C55.4 14.8 33.1 23.8 4.8 15.3C4.8 15.3 0.9 8.0 1.0 2.3C1.0 2.3 29.3 12.4 57.8 0.7C57.8 0.7 58.2 0.4 58.1 1.6C58.1 3.6 57.8 9.0 55.4 14.8Z"
                      : "M52.5 1.5C52.5 1.5 47.3 14.3 42.6 14.5C37.9 14.8 33.2 14.1 30.7 13.8C28.1 13.5 22.7 12.4 15.3 14.0C15.3 14.0 4.8 9.8 1.7 1.9C1.7 1.9 24.1 11.8 52.5 1.5Z"
                  }
                  stroke="black"
                  strokeWidth="1.2"
                  fill={selectedPart?.type === 'posterior' && selectedPart.index === index ? '#bfdbfe' : 'white'}
                  className="transition-colors"
                />
              </svg>
            ))}
          </div>
        </div>
      )}

      {hasAnteriorTeeth && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Anterior</h4>
          <div className="flex items-center gap-4 flex-wrap">
            {[0, 1, 2].map((index) => (
              <svg
                key={`anterior-${index}`}
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="20"
                viewBox="0 0 60 20"
                fill="none"
                onClick={() => onShadePartClick('anterior', index)}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                <path
                  d={
                    index === 0
                      ? "M1.8 14.8C1.8 14.8 4.4 8.5 6.7 5.9C9.1 3.2 15.7 -1.6 24.6 2.7C33.6 7.2 36.7 13.9 36.7 13.9C36.7 13.9 21.4 23.4 1.8 14.8Z"
                      : index === 1
                      ? "M1.8 15.6L8.1 2.3C8.1 2.3 12.3 6.2 24.5 6.2C36.8 6.2 42.9 1.9 42.9 1.9C42.9 1.9 45.9 7.7 46.8 15.1C46.8 15.1 33.3 19.6 21.6 18.6C9.9 17.6 8.6 18.5 1.8 15.6Z"
                      : "M49.7 1.8C49.7 1.8 41.0 5.9 27.8 5.5C14.6 5.2 10.0 4.4 5.1 1.8C5.1 1.8 2.8 7.2 2.0 8.7C1.1 10.2 -0.5 13.4 6.8 15.4C6.8 15.4 19.4 15.4 28.4 15.4C37.5 15.4 41.1 15.4 41.1 15.4C41.1 15.4 47.4 13.9 49.1 10.4C50.8 6.9 49.7 1.8 49.7 1.8Z"
                  }
                  stroke="black"
                  strokeWidth="1.2"
                  fill={selectedPart?.type === 'anterior' && selectedPart.index === index ? '#bfdbfe' : 'white'}
                  className="transition-colors"
                />
              </svg>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShadeGuideIcons;
