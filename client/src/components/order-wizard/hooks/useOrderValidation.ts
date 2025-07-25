import { OrderCategory, FormData } from '../types/orderTypes';
export const useOrderValidation = () => {
  const validateStep = (
    currentStep: number,
    orderCategory: OrderCategory,
    formData: FormData
  ): string[] => {
    const errors: string[] = [];
    if (orderCategory === 'new') {
      switch (currentStep) {
        case 1:
          if (!formData.firstName.trim()) errors.push('First name is required');
          if (!formData.lastName.trim()) errors.push('Last name is required');
          if (!formData.caseHandledBy.trim()) errors.push('Case handler is required');
          break;
        case 2:
          // Step 2: Restoration Type - validate prescription type and order method
          if (!formData.prescriptionType) errors.push('Please select a prescription type');
          if (!formData.orderMethod) errors.push('Please select an order method');
          break;
        case 3:
          // Step 3: Teeth Selection - validate that teeth are selected
          const toothGroups = formData.toothGroups || [];
          if (toothGroups.length === 0) {
            errors.push('Please select at least one tooth group');
          }
          break;
        case 4:
          // Step 4: Product Selection - validate that products are configured
          const productToothGroups = formData.toothGroups || [];
          if (productToothGroups.length === 0) {
            errors.push('At least one restoration product group is required');
          } else {
            // Validate tooth groups have required product details
            const incompleteGroups = productToothGroups.filter((group: any) =>
              !group.teeth || group.teeth.length === 0 || !group.selectedProducts || group.selectedProducts.length === 0
            );
            if (incompleteGroups.length > 0) {
              errors.push('Please complete product selection for all tooth groups');
            }
          }
          break;
        case 5:
          // Step 5: Upload & Logistics
          if (formData.orderType === 'request-scan') {
            if (!formData.scanBooking?.areaManagerId?.trim()) errors.push('Area manager is required for scan booking');
            if (!formData.scanBooking?.scanDate?.trim()) errors.push('Scan date is required for scan booking');
            if (!formData.scanBooking?.scanTime?.trim()) errors.push('Scan time is required for scan booking');
          }
          break;
        case 6:
          // Step 6: Final Details & Accessories
          const accessories = formData.accessories || [];
          if (accessories.includes('other') && (!formData.otherAccessory || formData.otherAccessory.trim() === '')) {
            errors.push('Please specify the other accessory');
          }
          break;
      }
    }
    if (orderCategory === 'repeat') {
      switch (currentStep) {
        case 1:
          if (!formData.previousOrderId.trim()) errors.push('Please select a previous order');
          break;
        case 3:
          if (formData.orderType === 'request-scan') {
            if (!formData.scanBooking?.areaManagerId?.trim()) errors.push('Area manager is required for scan booking');
            if (!formData.scanBooking?.scanDate?.trim()) errors.push('Scan date is required for scan booking');
            if (!formData.scanBooking?.scanTime?.trim()) errors.push('Scan time is required for scan booking');
          }
          const accessories = formData.accessories || [];
          if (accessories.includes('other') && (!formData.otherAccessory || formData.otherAccessory.trim() === '')) {
            errors.push('Please specify the other accessory');
          }
          break;
      }
    }
    if (orderCategory === 'repair') {
      switch (currentStep) {
        case 1:
          if (!formData.repairOrderId.trim()) errors.push('Please select an order to repair');
          break;
        case 2:
          if (!formData.issueDescription.trim()) errors.push('Please describe the issue');
          break;
        case 3:
          if (!formData.repairType.trim()) errors.push('Please select a repair type');
          break;
        case 4:
          if (formData.orderType === 'request-scan') {
            if (!formData.scanBooking?.areaManagerId?.trim()) errors.push('Area manager is required for scan booking');
            if (!formData.scanBooking?.scanDate?.trim()) errors.push('Scan date is required for scan booking');
            if (!formData.scanBooking?.scanTime?.trim()) errors.push('Scan time is required for scan booking');
          }
          const repairAccessories = formData.accessories || [];
          if (repairAccessories.includes('other') && (!formData.otherAccessory || formData.otherAccessory.trim() === '')) {
            errors.push('Please specify the other accessory');
          }
          break;
      }
    }
    return errors;
  };
  return { validateStep };
};