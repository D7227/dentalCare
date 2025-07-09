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

const SelectedTeethViewer: React.FC<SelectedTeethViewerProps> = ({ selectedTeeth, toothGroups }) => {
  return (
    <div className="flex flex-col items-center my-0 py-0 w-full px-2 md:px-0" style={{ width: '100%', maxWidth: 420, overflowX: 'auto' }}>
      {/* Render group teeth in order below the SVG for clarity */}
      <div className="w-full mt-4 space-y-2">
        {toothGroups.map((group, gIdx) => (
          <div key={gIdx} className="flex flex-wrap gap-2 items-center">
            <span className="font-semibold text-xs mr-2">
              {group.groupType === 'bridge' ? 'Bridge Group:' : group.groupType === 'joint' ? 'Joint Group:' : 'Group:'}
            </span>
            {group.teethDetails && group.teethDetails.flat().map((tooth, idx) => (
              <span key={idx} className={`px-2 py-1 rounded text-xs font-mono ${tooth.type === 'pontic' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'}`}>
                {tooth.teethNumber} ({tooth.type === 'pontic' ? 'P' : 'A'})
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedTeethViewer; 