import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useEffect, useState, useRef } from 'react';
import ToothSelector from './ToothSelector';
import ProductSelection from './ProductSelection';
import FileUploader from '@/components/shared/FileUploader';
import AccessoryTagging from './AccessoryTagging';
import PatientInfoCard from './components/PatientInfoCard';
import CaseInfoCard from './components/CaseInfoCard';
import AccessorySelection from './components/AccessorySelection';
import SelectedTeethViewer from './components/SelectedTeethViewer';
import { Camera } from 'lucide-react';
import Webcam from 'react-webcam';
import { useIsMobile } from '@/hooks/use-mobile';

interface NewOrderFlowProps {
  currentStep: number;
  formData: any;
  setFormData: (data: any) => void;
  onAddMoreProducts?: () => void;
  onSaveOrder?: (orderData: any) => void;
}

// Function to create comprehensive order object
export const createOrderObject = (formData: any, clinicId: string) => {
  return {
    // Order basic info
    referenceId: `REF-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
    type: formData.prescriptionType || formData.category || 'crown-bridge',
    category: formData.category || 'new',
    status: 'pending',
    priority: 'standard',
    urgency: 'standard',
    paymentStatus: 'pending',
    clinicId: clinicId,
    patientFirstName: formData.firstName || '',
    patientLastName: formData.lastName || '',
    patientAge: formData.age ? parseInt(formData.age, 10) : null,
    issueDescription: formData.issueDescription || '',
    issueCategory: formData.issueCategory || '',
    repairType: formData.repairType || '',
    trialApproval: formData.trialApproval || false,
    reapirInstructions: formData.reapirInstructions || '',
    patientSex: formData.sex || '',
    caseHandledBy: formData.caseHandledBy || '',
    consultingDoctor: formData.consultingDoctor || '',
    restorationType: formData.restorationType || '',
    prescriptionType: formData.prescriptionType || '',
    orderType: formData.orderType || '',
    orderMethod: formData.orderMethod || '',
    toothGroups: formData.toothGroups || [],
    restorationProducts: formData.restoration_products || formData.restorationProducts || [],
    files: formData.files || [],
    notes: formData.notes || '',
    accessories: formData.accessories || [],
    selectedTeeth: formData.selectedTeeth || [],
    // Pickup/Scan Information
    pickupDate: formData.pickupDate || '',
    pickupTime: formData.pickupTime || '',
    pickupRemarks: formData.pickupRemarks || '',
    scanBooking: formData.scanBooking || {},
    implantPhoto: formData.implantPhoto || '',
    implantCompany: formData.implantCompany || '',
    implantRemark: formData.implantRemark || '',
    // Additional Details
    selectedFileType: formData.selectedFileType || '',
    selectedCompany: formData.selectedCompany || '',
    expectedDeliveryDate: formData.expectedDeliveryDate || '',
    trial: formData.trial || '',
    shade: formData.shade || [],
    pontic: formData.pontic || 'Ridge Lap',
    occlusalStaining: formData.occlusalStaining || '',
    shadeGuide: formData.shadeGuide || [],
    additionalNotes: formData.additionalNotes || '',
    shadeNotes: formData.shadeNotes || '',
  };
};

// Helper to build deduplicated, prioritized group list for summary
function buildSummaryGroups(toothGroups: any[], selectedTeeth: any[]) {
  // Priority: bridge > joint > individual
  const usedTeeth = new Set<number>();
  const summaryGroups: any[] = [];
  // Add bridge groups first
  toothGroups.filter(g => g.type === 'bridge').forEach(group => {
    const teeth = group.teeth.filter((t: number) => !usedTeeth.has(t));
    if (teeth.length > 0) {
      summaryGroups.push({ ...group, teeth });
      teeth.forEach((t: number) => usedTeeth.add(t));
    }
  });
  // Then joint groups
  toothGroups.filter(g => g.type === 'joint').forEach(group => {
    const teeth = group.teeth.filter((t: number) => !usedTeeth.has(t));
    if (teeth.length > 0) {
      summaryGroups.push({ ...group, teeth });
      teeth.forEach((t: number) => usedTeeth.add(t));
    }
  });
  // Then individual teeth
  const individualTeeth = selectedTeeth.filter((t: any) => !usedTeeth.has(t.toothNumber));
  if (individualTeeth.length > 0) {
    summaryGroups.push({
      groupId: 'individual-group',
      teeth: individualTeeth.map((t: any) => t.toothNumber),
      type: 'individual',
      material: '',
      shade: '',
      notes: '',
    });
    individualTeeth.forEach((t: any) => usedTeeth.add(t.toothNumber));
  }
  return summaryGroups;
}

function CameraCapture({ onPhoto }: { onPhoto: (file: File) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  // Detect if device is mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Use environment camera for mobile, user camera for desktop
  const videoConstraints = isMobile
    ? { facingMode: { ideal: 'environment' } }
    : { facingMode: 'user' };

  const handleDivClick = () => {
    if (isMobile) {
      fileInputRef.current?.click();
    } else {
      setShowModal(true);
      setCameraError(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onPhoto) {
      onPhoto(file);
    }
  };

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    setImgSrc(imageSrc || null);
  };

  const handleConfirm = () => {
    if (imgSrc) {
      fetch(imgSrc)
        .then(res => res.arrayBuffer())
        .then(buf => {
          const file = new File([buf], 'captured-photo.png', { type: 'image/png' });
          onPhoto(file);
          setShowModal(false);
          setImgSrc(null);
        });
    }
  };

  const handleRetake = () => {
    setImgSrc(null);
  };

  const handleClose = () => {
    setShowModal(false);
    setImgSrc(null);
    setCameraError(null);
  };

  return (
    <>
      <div
        className="border-2 border-dashed border-teal-400 rounded-xl flex flex-col items-center justify-center py-12 cursor-pointer hover:bg-teal-50 transition"
        onClick={handleDivClick}
      >
        <Camera size={64} className="text-gray-400 mb-4" />
        <span className="text-base font-semibold text-teal-600 underline">Take Your Photo</span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      {/* Modal for webcam capture */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center">
            {cameraError ? (
              <>
                <div className="text-red-600 font-semibold mb-4">{cameraError}</div>
                <button
                  type="button"
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded font-semibold"
                  onClick={handleClose}
                >
                  Close
                </button>
              </>
            ) : !imgSrc ? (
              <>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/png"
                  videoConstraints={videoConstraints}
                  className="rounded-lg mb-4 w-80 h-60 object-cover"
                  onUserMediaError={err => {
                    setCameraError('Attach Camera');
                  }}
                />
                <button
                  type="button"
                  className="bg-teal-600 text-white px-4 py-2 rounded font-semibold mb-2"
                  onClick={capture}
                >
                  Capture
                </button>
                <button
                  type="button"
                  className="text-gray-500 underline text-sm"
                  onClick={handleClose}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <img src={imgSrc} alt="Captured" className="rounded-lg mb-4 w-80 h-60 object-cover" />
                <div className="flex gap-4">
                  <button
                    type="button"
                    className="bg-teal-600 text-white px-4 py-2 rounded font-semibold"
                    onClick={handleConfirm}
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded font-semibold"
                    onClick={handleRetake}
                  >
                    Retake
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const NewOrderFlow = ({ currentStep, formData, setFormData, onSaveOrder }: NewOrderFlowProps) => {
  const [companies, setCompanies] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [companiesError, setCompaniesError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [showInstructions, setShowInstructions] = useState(false);

  // Fetch companies from API
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoadingCompanies(true);
      setCompaniesError(null);
      try {
        const response = await fetch('/api/companies');
        if (response.ok) {
          const data = await response.json();
          setCompanies(data);
        } else {
          console.error('Failed to fetch companies');
          setCompaniesError('Failed to load companies');
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
        setCompaniesError('Error loading companies');
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

  // Step 1: Patient & Case Information
  if (currentStep === 1) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <PatientInfoCard formData={formData} setFormData={setFormData} />
        <CaseInfoCard formData={formData} setFormData={setFormData} />
      </div>
    );
  }

  // Step 2: Restoration Type Selection
  if (currentStep === 2) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <Card className='border-none p-0'>
          <CardHeader className='p-0'>
            <CardTitle className="text-lg sm:text-xl font-semibold">Restoration Type</CardTitle>
            <CardDescription className="text-xs sm:text-base">Select the type of prescription and order method</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-0">
            {/* Select Prescription */}
            <Card className='p-3 sm:p-4 mt-4'>
              <Label className="text-base font-medium">Select Prescription</Label>
              <RadioGroup
                value={formData.prescriptionType}
                onValueChange={value => setFormData({
                  ...formData,
                  prescriptionType: value
                })} 
                className="mt-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-2">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="implant" id="implant" />
                    <Label htmlFor="implant" className="font-normal">Implant</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="crown-bridge" id="crown-bridge" />
                    <Label htmlFor="crown-bridge" className="font-normal">Crown and Bridge</Label>
                  </div>
                </div>
              </RadioGroup>
            </Card>

            {/* Order Method */}
            <Card className='p-3 sm:p-4 mt-4'>
              <Label className="text-base font-medium">Order Method</Label>
              <RadioGroup
                value={formData.orderMethod}
                onValueChange={value => setFormData({
                  ...formData,
                  orderMethod: value
                })}
                className="mt-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-2">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="digital" id="digital" />
                    <Label htmlFor="digital" className="font-normal">Digital</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="manual" id="manual" />
                    <Label htmlFor="manual" className="font-normal">Manual</Label>
                  </div>
                </div>
              </RadioGroup>
            </Card>

            {/* Show selection summary */}
            {(formData.prescriptionType || formData.orderMethod) && (
              <div className="p-3 sm:p-4 bg-[#EFF9F7] rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Selection Summary</h4>
                {formData.prescriptionType && (
                  <p className="text-xs sm:text-sm text-gray-600">Prescription: <span className="font-medium">{formData.prescriptionType === 'crown-bridge' ? 'Crown and Bridge' : 'Implant'}</span></p>
                )}
                {formData.orderMethod && (
                  <p className="text-xs sm:text-sm text-gray-600">Method: <span className="font-medium">{formData.orderMethod === 'digital' ? 'Digital' : 'Manual'}</span></p>
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
    if (isMobile) {
      return (
        <div className="flex flex-col gap-4">
          <Card className="border-none p-0">
            <CardHeader className="p-0">
              <CardTitle className="text-lg font-semibold">Teeth Selection</CardTitle>
              <CardDescription className="text-xs">Select the teeth for your restoration</CardDescription>
            </CardHeader>
            <CardContent className="p-0 mt-4">
              <ToothSelector
                prescriptionType={formData.prescriptionType}
                selectedGroups={formData.toothGroups || []}
                selectedTeeth={formData.selectedTeeth || []}
                onSelectionChange={(groups, teeth) => setFormData({
                  ...formData,
                  toothGroups: groups,
                  selectedTeeth: teeth
                })}
              />
            </CardContent>
          </Card>
        </div>
      );
    }
    // Desktop: side-by-side layout
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <Card className="border-none p-0">
            <CardHeader className="p-0">
              <CardTitle className="text-lg sm:text-xl font-semibold">Teeth Selection</CardTitle>
              <CardDescription className="text-xs sm:text-base">Select the teeth for your restoration</CardDescription>
            </CardHeader>
            <CardContent className="p-0 mt-4">
              <ToothSelector
                prescriptionType={formData.prescriptionType}
                selectedGroups={formData.toothGroups || []}
                selectedTeeth={formData.selectedTeeth || []}
                onSelectionChange={(groups, teeth) => setFormData({
                  ...formData,
                  toothGroups: groups,
                  selectedTeeth: teeth
                })}
              />
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-4">
          {instructionsPanel}
          {summaryPanel}
        </div>
      </div>
    );
  }

  // Step 4: Product Selection & Details
  if (currentStep === 4) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <Card className='border-none p-0'>
          <div className='p-0 mt-4'>
            <ProductSelection formData={formData} setFormData={setFormData} />
          </div>
        </Card>
      </div>
    );
  }

  // Step 5: Upload Files & Impression Handling
  if (currentStep === 5) {
    const handlePhoto = (file: File) => {
      setFormData({
        ...formData,
        implantPhoto: file,
        capturedPhoto: file,
      });
    };
    return (
      <div className="space-y-2 sm:space-y-4">
        {
          formData.prescriptionType === 'implant' && (
            <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold">Implant System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div>
              <Label className="text-base font-medium">Select Company</Label>
              <Select
                value={formData.implantCompany || ''}
                onValueChange={value => setFormData({
                  ...formData,
                  implantCompany: value
                })}
                disabled={loadingCompanies}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={loadingCompanies ? "Loading companies..." : "Choose a company"} />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{company.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                  {companies.length === 0 && !loadingCompanies && !companiesError && (
                    <SelectItem value="" disabled>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-500">No companies available</span>
                      </div>
                    </SelectItem>
                  )}
                  {companiesError && (
                    <SelectItem value="" disabled>
                      <div className="flex flex-col">
                        <span className="font-medium text-red-500">{companiesError}</span>
                      </div>
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2 sm:space-y-3'>
              <Label className="text-base font-medium">Capture Photos</Label>

              <CameraCapture onPhoto={handlePhoto} />
              {formData.capturedPhoto && (
                <div className="flex flex-col items-center ">
                  <span className="text-xs sm:text-sm text-gray-600 mb-2">Captured Photo Preview:</span>
                  <img
                    src={URL.createObjectURL(formData.capturedPhoto)}
                    alt="Captured"
                    className="rounded-lg border w-36 sm:w-48 h-28 sm:h-36 object-cover"
                  />
                </div>
              )}
            </div>
            <div>
              <Label className="text-base font-medium">Remark</Label>
              <Textarea
                id="implantRemark"
                value={formData.implantRemark || ''}
                onChange={e => setFormData({
                  ...formData,
                  implantRemark: e.target.value
                })}
                className="mt-3"
                rows={1}
                placeholder="Enter any implant-related remarks here..."
              />
            </div>
          </CardContent>
        </Card>
          )
        }
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold">Upload Files</CardTitle>
            <CardDescription className="text-xs sm:text-base">Select file type and upload supporting files</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
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
                <SelectTrigger className="mt-3 text-start">
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
              <div className="border-t pt-4 sm:pt-6">
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
              <div className="text-center py-6 sm:py-8 text-gray-500">
                <p className="text-xs sm:text-sm">Please select a file type above to begin uploading</p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold">Impression Handling</CardTitle>
            <CardDescription className="text-xs sm:text-base">Select how you want to handle impressions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
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
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-2">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="pickup-from-lab" id="pickup-from-lab" />
                    <Label htmlFor="pickup-from-lab">Pickup from Clinic</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="send-by-courier" id="send-by-courier" />
                    <Label htmlFor="send-by-courier">Send by Courier</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            {formData.orderType === 'pickup-from-lab' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="pickupDate">Pickup Date</Label>
                  <Input
                    id="pickupDate"
                    type="date"
                    value={formData.pickupDate}
                    min={new Date().toISOString().split('T')[0]}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
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
    const summaryGroups = buildSummaryGroups(formData.toothGroups || [], formData.selectedTeeth || []);
    // Debug log for developer
    if (typeof window !== 'undefined') {
      console.log('DEBUG: selectedTeeth in summary step:', formData.selectedTeeth);
      console.log('DEBUG: toothGroups in summary step:', formData.toothGroups);
    }
    return (
      <div className="space-y-4 sm:space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold">Additional Notes</CardTitle>
            <CardDescription className="text-xs sm:text-base">Add any special instructions or notes</CardDescription>
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

        {/* Comprehensive Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold">Complete Order Summary</CardTitle>
            <CardDescription className="text-xs sm:text-base">Review all your order details before submission</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            {/* Patient Information Summary */}
            <div className="border-b pb-4">
              <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-blue-600">Patient Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label className="font-medium text-xs sm:text-sm">Name:</Label>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {formData.firstName} {formData.lastName}
                  </p>
                </div>
                <div>
                  <Label className="font-medium text-xs sm:text-sm">Age:</Label>
                  <p className="text-xs sm:text-sm text-gray-600">{formData.age ? formData.age : 'Not specified'}</p>
                </div>
                <div>
                  <Label className="font-medium text-xs sm:text-sm">Sex:</Label>
                  <p className="text-xs sm:text-sm text-gray-600">{formData.sex || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Case Information Summary */}
            <div className="border-b pb-4">
              <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-green-600">Case Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label className="font-medium text-xs sm:text-sm">Case Handled By:</Label>
                  <p className="text-xs sm:text-sm text-gray-600">{formData.caseHandledBy || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="font-medium text-xs sm:text-sm">Consulting Doctor:</Label>
                  <p className="text-xs sm:text-sm text-gray-600">{formData.consultingDoctor || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Restoration Details Summary */}
            <div className="border-b pb-4">
              <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-purple-600">Restoration Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label className="font-medium text-xs sm:text-sm">Prescription Type:</Label>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {formData.prescriptionType === 'crown-bridge' ? 'Crown and Bridge' :
                      formData.prescriptionType === 'implant' ? 'Implant' : 'Not specified'}
                  </p>
                </div>
                <div>
                  <Label className="font-medium text-xs sm:text-sm">Order Method:</Label>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {formData.orderMethod === 'digital' ? 'Digital' :
                      formData.orderMethod === 'manual' ? 'Manual' : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Teeth and Products Summary */}
            <div className="border-b pb-4">
              <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-orange-600">Teeth and Products</h4>
              <div>
                <Label className="font-medium text-xs sm:text-sm">Selected Teeth Groups:</Label>
                <p className="text-xs sm:text-sm text-gray-600">
                  {summaryGroups && summaryGroups.length > 0
                    ? `${summaryGroups.length} group(s) configured`
                    : 'No teeth groups selected'}
                </p>
              </div>
              <div className="mt-2">
                <Label className="font-medium text-xs sm:text-sm">Restoration Products:</Label>
                <p className="text-xs sm:text-sm text-gray-600">
                  {formData.restoration_products && formData.restoration_products.length > 0
                    ? `${formData.restoration_products.length} product(s) selected`
                    : 'No products selected'}
                </p>
              </div>
              <div className="mt-4">
                <SelectedTeethViewer selectedTeeth={formData.selectedTeeth || []} toothGroups={summaryGroups} />
              </div>
            </div>

            {/* Files and Accessories Summary */}
            <div className="border-b pb-4">
              <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-red-600">Files and Accessories</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label className="font-medium text-xs sm:text-sm">Uploaded Files:</Label>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {formData.files && formData.files.length > 0
                      ? `${formData.files.length} file(s) uploaded`
                      : 'No files uploaded'}
                  </p>
                </div>
                <div>
                  <Label className="font-medium text-xs sm:text-sm">Accessories:</Label>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {formData.accessories && formData.accessories.length > 0
                      ? `${formData.accessories.length} accessory(ies) selected`
                      : 'No accessories selected'}
                  </p>
                </div>
              </div>
            </div>

            {/* Pickup/Scan Information Summary */}
            {(formData.pickupDate || formData.pickupTime || formData.scanBooking) && (
              <div className="border-b pb-4">
                <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-indigo-600">Pickup/Scan Information</h4>
                {formData.orderType === 'pickup-from-lab' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label className="font-medium text-xs sm:text-sm">Pickup Date:</Label>
                      <p className="text-xs sm:text-sm text-gray-600">{formData.pickupDate || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label className="font-medium text-xs sm:text-sm">Pickup Time:</Label>
                      <p className="text-xs sm:text-sm text-gray-600">{formData.pickupTime || 'Not specified'}</p>
                    </div>
                    {formData.pickupRemarks && (
                      <div className="col-span-1 sm:col-span-2">
                        <Label className="font-medium text-xs sm:text-sm">Pickup Remarks:</Label>
                        <p className="text-xs sm:text-sm text-gray-600">{formData.pickupRemarks}</p>
                      </div>
                    )}
                  </div>
                )}
                {formData.orderType === 'request-scan' && formData.scanBooking && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label className="font-medium text-xs sm:text-sm">Courier Name:</Label>
                      <p className="text-xs sm:text-sm text-gray-600">{formData.scanBooking.courierName || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label className="font-medium text-xs sm:text-sm">Tracking ID:</Label>
                      <p className="text-xs sm:text-sm text-gray-600">{formData.scanBooking.trackingId || 'Not specified'}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notes Summary */}
            {formData.notes && (
              <div>
                <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-gray-600">Additional Notes</h4>
                <p className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{formData.notes}</p>
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
