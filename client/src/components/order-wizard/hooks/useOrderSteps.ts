
import { OrderCategory, Step } from '../types/orderTypes';

export const useOrderSteps = () => {
  const getStepsForCategory = (category: OrderCategory): Step[] => {
    switch (category) {
      case 'new':
        return [
          { number: 0, title: 'Category', description: 'Select order type' },
          { number: 1, title: 'Patient Details', description: 'Basic information' },
          { number: 2, title: 'Restoration Info', description: 'Type and specifications' },
          { number: 3, title: 'Upload & Logistics', description: 'Files and delivery' },
          { number: 4, title: 'Review Order', description: 'Confirm and submit' }
        ];
      case 'repeat':
        return [
          { number: 0, title: 'Category', description: 'Select order type' },
          { number: 1, title: 'Select Order', description: 'Choose previous order' },
          { number: 2, title: 'Review Details', description: 'Edit if needed' },
          { number: 3, title: 'Upload & Logistics', description: 'Files and delivery' },
          { number: 4, title: 'Review Order', description: 'Confirm and submit' }
        ];
      case 'repair':
        return [
          { number: 0, title: 'Category', description: 'Select order type' },
          { number: 1, title: 'Select Order', description: 'Choose order to repair' },
          { number: 2, title: 'Describe Issue', description: 'What needs fixing' },
          { number: 3, title: 'Repair Type', description: 'Select repair options' },
          { number: 4, title: 'Upload & Logistics', description: 'Files and delivery' },
          { number: 5, title: 'Review Order', description: 'Confirm repair' }
        ];
      default:
        return [{ number: 0, title: 'Category', description: 'Select order type' }];
    }
  };

  return { getStepsForCategory };
};
