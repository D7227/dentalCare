
import React, { useEffect, memo, useState } from 'react';
import { RefreshCw, Loader2, Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useOrderFormValidation, resubmitOrderSchema } from '@/hooks/useOrderFormValidation';
import { useModalNavigation } from '@/hooks/useModalNavigation';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAutoSave } from '@/hooks/useAutoSave';
import BaseModal from '@/components/shared/BaseModal';
import FormField from '@/components/shared/FormField';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import FileUploadZone from '@/components/FileUploadZone';

interface ResubmitOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

const ResubmitOrderModal = memo(({ isOpen, onClose, order }: ResubmitOrderModalProps) => {
  const { toast } = useToast();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const {
    formData,
    setFormData,
    errors,
    isSubmitting,
    updateField,
    handleSubmit,
  } = useOrderFormValidation(resubmitOrderSchema, {
    patientName: '',
    restorationType: '',
    shade: 'A1',
    ponticDesign: 'Ovate',
    notes: '',
    files: [] as File[],
  });

  const { firstInputRef, handleKeyDown } = useModalNavigation({
    isOpen,
    onClose: () => {
      if (hasUnsavedChanges) {
        const confirmed = window.confirm('You have unsaved changes. Are you sure you want to close?');
        if (confirmed) {
          onClose();
          setHasUnsavedChanges(false);
        }
      } else {
        onClose();
      }
    },
    isSubmitting
  });

  // Auto-save functionality
  const { isSaving } = useAutoSave({
    data: formData,
    onSave: async (data) => {
      localStorage.setItem(`resubmit-draft-${order?.id}`, JSON.stringify(data));
    },
    enabled: isOpen && hasUnsavedChanges,
    delay: 3000
  });

  // Keyboard shortcuts
  useKeyboardShortcuts({
    shortcuts: [
      {
        key: 's',
        ctrlKey: true,
        action: () => onSubmit(),
        description: 'Submit order (Ctrl+S)'
      }
    ],
    enabled: isOpen && !isSubmitting
  });

  useEffect(() => {
    if (order && isOpen) {
      const savedDraft = localStorage.getItem(`resubmit-draft-${order.id}`);
      if (savedDraft) {
        try {
          const draftData = JSON.parse(savedDraft);
          setFormData(draftData);
          toast({
            title: "Draft restored",
            description: "Your previous changes have been restored.",
          });
        } catch (error) {
          console.error('Failed to restore draft:', error);
        }
      } else {
        setFormData({
          patientName: order.patient || '',
          restorationType: order.type || '',
          shade: 'A1',
          ponticDesign: 'Ovate',
          notes: '',
          files: [],
        });
      }
      setHasUnsavedChanges(false);
    }
  }, [order, isOpen, setFormData, toast]);

  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [formData]);

  const onSubmit = async () => {
    await handleSubmit(async (data) => {
      const steps = [
        'Validating submission...',
        'Uploading files...',
        'Processing order...',
        'Finalizing submission...'
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      toast({
        title: "Order Resubmitted Successfully",
        description: `Order ${order?.id} has been resubmitted for review.`,
      });
      
      localStorage.removeItem(`resubmit-draft-${order?.id}`);
      setHasUnsavedChanges(false);
      onClose();
    });
  };

  if (!order) return null;

  const restorationOptions = [
    { value: 'Crown', label: 'Crown' },
    { value: 'Bridge', label: 'Bridge' },
    { value: 'Denture', label: 'Denture' },
    { value: 'Implant', label: 'Implant' },
    { value: 'Orthodontic', label: 'Orthodontic' }
  ];

  const shadeOptions = [
    { value: 'A1', label: 'A1 - Vita Classic' },
    { value: 'A2', label: 'A2 - Vita Classic' },
    { value: 'A3', label: 'A3 - Vita Classic' },
    { value: 'B1', label: 'B1 - Vita Classic' },
    { value: 'B2', label: 'B2 - Vita Classic' },
    { value: 'C1', label: 'C1 - Vita Classic' },
    { value: 'C2', label: 'C2 - Vita Classic' }
  ];

  const ponticOptions = [
    { value: 'Ovate', label: 'Ovate' },
    { value: 'Ridge Lap', label: 'Ridge Lap' },
    { value: 'Modified Ridge Lap', label: 'Modified Ridge Lap' },
    { value: 'Sanitary', label: 'Sanitary' }
  ];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={() => {
        if (hasUnsavedChanges) {
          const confirmed = window.confirm('You have unsaved changes. Are you sure you want to close?');
          if (confirmed) {
            onClose();
            setHasUnsavedChanges(false);
          }
        } else {
          onClose();
        }
      }}
      title="Resubmit Order"
      description={`You are resubmitting Order ${order.id}. Please address the rejection reason and provide any necessary updates.`}
      badge={{
        text: "Resubmission",
        variant: "secondary",
        className: "flex items-center gap-1"
      }}
      onKeyDown={handleKeyDown}
    >
      {/* Auto-save indicator */}
      {isSaving && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
          <Save className="h-4 w-4 animate-pulse text-blue-600" />
          <span>Saving draft...</span>
        </div>
      )}

      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-destructive mb-2">Previous Rejection Details</h4>
            <p className="text-sm text-destructive/80 mb-1">
              <span className="font-medium">Reason:</span> {order.rejectionReason}
            </p>
            <p className="text-sm text-destructive/80">
              <span className="font-medium">Rejected by:</span> {order.rejectedBy} on {order.rejectedDate || order.date}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="form-stack">
        <div className="form-grid">
          <FormField
            type="input"
            id="patientName"
            label="Patient Name"
            required
            value={formData.patientName}
            onChange={(value) => updateField('patientName', value)}
            error={errors.patientName}
            readOnly
            ref={firstInputRef}
          />
          
          <FormField
            type="select"
            id="restorationType"
            label="Restoration Type"
            required
            value={formData.restorationType}
            onChange={(value) => updateField('restorationType', value)}
            error={errors.restorationType}
            disabled={isSubmitting}
            placeholder="Select type"
            options={restorationOptions}
          />
        </div>

        <div className="form-grid">
          <FormField
            type="select"
            id="shade"
            label="Shade Selection"
            required
            value={formData.shade}
            onChange={(value) => updateField('shade', value)}
            error={errors.shade}
            disabled={isSubmitting}
            placeholder="Select shade"
            options={shadeOptions}
          />
          
          <FormField
            type="select"
            id="ponticDesign"
            label="Pontic Design"
            required
            value={formData.ponticDesign}
            onChange={(value) => updateField('ponticDesign', value)}
            error={errors.ponticDesign}
            disabled={isSubmitting}
            placeholder="Select design"
            options={ponticOptions}
          />
        </div>

        <FormField
          type="textarea"
          id="notes"
          label="Additional Notes (Address rejection reason)"
          required
          value={formData.notes}
          onChange={(value) => updateField('notes', value)}
          error={errors.notes}
          disabled={isSubmitting}
          placeholder="Please describe how you've addressed the rejection reason..."
          rows={4}
        />

        <div className="form-field">
          <label className="form-label flex items-center gap-2">
            Supporting Files
            {formData.files.length > 0 && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {formData.files.length} file{formData.files.length !== 1 ? 's' : ''}
              </span>
            )}
          </label>
          <FileUploadZone
            files={formData.files}
            onFilesChange={(files) => updateField('files', files)}
            maxFiles={5}
            maxFileSize={10}
          />
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground flex items-center gap-4">
            <span>Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+S</kbd> to submit</span>
            {hasUnsavedChanges && (
              <span className="flex items-center gap-1 text-amber-600">
                <AlertCircle className="h-3 w-3" />
                Unsaved changes
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                if (hasUnsavedChanges) {
                  const confirmed = window.confirm('You have unsaved changes. Are you sure you want to close?');
                  if (confirmed) {
                    onClose();
                    setHasUnsavedChanges(false);
                  }
                } else {
                  onClose();
                }
              }} 
              type="button"
              disabled={isSubmitting}
              className="btn-outline hover-lift focus-ring transition-all duration-200"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="btn-primary hover-lift focus-ring transition-all duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" text="Submitting..." />
              ) : (
                <>
                  <RefreshCw className="mr-2" size={16} />
                  Resubmit Order
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
});

ResubmitOrderModal.displayName = 'ResubmitOrderModal';

export default ResubmitOrderModal;
