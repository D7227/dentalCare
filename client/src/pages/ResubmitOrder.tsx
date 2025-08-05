
import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { RefreshCw, Loader2, Save, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useOrderFormValidation, resubmitOrderSchema } from '@/hooks/useOrderFormValidation';
import { useAutoSave } from '@/hooks/useAutoSave';
import FormField from '@/components/shared/FormField';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import FileUploader from '@/components/shared/FileUploader';
import { ordersData } from '@/data/ordersData';
import Header from '@/doctor/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ResubmitOrder = () => {
  const [location, setLocation] = useLocation();
  const { orderId } = useParams();
  const { toast } = useToast();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Find the order by ID
  const order = ordersData.find(o => o.id === orderId);

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

  // Auto-save functionality
  const { isSaving } = useAutoSave({
    data: formData,
    onSave: async (data) => {
      localStorage.setItem(`resubmit-draft-${order?.id}`, JSON.stringify(data));
    },
    enabled: order && hasUnsavedChanges,
    delay: 3000
  });

  useEffect(() => {
    if (order) {
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
  }, [order, setFormData, toast]);

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
      // Navigation will be handled by the parent component
    });
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => window.history.back()} className="bg-[#11AB93] hover:bg-[#0F9A82]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <Header
          onToggleSidebar={() => {}}
          doctorName="Dr. Sarah Mitchell"
          clinicName="Smile Dental Clinic"
          onMobileMenuToggle={() => {}}
        />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation(`/order/${orderId}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            Back to Order Details
          </Button>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <RefreshCw className="h-6 w-6 text-[#11AB93]" />
            <h1 className="text-2xl font-bold text-gray-900">Resubmit Order</h1>
          </div>
          <p className="text-gray-600">
            You are resubmitting Order {order.id}. Please address the rejection reason and provide any necessary updates.
          </p>
        </div>

        {/* Auto-save indicator */}
        {isSaving && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
            <Save className="h-4 w-4 animate-pulse text-blue-600" />
            <span>Saving draft...</span>
          </div>
        )}

        {/* Rejection Details */}
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              Previous Rejection Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Reason:</span> {order.rejectionReason}
              </p>
              <p className="text-sm">
                <span className="font-medium">Rejected by:</span> {order.rejectedBy} on {order.rejectedDate || order.date}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Resubmission Form */}
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  type="input"
                  id="patientName"
                  label="Patient Name"
                  required
                  value={formData.patientName}
                  onChange={(value) => updateField('patientName', value)}
                  error={errors.patientName}
                  readOnly
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  Supporting Files
                  {formData.files.length > 0 && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {formData.files.length} file{formData.files.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </label>
                <FileUploader
                  files={formData.files || []}
                  onFilesChange={(files) => updateField('files', files)}
                  maxFiles={5}
                  maxFileSize={10}
                  label="Supporting Files"
                  description="Upload documents, images, or other files to support your resubmission"
                />
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-border">
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
                    onClick={() => setLocation(`/order/${orderId}`)} 
                    type="button"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-[#11AB93] hover:bg-[#0F9A82]"
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResubmitOrder;
