
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ToothTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  toothNumber: number;
  position: { x: number; y: number };
  onSelectType: (type: 'abutment' | 'pontic') => void;
}

const ToothTypeDialog = ({
  isOpen,
  onClose,
  toothNumber,
  position,
  onSelectType
}: ToothTypeDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-xs p-4"
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-sm">
            Tooth {toothNumber}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Button
            onClick={() => onSelectType('abutment')}
            className="w-full text-sm bg-blue-600 hover:bg-blue-700"
          >
            Abutment
          </Button>
          <Button
            onClick={() => onSelectType('pontic')}
            className="w-full text-sm bg-purple-600 hover:bg-purple-700"
          >
            Pontic
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ToothTypeDialog;
