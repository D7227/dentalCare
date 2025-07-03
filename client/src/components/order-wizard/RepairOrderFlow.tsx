import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import FileUploader from '@/components/shared/FileUploader';
import { useOrders } from '@/hooks/shared/useOrders';
import { OrderData } from '@/types';

interface RepairOrderFlowProps {
  currentStep: number;
  formData: any;
  setFormData: (data: any) => void;
  setSelectedOrderId: (id: string) => void;
}

const RepairOrderFlow = ({ currentStep, formData, setFormData, setSelectedOrderId }: RepairOrderFlowProps) => {
  // Use dynamic order data instead of mock data
  const { data: allOrders = [], isLoading, error } = useOrders();

  // Filter orders that are eligible for repair (delivered or rejected status)
  // const ordersForRepair = allOrders.filter((order: OrderData) => 
  //   order.status === 'delivered' || order.status === 'rejected'
  // );

  // File upload is now handled by the shared FileUploader component

  if (currentStep === 1) {
    return (
      <Card className="w-full max-w-full">
        <CardHeader>
          <CardTitle className="text-primary text-base sm:text-lg">Select Order to Repair</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-2 sm:p-4">
          <div>
            <Label htmlFor="repairOrderId" className="text-xs sm:text-sm">Order to Repair</Label>
            <Select onValueChange={(value) => {
              const selectedOrder = allOrders.find(order => order.referenceId === value);
              setFormData({
                ...selectedOrder,
                repairOrderId: value,
                restorationType: selectedOrder?.restorationType || '',
                originalStatus: selectedOrder?.status,
                issueDescription: selectedOrder?.issueDescription || '',
                issueCategory: '',
                repairType: selectedOrder?.repairType || '',
                returnWithTrial: selectedOrder?.returnWithTrial || false,
                repairInstructions: '',
              });
              setSelectedOrderId(selectedOrder?.id);
            }}>
              <SelectTrigger className="mt-1 text-xs sm:text-sm">
                <SelectValue placeholder="Select order to repair" />
              </SelectTrigger>
              <SelectContent>
                {allOrders.map((order) => (
                  <SelectItem key={order.referenceId} value={order.referenceId} className="text-xs sm:text-sm">
                    {order.referenceId} - {order.patientFirstName} {order.patientLastName} ({order.prescriptionType}) - {order.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {formData.repairOrderId && (
            <div className="p-2 sm:p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <h4 className="font-medium text-warning-foreground mb-2 flex items-center gap-2 text-xs sm:text-sm">
                <AlertTriangle size={16} />
                Order Details
              </h4>
              <div className="text-xs sm:text-sm space-y-1">
                <p><span className="font-medium">Order ID:</span> {formData.repairOrderId}</p>
                <p><span className="font-medium">Type:</span> {formData.prescriptionType}</p>
                <p><span className="font-medium">Status:</span> 
                  <Badge variant="outline" className="ml-2">{formData.originalStatus}</Badge>
                </p>
              </div>
            </div>
          )}
          <div className="p-2 sm:p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="checkWarranty"
                checked={formData.checkWarranty || false}
                onCheckedChange={(checked) => setFormData({...formData, checkWarranty: checked})}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="checkWarranty" className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                  <Shield size={16} className="text-success" />
                  Check Warranty Eligibility
                </Label>
                <p className="text-xs text-muted-foreground">
                  This order will be checked against the original delivery date and warranty terms.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentStep === 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Describe Issue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="issueDescription">Issue Description</Label>
            <Textarea
              id="issueDescription"
              value={formData.issueDescription || ''}
              onChange={(e) => setFormData({...formData, issueDescription: e.target.value})}
              placeholder="Please describe the issue in detail..."
              className="mt-1"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="issueCategory">Issue Category</Label>
            <Select onValueChange={(value) => setFormData({...formData, issueCategory: value})}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select issue category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fit-issue">Fit Issue</SelectItem>
                <SelectItem value="shade-mismatch">Shade Mismatch</SelectItem>
                <SelectItem value="damage">Physical Damage</SelectItem>
                <SelectItem value="aesthetic">Aesthetic Concern</SelectItem>
                <SelectItem value="functional">Functional Issue</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentStep === 3) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Repair Type & Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="repairType">Repair Type</Label>
            <Select onValueChange={(value) => setFormData({...formData, repairType: value})}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select repair type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adjustment">Minor Adjustment</SelectItem>
                <SelectItem value="remake">Complete Remake</SelectItem>
                <SelectItem value="rework">Major Rework</SelectItem>
                <SelectItem value="refinish">Refinish/Polish</SelectItem>
                <SelectItem value="shade-correction">Shade Correction</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="returnWithTrial"
              checked={formData.returnWithTrial || false}
              onCheckedChange={(checked) => setFormData({...formData, returnWithTrial: checked})}
            />
            <Label htmlFor="returnWithTrial" className="text-sm font-medium">
              Return with trial for approval
            </Label>
          </div>

          <div>
            <Label>Repair Instructions</Label>
            <Textarea
              value={formData.repairInstructions || ''}
              onChange={(e) => setFormData({...formData, repairInstructions: e.target.value})}
              placeholder="Specific instructions for the repair..."
              className="mt-1"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentStep === 4) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">File Upload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileUploader
              files={formData.files || []}
              onFilesChange={(files) => setFormData({...formData, files})}
              maxFiles={10}
              maxFileSize={10}
              acceptedTypes={['.jpg', '.jpeg', '.png', '.pdf', '.stl']}
              label="Upload Supporting Files"
              description="Upload photos, impressions, or other repair documentation"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default RepairOrderFlow;
