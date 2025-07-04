
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

interface RepairOrderFlowProps {
  currentStep: number;
  formData: any;
  setFormData: (data: any) => void;
}

const RepairOrderFlow = ({ currentStep, formData, setFormData }: RepairOrderFlowProps) => {
  // File upload is now handled by the shared FileUploader component

  const mockOrdersForRepair = [
    { id: 'ORD-2024-001', patient: 'John Smith', type: 'Crown', date: '2024-01-15', status: 'Delivered' },
    { id: 'ORD-2024-004', patient: 'Emily Davis', type: 'Implant Crown', date: '2024-01-12', status: 'Rejected' },
    { id: 'ORD-2024-007', patient: 'Robert Brown', type: 'Bridge', date: '2024-01-09', status: 'Delivered' }
  ];

  if (currentStep === 1) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Select Order to Repair</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="repairOrderId">Order to Repair</Label>
            <Select onValueChange={(value) => {
              const selectedOrder = mockOrdersForRepair.find(order => order.id === value);
              setFormData({
                ...formData, 
                repairOrderId: value,
                restorationType: selectedOrder?.type.toLowerCase().replace(' ', '-'),
                originalStatus: selectedOrder?.status
              });
            }}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select order to repair" />
              </SelectTrigger>
              <SelectContent>
                {mockOrdersForRepair.map((order) => (
                  <SelectItem key={order.id} value={order.id}>
                    {order.id} - {order.patient} ({order.type}) - {order.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.repairOrderId && (
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <h4 className="font-medium text-warning-foreground mb-2 flex items-center gap-2">
                <AlertTriangle size={16} />
                Order Details
              </h4>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">Order ID:</span> {formData.repairOrderId}</p>
                <p><span className="font-medium">Type:</span> {formData.restorationType}</p>
                <p><span className="font-medium">Status:</span> 
                  <Badge variant="outline" className="ml-2">{formData.originalStatus}</Badge>
                </p>
              </div>
            </div>
          )}

          <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="checkWarranty"
                checked={formData.checkWarranty || false}
                onCheckedChange={(checked) => setFormData({...formData, checkWarranty: checked})}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="checkWarranty" className="flex items-center gap-2 text-sm font-medium">
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
              value={formData.issueDescription}
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
              checked={formData.returnWithTrial}
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
