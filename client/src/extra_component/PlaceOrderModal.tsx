import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import OrderCategoryStep from '@/components/order-wizard/OrderCategoryStep';
import NewOrderFlow from '@/components/order-wizard/NewOrderFlow';
import RepeatOrderFlow from '@/components/order-wizard/RepeatOrderFlow';
import RepairOrderFlow from '@/components/order-wizard/RepairOrderFlow';
import AccessoryTagging from '@/components/order-wizard/AccessoryTagging';
import OrderSummary from '@/components/order-wizard/OrderSummary';
import OrderModalHeader from '@/components/order-wizard/components/OrderModalHeader';
import OrderModalFooter from '@/components/order-wizard/components/OrderModalFooter';
import { useOrderValidation } from '@/components/order-wizard/hooks/useOrderValidation';
import { useOrderSteps } from '@/components/order-wizard/hooks/useOrderSteps';
import { useOrderForm } from '../hooks/shared/useOrderForm';
import { useCreateOrder } from '../hooks/shared/useOrders';
import { OrderFormData, convertToOrderData } from '../types';
import { OrderCategory } from '@/components/order-wizard/types/orderTypes';

interface PlaceOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (orderData: any) => void;
}

const PlaceOrderModal = ({ isOpen, onClose, onSubmit }: PlaceOrderModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [orderCategory, setOrderCategory] = useState<OrderCategory>(null);
  const [stepValidationErrors, setStepValidationErrors] = useState<Record<number, string[]>>({});
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { toast } = useToast();
  
  const createOrderMutation = useCreateOrder((data) => {
    // Reset form and close modal on successful order creation
    resetForm();
    setCurrentStep(0);
    setOrderCategory(null);
    onClose();
  });
  const modalRef = useRef<HTMLDivElement>(null);
  
  const { validateStep } = useOrderValidation();
  const { getStepsForCategory } = useOrderSteps();

  // Use unified form hook instead of local state
  const {
    formData,
    errors,
    isValid,
    updateField,
    updateNestedField,
    updateFormData,
    updatePatientField,
    updateDoctorField,
    updateScanBookingField,
    addToothGroup,
    removeToothGroup,
    updateToothGroup,
    addAccessory,
    removeAccessory,
    validateForm,
    resetForm,
    setFormData
  } = useOrderForm();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !createOrderMutation.isPending) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const steps = getStepsForCategory(orderCategory);
  const maxSteps = steps.length - 1;

  const validateCurrentStep = (): boolean => {
    // Use the unified form validation
    const isFormValid = validateForm();
    // Also use the step-specific validation for wizard flow
    const stepErrors = validateStep(currentStep, orderCategory, formData as any);
    setStepValidationErrors(prev => ({ ...prev, [currentStep]: stepErrors }));
    // Show errors in toast
    if (!isFormValid || stepErrors.length > 0) {
      [...(errors || []), ...(stepErrors || [])].forEach((error) => {
        toast({
          title: 'Validation Error',
          description: error,
          variant: 'destructive',
        });
      });
    }
    return isFormValid && stepErrors.length === 0;
  };

  const handleCategorySelect = (category: OrderCategory) => {
    setOrderCategory(category);
    updateField('orderType', category || 'new');
    setCurrentStep(1);
    setStepValidationErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      return;
    }

    // Use the createOrderMutation to submit the order
    createOrderMutation.mutate(formData);
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(Math.min(maxSteps, currentStep + 1));
    }
  };

  const prevStep = () => {
    if (currentStep === 1 && orderCategory) {
      setCurrentStep(0);
      setOrderCategory(null);
      setStepValidationErrors({});
    } else {
      setCurrentStep(Math.max(0, currentStep - 1));
      setStepValidationErrors(prev => ({ ...prev, [currentStep]: [] }));
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleCancelOrder = () => {
    setShowCancelModal(true);
  };

  const handleClose = () => {
    onClose();
    // Reset state
    setCurrentStep(0);
    setOrderCategory(null);
    setStepValidationErrors({});
    resetForm();
  };

  const confirmCancelOrder = () => {
    setShowCancelModal(false);
    handleClose();
    toast({
      title: "Order Cancelled",
      description: "Your order has been cancelled and unsaved changes were discarded.",
    });
  };

  const renderStepContent = () => {
    if (currentStep === 0) {
      return <OrderCategoryStep onCategorySelect={handleCategorySelect} />;
    }

    const isUploadLogisticsStep = (orderCategory === 'new' && currentStep === 3) || 
                                  (orderCategory === 'repair' && currentStep === 4);

    if (isUploadLogisticsStep) {
      return (
        <AccessoryTagging 
          formData={formData} 
          setFormData={updateFormData}
        />
      );
    }

    if (currentStep === maxSteps) {
      return (
        <OrderSummary 
          formData={formData} 
          orderCategory={orderCategory} 
          onEditSection={goToStep} 
        />
      );
    }

    const flowProps = {
      currentStep,
      formData,
      updateField,
      updateNestedField,
      updateFormData,
      updatePatientField,
      updateDoctorField,
      updateScanBookingField,
      addToothGroup,
      removeToothGroup,
      updateToothGroup,
      addAccessory,
      removeAccessory,
      setFormData, // Pass setFormData to all flows
    };

    const noop = () => {};

    switch (orderCategory) {
      case 'new':
        return <NewOrderFlow {...flowProps} />;
      case 'repeat':
        return <RepeatOrderFlow {...flowProps} setSelectedOrderId={noop} />;
      case 'repair':
        return <RepairOrderFlow {...flowProps} setSelectedOrderId={noop} />;
      default:
        return null;
    }
  };

  const getSubmitButtonText = () => {
    switch (orderCategory) {
      case 'repair': return 'Submit Repair Request';
      case 'repeat': return 'Submit Repeat Order';
      case 'new': return 'Submit New Order';
      default: return 'Submit Order';
    }
  };

  const getCurrentStepTitle = () => {
    const step = steps.find(s => s.number === currentStep);
    return step ? step.title : 'Place New Order';
  };

  const getCurrentStepDescription = () => {
    const step = steps.find(s => s.number === currentStep);
    return step ? step.description : 'Create a new dental lab order';
  };

  const currentStepErrors = stepValidationErrors[currentStep] || [];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          ref={modalRef}
          className="max-w-5xl h-[92vh] flex flex-col bg-white"
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          <OrderModalHeader
            orderCategory={orderCategory}
            steps={steps}
            currentStep={currentStep}
            onCancel={handleCancelOrder}
            getCurrentStepTitle={getCurrentStepTitle}
            getCurrentStepDescription={getCurrentStepDescription}
          />

          <div className="flex-1 flex flex-col min-h-0 py-4">
            {/* Error boxes removed; errors now shown in toast */}
            <div className="flex-1 overflow-y-auto px-2">
              <div className="max-w-5xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {renderStepContent()}
                </form>
              </div>
            </div>

            <OrderModalFooter
              orderCategory={orderCategory}
              currentStep={currentStep}
              maxSteps={maxSteps}
              isSubmitting={createOrderMutation.isPending}
              onPrevStep={prevStep}
              onNextStep={nextStep}
              onSubmit={handleSubmit}
              getSubmitButtonText={getSubmitButtonText}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Order Confirmation Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Cancel Order
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Are you sure you want to cancel this order? All unsaved changes will be lost.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowCancelModal(false)}
              className="px-4 py-2"
            >
              No, Continue
            </Button>
            <Button
              onClick={confirmCancelOrder}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white"
            >
              Yes, Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlaceOrderModal;