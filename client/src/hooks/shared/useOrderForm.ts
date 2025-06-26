import { useState, useCallback } from 'react';
import { OrderFormData, getDefaultOrderFormData, convertToOrderData } from '@/../../shared/types/OrderFormData';

export interface UseOrderFormResult {
  formData: OrderFormData;
  errors: string[];
  isValid: boolean;
  updateField: <K extends keyof OrderFormData>(field: K, value: OrderFormData[K]) => void;
  updateNestedField: <T extends Record<string, any>>(
    field: keyof OrderFormData,
    nestedField: keyof T,
    value: any
  ) => void;
  updateFormData: (updates: Partial<OrderFormData>) => void;
  updatePatientField: (field: string, value: any) => void;
  updateDoctorField: (field: string, value: any) => void;
  updateScanBookingField: (field: string, value: any) => void;
  addToothGroup: (toothGroup: any) => void;
  removeToothGroup: (index: number) => void;
  updateToothGroup: (index: number, updates: any) => void;
  addAccessory: (accessory: string) => void;
  removeAccessory: (accessory: string) => void;
  validateForm: () => boolean;
  resetForm: () => void;
  setFormData: (data: OrderFormData) => void;
}

export const useOrderForm = (initialData?: Partial<OrderFormData>): UseOrderFormResult => {
  const [formData, setFormData] = useState<OrderFormData>(() => ({
    ...getDefaultOrderFormData(),
    ...initialData
  }));
  
  const [errors, setErrors] = useState<string[]>([]);

  // Unified field update helper
  const updateField = useCallback(<K extends keyof OrderFormData>(
    field: K, 
    value: OrderFormData[K]
  ) => {
    setFormData((prev: OrderFormData) => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Nested field update helper for patient, doctor, scanBooking
  const updateNestedField = useCallback(<T extends Record<string, any>>(
    field: keyof OrderFormData,
    nestedField: keyof T,
    value: any
  ) => {
    setFormData((prev: OrderFormData) => ({
      ...prev,
      [field]: {
        ...(prev[field] as T || {}),
        [nestedField]: value
      }
    }));
  }, []);

  // Batch update helper
  const updateFormData = useCallback((updates: Partial<OrderFormData>) => {
    setFormData((prev: OrderFormData) => ({ ...prev, ...updates }));
  }, []);

  const addToothGroup = useCallback((toothGroup: any) => {
    setFormData((prev: OrderFormData) => ({
      ...prev,
      toothGroups: [...(prev.toothGroups || []), toothGroup]
    }));
  }, []);

  const removeToothGroup = useCallback((index: number) => {
    setFormData((prev: OrderFormData) => ({
      ...prev,
      toothGroups: (prev.toothGroups || []).filter((_, i) => i !== index)
    }));
  }, []);

  const updateToothGroup = useCallback((index: number, updates: any) => {
    setFormData((prev: OrderFormData) => ({
      ...prev,
      toothGroups: (prev.toothGroups || []).map((group, i) => 
        i === index ? { ...group, ...updates } : group
      )
    }));
  }, []);

  const addAccessory = useCallback((accessory: string) => {
    setFormData((prev: OrderFormData) => ({
      ...prev,
      accessories: [...(prev.accessories || []), accessory]
    }));
  }, []);

  const removeAccessory = useCallback((accessory: string) => {
    setFormData((prev: OrderFormData) => ({
      ...prev,
      accessories: (prev.accessories || []).filter(acc => acc !== accessory)
    }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: string[] = [];
    
    // Patient validation
    if (!formData.patient?.firstName?.trim()) {
      newErrors.push('Patient first name is required');
    }
    if (!formData.patient?.lastName?.trim()) {
      newErrors.push('Patient last name is required');
    }
    if (!formData.patient?.age || formData.patient.age <= 0) {
      newErrors.push('Valid patient age is required');
    }
    if (!formData.patient?.sex) {
      newErrors.push('Patient sex is required');
    }
    
    // Doctor validation
    if (!formData.doctor?.name?.trim()) {
      newErrors.push('Doctor name is required');
    }
    if (!formData.doctor?.phone?.trim()) {
      newErrors.push('Doctor phone is required');
    }
    if (!formData.doctor?.email?.trim()) {
      newErrors.push('Doctor email is required');
    }
    if (!formData.doctor?.clinicName?.trim()) {
      newErrors.push('Clinic name is required');
    }
    if (!formData.doctor?.clinicAddress?.trim()) {
      newErrors.push('Clinic address is required');
    }
    if (!formData.doctor?.city?.trim()) {
      newErrors.push('City is required');
    }
    if (!formData.doctor?.state?.trim()) {
      newErrors.push('State is required');
    }
    if (!formData.doctor?.pincode?.trim()) {
      newErrors.push('Pincode is required');
    }
    
    // Order details validation
    if (!formData.category?.trim()) {
      newErrors.push('Category is required');
    }
    if (!formData.restorationType?.trim()) {
      newErrors.push('Restoration type is required');
    }
    if (!formData.productSelection?.trim()) {
      newErrors.push('Product selection is required');
    }
    if (!formData.orderType) {
      newErrors.push('Order type is required');
    }
    
    // Conditional validations
    if (formData.orderType === 'repair') {
      if (!formData.repairType?.trim()) {
        newErrors.push('Repair type is required for repair orders');
      }
      if (!formData.issueDescription?.trim()) {
        newErrors.push('Issue description is required for repair orders');
      }
    }
    
    if (formData.orderType === 'repeat' && !formData.previousOrderId?.trim()) {
      newErrors.push('Previous order ID is required for repeat orders');
    }
    
    // Email format validation
    if (formData.doctor?.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.doctor.email)) {
        newErrors.push('Valid email address is required');
      }
    }
    
    // Phone format validation
    if (formData.doctor?.phone) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(formData.doctor.phone)) {
        newErrors.push('Valid phone number is required');
      }
    }
    
    // Pincode validation
    if (formData.doctor?.pincode) {
      const pincodeRegex = /^\d{6}$/;
      if (!pincodeRegex.test(formData.doctor.pincode)) {
        newErrors.push('Valid 6-digit pincode is required');
      }
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(getDefaultOrderFormData());
    setErrors([]);
  }, []);

  const isValid = errors.length === 0;

  // Helper functions for easier component integration
  const updatePatientField = useCallback((field: string, value: any) => {
    updateNestedField('patient', field, value);
  }, [updateNestedField]);

  const updateDoctorField = useCallback((field: string, value: any) => {
    updateNestedField('doctor', field, value);
  }, [updateNestedField]);

  const updateScanBookingField = useCallback((field: string, value: any) => {
    updateNestedField('scanBooking', field, value);
  }, [updateNestedField]);

  return {
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
  };
};