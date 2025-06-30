import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Calendar, Shield, AlertCircle, Search, CheckCircle, XCircle, Edit2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import ToothSelector from './ToothSelector';
import ToothChartSVG from './ToothChartSVG';
import ReviewDetailsStep from './ReviewDetailsStep';
import AccessoryTagging from './AccessoryTagging';
import FileUploader from '@/components/shared/FileUploader';

import { useOrders } from '@/hooks/shared/useOrders';

interface RepeatOrderFlowProps {
  currentStep: number;
  formData: any;
  setFormData: (data: any) => void;
}

const RepeatOrderFlow = ({ currentStep, formData, setFormData }: RepeatOrderFlowProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [warrantyAuthId, setWarrantyAuthId] = useState('');
  const [warrantyStatus, setWarrantyStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid' | 'expired'>('idle');
  const [warrantyInfo, setWarrantyInfo] = useState<any>(null);

  // Fetch orders dynamically
  const { data: orders = [], isLoading, isError } = useOrders();

  // Filter previous orders based on search criteria
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const patientName = `${order.patientFirstName} ${order.patientLastName}`.toLowerCase();
      const matchesSearch =
        patientName.includes(searchTerm.toLowerCase()) ||
        (order.orderId || order.referenceId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.restorationType || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;

      const matchesDate = !selectedDate || (order.createdAt && order.createdAt.split('T')[0] === selectedDate);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchTerm, selectedStatus, selectedDate]);

  // Area managers for scan booking
  const areaManagers = [
    'John Smith - North Region',
    'Sarah Johnson - South Region', 
    'Mike Wilson - East Region',
    'Emily Davis - West Region',
    'Tom Brown - Central Region'
  ];

  // Time slots for scan booking
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  // File upload handler is now handled by FileUploader component

  const handleDeliveryMethodChange = (value: string) => {
    setFormData({
      ...formData,
      orderType: value,
      // Clear scan booking data if not requesting scan
      ...(value !== 'request-scan' && { 
        scanBooking: undefined 
      })
    });
  };

  const handleScanBookingChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      scanBooking: {
        ...formData.scanBooking,
        [field]: value
      }
    });
  };

  const handleWarrantyCheck = async () => {
    if (!warrantyAuthId.trim()) {
      alert('Please enter Authentication ID');
      return;
    }

    setWarrantyStatus('checking');
    
    // Simulate API call for warranty verification
    setTimeout(() => {
      // Mock warranty verification logic
      const mockWarrantyData = {
        'AUTH123456': {
          status: 'valid',
          originalOrderDate: '2023-06-15',
          warrantyPeriod: '24 months',
          expiryDate: '2025-06-15',
          coverage: 'Full replacement warranty',
          manufacturingLab: 'Premium Dental Lab',
          technician: 'Dr. Smith Johnson'
        },
        'AUTH789012': {
          status: 'expired',
          originalOrderDate: '2021-03-10',
          warrantyPeriod: '12 months',
          expiryDate: '2022-03-10',
          coverage: 'Standard warranty (expired)',
          manufacturingLab: 'Standard Dental Lab',
          technician: 'Dr. Mike Wilson'
        }
      };

      const warrantyData = mockWarrantyData[warrantyAuthId as keyof typeof mockWarrantyData];
      
      if (warrantyData) {
        if (warrantyData.status === 'valid') {
          setWarrantyStatus('valid');
          setWarrantyInfo(warrantyData);
        } else {
          setWarrantyStatus('expired');
          setWarrantyInfo(warrantyData);
        }
      } else {
        setWarrantyStatus('invalid');
        setWarrantyInfo(null);
      }
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (currentStep === 1) {
    return (
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
          <CardTitle className="text-primary flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">1</span>
            </div>
            Select Previous Order
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Search and Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Search Orders</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search by order ID, patient, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Filter by Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Filter by Date</Label>
              <Input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>

          {/* Orders List */}
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading orders...</div>
          ) : isError ? (
            <div className="text-center py-8 text-red-500">Failed to load orders.</div>
          ) : (
            <div className="max-h-96 overflow-y-auto space-y-2 border rounded-lg p-2">
              {filteredOrders.slice(0, 10).map((order) => (
                <Card 
                  key={order.orderId || order.referenceId} 
                  className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                    formData.previousOrderId === (order.orderId || order.referenceId)
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                  onClick={() => {
                    setFormData({
                      ...formData,
                      previousOrderId: order.orderId || order.referenceId,
                      selectedOrder: order,
                      restorationType: order.restorationType?.toLowerCase().replace(' ', '-') || '',
                      toothGroups: order.toothGroups || []
                    });
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{order.orderId || order.referenceId}</span>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>Patient: <span className="font-medium">{order.patientFirstName} {order.patientLastName}</span></div>
                          <div>Type: <span className="font-medium">{order.prescriptionType}</span></div>
                          <div>Date: <span className="font-medium">{order.createdAt?.split('T')[0]}</span></div>
                          {/* Show all selected teeth for this order */}
                          {order.toothGroups && order.toothGroups.length > 0 && (
                            <div>
                              Teeth: <span className="font-medium">
                                {order.toothGroups.map((g: any) => g.teeth).flat().join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      {formData.previousOrderId === (order.orderId || order.referenceId) && (
                        <CheckCircle className="text-primary" size={20} />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredOrders.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="mx-auto mb-2" size={24} />
                  <p>No orders found matching your criteria</p>
                </div>
              )}
            </div>
          )}

          {/* Selected Order Preview */}
          {formData.previousOrderId && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-800 mb-3">Selected Order Preview</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-blue-700">Order ID:</span>
                      <span className="text-sm text-blue-600">{formData.previousOrderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-blue-700">Patient:</span>
                      <span className="text-sm text-blue-600">{formData.selectedOrder?.patientFirstName} {formData.selectedOrder?.patientLastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-blue-700">Type:</span>
                      <span className="text-sm text-blue-600">{formData.selectedOrder?.prescriptionType}</span>
                    </div>
                    {/* Show all selected teeth for the selected order */}
                    {formData.selectedOrder?.toothGroups && formData.selectedOrder.toothGroups.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-blue-700">Teeth:</span>
                        <span className="text-sm text-blue-600">
                          {formData.selectedOrder.toothGroups.map((g: any) => g.teeth).flat().join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-blue-700">Date:</span>
                      <span className="text-sm text-blue-600">{formData.selectedOrder?.createdAt?.split('T')[0]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-blue-700">Status:</span>
                      <Badge className={getStatusColor(formData.selectedOrder?.status)}>
                        {formData.selectedOrder?.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Warranty Check Option */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="checkWarranty"
                  checked={formData.checkWarranty || false}
                  onCheckedChange={(checked) => setFormData({...formData, checkWarranty: checked})}
                  className="mt-1"
                />
                <div className="space-y-3 flex-1">
                  <div>
                    <Label htmlFor="checkWarranty" className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                      <Shield size={16} className="text-green-600" />
                      Check Warranty Eligibility
                    </Label>
                    <p className="text-sm text-green-600 mt-1">
                      Verify warranty status before placing repeat order
                    </p>
                  </div>
                  
                  {formData.checkWarranty && (
                    <div className="space-y-3 mt-4 p-3 bg-white rounded border">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Authentication ID</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter authentication ID..."
                            value={warrantyAuthId}
                            onChange={(e) => setWarrantyAuthId(e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            onClick={handleWarrantyCheck}
                            disabled={warrantyStatus === 'checking'}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {warrantyStatus === 'checking' ? (
                              <Clock className="animate-spin" size={16} />
                            ) : (
                              'Verify'
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Warranty Status Display */}
                      {warrantyStatus === 'valid' && warrantyInfo && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="text-green-600" size={16} />
                            <span className="font-medium text-green-800">Valid Warranty</span>
                          </div>
                          <div className="text-sm text-green-700 space-y-1">
                            <p><strong>Coverage:</strong> {warrantyInfo.coverage}</p>
                            <p><strong>Expiry:</strong> {warrantyInfo.expiryDate}</p>
                            <p><strong>Lab:</strong> {warrantyInfo.manufacturingLab}</p>
                          </div>
                        </div>
                      )}

                      {warrantyStatus === 'expired' && warrantyInfo && (
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="text-orange-600" size={16} />
                            <span className="font-medium text-orange-800">Warranty Expired</span>
                          </div>
                          <div className="text-sm text-orange-700 space-y-1">
                            <p><strong>Expired:</strong> {warrantyInfo.expiryDate}</p>
                            <p><strong>Original Coverage:</strong> {warrantyInfo.coverage}</p>
                          </div>
                        </div>
                      )}

                      {warrantyStatus === 'invalid' && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded">
                          <div className="flex items-center gap-2">
                            <XCircle className="text-red-600" size={16} />
                            <span className="font-medium text-red-800">Invalid Authentication ID</span>
                          </div>
                          <p className="text-sm text-red-700 mt-1">
                            Please check the Authentication ID and try again.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    );
  }

  if (currentStep === 2) {
    return (
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
          <CardTitle className="text-primary flex items-center gap-2">
            <Edit2 size={20} />
            Review & Edit Details
          </CardTitle>
          <div className="text-sm text-muted-foreground mt-1">Edit if needed</div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Original Order Summary */}
          <Card className="border-blue-200 bg-blue-50 mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-800 text-base">Original Order Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-blue-700">Order ID</Label>
                <p className="text-sm text-blue-600">{formData.previousOrderId}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-blue-700">Patient</Label>
                <p className="text-sm text-blue-600">{formData.selectedOrder?.patientFirstName} {formData.selectedOrder?.patientLastName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-blue-700">Original Date</Label>
                <p className="text-sm text-blue-600">{formData.selectedOrder?.date}</p>
              </div>
            </CardContent>
          </Card>

          {/* Smart Suggestions */}
          <Card className="border-green-200 bg-green-50 mb-6">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                  <CheckCircle className="text-green-600" size={14} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-green-800 mb-2">Smart Suggestions</h4>
                  <div className="space-y-2 text-sm text-green-700">
                    <p>• Same restoration type and materials as original order</p>
                    <p>• Updated delivery timeframe based on current lab capacity</p>
                    <p>• Pre-filled patient information and treatment history</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <ToothSelector 
            selectedGroups={formData.toothGroups || []}
            onGroupsChange={(groups) => setFormData({
              ...formData,
              toothGroups: groups
            })}
          />
        </CardContent>
      </Card>
    );
  }

  if (currentStep === 3) {
    return (
      <div className="space-y-6">
        {/* File Upload Section */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="text-primary flex items-center gap-2">
              <Upload size={20} />
              Additional Files & Documentation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <FileUploader
                  files={formData.files || []}
                  onFilesChange={(files) => setFormData({...formData, files})}
                  maxFiles={10}
                  maxFileSize={10}
                  acceptedTypes={['.jpg', '.jpeg', '.png', '.pdf', '.stl']}
                  label="Upload New Files (Optional)"
                  description="Add new impressions, photos, or other supporting files"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground">
                  Original Order Files
                </Label>
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="text-green-600" size={16} />
                        <span className="text-sm font-medium text-green-800">
                          Files from Original Order
                        </span>
                      </div>
                      <div className="text-sm text-green-700 space-y-1">
                        <p>• Impression_Model_Lab.stl</p>
                        <p>• Shade_Guide_Photo.jpg</p>
                        <p>• Original_Prescription.pdf</p>
                      </div>
                      <p className="text-xs text-green-600 mt-2">
                        These files will be automatically included with your repeat order
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Delivery Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Delivery Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={formData.orderType} onValueChange={handleDeliveryMethodChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select delivery method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pickup-from-lab">Pickup from Clinic</SelectItem>
                    <SelectItem value="request-scan">Request Scan</SelectItem>
                    <SelectItem value="digital-delivery">Digital Delivery</SelectItem>
                  </SelectContent>
                </Select>

                {formData.orderType === 'pickup-from-lab' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="pickupDate">Pickup Date</Label>
                      <Input 
                        id="pickupDate" 
                        type="date" 
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.pickupDate || ''} 
                        onChange={e => setFormData({
                          ...formData,
                          pickupDate: e.target.value
                        })} 
                        className="mt-1" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="pickupTime">Pickup Time</Label>
                      <Input 
                        id="pickupTime" 
                        type="time" 
                        value={formData.pickupTime || ''} 
                        onChange={e => setFormData({
                          ...formData,
                          pickupTime: e.target.value
                        })} 
                        className="mt-1" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="pickupRemarks">Pickup Remarks</Label>
                      <Textarea 
                        id="pickupRemarks" 
                        value={formData.pickupRemarks || ''} 
                        onChange={e => setFormData({
                          ...formData,
                          pickupRemarks: e.target.value
                        })} 
                        className="mt-1" 
                        rows={3} 
                      />
                    </div>
                  </div>
                )}

                {formData.orderType === 'request-scan' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                    <div>
                      <Label htmlFor="areaManagerId">Area Manager *</Label>
                      <Select 
                        value={formData.scanBooking?.areaManagerId || ''} 
                        onValueChange={value => handleScanBookingChange('areaManagerId', value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select area manager" />
                        </SelectTrigger>
                        <SelectContent>
                          {areaManagers.map((manager, index) => (
                            <SelectItem key={index} value={`manager${index + 1}`}>
                              {manager}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="scanDate">Scan Date *</Label>
                      <Input 
                        id="scanDate" 
                        min={new Date().toISOString().split('T')[0]}
                        type="date" 
                        value={formData.scanBooking?.scanDate || ''} 
                        onChange={e => handleScanBookingChange('scanDate', e.target.value)} 
                        className="mt-1" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="scanTime">Scan Time *</Label>
                      <Select 
                        value={formData.scanBooking?.scanTime || ''} 
                        onValueChange={value => handleScanBookingChange('scanTime', value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot, index) => (
                            <SelectItem key={index} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="scanNotes">Scan Notes</Label>
                      <Textarea 
                        id="scanNotes" 
                        value={formData.scanBooking?.notes || ''} 
                        onChange={e => handleScanBookingChange('notes', e.target.value)} 
                        className="mt-1" 
                        rows={3} 
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Accessory Tagging */}
        <AccessoryTagging formData={formData} setFormData={setFormData} />
      </div>
    );
  }

  return null;
};

export default RepeatOrderFlow;