import React, { useState } from 'react';
import { ToothGroup } from '../types/tooth';
import ShadeSelectModal from './ShadeSelectModal';
import { AnteriorSVG, PosteriorSVG } from '@/assets/svg';
import { X, CheckCircle } from 'lucide-react';

interface ShadeGuideSectionProps {
  selectedGroups: ToothGroup[];
}

const ShadeGuideSection = ({ selectedGroups }: ShadeGuideSectionProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'anterior' | 'posterior' | null>(null);
  const [selectedShades, setSelectedShades] = useState<{
    type: 'anterior' | 'posterior';
    shades: { part: number; value: string; label: string; family: string }[];
  } | null>(null);

  const handleSVGClick = (type: 'anterior' | 'posterior') => {
    // If user clicks on the same type that's already selected, allow editing
    if (selectedShades?.type === type) {
      setSelectedType(type);
      setModalOpen(true);
      return;
    }
    
    // If user clicks on different type and there's already a selection, prevent it
    if (selectedShades && selectedShades.type !== type) {
      return; // Don't allow switching between anterior/posterior
    }
    
    setSelectedType(type);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedType(null);
  };

  const handleShadeSelect = (data: {
    type: 'anterior' | 'posterior';
    shades: { part: number; value: string; label: string; family: string }[];
  }) => {
    // Filter out empty shades and only keep selected ones
    const validShades = data.shades.filter(shade => shade.value && shade.label);
    setSelectedShades({
      type: data.type,
      shades: validShades
    });
    setModalOpen(false);
    setSelectedType(null);
  };

  const handleClearSelection = () => {
    setSelectedShades(null);
    setSelectedType(null);
    setModalOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* <h4 className="text-base font-semibold text-gray-900 mb-4">Shade Guide</h4> */}
      <div className="flex justify-start gap-24">
        {/* Anterior */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-medium text-gray-700 mb-2">Anterior</span>
          <button
            type="button"
            onClick={() => handleSVGClick('anterior')}
            className={`transition-all ${selectedShades?.type === 'anterior' ? 'ring-2 ring-teal-500' : ''} ${
              selectedShades && selectedShades.type !== 'anterior' ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80'
            }`}
            style={{ background: 'none', border: 'none', padding: 0 }}
            disabled={!!(selectedShades && selectedShades.type !== 'anterior')}
          >
            <img src={AnteriorSVG} alt="Anterior" width={70} height={60} />
          </button>
        </div>
        {/* Posterior */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-medium text-gray-700 mb-2">Posterior</span>
          <button
            type="button"
            onClick={() => handleSVGClick('posterior')}
            className={`transition-all ${selectedShades?.type === 'posterior' ? 'ring-2 ring-teal-500' : ''} ${
              selectedShades && selectedShades.type !== 'posterior' ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80'
            }`}
            style={{ background: 'none', border: 'none', padding: 0 }}
            disabled={!!(selectedShades && selectedShades.type !== 'posterior')}
          >
            <img src={PosteriorSVG} alt="Posterior" width={70} height={60} />
          </button>
        </div>
      </div>
      
      {/* Shade Selection Modal */}
      <ShadeSelectModal
        open={modalOpen}
        onClose={handleModalClose}
        toothType={selectedType || 'anterior'}
        onSelect={handleShadeSelect}
      />
      
      {/* Show selected shade info if needed */}
      {selectedShades && selectedShades.shades && selectedShades.shades.length > 0 && (
        <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-medium text-teal-800">
                {selectedShades.type.charAt(0).toUpperCase() + selectedShades.type.slice(1)} Shade Selected
              </span>
            </div>
            <button
              type="button"
              onClick={handleClearSelection}
              className="p-1 text-teal-600 hover:text-teal-800 hover:bg-teal-100 rounded transition-colors"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedShades.shades.map((shade, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 px-2 py-1 bg-white border border-teal-200 rounded-md text-xs"
              >
                <span className="text-teal-700 font-medium">Part {shade.part}:</span>
                <span className="text-gray-700">{shade.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShadeGuideSection;
