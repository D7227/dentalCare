import React, { useState } from 'react';
import { ToothGroup } from '../types/tooth';
import ShadeSelectModal from './ShadeSelectModal';
import { AnteriorSVG, PosteriorSVG } from '@/assets/svg';
import { X, CheckCircle } from 'lucide-react';

interface ShadeGuide {
  type: 'anterior' | 'posterior';
  shades: string[];
}

interface ShadeGuideSectionProps {
  selectedGroups: ToothGroup[];
  onShadeGuideChange?: (guide: ShadeGuide | null) => void;
  selectedGuide?: ShadeGuide | null;
}

const ShadeGuideSection = ({ selectedGroups, onShadeGuideChange, selectedGuide }: ShadeGuideSectionProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'anterior' | 'posterior' | null>(null);
  // Store shades for the selected type only
  const [guide, setGuide] = useState<ShadeGuide | null>(null);

  // Sync selectedGuide prop to local state
  React.useEffect(() => {
    if (selectedGuide) {
      setGuide(selectedGuide);
    } else {
      setGuide(null);
    }
  }, [selectedGuide]);

  const handleSVGClick = (type: 'anterior' | 'posterior') => {
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
    // Only keep selected type and its shades
    const validShades = data.shades.filter(shade => shade.value && shade.label).map(s => s.label);
    const newGuide: ShadeGuide = { type: data.type, shades: validShades };
    setGuide(newGuide);
    if (onShadeGuideChange) {
      onShadeGuideChange(newGuide);
    }
    setModalOpen(false);
    setSelectedType(null);
  };

  const handleClearSelection = () => {
    setGuide(null);
    setSelectedType(null);
    setModalOpen(false);
    if (onShadeGuideChange) onShadeGuideChange(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-start gap-24">
        {/* Anterior */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-medium text-gray-700 mb-2">Anterior</span>
          <button
            type="button"
            onClick={() => handleSVGClick('anterior')}
            className={`transition-all ${guide?.type === 'anterior' ? 'ring-2 ring-teal-500' : ''} ${guide?.type === 'posterior' ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80'}`}
            style={{ background: 'none', border: 'none', padding: 0 }}
            disabled={guide?.type === 'posterior'}
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
            className={`transition-all ${guide?.type === 'posterior' ? 'ring-2 ring-teal-500' : ''} ${guide?.type === 'anterior' ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80'}`}
            style={{ background: 'none', border: 'none', padding: 0 }}
            disabled={guide?.type === 'anterior'}
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
        defaultShades={selectedType && guide?.type === selectedType ? (guide.shades.map((label, idx) => ({ part: idx + 1, value: label, label, family: '' })) as any) : [null, null, null]}
      />
      {/* Show selected shade info if needed */}
      {guide && guide?.shades?.length > 0 && (
        <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-medium text-teal-800">
                {guide.type.charAt(0).toUpperCase() + guide.type.slice(1)} Shade Selected
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
            {guide.shades.map((shade, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 px-2 py-1 bg-white border border-teal-200 rounded-md text-xs"
              >
                <span className="text-teal-700 font-medium">Part {index + 1}:</span>
                <span className="text-gray-700">{shade}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export type { ShadeGuide };
export default ShadeGuideSection;
