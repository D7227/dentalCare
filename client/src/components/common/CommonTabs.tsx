import React from 'react';

interface TabItem {
  label: string;
  value: string;
}

interface CommonTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
  children?: { [key: string]: React.ReactNode };
}

const CommonTabs: React.FC<CommonTabsProps> = ({ tabs, activeTab, onTabChange, className = '', children }) => {
  return (
    <div>
      <div className={`flex w-full rounded-xl border border-customGray-200 bg-white p-1 ${className}`}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150
              ${activeTab === tab.value
                ? 'bg-customPrimery-100 text-white shadow-sm'
                : 'bg-transparent text-gray-700 hover:bg-gray-100'}
            `}
            style={{ minWidth: 0 }}
            onClick={() => onTabChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {children && (
        <div className="mt-4">
          {children[activeTab]}
        </div>
      )}
    </div>
  );
};

export default CommonTabs; 