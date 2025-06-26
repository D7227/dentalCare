
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
          // Check if restoration products are added via toothGroups or restorationProducts
          const restorationProducts = formData.restorationProducts || [];
          const toothGroups = formData.toothGroups || [];
          

          
          if (restorationProducts.length === 0 && toothGroups.length === 0) {
            errors.push('At least one restoration product group is required');
          } else if (restorationProducts.length > 0) {
            const incompleteProducts = restorationProducts.filter((product: any) => 
              !product.type || !product.toothGroups || product.toothGroups.length === 0 ||
              product.toothGroups.every((group: any) => !group.teeth || group.teeth.length === 0)
            );
            if (incompleteProducts.length > 0) {
              errors.push('Please complete all restoration products (type and teeth selection required)');
            }
          } else if (toothGroups.length > 0) {
            // Validate tooth groups - only check for essential data
            const incompleteGroups = toothGroups.filter((group: any) => 
              !group.teeth || group.teeth.length === 0 || !group.material || !group.shade
            );
            if (incompleteGroups.length > 0) {
              errors.push('Please complete all tooth groups (teeth, material, and shade required)');
            }
          }
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
