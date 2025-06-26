
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, CheckCircle } from 'lucide-react';
import { OrderCategory } from './types/orderTypes';
import ToothChart from './components/ToothChart';
import { DoctorInfo } from '../shared/DoctorInfo';
import { ToothSummary } from '../shared/ToothSummary';

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
      case 'new': return 'bg-emerald-100 text-emerald-800';
      case 'repeat': return 'bg-blue-100 text-blue-800';
      case 'repair': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const EditButton = ({ onClick, label }: { onClick?: () => void; label: string }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="text-primary hover:bg-primary/10 print:hidden h-8 px-2"
    >
      <Edit2 size={12} className="mr-1" />
      Edit
    </Button>
  );

  // Group restoration data by teeth groups
  const restorationGroups = formData.toothGroups || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 print:space-y-4">
      {/* Header */}
      <div className="text-center space-y-3 print:space-y-2">
        <h1 className="text-2xl font-bold text-gray-900 print:text-xl">{getCategoryTitle()}</h1>
        <Badge className={`${getCategoryColor()} px-4 py-1 rounded-full print:px-3`}>
          {(orderCategory || 'new').charAt(0).toUpperCase() + (orderCategory || 'new').slice(1)} Order
        </Badge>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3 print:gap-4">
        
        {/* Left Column - Patient & Case Info */}
        <div className="space-y-4 print:space-y-3">
          {/* Patient Information */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 print:pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-900">Patient Information</CardTitle>
                <EditButton onClick={() => onEditSection?.(1)} label="Patient" />
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2 print:space-y-1">
              <div className="text-sm">
                <div className="font-medium text-gray-900">{formData.firstName} {formData.lastName}</div>
                <div className="text-gray-600">{formData.age} years old, {formData.sex}</div>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>Case Handler: <span className="text-gray-700">{formData.caseHandledBy}</span></div>
                <div>Consulting Doctor: <span className="text-gray-700">{formData.consultingDoctor}</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 print:pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-900">Delivery</CardTitle>
                <EditButton onClick={() => onEditSection?.(6)} label="Delivery" />
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2 print:space-y-1">
              <div className="text-sm">
                <div className="font-medium text-gray-900">
                  {formData.orderType === 'pickup-from-lab' ? 'Pickup from Clinic' : 
                   formData.orderType === 'request-scan' ? 'Request Scan' :
                   formData.orderType === 'digital-delivery' ? 'Digital Delivery' :
                   'Not specified'}
                </div>
                {formData.expectedDeliveryDate && (
                  <div className="text-gray-600">
                    Expected: {new Date(formData.expectedDeliveryDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          {(formData.files?.length > 0 || formData.notes) && (
            <Card className="shadow-sm">
              <CardHeader className="pb-3 print:pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-gray-900">Additional Information</CardTitle>
                  <EditButton onClick={() => onEditSection?.(4)} label="Files" />
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2 print:space-y-1">
                {formData.files?.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium">{formData.files.length}</span> files uploaded
                  </div>
                )}
                {formData.notes && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded text-xs">
                    {formData.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Center Column - Tooth Chart */}
        <div className="space-y-4 print:space-y-3">
          <Card className="border-2 border-dashed border-green-300 bg-green-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-green-700">
                  Adding: {formData.restorationType ? 
                    formData.restorationType.charAt(0).toUpperCase() + formData.restorationType.slice(1) : 
                    'Crown'} & Bridge
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onEditSection?.(2)}
                  className="text-green-600 border-green-300 hover:bg-green-100 print:hidden h-7 px-2 text-xs"
                >
                  Change
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ToothChart 
                selectedGroups={restorationGroups}
                tempSelection={[]}
                onToothClick={() => {}} 
                isToothSelected={() => false}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Restoration Details */}
        <div className="space-y-4 print:space-y-3">
          <Card className="shadow-sm">
            <CardHeader className="pb-3 print:pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-900">Restoration Details</CardTitle>
                <EditButton onClick={() => onEditSection?.(2)} label="Restoration" />
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3 print:space-y-2">
              {restorationGroups.length > 0 ? (
                restorationGroups.map((group: any, index: number) => (
                  <div key={group.groupId || index} className="border-l-3 border-primary pl-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        Teeth {group.teeth.join(', ')}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-2 py-0.5 ${
                          group.type === 'joint' ? 'border-blue-300 text-blue-700 bg-blue-50' :
                          group.type === 'separate' ? 'border-green-300 text-green-700 bg-green-50' :
                          group.type === 'bridge' ? 'border-amber-300 text-amber-700 bg-amber-50' :
                          'border-gray-300 text-gray-700'
                        }`}
                      >
                        {group.type === 'joint' ? 'Joint' :
                         group.type === 'separate' ? 'Separate' :
                         group.type === 'bridge' ? 'Bridge' :
                         group.type}
                      </Badge>
                    </div>
                    {group.material && (
                      <div className="text-xs text-gray-600">
                        Material: <span className="font-medium">{group.material}</span>
                      </div>
                    )}
                    {group.shade && (
                      <div className="text-xs text-gray-600">
                        Shade: <span className="font-medium">{group.shade}</span>
                      </div>
                    )}
                    {group.notes && (
                      <div className="text-xs text-gray-500 italic">
                        {group.notes}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 italic">No restoration details specified</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 print:p-3 print:bg-transparent print:border-gray-300">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 print:h-4 print:w-4" />
          <div>
            <p className="text-emerald-800 font-medium text-sm print:text-xs">
              Please review all details carefully before submitting your {orderCategory} request.
            </p>
            <p className="text-emerald-700 text-xs mt-1 print:hidden">
              Once submitted, the lab will begin processing your order according to the specified requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;