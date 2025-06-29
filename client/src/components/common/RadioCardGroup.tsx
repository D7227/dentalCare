import React from 'react';
import { cn } from '@/lib/utils';

interface RadioCardOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

interface RadioCardGroupProps {
  options: RadioCardOption[];
  value: string | null;
  onChange: (value: string) => void;
  name: string;
  className?: string;
  cardClassName?: string;
  direction?: 'vertical' | 'horizontal';
  label?: string;
}

const RadioCardGroup: React.FC<RadioCardGroupProps> = ({
  options,
  value,
  onChange,
  name,
  className = '',
  cardClassName = '',
  direction = 'vertical',
  label,
}) => {
  return (
    <div className={cn('p-4 rounded-lg border border-blue-200 bg-[#F3FAFF]', className)}>
      {label && (
        <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
          {label}
        </h4>
      )}
      <div className={direction === 'vertical' ? 'space-y-3' : 'flex gap-3'}>
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'flex items-center space-x-3 p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer',
              value === option.value ? 'border-[#2563eb] ring-2 ring-[#2563eb]' : 'border-gray-200',
              option.disabled && 'opacity-60 pointer-events-none',
              cardClassName
            )}
            htmlFor={`${name}-${option.value}`}
          >
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="w-5 h-5 text-[#2563eb] border-gray-300 focus:ring-[#2563eb] accent-[#2563eb]"
              disabled={option.disabled}
            />
            {option.icon && (
              <span className="w-6 h-6 rounded-[6px] flex items-center justify-center flex-shrink-0 bg-[#E2F4F1]">
                {option.icon}
              </span>
            )}
            <span className="text-base font-medium text-gray-900 flex-1 flex items-center space-x-2">
              {option.label}
            </span>
            {option.description && (
              <span className="text-xs text-gray-500 ml-2">{option.description}</span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioCardGroup; 