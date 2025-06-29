import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import ToothSelector from './ToothSelector';
import ProductSelection from './ProductSelection';
import FileUploader from '@/components/shared/FileUploader';
import AccessoryTagging from './AccessoryTagging';
import PatientInfoCard from './components/PatientInfoCard';
import CaseInfoCard from './components/CaseInfoCard';
import AccessorySelection from './components/AccessorySelection';

interface NewOrderFlowProps {
  currentStep: number;
  formData: any;
  setFormData: (data: any) => void;
  onAddMoreProducts?: () => void;
}

const NewOrderFlow = ({ currentStep, formData, setFormData }: NewOrderFlowProps) => {
  // Step 1: Patient & Case Information
  if (currentStep === 1) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PatientInfoCard formData={formData} setFormData={setFormData} />
        <CaseInfoCard formData={formData} setFormData={setFormData} />
      </div>
    );
  }

  // Step 2: Restoration Type Selection
  if (currentStep === 2) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Restoration Type</CardTitle>
            <CardDescription>Select the type of prescription and order method</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Select Prescription */}
            <div>
              <Label className="text-base font-medium">Select Prescription</Label>
              <RadioGroup
                value={formData.prescriptionType}
                onValueChange={value => setFormData({
                  ...formData,
                  prescriptionType: value
                })}
                className="mt-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="implant" id="implant" />
                  <Label htmlFor="implant" className="font-normal">Implant</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="crown-bridge" id="crown-bridge" />
                  <Label htmlFor="crown-bridge" className="font-normal">Crown and Bridge</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Order Method */}
            <div>
              <Label className="text-base font-medium">Order Method</Label>
              <RadioGroup
                value={formData.orderMethod}
                onValueChange={value => setFormData({
                  ...formData,
                  orderMethod: value
                })}
                className="mt-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="digital" id="digital" />
                  <Label htmlFor="digital" className="font-normal">Digital</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manual" id="manual" />
                  <Label htmlFor="manual" className="font-normal">Manual</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Show selection summary */}
            {(formData.prescriptionType || formData.orderMethod) && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Selection Summary</h4>
                {formData.prescriptionType && (
                  <p className="text-sm text-gray-600">Prescription: <span className="font-medium">{formData.prescriptionType === 'crown-bridge' ? 'Crown and Bridge' : 'Implant'}</span></p>
                )}
                {formData.orderMethod && (
                  <p className="text-sm text-gray-600">Method: <span className="font-medium">{formData.orderMethod === 'digital' ? 'Digital' : 'Manual'}</span></p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 3: Teeth Selection
  if (currentStep === 3) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Teeth Selection</CardTitle>
            <CardDescription>Select the teeth for your restoration</CardDescription>
          </CardHeader>
          <CardContent>
            <ToothSelector
              selectedGroups={formData.toothGroups || []}
              onGroupsChange={groups => setFormData({
                ...formData,
                toothGroups: groups
              })}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 4: Product Selection & Details
  if (currentStep === 4) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Product Selection</CardTitle>
            <CardDescription>Configure products and restoration details for your selected teeth</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductSelection formData={formData} setFormData={setFormData} />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 5: Upload Files & Impression Handling
  if (currentStep === 5) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Upload Files</CardTitle>
            <CardDescription>Select file type and upload supporting files</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Type Selection */}
            <div>
              <Label className="text-base font-medium">Select File Type</Label>
              <Select
                value={formData.selectedFileType || ''}
                onValueChange={value => setFormData({
                  ...formData,
                  selectedFileType: value
                })}
              >
                <SelectTrigger className="mt-3">
                  <SelectValue placeholder="Choose file type to upload" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scan">
                    <div className="flex flex-col">
                      <span className="font-medium">Scan File</span>
                      <span className="text-xs text-gray-600">Supports: PLY, STL files</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="xray-photo">
                    <div className="flex flex-col">
                      <span className="font-medium">X-ray / Shade Photos</span>
                      <span className="text-xs text-gray-600">Supports: JPG, PNG, JPEG files</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="pdf">
                    <div className="flex flex-col">
                      <span className="font-medium">PDF Document</span>
                      <span className="text-xs text-gray-600">Supports: PDF files</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="dicom">
                    <div className="flex flex-col">
                      <span className="font-medium">DICOM (CBCT Scan)</span>
                      <span className="text-xs text-gray-600">Supports: DICOM files</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* File Upload - Only show when file type is selected */}
            {formData.selectedFileType && (
              <div className="border-t pt-6">
                <FileUploader
                  files={formData.files || []}
                  onFilesChange={files => setFormData({
                    ...formData,
                    files
                  })}
                  maxFiles={10}
                  acceptedTypes={
                    formData.selectedFileType === 'scan' ? ['.ply', '.stl'] :
                      formData.selectedFileType === 'xray-photo' ? ['.jpg', '.jpeg', '.png'] :
                        formData.selectedFileType === 'pdf' ? ['.pdf'] :
                          formData.selectedFileType === 'dicom' ? ['.dcm', '.dicom'] :
                            ['.jpg', '.jpeg', '.png', '.pdf', '.stl', '.ply', '.dcm', '.dicom']
                  }
                  label={`Upload ${formData.selectedFileType === 'scan' ? 'Scan Files' :
                      formData.selectedFileType === 'xray-photo' ? 'X-ray / Shade Photos' :
                        formData.selectedFileType === 'pdf' ? 'PDF Documents' :
                          formData.selectedFileType === 'dicom' ? 'DICOM Files' :
                            'Files'
                    }`}
                  description={
                    formData.selectedFileType === 'scan' ? 'Upload PLY or STL scan files' :
                      formData.selectedFileType === 'xray-photo' ? 'Upload JPG, PNG, or JPEG image files' :
                        formData.selectedFileType === 'pdf' ? 'Upload PDF documents' :
                          formData.selectedFileType === 'dicom' ? 'Upload DICOM scan files' :
                            'Upload your selected file type'
                  }
                />
              </div>
            )}
            {/* Show instruction when no file type selected */}
            {!formData.selectedFileType && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">Please select a file type above to begin uploading</p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Impression Handling</CardTitle>
            <CardDescription>Select how you want to handle impressions</CardDescription>
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
                  <RadioGroupItem value="send-by-courier" id="send-by-courier" />
                  <Label htmlFor="send-by-courier">Send by Courier</Label>
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
                  <Label htmlFor="courierName">Courier Name</Label>
                  <Input
                    id="courierName"
                    type="text"
                    placeholder="Search courier name..."
                    value={formData.scanBooking?.courierName || ''}
                    onChange={e => setFormData({
                      ...formData,
                      scanBooking: {
                        ...formData.scanBooking,
                        courierName: e.target.value
                      }
                    })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="trackingId">Tracking ID</Label>
                  <Input
                    id="trackingId"
                    type="text"
                    placeholder="Enter tracking ID..."
                    value={formData.scanBooking?.trackingId || ''}
                    onChange={e => setFormData({
                      ...formData,
                      scanBooking: {
                        ...formData.scanBooking,
                        trackingId: e.target.value
                      }
                    })}
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <AccessorySelection formData={formData} setFormData={setFormData} />
      </div>
    );
  }
  // Step 6: Final Details & Accessories
  if (currentStep === 6) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Additional Notes</CardTitle>
            <CardDescription>Add any special instructions or notes</CardDescription>
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

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Order Summary</CardTitle>
            <CardDescription>Review your order details before submission</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.prescriptionType && (
              <div>
                <Label className="font-medium">Prescription Type:</Label>
                <p className="text-sm text-gray-600">{formData.prescriptionType === 'crown-bridge' ? 'Crown and Bridge' : 'Implant'}</p>
              </div>
            )}
            {formData.orderMethod && (
              <div>
                <Label className="font-medium">Order Method:</Label>
                <p className="text-sm text-gray-600">{formData.orderMethod === 'digital' ? 'Digital' : 'Manual'}</p>
              </div>
            )}
            {formData.toothGroups && formData.toothGroups.length > 0 && (
              <div>
                <Label className="font-medium">Selected Teeth Groups:</Label>
                <p className="text-sm text-gray-600">{formData.toothGroups.length} group(s) configured</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default NewOrderFlow;
