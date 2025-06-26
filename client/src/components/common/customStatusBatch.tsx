import React from 'react';
import { Clock3, RotateCw, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface RoundedIconButtonProps {
  label: 'new' | 'repeat' | 'repair';
  onClick?: () => void;
  className?: string;
}

// Icon and text mapping
const getButtonMap = (label: string) => {
  switch (label.toLowerCase()) {
    case 'new':
      return {
        icon: Clock3,
        text: 'New',
      };
    case 'repeat':
      return {
        icon: RotateCw,
        text: 'Repeat',
      };
    case 'repair':
      return {
        icon: Wrench,
        text: 'Repair',
      };
    default:
      console.error(`Unknown label: ${label}`);
      return null;
  }
};

const CustomStatusBatch: React.FC<RoundedIconButtonProps> = ({
  label ='new',
  onClick,
  className = '',
}) => {
  const config = getButtonMap(label);

  if (!config) return null;
   const { icon: Icon, text } = config;

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] bg-teal-50 text-[#07AD94] font-medium text-base hover:bg-teal-100 transition-all duration-200 border-1 border-[#6B21A80D]',
        className
      )}
    >
      <Icon size={12} />
      <span className='text-12/16'>{text}</span>
    </button>
  );
};

export default CustomStatusBatch;
