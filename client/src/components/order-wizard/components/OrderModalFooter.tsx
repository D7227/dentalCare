
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { OrderCategory } from '../types/orderTypes';

interface OrderModalFooterProps {
  orderCategory: OrderCategory;
  currentStep: number;
  maxSteps: number;
  isSubmitting: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSubmit: (e: React.FormEvent) => void;
  getSubmitButtonText: () => string;
}

const OrderModalFooter = ({
  orderCategory,
  currentStep,
  maxSteps,
  isSubmitting,
  onPrevStep,
  onNextStep,
  onSubmit,
  getSubmitButtonText
}: OrderModalFooterProps) => {
  if (!orderCategory) return null;

  return (
    <div className="flex-shrink-0 flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevStep}
        disabled={isSubmitting}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 border-gray-300 hover:bg-gray-50 transition-colors"
      >
        <ChevronLeft size={14} />
        {currentStep === 1 ? 'Change Category' : 'Previous'}
      </Button>
      
      <div className="flex items-center gap-3">
        {currentStep < maxSteps ? (
          <Button
            type="button"
            onClick={onNextStep}
            className="flex items-center gap-2 px-6 py-2 bg-[#11AB93] hover:bg-[#0F9A82] text-white transition-colors"
            disabled={isSubmitting}
          >
            Continue
            <ChevronRight size={14} />
          </Button>
        ) : (
          <Button
            type="submit"
            onClick={onSubmit}
            className="flex items-center gap-2 px-6 py-2 bg-[#11AB93] hover:bg-[#0F9A82] text-white transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              getSubmitButtonText()
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderModalFooter;
