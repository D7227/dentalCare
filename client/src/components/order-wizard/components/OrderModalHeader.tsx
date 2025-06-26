
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import WizardProgress from '../WizardProgress';
import { OrderCategory, Step } from '../types/orderTypes';

interface OrderModalHeaderProps {
  orderCategory: OrderCategory;
  steps: Step[];
  currentStep: number;
  onCancel: () => void;
  getCurrentStepTitle: () => string;
  getCurrentStepDescription: () => string;
}

const OrderModalHeader = ({
  orderCategory,
  steps,
  currentStep,
  onCancel,
  getCurrentStepTitle,
  getCurrentStepDescription
}: OrderModalHeaderProps) => {
  return (
    <DialogHeader className="flex-shrink-0 space-y-3 pb-4 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <DialogTitle className="text-xl font-semibold text-gray-900 tracking-tight">
            {getCurrentStepTitle()}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {getCurrentStepDescription()}
          </DialogDescription>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
            Step {currentStep + 1} of {steps.length}
          </div>
          {orderCategory && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <X size={14} />
              Cancel
            </Button>
          )}
        </div>
      </div>
      
      <WizardProgress steps={steps} currentStep={currentStep} />
    </DialogHeader>
  );
};

export default OrderModalHeader;
