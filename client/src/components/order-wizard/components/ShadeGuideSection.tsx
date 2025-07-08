import React, { useState } from 'react';
import { ToothGroup } from '../types/tooth';
import ShadeSelectModal from './ShadeSelectModal';
import { AnteriorSVG, PosteriorSVG } from '@/assets/svg';
import { X, CheckCircle } from 'lucide-react';

interface ShadeGuideSectionProps {
  selectedGroups: ToothGroup[];
  onShadeGuideChange?: (shades: string[]) => void;
  selectedShades?: string[];
}

const ShadeGuideSection = ({ selectedGroups, onShadeGuideChange, selectedShades }: ShadeGuideSectionProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'anterior' | 'posterior' | null>(null);
  // Store shades for both types
  const [shadesByType, setShadesByType] = useState<{
    anterior: ({ part: number; value: string; label: string; family: string }[]) | null;
    posterior: ({ part: number; value: string; label: string; family: string }[]) | null;
  }>({ anterior: null, posterior: null });

  // Sync selectedShades prop to local state
  React.useEffect(() => {
    if (selectedShades && selectedShades.length > 0) {
      // For simplicity, assign all to anterior if present, otherwise posterior
      setShadesByType(prev => ({
        ...prev,
        anterior: selectedShades.length ? selectedShades.map((label, idx) => ({ part: idx + 1, value: label, label, family: '' })) : null,
      }));
    } else {
      setShadesByType({ anterior: null, posterior: null });
    }
  }, [selectedShades]);

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
    // Filter out empty shades and only keep selected ones
    const validShades = data.shades.filter(shade => shade.value && shade.label);
    setShadesByType(prev => ({ ...prev, [data.type]: validShades }));
    if (onShadeGuideChange) {
      // Merge all selected shade labels from both types
      const allLabels = [
        ...(data.type === 'anterior' && shadesByType.posterior ? shadesByType.posterior.map(s => s.label) : []),
        ...(data.type === 'posterior' && shadesByType.anterior ? shadesByType.anterior.map(s => s.label) : []),
        ...validShades.map(s => s.label)
      ];
      onShadeGuideChange(allLabels);
    }
    setModalOpen(false);
    setSelectedType(null);
  };

  const handleClearSelection = () => {
    setShadesByType({ anterior: null, posterior: null });
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
            className={`transition-all ${shadesByType.anterior ? 'ring-2 ring-teal-500' : ''} ${
              shadesByType.posterior ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80'
            }`}
            style={{ background: 'none', border: 'none', padding: 0 }}
            disabled={!!shadesByType.posterior}
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
            className={`transition-all ${shadesByType.posterior ? 'ring-2 ring-teal-500' : ''} ${
              shadesByType.anterior ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80'
            }`}
            style={{ background: 'none', border: 'none', padding: 0 }}
            disabled={!!shadesByType.anterior}
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
        defaultShades={selectedType ? (shadesByType[selectedType] || [null, null, null]) : [null, null, null]}
      />
      
      {/* Show selected shade info if needed */}
      {(['anterior', 'posterior'] as const).map(type => (
        shadesByType[type] && shadesByType[type]!.length > 0 && (
          <div key={type} className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-medium text-teal-800">
                  {type.charAt(0).toUpperCase() + type.slice(1)} Shade Selected
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
              {shadesByType[type]!.map((shade, index) => (
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
        )
      ))}
    </div>
  );
};

export default ShadeGuideSection;
