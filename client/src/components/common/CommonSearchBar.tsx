import React from 'react';
import { Search } from 'lucide-react';

interface CommonSearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const CommonSearchBar: React.FC<CommonSearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  autoFocus = false,
  onKeyPress,
}) => {
  return (
    <div
      className={`flex items-center w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 focus-within:border-primary-400 transition shadow-sm ${className}`}
      style={{ minHeight: 44 }}
    >
      <Search className="text-gray-400 mr-2" size={20} />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-base"
        autoFocus={autoFocus}
        onKeyPress={onKeyPress}
      />
    </div>
  );
};

export default CommonSearchBar; 