import React from 'react';
import { Heart, FileText } from 'lucide-react';

interface ToothSelectionProps {
  toothGroups: any[];
}

const ToothSelection = ({ toothGroups }: ToothSelectionProps) => {
  // Parse teeth from tooth groups
  const getAllTeeth = () => {
    const allTeeth: number[] = [];
    toothGroups.forEach(group => {
      if (group.teeth && Array.isArray(group.teeth)) {
        allTeeth.push(...group.teeth.map((tooth: any) => parseInt(tooth)));
      }
    });
    return Array.from(new Set(allTeeth)).sort((a, b) => a - b);
  };

  const selectedTeeth = getAllTeeth();

  // Dental chart layout (FDI notation)
  const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  const renderTooth = (toothNumber: number) => {
    const isSelected = selectedTeeth.includes(toothNumber);
    
    return (
      <div
        key={toothNumber}
        className={`
          w-10 h-12 border-2 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200
          ${isSelected 
            ? 'bg-teal-500 text-white border-teal-600 shadow-lg transform scale-105' 
            : 'bg-gray-50 text-gray-500 border-gray-300 hover:bg-gray-100'
          }
        `}
      >
        {toothNumber}
      </div>
    );
  };

  if (!toothGroups || toothGroups.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Heart className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p>No teeth selected for this order</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-teal-600" />
        <h4 className="font-medium text-gray-900 dark:text-gray-100">Selected Teeth & Abutment Information</h4>
      </div>

      {/* Dental Chart */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
        <div className="max-w-4xl mx-auto">
          {/* Upper Arch */}
          <div className="mb-8">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">Upper Arch</div>
            <div className="flex justify-center gap-2">
              {upperTeeth.map(renderTooth)}
            </div>
          </div>

          {/* Lower Arch */}
          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">Lower Arch</div>
            <div className="flex justify-center gap-2">
              {lowerTeeth.map(renderTooth)}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Teeth Summary */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Selected:</span>
          {selectedTeeth.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedTeeth.map(tooth => (
                <span 
                  key={tooth}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100"
                >
                  {tooth}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-sm text-gray-500">No teeth selected</span>
          )}
        </div>
      </div>

      {/* Tooth Group Details */}
      {toothGroups.map((group, index) => (
        <div key={group.id || index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <label className="font-medium text-gray-700 dark:text-gray-300">Type</label>
              <p className="text-gray-900 dark:text-gray-100 capitalize">{group.type || 'Not specified'}</p>
            </div>
            <div>
              <label className="font-medium text-gray-700 dark:text-gray-300">Material</label>
              <p className="text-gray-900 dark:text-gray-100">{group.material || 'Not specified'}</p>
            </div>
            <div>
              <label className="font-medium text-gray-700 dark:text-gray-300">Shade</label>
              <p className="text-gray-900 dark:text-gray-100">{group.shade || 'Not specified'}</p>
            </div>
            <div>
              <label className="font-medium text-gray-700 dark:text-gray-300">Teeth Count</label>
              <p className="text-gray-900 dark:text-gray-100">
                {group.teeth ? (Array.isArray(group.teeth) ? group.teeth.length : 1) : 0}
              </p>
            </div>
          </div>
          {group.notes && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-600">
              <label className="font-medium text-gray-700 dark:text-gray-300">Notes</label>
              <p className="text-gray-900 dark:text-gray-100 text-sm mt-1">{group.notes}</p>
            </div>
          )}
        </div>
      ))}

      {/* Special Instructions */}
      <div className="mt-8">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Special Instructions</h4>
        <div className="border border-gray-200 rounded-lg p-4">
          <textarea 
            className="w-full h-20 resize-none border-0 focus:ring-0 text-sm text-gray-700 placeholder-gray-400"
            placeholder="Custom retainer post-treatment"
            defaultValue="Custom retainer post-treatment"
            readOnly
          />
        </div>
      </div>

      {/* Files & Attachments */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-gray-600" />
          <h4 className="text-lg font-semibold text-gray-900">Files & Attachments</h4>
        </div>
        <div className="border border-gray-200 rounded-lg p-8 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">No files attached to this order.</p>
        </div>
      </div>
    </div>
  );
};

export default ToothSelection;