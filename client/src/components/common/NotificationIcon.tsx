import React from 'react';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationIconProps {
  unreadCount?: number;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  showBadge?: boolean;
  maxCount?: number;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({
  unreadCount = 0,
  borderColor = '#e5e7eb', // light gray
  borderWidth = 1,
  borderStyle = 'solid',
  size = 'md',
  onClick,
  className,
  showBadge = true,
  maxCount = 99,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const badgeSizes = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-5 h-5 text-sm',
    lg: 'w-6 h-6 text-base',
  };

  const displayCount = unreadCount > maxCount ? `${maxCount}+` : unreadCount.toString();

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-lg cursor-pointer transition-all duration-200 hover:scale-105',
        sizeClasses[size],
        className
      )}
      style={{
        border: `${borderWidth}px ${borderStyle} ${borderColor}`,
        backgroundColor: 'white',
      }}
      onClick={onClick}
    >
      {/* Bell Icon */}
      <Bell
        size={iconSizes[size]}
        className="text-gray-800"
        strokeWidth={1.5}
      />
      
      {/* Unread Badge */}
      {showBadge && unreadCount > 0 && (
        <div
          className={cn(
            'absolute -top-1 -right-1 bg-red-500 text-white rounded-full flex items-center justify-center font-medium',
            badgeSizes[size]
          )}
        >
          {displayCount}
        </div>
      )}
    </div>
  );
};

export default NotificationIcon; 