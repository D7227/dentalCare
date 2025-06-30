import React, { useState, useEffect } from 'react';
import ShadeSelector, { ShadeOption } from '../ShadeSelector';

interface ShadeSelectModalProps {
  open: boolean;
  onClose: () => void;
  toothType: 'anterior' | 'posterior';
  onSelect: (data: {
    type: 'anterior' | 'posterior';
    shades: { part: number; value: string; label: string; family: string }[];
  }) => void;
  defaultShades?: (ShadeOption | null)[];
}

const ShadeSelectModal: React.FC<ShadeSelectModalProps> = ({ open, onClose, toothType, onSelect, defaultShades }) => {
  const [shades, setShades] = useState<(ShadeOption | null)[]>(defaultShades || [null, null, null]);

  // Reset shades when modal opens, using defaultShades if provided
  useEffect(() => {
    if (open) {
      setShades(defaultShades || [null, null, null]);
    }
  }, [open, defaultShades]);

  const handleChange = (index: number, shade: ShadeOption | null) => {
    setShades(prev => {
      const updated = [...prev];
      updated[index] = shade;
      return updated;
    });
  };

  const handleSave = () => {
    const selectedShades = shades.map((opt, idx) => ({
      part: idx + 1,
      value: opt?.value || '',
      label: opt?.label || '',
      family: opt?.family || ''
    }));
    onSelect({ type: toothType, shades: selectedShades });
    onClose();
  };

  // Check if at least one shade is selected
  const hasAtLeastOneShade = shades.some(shade => shade !== null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-4 text-center">
          Select Shade for {toothType} tooth
        </h3>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Select at least one shade (optional field)
        </p>
        {[0, 1, 2].map((part) => (
          <div key={part} className="mb-3">
            <ShadeSelector
              value={shades[part]}
              onValueChange={shade => handleChange(part, shade)}
              label={`Shade Selection Part ${part + 1}`}
              placeholder="Choose a shade (optional)"
              part={part + 1}
            />
          </div>
        ))}
        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!hasAtLeastOneShade}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShadeSelectModal; 