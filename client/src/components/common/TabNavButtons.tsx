import React from 'react';
import { FileText, MessageCircle, Package, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface TabNavButtonsProps {
  activeTab: string;
  onChange: (id: string) => void;
}

const TABS: TabOption[] = [
  { id: 'overview', label: 'Overview', icon: <FileText size={16} /> },
  { id: 'chat', label: 'Chat', icon: <MessageCircle size={16} /> },
  { id: 'pickup', label: 'Pickup', icon: <Package size={16} /> },
  { id: 'payment', label: 'Payment', icon: <CreditCard size={16} /> },
];

const TabNavButtons: React.FC<TabNavButtonsProps> = ({ activeTab, onChange }) => {
  return (
    <div className="inline-flex items-center gap-2 p-1 bg-teal-50 rounded-lg">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors',
            activeTab === tab.id
              ? 'bg-white text-teal-600 border border-teal-500'
              : 'text-gray-600 hover:text-teal-600'
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavButtons;
