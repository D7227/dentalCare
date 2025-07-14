import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronLeft, ChevronRight, ArrowLeft, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import OrderCategoryStep from "@/components/order-wizard/OrderCategoryStep";
import NewOrderFlow from "@/components/order-wizard/NewOrderFlow";
import RepeatOrderFlow from "@/components/order-wizard/RepeatOrderFlow";
import RepairOrderFlow from "@/components/order-wizard/RepairOrderFlow";
import AccessoryTagging from "@/components/order-wizard/AccessoryTagging";
import OrderSummary from "@/components/order-wizard/OrderSummary";
import WizardProgress from "@/components/order-wizard/WizardProgress";
import { useOrderValidation } from "@/components/order-wizard/hooks/useOrderValidation";
import { useOrderSteps } from "@/components/order-wizard/hooks/useOrderSteps";
import { OrderCategoryType } from "@/components/order-wizard/types/orderTypes";
import CustomButton from "@/components/common/customButtom";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";
import { setOrder, setStep, resetOrder } from "@/store/slices/orderLocalSlice";
import {
  useCreateOrderMutation,
  useUpdateOrderMutation,
} from "@/store/slices/orderApi";
import { useIsMobile } from "@/hooks/use-mobile";
import type { OrderType } from "@/types/orderType";
import { createOrderObject } from "@/utils/orderHelper";

const PlaceOrder = () => {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const { validateStep } = useOrderValidation();
  const { getStepsForCategory } = useOrderSteps();

  // Redux state
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { order, step } = useAppSelector((state) => state.orderLocal);
  const [createOrder, { isLoading: isSubmitting }] = useCreateOrderMutation();
  const [updateOrder] = useUpdateOrderMutation();

  console.log("order, step ", order, step);

  // Handle the New | Repeat | Repair
  const [orderCategory, setOrderCategory] = React.useState<OrderCategoryType>(
    order?.orderType || null
  );
  // Handle CancelOrder Model
  const [showCancelModal, setShowCancelModal] = React.useState(false);
  const [stepValidationErrors, setStepValidationErrors] = React.useState<
    Record<number, string[]>
  >({});
  const [isAuthChecking, setIsAuthChecking] = React.useState(true);
  const [selectedOrderId, setSelectedOrderId] = React.useState<string>(
    order?.orderId || ""
  );

  // Restore persisted user on mount
  useEffect(() => {
    if (!isAuthenticated) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          dispatch(setUser(userData));
        } catch (error) {
          setLocation("/login");
        }
      } else {
        setLocation("/login");
      }
    }
    setIsAuthChecking(false);
  }, [isAuthenticated, dispatch, setLocation]);

  // Restore order/step from Redux on mount
  useEffect(() => {
    if (order?.orderType)
      setOrderCategory(order.orderType as OrderCategoryType);
    if (order?.orderId) setSelectedOrderId(order.orderId);
  }, [order]);

  // Wizard steps
  const orderData: Partial<OrderType> = order;
  const steps = getStepsForCategory(orderCategory, false);
  const maxSteps = steps.length - 1;

  // Step validation
  const validateCurrentStep = (): boolean => {
    // Only validate if step > 0 (skip validation for category selection)
    if (step === 0) return true;
    const errors = validateStep(step, orderCategory, orderData);
    console.log("errors", errors);
    setStepValidationErrors((prev) => ({ ...prev, [step]: errors }));
    return errors.length === 0;
  };

  // Category selection
  const handleCategorySelect = (category: OrderCategoryType) => {
    setOrderCategory(category);
    if (category) handleOrderChange({ orderType: category });
    dispatch(setStep(1));
    setStepValidationErrors({});
  };

  // Add more products
  const handleAddMoreProducts = () => {
    dispatch(setStep(2));
    handleOrderChange({ prescriptionTypesId: [], orderType: "new" });
  };

  // Save order (from NewOrderFlow)
  const handleSaveOrder = () => {
    handleSubmit(new Event("submit") as any);
  };

  // Submit order
  const handleSubmit = async (e: React.FormEvent) => {
    console.log("order", order);
    // e.preventDefault();
    // if (!validateCurrentStep()) {
    //   // Show validation errors in a toast
    //   const errors = stepValidationErrors[step] || [];
    //   if (errors.length > 0) {
    //     toast({
    //       title: "Validation Errors",
    //       description: `<ul>${errors.map(e => `<li>${e}</li>`).join('')}</ul>`,
    //       variant: "destructive",
    //     });
    //   }
    //   return;
    // }
    // try {
    //   if (orderCategory === "repair") {
    //     // Set required fields for repair
    //     const formData: any = { ...order };
    //     formData.category = "repair";
    //     formData.type = "repair";
    //     if (!formData.clinicId) formData.clinicId = user?.clinicId || '';
    //     const orderData = createOrderObject(formData, user?.clinicId || '');
    //     const updateResponse = await fetch(`/api/orders/${selectedOrderId}`, {
    //       method: 'PUT',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(orderData),
    //     });
    //     if (!updateResponse.ok) {
    //       throw new Error('Failed to update order');
    //     }
    //     const updatedOrder = await updateResponse.json();
    //     queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
    //     toast({
    //       title: "Order updated successfully!",
    //       description: `Order #${updatedOrder.id} has been updated.`,
    //     });
    //     window.history.back();
    //     return;
    //   }
    //   if (orderCategory === 'repeat') {
    //     if (!selectedOrderId) {
    //       toast({
    //         title: "Update Error",
    //         description: "No order ID found for update.",
    //         variant: "destructive"
    //       });
    //       return;
    //     }
    //     const formData: any = { ...order };
    //     formData.category = "repeat";
    //     formData.type = "repeat";
    //     if (!formData.clinicId) formData.clinicId = user?.clinicId || '';
    //     const orderData = createOrderObject(formData, user?.clinicId || "");
    //     const updateResponse = await fetch(`/api/orders/${selectedOrderId}`, {
    //       method: "PUT",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(orderData),
    //     });
    //     if (!updateResponse.ok) {
    //       throw new Error('Failed to update order');
    //     }
    //     const updatedOrder = await updateResponse.json();
    //     queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
    //     toast({
    //       title: "Order updated successfully!",
    //       description: `Order #${updatedOrder.id} has been updated.`,
    //     });
    //     window.history.back();
    //     return;
    //   }
    //   // New order logic
    //   const formData: any = { ...order };
    //   formData.accessories = [];
    //   formData.orderStatus = 'pending';
    //   formData.percentage = 10;
    //   formData.type = formData.type || "new";
    //   if (!formData.clinicId) formData.clinicId = user?.clinicId || '';
    //   const orderData = createOrderObject(formData, user?.clinicId || "");
    //   const orderResponse = await fetch('/api/orders', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(orderData),
    //   });
    //   if (!orderResponse.ok) {
    //     throw new Error('Failed to create order');
    //   }
    //   const orderResult = await orderResponse.json();
    //   // Create tooth groups for the order
    //   if (formData.toothGroups && formData.toothGroups.length > 0) {
    //     for (const toothGroup of formData.toothGroups) {
    //       const toothGroupData = {
    //         orderId: orderResult.id,
    //         groupId: `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    //         teeth: toothGroup.teethDetails?.flat().map((detail: any) => detail.teethNumber) || [],
    //         type: toothGroup.groupType || "separate",
    //         notes: toothGroup.shadeNotes || "",
    //         material: toothGroup.selectedProducts?.[0]?.material || "",
    //         shade: toothGroup.shadeDetails || "",
    //       };
    //       try {
    //         const response = await fetch('/api/tooth-groups', {
    //           method: 'POST',
    //           headers: {
    //             'Content-Type': 'application/json',
    //           },
    //           body: JSON.stringify(toothGroupData),
    //         });
    //         if (!response.ok) {
    //           const errorData = await response.json();
    //           console.error('Failed to create tooth group:', errorData);
    //         }
    //       } catch (error) {
    //         console.error('Error creating tooth group:', error);
    //       }
    //     }
    //   }
    //   queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
    //   toast({
    //     title: "Order submitted successfully!",
    //     description: `Order #${orderResult.id} has been sent to the lab for processing.`
    //   });
    //   window.history.back();
    // } catch (error) {
    //   console.error('Order submission error:', error);
    //   toast({
    //     title: "Submission Error",
    //     description: "There was an error submitting your order. Please try again.",
    //     variant: "destructive"
    //   });
    // }
  };

  // Step navigation
  const nextStep = () => {
    const isValid = validateCurrentStep();
    const errors = stepValidationErrors[step] || [];
    if (!isValid && errors.length > 0) {
      toast({
        title: "Validation Errors",
        description: (
          <ul className="space-y-1 sm:space-y-2">
            {currentStepErrors.map((error, index) => (
              <li
                key={index}
                className="text-xs sm:text-sm text-red-700 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0"></span>
                {error}
              </li>
            ))}
          </ul>
        ),
        variant: "destructive",
      });
      return;
    }
    if (isValid) {
      dispatch(setStep(Math.min(maxSteps, step + 1)));
    }
  };

  const prevStep = () => {
    if (step === 1 && orderCategory) {
      dispatch(setStep(0));
      setOrderCategory(null);
      setStepValidationErrors({});
    } else {
      dispatch(setStep(Math.max(0, step - 1)));
      setStepValidationErrors((prev) => ({ ...prev, [step]: [] }));
    }
  };

  const goToStep = (s: number) => {
    dispatch(setStep(s));
  };

  // Order data update handler
  const handleOrderChange = (partialOrder: Partial<OrderType>) => {
    dispatch(setOrder(partialOrder));
  };

  // Cancel order
  const confirmCancelOrder = () => {
    setShowCancelModal(false);
    window.history.back();
    dispatch(resetOrder());
    toast({
      title: "Order Cancelled",
      description:
        "Your order has been cancelled and unsaved changes were discarded.",
    });
  };

  // Step content
  const renderStepContent = () => {
    if (step === 0) {
      console.log("step", step);
      return <OrderCategoryStep onCategorySelect={handleCategorySelect} />;
    }
    const isRepairUploadStep = orderCategory === "repair" && step === 4;
    if (isRepairUploadStep) {
      return (
        <AccessoryTagging
          formData={orderData}
          setFormData={handleOrderChange}
        />
      );
    }
    if (step === maxSteps) {
      return (
        <OrderSummary
          formData={orderData}
          orderCategory={orderCategory}
          onEditSection={goToStep}
        />
      );
    }
    switch (orderCategory) {
      case "new":
        return (
          <NewOrderFlow
            currentStep={step}
            formData={orderData as any}
            setFormData={handleOrderChange}
            onAddMoreProducts={handleAddMoreProducts}
            onSaveOrder={handleSaveOrder}
            setCurrentStep={(s: number) => dispatch(setStep(s))}
          />
        );
      case "repeat":
        return (
          <RepeatOrderFlow
            currentStep={step}
            formData={orderData}
            setFormData={handleOrderChange}
            setSelectedOrderId={setSelectedOrderId}
          />
        );
      case "repair":
        return (
          <RepairOrderFlow
            currentStep={step}
            formData={orderData}
            setFormData={handleOrderChange}
            setSelectedOrderId={setSelectedOrderId}
          />
        );
      default:
        return null;
    }
  };

  const getSubmitButtonText = () => {
    switch (orderCategory) {
      case "repair":
        return "Submit Repair Request";
      case "repeat":
        return "Submit Repeat Order";
      case "new":
        return "Submit New Order";
      default:
        return "Submit Order";
    }
  };

  const getCurrentStepTitle = () => {
    const s = steps.find((s) => s.number === step);
    return s ? s.title : "Place New Order";
  };
  const getCurrentStepDescription = () => {
    const s = steps.find((s) => s.number === step);
    return s ? s.description : "Create a new dental lab order";
  };
  const currentStepErrors = stepValidationErrors[step] || [];
  console.log("currentStepErrors", currentStepErrors);

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Compact Header */}
      <Card className="sticky top-0 z-50 rounded-none border-x-0 border-t-0 shadow-sm bg-white">
        <div className="max-w-7xl mx-auto">
          <CardContent className="p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between">
              <div className="flex items-center gap-3">
                {!isMobile && (
                  <>
                    <CustomButton
                      variant="blackAndWhite"
                      onClick={() => window.history.back()}
                    >
                      <ArrowLeft size={18} />
                      Back
                    </CustomButton>
                    <div className="h-5 w-px bg-gray-300"></div>
                  </>
                )}
                <div className="flex items-center gap-3 justify-between ">
                  <div>
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                      {getCurrentStepTitle()}
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {getCurrentStepDescription()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {orderCategory && (
                  <div className="flex items-center gap-1 sm:gap-2 bg-mainBrackground px-2 sm:px-3 py-2 rounded-[8px] border border-customGreen-100">
                    {steps.map((stepObj, index) => (
                      <div key={stepObj.number} className="flex items-center">
                        <div
                          className={`
                            w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors
                            ${
                              stepObj.number < step
                                ? "bg-customGreen-100 text-white"
                                : stepObj.number === step
                                ? "bg-customGreen-100 text-white"
                                : "bg-gray-200 text-gray-500"
                            }
                          `}
                        >
                          {index + 1}
                        </div>
                        {index < steps.length - 1 && (
                          <div
                            className={`
                              w-2 sm:w-3 h-0.5 mx-0.5 sm:mx-1
                              ${
                                stepObj.number < step
                                  ? "bg-customGreen-100"
                                  : "bg-gray-200"
                              }
                            `}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {orderCategory && !isMobile && (
                  <Button
                    variant="outline"
                    onClick={() => setShowCancelModal(true)}
                    className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                  >
                    <X size={16} />
                    Cancel Order
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:py-6">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Left Sidebar - Hidden when order category is selected */}
          {!orderCategory && (
            <div className="lg:w-80 flex-shrink-0 order-2 lg:order-1">
              <Card className="lg:sticky lg:top-24 shadow-sm border border-customGray-200 bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
                    Order Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <WizardProgress steps={steps} currentStep={step} />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content Area */}
          <div
            className={`flex-1 min-w-0 bg-transparent order-1 ${
              orderCategory ? "lg:order-1" : "lg:order-2"
            }`}
          >
            <Card className="shadow-sm border bg-[#F5F9F8] !border-customPrimery-200">
              <CardContent className="p-4 sm:p-6">
                {/* Validation Errors */}
                {/* {currentStepErrors.length > 0 && (
                  <Card className="mb-4 sm:mb-6 border-red-200 bg-red-50">
                    <CardContent className="p-3 sm:p-4">
                      <h4 className="font-semibold text-red-800 mb-2 sm:mb-3 flex items-center gap-2 text-sm">
                        <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xs font-bold">
                          !
                        </span>
                        Please fix the following errors:
                      </h4>
                      <ul className="space-y-1 sm:space-y-2">
                        {currentStepErrors.map((error, index) => (
                          <li
                            key={index}
                            className="text-xs sm:text-sm text-red-700 flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0"></span>
                            {error}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )} */}

                {/* Step Content */}
                <form onSubmit={handleSubmit}>{renderStepContent()}</form>
              </CardContent>

              {/* Navigation Footer */}
              {orderCategory && (
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={isSubmitting}
                      className="flex items-center justify-center gap-2 px-4 py-2 order-2 sm:order-1"
                    >
                      <ChevronLeft size={16} />
                      {step === 1 ? "Change Category" : "Previous"}
                    </Button>
                    <div className="flex items-center justify-center gap-3 order-1 sm:order-2">
                      {step < maxSteps ? (
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="flex items-center gap-2 bg-[#11AB93] hover:bg-[#0F9A82] px-4 sm:px-6 py-2 w-full sm:w-auto"
                          disabled={isSubmitting}
                        >
                          Continue
                          <ChevronRight size={16} />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          onClick={handleSubmit}
                          className="flex items-center gap-2 bg-[#11AB93] hover:bg-[#0F9A82] px-4 sm:px-6 py-2 w-full sm:w-auto"
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
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Cancel Order
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Are you sure you want to cancel this order? All unsaved changes
              will be lost.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowCancelModal(false)}
              className="px-4 py-2 order-2 sm:order-1"
            >
              No, Continue
            </Button>
            <Button
              onClick={confirmCancelOrder}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white order-1 sm:order-2"
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
