import { useRef, useEffect } from 'react';

interface UseModalNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  isSubmitting?: boolean;
}

export const useModalNavigation = ({ isOpen, onClose, isSubmitting }: UseModalNavigationProps) => {
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      // Focus the first input when modal opens
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && !isSubmitting) {
      onClose();
    }
  };

  return {
    firstInputRef,
    handleKeyDown,
  };
};