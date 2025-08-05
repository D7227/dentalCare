import { OrderCategory, Step } from '../types/orderTypes';
import {
  User,
  FileText,
  Target,
  Package,
  Upload,
  CheckCircle,
  Repeat,
  Wrench,
  Grid3X3,
} from "lucide-react";
export const useOrderSteps = () => {
  const getStepsForCategory = (category: OrderCategory, hasSelectedTeeth: boolean = false): Step[] => {
    switch (category) {
      case 'new':
        return [
          { number: 0, title: 'Category', description: 'Select order type' },
          { number: 1, title: 'Patient Details', description: 'Basic information' },
          { number: 2, title: 'Restoration Type', description: 'Prescription and method' },
          { number: 3, title: 'Subcategory', description: 'Select subcategory' },
          { number: 4, title: 'Teeth Selection', description: 'Select teeth' },
          { number: 5, title: 'Product Selection', description: 'Configure products' },
          { number: 6, title: 'Upload & Logistics', description: 'Files and delivery' },
          { number: 7, title: 'Review Order', description: 'Confirm and submit' }
        ];
      case 'repeat': {
        const baseSteps: Step[] = [
          { number: 0, title: 'Category', description: 'Select order type' },
          { number: 1, title: 'Select Order', description: 'Choose previous order' },
          { number: 2, title: 'Review Details', description: 'Edit if needed' },
        ];
        if (hasSelectedTeeth) {
          baseSteps.push({ number: 3, title: 'Product Selection', description: 'Configure products' });
          baseSteps.push({ number: 4, title: 'Upload & Logistics', description: 'Files and delivery' });
          baseSteps.push({ number: 5, title: 'Review Order', description: 'Confirm and submit' });
        } else {
          baseSteps.push({ number: 3, title: 'Upload & Logistics', description: 'Files and delivery' });
          baseSteps.push({ number: 4, title: 'Review Order', description: 'Confirm and submit' });
        }
        return baseSteps;
      }
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