
import React, { useState } from 'react';
import { ToothGroup } from '../types/tooth';
import ShadeSelector from '../ShadeSelector';

interface ShadeGuideSectionProps {
  selectedGroups: ToothGroup[];
}

const ShadeGuideSection = ({
  selectedGroups
}: ShadeGuideSectionProps) => {
  const [showShadeSelector, setShowShadeSelector] = useState(false);
  const [selectedShadeInfo, setSelectedShadeInfo] = useState<{
    toothType: 'posterior' | 'anterior';
    partIndex: number;
  } | null>(null);

  const handleShadePartClick = (toothType: 'posterior' | 'anterior', partIndex: number) => {
    setSelectedShadeInfo({
      toothType,
      partIndex
    });
    setShowShadeSelector(true);
  };

  const handleShadeSelection = (shade: string) => {
    console.log(`Selected shade ${shade} for ${selectedShadeInfo?.toothType} tooth part ${selectedShadeInfo?.partIndex}`);
    setShowShadeSelector(false);
    setSelectedShadeInfo(null);
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-900">Shade Guide</h4>
      
      {/* Anterior and Posterior Side by Side */}
      <div className="flex gap-8">
        {/* Anterior Section */}
        <div className="flex-1 space-y-2">
          <h5 className="text-xs font-medium text-gray-700">Anterior</h5>
          <div className="flex flex-col">
            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="20" viewBox="0 0 38 20" fill="none" className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleShadePartClick('anterior', 0)}>
              <path d="M1.83398 14.8316C1.83398 14.8316 4.45793 8.53757 6.79033 5.91363C9.10558 3.28968 15.7083 -1.66667 24.6949 2.79233C33.6815 7.25132 36.7342 13.957 36.7342 13.957C36.7342 13.957 21.4536 23.4409 1.83398 14.8316Z" stroke="black" strokeWidth="1.372" strokeMiterlimit="10" fill="white" className="hover:fill-blue-100 transition-colors" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="20" viewBox="0 0 48 20" fill="none" className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleShadePartClick('anterior', 1)}>
              <path d="M1.84766 15.6423L8.12455 2.35105C8.12455 2.35105 12.3606 6.26125 24.5885 6.26125C36.8165 6.26125 42.9219 1.93945 42.9219 1.93945C42.9219 1.93945 45.9403 7.719 46.8321 15.1449C46.8321 15.1449 33.3007 19.6211 21.6387 18.6435C9.97675 17.666 8.6905 18.5749 1.84766 15.6423Z" stroke="black" strokeWidth="1.372" strokeMiterlimit="10" fill="white" className="hover:fill-green-100 transition-colors" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="51" height="17" viewBox="0 0 51 17" fill="none" className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleShadePartClick('anterior', 2)}>
              <path d="M49.7468 1.83594C49.7468 1.83594 41.0175 5.91763 27.8292 5.59179C14.6408 5.26594 10.0618 4.44273 5.17405 1.83594C5.17405 1.83594 2.8931 7.28963 2.0013 8.76453C1.1095 10.2394 -0.519748 13.4979 6.88904 15.453C6.88904 15.453 19.4428 15.453 28.4809 15.453C37.5189 15.453 41.189 15.453 41.189 15.453C41.189 15.453 47.4659 13.9781 49.1809 10.4795C50.8959 6.96378 49.7468 1.83594 49.7468 1.83594Z" stroke="black" strokeWidth="1.372" strokeMiterlimit="10" fill="white" className="hover:fill-orange-100 transition-colors" />
            </svg>
          </div>
        </div>

        {/* Posterior Section */}
        <div className="flex-1 space-y-2">
          <h5 className="text-xs font-medium text-gray-700">Posterior</h5>
          <div className="flex flex-col">
            <svg xmlns="http://www.w3.org/2000/svg" width="59" height="19" viewBox="0 0 59 19" fill="none" className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleShadePartClick('posterior', 0)}>
              <path d="M28.6324 18.1308C28.6324 18.1308 11.4996 18.5081 1.03807 14.5636C1.03807 14.5636 0.489267 9.07556 3.45621 5.06247C6.42316 1.04937 10.6935 -0.528427 16.8847 2.90157C23.0758 6.33157 26.9002 9.52146 33.0914 6.82892C39.2825 4.13637 45.6452 1.27232 49.2981 1.01507C52.9511 0.757821 58.8164 3.75907 58.1475 12.6942C58.1475 12.7114 52.0078 17.8392 28.6324 18.1308Z" stroke="black" strokeWidth="1.372" strokeMiterlimit="10" fill="white" className="hover:fill-blue-100 transition-colors" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="59" height="20" viewBox="0 0 59 20" fill="none" className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleShadePartClick('posterior', 1)}>
              <path d="M55.4209 14.8762C55.4209 14.8762 33.1602 23.8628 4.82845 15.305C4.82845 15.305 0.935405 7.99908 1.05545 2.30528C1.05545 2.30528 29.3356 12.4923 57.856 0.744553C57.856 0.744553 58.2848 0.401774 58.1078 1.60213C58.1032 3.64728 57.8549 9.07517 55.4209 14.8762Z" stroke="black" strokeWidth="1.372" strokeMiterlimit="10" fill="white" className="hover:fill-green-100 transition-colors" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="54" height="16" viewBox="0 0 54 16" fill="none" className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleShadePartClick('posterior', 2)}>
              <path d="M52.5415 1.56836C52.5415 1.56836 47.3622 14.3451 42.646 14.5852C37.9469 14.8253 33.2993 14.1564 30.7268 13.8477C28.1543 13.539 22.7177 12.4414 15.3261 14.0878C15.3261 14.0878 4.86458 9.8861 1.70898 1.96281C1.70898 1.96281 24.1755 11.8412 52.5415 1.56836Z" stroke="black" strokeWidth="1.372" strokeMiterlimit="10" fill="white" className="hover:fill-orange-100 transition-colors" />
            </svg>
          </div>
        </div>
      </div>

      {/* Shade Selector Modal */}
      {showShadeSelector && selectedShadeInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Select Shade for {selectedShadeInfo.toothType} tooth part {selectedShadeInfo.partIndex + 1}
            </h3>
            <ShadeSelector onValueChange={handleShadeSelection} placeholder="Choose a shade" />
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowShadeSelector(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShadeGuideSection;
