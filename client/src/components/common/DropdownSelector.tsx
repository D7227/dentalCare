import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropdownSelectorProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const DropdownSelector: React.FC<DropdownSelectorProps> = ({
  options,
  value,
  onChange,
  className = '',
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (option: string) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-2 border rounded-lg border-teal-400 text-black font-medium bg-white hover:bg-teal-50 gap-2"
      >
        <span>{value}</span>
        <ChevronDown className="text-teal-500" size={18} />
      </button>

      {open && (
        <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 hover:bg-teal-50 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownSelector;
