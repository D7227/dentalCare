

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import ToothSelector from './ToothSelector';
import FileUploader from '@/components/shared/FileUploader';
import AccessoryTagging from './AccessoryTagging';
import PatientInfoCard from './components/PatientInfoCard';
import CaseInfoCard from './components/CaseInfoCard';

interface NewOrderFlowProps {
  currentStep: number;
  formData: any;
  setFormData: (data: any) => void;
}

const NewOrderFlow = ({ currentStep, formData, setFormData }: NewOrderFlowProps) => {
  if (currentStep === 1) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PatientInfoCard formData={formData} setFormData={setFormData} />
        <CaseInfoCard formData={formData} setFormData={setFormData} />
      </div>
    );
  }

  if (currentStep === 2) {
    return (
      <div className="space-y-6">
        <ToothSelector 
          selectedGroups={formData.toothGroups || []} 
          onGroupsChange={groups => setFormData({
            ...formData,
            toothGroups: groups
          })} 
        />
        
        {/* <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">Expected Date of Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="expectedDeliveryDate" className="text-base font-semibold">When do you need this delivered?</Label>
              <Input 
                id="expectedDeliveryDate" 
                type="date" 
                value={formData.expectedDeliveryDate || ''} 
                onChange={e => setFormData({
                  ...formData,
                  expectedDeliveryDate: e.target.value
                })} 
                className="mt-2 h-12 text-lg border-2 border-primary/20 focus:border-primary" 
                min={new Date().toISOString().split('T')[0]}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Select your preferred delivery date to help us plan your order timeline
              </p>
            </div>
          </CardContent>
        </Card> */}
      </div>
    );
  }

  if (currentStep === 3) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Upload Files</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUploader 
              files={formData.files || []} 
              onFilesChange={files => setFormData({
                ...formData,
                files
              })} 
              maxFiles={10} 
              acceptedTypes={['.jpg', '.jpeg', '.png', '.pdf', '.stl']}
              label="Upload Files"
              description="Upload impressions, photos, or other supporting files"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Impression Handling</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Handling Type</Label>
              <RadioGroup 
                value={formData.orderType} 
                onValueChange={value => setFormData({
                  ...formData,
                  orderType: value
                })} 
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pickup-from-lab" id="pickup-from-lab" />
                  <Label htmlFor="pickup-from-lab">Pickup from Clinic</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="request-scan" id="request-scan" />
                  <Label htmlFor="request-scan">Request Scan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="digital-delivery" id="digital-delivery" />
                  <Label htmlFor="digital-delivery">Digital Delivery</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.orderType === 'pickup-from-lab' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="pickupDate">Pickup Date</Label>
                  <Input 
                    id="pickupDate" 
                    type="date" 
                    value={formData.pickupDate} 
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
                    value={formData.pickupTime} 
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
                    value={formData.pickupRemarks} 
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
                    value={formData.scanBooking?.areaManagerId} 
                    onValueChange={value => setFormData({
                      ...formData,
                      scanBooking: {
                        ...formData.scanBooking,
                        areaManagerId: value
                      }
                    })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select area manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manager1">John Doe</SelectItem>
                      <SelectItem value="manager2">Jane Smith</SelectItem>
                      <SelectItem value="manager3">Mike Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="scanDate">Scan Date *</Label>
                  <Input 
                    id="scanDate" 
                    type="date" 
                    value={formData.scanBooking?.scanDate} 
                    onChange={e => setFormData({
                      ...formData,
                      scanBooking: {
                        ...formData.scanBooking,
                        scanDate: e.target.value
                      }
                    })} 
                    className="mt-1" 
                  />
                </div>
                <div>
                  <Label htmlFor="scanTime">Scan Time *</Label>
                  <Input 
                    id="scanTime" 
                    type="time" 
                    value={formData.scanBooking?.scanTime} 
                    onChange={e => setFormData({
                      ...formData,
                      scanBooking: {
                        ...formData.scanBooking,
                        scanTime: e.target.value
                      }
                    })} 
                    className="mt-1" 
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="scanNotes">Scan Notes</Label>
                  <Textarea 
                    id="scanNotes" 
                    value={formData.scanBooking?.notes} 
                    onChange={e => setFormData({
                      ...formData,
                      scanBooking: {
                        ...formData.scanBooking,
                        notes: e.target.value
                      }
                    })} 
                    className="mt-1" 
                    rows={3} 
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="additionalNotes">Special Instructions or Notes</Label>
              <Textarea 
                id="additionalNotes" 
                value={formData.notes || ''} 
                onChange={e => setFormData({
                  ...formData,
                  notes: e.target.value
                })} 
                placeholder="Any special instructions, preferences, or additional information..."
                className="mt-1" 
                rows={4} 
              />
            </div>
          </CardContent>
        </Card>

        <AccessoryTagging formData={formData} setFormData={setFormData} />
      </div>
    );
  }

  return null;
};

export default NewOrderFlow;
