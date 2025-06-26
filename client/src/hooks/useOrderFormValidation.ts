import { useState, useCallback } from 'react';
import { z } from 'zod';

export const resubmitOrderSchema = z.object({
  patientName: z.string().min(1, 'Patient name is required'),
  restorationType: z.string().min(1, 'Restoration type is required'),
  shade: z.string().min(1, 'Shade is required'),
  ponticDesign: z.string().min(1, 'Pontic design is required'),
  notes: z.string().min(10, 'Please provide detailed notes (minimum 10 characters)'),
  files: z.array(z.any()).optional(),
});

export const useOrderFormValidation = (
  schema: z.ZodSchema,
  initialData: any
) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    try {
      schema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  }, [formData, schema]);

  const handleSubmit = useCallback(async (onSubmit: (data: any) => Promise<void>) => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  return {
    formData,
    setFormData,
    errors,
    isSubmitting,
    updateField,
    handleSubmit,
    validateForm,
  };
};