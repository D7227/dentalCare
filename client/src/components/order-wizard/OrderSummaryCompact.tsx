import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, CheckCircle, User, FileText, Calendar } from 'lucide-react';
import { OrderCategory } from './types/orderTypes';
import CompactToothChart from './CompactToothChart';

interface OrderSummaryProps {
  formData: any;
  orderCategory: OrderCategory;
  onEditSection?: (step: number) => void;
}

const OrderSummary = ({ formData, orderCategory, onEditSection }: OrderSummaryProps) => {
  const getCategoryTitle = () => {
    switch (orderCategory) {
      case 'new': return 'Review & Submit Order';
      case 'repeat': return 'Review & Submit Repeat Order';
      case 'repair': return 'Review & Submit Repair Request';
      default: return 'Review & Submit Order';
    }
  };

  const getCategoryColor = () => {
    switch (orderCategory) {
      case 'new': return 'bg-green-100 text-green-800 border-green-200';
      case 'repeat': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'repair': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const EditButton = ({ onClick, label }: { onClick?: () => void; label: string }) => (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      className="text-primary border-primary/30 hover:bg-primary hover:text-white transition-colors print:hidden"
    >
      <Edit2 size={14} className="mr-1" />
      Edit {label}
    </Button>
  );

  return (
    <div className="space-y-3 print:space-y-2 print:text-xs">
      {/* Header */}
      <div className="text-center mb-3 print:mb-2">
        <h3 className="text-xl font-bold text-foreground mb-2 print:text-lg print:mb-1">{getCategoryTitle()}</h3>
        <Badge className={`text-sm px-4 py-2 ${getCategoryColor()} rounded-full print:text-xs print:px-3 print:py-1`}>
          {(orderCategory || 'new').charAt(0).toUpperCase() + (orderCategory || 'new').slice(1)} Order
        </Badge>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3">
        {/* Left Column */}
        <div className="space-y-3 print:space-y-2">
          {/* Patient Information */}
          <Card className="border-l-4 border-l-primary print:border-l-2">
            <CardHeader className="py-2 print:hidden">
              <div className="flex items-center justify-between">
                <CardTitle className="text-primary flex items-center gap-2 text-sm">
                  <User size={14} />
                  Patient Information
                </CardTitle>
                <EditButton onClick={() => onEditSection?.(1)} label="Patient" />
              </div>
            </CardHeader>
            <CardContent className="p-3 print:p-2">
              <div className="print:block hidden text-xs font-semibold text-primary mb-1">Patient Information</div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Name:</span>
                  <span className="text-xs font-medium">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Age:</span>
                  <span className="text-xs font-medium">{formData.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Gender:</span>
                  <span className="text-xs font-medium capitalize">{formData.sex}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Case Handler:</span>
                  <span className="text-xs font-medium">{formData.caseHandleBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Doctor:</span>
                  <span className="text-xs font-medium">{formData.consultingDoctor}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impression Handling */}
          <Card className="border-l-4 border-l-primary print:border-l-2">
            <CardHeader className="py-2 print:hidden">
              <div className="flex items-center justify-between">
                <CardTitle className="text-primary flex items-center gap-2 text-sm">
                  <Calendar size={14} />
                  Impression Handling
                </CardTitle>
                <EditButton onClick={() => onEditSection?.(6)} label="Delivery" />
              </div>
            </CardHeader>
            <CardContent className="p-3 print:p-2">
              <div className="print:block hidden text-xs font-semibold text-primary mb-1">Impression Handling</div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Type:</span>
                  <span className="text-xs font-medium">
                    {formData.orderType === 'pickup-from-lab' ? 'Pickup from Clinic' : 
                     formData.orderType === 'request-scan' ? 'Request Scan' :
                     formData.orderType === 'digital-delivery' ? 'Digital Delivery' :
                     formData.orderType?.replace('-', ' ') || 'Not specified'}
                  </span>
                </div>
                {formData.expectedDeliveryDate && (
                  <div className="flex justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Expected Date:</span>
                    <span className="text-xs font-medium">
                      {new Date(formData.expectedDeliveryDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Files and Notes */}
          {(formData.files?.length > 0 || formData.notes) && (
            <Card className="border-l-4 border-l-primary print:border-l-2">
              <CardHeader className="py-2 print:hidden">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-primary flex items-center gap-2 text-sm">
                    <FileText size={14} />
                    Files & Notes
                  </CardTitle>
                  <EditButton onClick={() => onEditSection?.(4)} label="Files" />
                </div>
              </CardHeader>
              <CardContent className="p-3 print:p-2">
                <div className="print:block hidden text-xs font-semibold text-primary mb-1">Files & Notes</div>
                <div className="space-y-1">
                  {formData.files?.length > 0 && (
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground">Files: {formData.files.length} uploaded</span>
                    </div>
                  )}
                  {formData.notes && (
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground">Notes:</span>
                      <p className="text-xs text-muted-foreground mt-1">{formData.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Tooth Chart */}
        <div className="space-y-3 print:space-y-2">
          <CompactToothChart 
            toothGroups={formData.toothGroups || []} 
            className="h-fit"
          />

          {/* Restoration Summary */}
          {formData.toothGroups?.length > 0 && (
            <Card className="border-l-4 border-l-primary print:border-l-2">
              <CardHeader className="py-2 print:hidden">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-primary text-sm">Restoration Summary</CardTitle>
                  <EditButton onClick={() => onEditSection?.(2)} label="Restoration" />
                </div>
              </CardHeader>
              <CardContent className="p-3 print:p-2">
                <div className="print:block hidden text-xs font-semibold text-primary mb-1">Restoration Summary</div>
                <div className="space-y-2">
                  {formData.toothGroups.map((group: any, index: number) => (
                    <div key={group.groupId || index} className="border rounded p-2 bg-muted/50">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold">Teeth: {group.teeth.join(', ')}</span>
                        <Badge variant={group.type === 'individual' ? 'secondary' : 'default'} className="text-xs">
                          {group.type === 'individual' ? 'Individual' : 'Bridge'}
                        </Badge>
                      </div>
                      {group.material && (
                        <div className="text-xs text-muted-foreground">Material: {group.material}</div>
                      )}
                      {group.shade && (
                        <div className="text-xs text-muted-foreground">Shade: {group.shade}</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Final Review Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 print:p-2 print:bg-transparent print:border-0">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 print:h-4 print:w-4" />
          <p className="text-green-800 font-medium text-sm print:text-xs">
            Please review all details carefully before submitting your {orderCategory} request.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;