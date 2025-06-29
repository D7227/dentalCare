
import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ChevronLeft, ChevronRight, ArrowLeft, X } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import OrderCategoryStep from '@/components/order-wizard/OrderCategoryStep';
import NewOrderFlow from '@/components/order-wizard/NewOrderFlow';
import RepeatOrderFlow from '@/components/order-wizard/RepeatOrderFlow';
import RepairOrderFlow from '@/components/order-wizard/RepairOrderFlow';
import AccessoryTagging from '@/components/order-wizard/AccessoryTagging';
import OrderSummary from '@/components/order-wizard/OrderSummary';
import WizardProgress from '@/components/order-wizard/WizardProgress';
import { useOrderValidation } from '@/components/order-wizard/hooks/useOrderValidation';
import { useOrderSteps } from '@/components/order-wizard/hooks/useOrderSteps';
import { OrderCategory, FormData } from '@/components/order-wizard/types/orderTypes';

interface ToothGroup {
  groupId: string;
  teeth: number[];
  type: 'individual' | 'connected';
  notes: string;
  material: string;
  shade: string;
  warning?: string;
}

const PlaceOrder = () => {
  const [location, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [orderCategory, setOrderCategory] = useState<OrderCategory>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepValidationErrors, setStepValidationErrors] = useState<Record<number, string[]>>({});
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { toast } = useToast();
  
  const { validateStep } = useOrderValidation();
  const { getStepsForCategory } = useOrderSteps();
  
  const [formData, setFormData] = useState<FormData>({
    category: null,
    prescriptionType: '',
    orderMethod: '',
    caseHandledBy: '',
    consultingDoctor: '',
    firstName: '',
    lastName: '',
    age: '',
    sex: '',
    restorationType: '',
    productSelection: '',
    toothGroups: [],
    toothNumbers: [],
    abutmentType: 'joint',
    restorationProducts: [],
    ponticDesign: '',
    occlusalStaining: 'medium',
    shadeInstruction: '',
    clearance: '',
    accessories: [],
    otherAccessory: '',
    returnAccessories: undefined,
    notes: '',
    files: [],
    orderType: '',
    expectedDeliveryDate: '',
    pickupDate: '',
    pickupTime: '',
    pickupRemarks: '',
    scanBooking: {
      areaManagerId: '',
      scanDate: '',
      scanTime: '',
      notes: ''
    },
    previousOrderId: '',
    repairOrderId: '',
    issueDescription: '',
    repairType: '',
    returnWithTrial: false
  });
  
  const steps = getStepsForCategory(orderCategory);
  const maxSteps = steps.length - 1;
  
  const validateCurrentStep = (): boolean => {
    const errors = validateStep(currentStep, orderCategory, formData);
    setStepValidationErrors(prev => ({ ...prev, [currentStep]: errors }));
    return errors.length === 0;
  };
  
  const handleCategorySelect = (category: OrderCategory) => {
    setOrderCategory(category);
    setFormData({ ...formData, category });
    setCurrentStep(1);
    setStepValidationErrors({});
  };

  const handleAddMoreProducts = () => {
    // Go back to step 2 (prescription type selection) to add another product group
    setCurrentStep(2);
    // Clear current prescription and order method for new selection
    setFormData({
      ...formData,
      prescriptionType: '',
      orderMethod: ''
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) {
      return;
    }
    setIsSubmitting(true);
    
    console.log("Form data at submission:", JSON.stringify(formData, null, 2));
    
    try {
      // First create the patient if needed
      const patientResponse = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          age: formData.age,
          sex: formData.sex,
        }),
      });
      
      const patient = await patientResponse.json();
      
      // Then create the order
      const orderData = {
        orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        patientId: patient.id,
        type: formData.orderType || 'new',
        category: formData.prescriptionType || formData.category || 'crown-bridge',
        status: 'pending',
        priority: 'standard',
        urgency: 'standard',
        caseHandledBy: formData.caseHandledBy,
        consultingDoctor: formData.consultingDoctor,
        restorationType: formData.restorationType,
        toothGroups: formData.toothGroups || [],
        restorationProducts: formData.restorationProducts || [],
        accessories: formData.accessories || [],
        notes: formData.notes,
        files: formData.files || [],
        orderType: formData.orderType || 'new',
        paymentStatus: 'pending',
      };
      
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }
      
      const order = await orderResponse.json();

      // Create tooth groups for the order
      if (formData.toothGroups && formData.toothGroups.length > 0) {
        for (const toothGroup of formData.toothGroups) {
          const toothGroupData = {
            orderId: order.id,
            groupId: toothGroup.groupId || `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            teeth: toothGroup.teeth,
            type: toothGroup.type,
            notes: toothGroup.notes || '',
            material: toothGroup.material || '',
            shade: toothGroup.shade || '',
          };
          
          try {
            const response = await fetch('/api/tooth-groups', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(toothGroupData),
            });
            
            if (!response.ok) {
              const errorData = await response.json();
              console.error('Failed to create tooth group:', errorData);
            }
          } catch (error) {
            console.error('Error creating tooth group:', error);
          }
        }
      }
      
      // Invalidate the orders cache to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      
      toast({
        title: "Order submitted successfully!",
        description: `Order #${order.id} has been sent to the lab for processing.`
      });
      // Navigation will be handled by the parent component
    } catch (error) {
      console.error('Order submission error:', error);
      toast({
        title: "Submission Error",
        description: "There was an error submitting your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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

  const confirmCancelOrder = () => {
    setShowCancelModal(false);
    window.history.back();
    toast({
      title: "Order Cancelled",
      description: "Your order has been cancelled and unsaved changes were discarded.",
    });
  };

  const renderStepContent = () => {
    if (currentStep === 0) {
      return <OrderCategoryStep onCategorySelect={handleCategorySelect} />;
    }
    
    // Let NewOrderFlow handle its own step 3 content
    // Only override for repair step 4
    const isRepairUploadStep = (orderCategory === 'repair' && currentStep === 4);
    
    if (isRepairUploadStep) {
      return <AccessoryTagging formData={formData} setFormData={setFormData} />;
    }
    
    if (currentStep === maxSteps) {
      return <OrderSummary formData={formData} orderCategory={orderCategory} onEditSection={goToStep} />;
    }
    
    switch (orderCategory) {
      case 'new':
        return <NewOrderFlow 
          currentStep={currentStep} 
          formData={formData} 
          setFormData={setFormData} 
          onAddMoreProducts={handleAddMoreProducts}
        />;
      case 'repeat':
        return <RepeatOrderFlow currentStep={currentStep} formData={formData} setFormData={setFormData} />;
      case 'repair':
        return <RepairOrderFlow currentStep={currentStep} formData={formData} setFormData={setFormData} />;
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
    <div className="min-h-screen bg-gray-50">
      {/* Compact Header */}
      <Card className="sticky top-0 z-50 rounded-none border-x-0 border-t-0 shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => window.history.back()} 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={18} />
                Back
              </Button>
              <div className="h-5 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {getCurrentStepTitle()}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {getCurrentStepDescription()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-muted-foreground bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                Step {currentStep + 1} of {steps.length}
              </div>
              {orderCategory && (
                <Button
                  variant="outline"
                  onClick={handleCancelOrder}
                  className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  <X size={16} />
                  Cancel Order
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Progress Steps */}
          <div className="lg:w-80 flex-shrink-0">
            <Card className="sticky top-24 shadow-sm border border-customGray-200 bg-transparent">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Order Progress</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <WizardProgress steps={steps} currentStep={currentStep} />
              </CardContent>
            </Card>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 min-w-0 bg-transparent">
            <Card className="shadow-sm border bg-transparent !border-customPrimery-200 !bg-[linear-gradient(114deg,_rgba(255,255,255,0)_0%,_rgba(11,128,67,0.1)_98.94%)]">
              <CardContent className="p-6">
                {/* Validation Errors */}
                {currentStepErrors.length > 0 && (
                  <Card className="mb-6 border-red-200 bg-red-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2 text-sm">
                        <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xs font-bold">!</span>
                        Please fix the following errors:
                      </h4>
                      <ul className="space-y-2">
                        {currentStepErrors.map((error, index) => (
                          <li key={index} className="text-sm text-red-700 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0"></span>
                            {error}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Step Content */}
                <form onSubmit={handleSubmit}>
                  {renderStepContent()}
                </form>
              </CardContent>

              {/* Navigation Footer */}
              {orderCategory && (
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-4 py-2"
                    >
                      <ChevronLeft size={16} />
                      {currentStep === 1 ? 'Change Category' : 'Previous'}
                    </Button>
                    
                    <div className="flex items-center gap-3">
                      {currentStep < maxSteps ? (
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="flex items-center gap-2 bg-[#11AB93] hover:bg-[#0F9A82] px-6 py-2"
                          disabled={isSubmitting}
                        >
                          Continue
                          <ChevronRight size={16} />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          onClick={handleSubmit}
                          className="flex items-center gap-2 bg-[#11AB93] hover:bg-[#0F9A82] px-6 py-2"
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
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default PlaceOrder;
