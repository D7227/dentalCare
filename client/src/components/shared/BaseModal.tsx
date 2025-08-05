import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  badge?: {
    text: string;
    variant: any;
    className?: string;
  };
  children: React.ReactNode;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  className?: string;
  height?: string;
  overflow?: string;
}

const BaseModal = ({
  isOpen,
  onClose,
  title = 'Hello',
  description,
  badge,
  children,
  onKeyDown,
  className = '',
  height,
  overflow
}: BaseModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-[999]`}>
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div
        className={`relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 ${height}  ${overflow && overflow} ${className}`}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              {description && (
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              )}
            </div>
            {badge && (
              <Badge variant={badge.variant} className={badge.className}>
                {badge.text}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BaseModal;