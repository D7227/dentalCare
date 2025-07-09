import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState, useRef } from "react";
import ToothSelector from "./ToothSelector";
import ProductSelection from "./ProductSelection";
import FileUploader from "@/components/shared/FileUploader";
import AccessoryTagging from "./AccessoryTagging";
import PatientInfoCard from "./components/PatientInfoCard";
import CaseInfoCard from "./components/CaseInfoCard";
import AccessorySelection from "./components/AccessorySelection";
import SelectedTeethViewer from "./components/SelectedTeethViewer";
import { Camera, Smartphone, FileText } from "lucide-react";
import Webcam from "react-webcam";
import { useIsMobile } from "@/hooks/use-mobile";
import OrderTypeSection from "./components/OrderTypeSection";
import { SelectPrescriptionSection } from "./components/SelectPrescriptionSection";
import { StlViewer } from "react-stl-viewer";

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
    referenceId: `REF-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 4)
      .toUpperCase()}`,
    type: formData.prescriptionType || formData.category || "crown-bridge",
    category: formData.category || "new",
    status: "pending",
    priority: "standard",
    urgency: "standard",
    paymentStatus: "pending",
    clinicId: clinicId,
    patientFirstName: formData.firstName || "",
    patientLastName: formData.lastName || "",
    patientAge: formData.age ? parseInt(formData.age, 10) : null,
    issueDescription: formData.issueDescription || "",
    issueCategory: formData.issueCategory || "",
    repairType: formData.repairType || "",
    trialApproval: formData.trialApproval || false,
    reapirInstructions: formData.reapirInstructions || "",
    patientSex: formData.sex || "",
    caseHandledBy: formData.caseHandledBy || "",
    consultingDoctor: formData.consultingDoctor || "",
    consultingDoctorMobile: formData.consultingDoctorMobile || "",
    restorationType: formData.restorationType || "",
    prescriptionType: formData.prescriptionType || "",
    subcategoryType: formData.subcategoryType || "",
    orderType: formData.orderType || "",
    orderMethod: formData.orderMethod || "",
    toothGroups: formData.toothGroups || [],
    restorationProducts:
      formData.restoration_products || formData.restorationProducts || [],
    files: formData.files || [],
    notes: formData.notes || "",
    accessories: formData.accessories || [],
    selectedTeeth: formData.selectedTeeth || [],
    // Pickup/Scan Information
    pickupDate: formData.pickupDate || "",
    pickupTime: formData.pickupTime || "",
    pickupRemarks: formData.pickupRemarks || "",
    scanBooking: formData.scanBooking || {},
    implantPhoto: formData.implantPhoto || "",
    implantCompany: formData.implantCompany || "",
    implantRemark: formData.implantRemark || "",
    // Additional Details
    selectedFileType: formData.selectedFileType || "",
    selectedCompany: formData.selectedCompany || "",
    expectedDeliveryDate: formData.expectedDeliveryDate || "",
    trial: formData.trial || "",
    shade: formData.shade || [],
    pontic: formData.pontic || "Ridge Lap",
    occlusalStaining: formData.occlusalStaining || "",
    shadeGuide: formData.shadeGuide || [],
    additionalNotes: formData.additionalNotes || "",
    shadeNotes: formData.shadeNotes || "",
  };
};

// Helper to build deduplicated, prioritized group list for summary
function buildSummaryGroups(toothGroups: any[], selectedTeeth: any[]) {
  // Priority: bridge > joint > individual
  const usedTeeth = new Set<number>();
  const summaryGroups: any[] = [];
  // Add bridge groups first
  toothGroups
    .filter((g) => g.type === "bridge")
    .forEach((group) => {
      const teeth = group.teeth.filter((t: number) => !usedTeeth.has(t));
      if (teeth.length > 0) {
        summaryGroups.push({ ...group, teeth });
        teeth.forEach((t: number) => usedTeeth.add(t));
      }
    });
  // Then joint groups
  toothGroups
    .filter((g) => g.type === "joint")
    .forEach((group) => {
      const teeth = group.teeth.filter((t: number) => !usedTeeth.has(t));
      if (teeth.length > 0) {
        summaryGroups.push({ ...group, teeth });
        teeth.forEach((t: number) => usedTeeth.add(t));
      }
    });
  // Then individual teeth
  const individualTeeth = selectedTeeth.filter(
    (t: any) => !usedTeeth.has(t.toothNumber)
  );
  if (individualTeeth.length > 0) {
    summaryGroups.push({
      groupId: "individual-group",
      teeth: individualTeeth.map((t: any) => t.toothNumber),
      type: "individual",
      material: "",
      shade: "",
      notes: "",
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
    ? { facingMode: { ideal: "environment" } }
    : { facingMode: "user" };

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
        .then((res) => res.arrayBuffer())
        .then((buf) => {
          const file = new File([buf], "captured-photo.png", {
            type: "image/png",
          });
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
        <span className="text-base font-semibold text-teal-600 underline">
          Take Your Photo
        </span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-4 sm:p-6 flex flex-col items-center w-full max-w-xs sm:max-w-md mx-2 my-8">
            {cameraError ? (
              <>
                <div className="text-red-600 font-semibold mb-4 text-center text-sm sm:text-base">
                  {cameraError}
                </div>
                <button
                  type="button"
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded font-semibold w-full"
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
                  className="rounded-lg mb-4 w-full max-w-xs h-48 sm:w-80 sm:h-60 object-cover"
                  onUserMediaError={(err) => {
                    setCameraError("Attach Camera");
                  }}
                />
                <button
                  type="button"
                  className="bg-teal-600 text-white px-4 py-2 rounded font-semibold mb-2 w-full"
                  onClick={capture}
                >
                  Capture
                </button>
                <button
                  type="button"
                  className="text-gray-500 underline text-sm w-full"
                  onClick={handleClose}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <img
                  src={imgSrc}
                  alt="Captured"
                  className="rounded-lg mb-4 w-full max-w-xs h-48 sm:w-80 sm:h-60 object-cover"
                />
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
                  <button
                    type="button"
                    className="bg-teal-600 text-white px-4 py-2 rounded font-semibold w-full"
                    onClick={handleConfirm}
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded font-semibold w-full"
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

const NewOrderFlow = ({
  currentStep,
  formData,
  setFormData,
  onAddMoreProducts,
  onSaveOrder,
}: NewOrderFlowProps) => {
  const [companies, setCompanies] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [companiesError, setCompaniesError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [showInstructions, setShowInstructions] = useState(false);
  const viewerRef = useRef(null);

  console.log("formData", formData);

  // Fetch companies from API
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoadingCompanies(true);
      setCompaniesError(null);
      try {
        const response = await fetch("/api/companies");
        if (response.ok) {
          const data = await response.json();
          setCompanies(data);
        } else {
          console.error("Failed to fetch companies");
          setCompaniesError("Failed to load companies");
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
        setCompaniesError("Error loading companies");
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    if (viewerRef.current) {
      // Type assertion to fix TS error: Property 'querySelector' does not exist on type 'never'
      const viewerElement = viewerRef.current as HTMLElement;
      const canvas = viewerElement.querySelector('canvas');
      if (canvas) {
        canvas.style.height = '400px';
        canvas.style.width = '400px';
      }
    }
  }, [formData.intraOralScans]);

  // Step 1: Patient & Case Information
  if (currentStep === 1) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <PatientInfoCard formData={formData} setFormData={setFormData} />
          <CaseInfoCard formData={formData} setFormData={setFormData} />
        </div>

        {/* Order Method */}
        {(formData?.toothGroups?.length === 0 || !formData?.toothGroups) &&
          (!formData?.selectedTeeth ||
            formData?.selectedTeeth.length === 0) && (
            <OrderTypeSection formData={formData} setFormData={setFormData} />
          )}
      </div>
    );
  }

  // Step 2: Restoration Type Selection
  if (currentStep === 2) {
    return (
      <SelectPrescriptionSection
        formData={formData}
        setFormData={setFormData}
        mode="prescription"
      />
    );
  }

  // Step 3: Subcategory Selection
  if (currentStep === 3) {
    return (
      <SelectPrescriptionSection
        formData={formData}
        setFormData={setFormData}
        mode="subcategory"
      />
    );
  }

  // Step 4: Teeth Selection
  if (currentStep === 4) {
    if (isMobile) {
      return (
        <div className="flex flex-col gap-4">
          <Card className="border-none p-0">
            <CardHeader className="p-0">
              <CardTitle className="text-lg font-semibold">
                Teeth Selection
              </CardTitle>
              <CardDescription className="text-xs">
                Select the teeth for your restoration
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 mt-4">
              <ToothSelector
                prescriptionType={formData.prescriptionType}
                selectedGroups={formData.toothGroups || []}
                selectedTeeth={formData.selectedTeeth || []}
                onSelectionChange={(groups, teeth) =>
                  setFormData({
                    ...formData,
                    toothGroups: groups,
                    selectedTeeth: teeth,
                  })
                }
              />
            </CardContent>
          </Card>
        </div>
      );
    }
    // Desktop: side-by-side layout
    return (
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <Card className="border-none p-0">
          <CardHeader className="p-0">
            <CardTitle className="text-lg sm:text-xl font-semibold">
              Teeth Selection
            </CardTitle>
            <CardDescription className="text-xs sm:text-base">
              Select the teeth for your restoration
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <ToothSelector
              prescriptionType={formData.prescriptionType}
              selectedGroups={formData.toothGroups || []}
              selectedTeeth={formData.selectedTeeth || []}
              onSelectionChange={(groups, teeth) =>
                setFormData({
                  ...formData,
                  toothGroups: groups,
                  selectedTeeth: teeth,
                })
              }
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 5: Product Selection & Details
  if (currentStep === 5) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <Card className="border-none p-0">
          <div className="p-0 mt-4">
            <ProductSelection
              formData={formData}
              setFormData={setFormData}
              onAddMoreProducts={
                typeof onAddMoreProducts === "function"
                  ? onAddMoreProducts
                  : undefined
              }
            />
          </div>
        </Card>
      </div>
    );
  }

  // Step 6: Upload Files & Impression Handling
  if (currentStep === 6) {
    const summaryGroups = buildSummaryGroups(
      formData.toothGroups || [],
      formData.selectedTeeth || []
    );
    return (
      <div className="space-y-4 sm:space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold">
              Upload Files
            </CardTitle>
            <CardDescription className="text-xs sm:text-base">
              Please upload patient details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left: File Inputs */}
              <div className="flex flex-col gap-6">
                {/* Intra oral scans */}
                <div>
                  <Label className="text-base font-medium">Intra oral scans (STL/PLY)</Label>
                  <Input
                    type="file"
                    accept=".stl,.ply"
                    multiple
                    onChange={e => setFormData({ ...formData, intraOralScans: Array.from(e.target.files || []) })}
                  />
                  <div className="mt-2 space-y-1">
                    {(formData.intraOralScans || []).map((file: any, idx: number) => (
                      <div key={idx} className="text-xs text-gray-700 flex items-center gap-2">
                        {file.name}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Face scans */}
                <div>
                  <Label className="text-base font-medium">Face scans (JPG/PNG)</Label>
                  <Input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    multiple
                    onChange={e => setFormData({ ...formData, faceScans: Array.from(e.target.files || []) })}
                  />
                  <div className="mt-2 space-y-1">
                    {(formData.faceScans || []).map((file: any, idx: number) => (
                      <div key={idx} className="text-xs text-gray-700 flex items-center gap-2">
                        {file.name}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Patient photos */}
                <div>
                  <Label className="text-base font-medium">Add patient photos (JPG/PNG)</Label>
                  <Input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    multiple
                    onChange={e => setFormData({ ...formData, patientPhotos: Array.from(e.target.files || []) })}
                  />
                  <div className="mt-2 space-y-1">
                    {(formData.patientPhotos || []).map((file: any, idx: number) => (
                      <div key={idx} className="text-xs text-gray-700 flex items-center gap-2">
                        {file.name}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Referral files */}
                <div>
                  <Label className="text-base font-medium">Referral images/docs (PDF/JPG/PNG)</Label>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    onChange={e => setFormData({ ...formData, referralFiles: Array.from(e.target.files || []) })}
                  />
                  <div className="mt-2 space-y-1">
                    {(formData.referralFiles || []).map((file: any, idx: number) => (
                      <div key={idx} className="text-xs text-gray-700 flex items-center gap-2">
                        {file.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Right: STL Preview */}
              <div className="flex flex-col items-center justify-start w-full">
                <div
                  ref={viewerRef}
                  style={{
                    width: 400,
                    height: 400,
                    border: '1px solid #ccc',
                    borderRadius: 8,
                    backgroundColor: '#000', // black background
                    overflow: 'hidden',
                  }}
                >
                  {(formData.intraOralScans || []).some((f: any) =>
                    f.name?.toLowerCase().endsWith('.stl')
                  ) ? (
                    <StlViewer
                      url={URL.createObjectURL(
                        (formData.intraOralScans || []).find((f: any) =>
                          f.name?.toLowerCase().endsWith('.stl')
                        )
                      )}
                      width="100%"
                      height="100%"
                      // modelColor="#cccccc" // light gray for better contrast
                      style={{ backgroundColor: "#000000" }}
                      orbitControls
                      shadows
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      No STL file selected
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold">
              Impression Handling
            </CardTitle>
            <CardDescription className="text-xs sm:text-base">
              Select how you want to handle impressions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div>
              <Label>Handling Type</Label>
              <RadioGroup
                value={formData.orderType}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    orderType: value,
                  })
                }
                className="mt-2"
              >
                <div className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value="pickup-from-lab"
                      id="pickup-from-lab"
                    />
                    <Label htmlFor="pickup-from-lab">Pickup from Clinic</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value="send-by-courier"
                      id="send-by-courier"
                    />
                    <Label htmlFor="send-by-courier">Send by Courier</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            {formData.orderType === "pickup-from-lab" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="pickupDate">Pickup Date</Label>
                  <Input
                    id="pickupDate"
                    type="date"
                    value={formData.pickupDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pickupDate: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="pickupTime">Pickup Time</Label>
                  <Input
                    id="pickupTime"
                    type="time"
                    value={formData.pickupTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pickupTime: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="pickupRemarks">Pickup Remarks</Label>
                  <Textarea
                    id="pickupRemarks"
                    value={formData.pickupRemarks}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pickupRemarks: e.target.value,
                      })
                    }
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            )}
            {formData.orderType === "send-by-courier" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="courierName">Courier Name</Label>
                  <Input
                    id="courierName"
                    type="text"
                    placeholder="Search courier name..."
                    value={formData.scanBooking?.courierName || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scanBooking: {
                          ...formData.scanBooking,
                          courierName: e.target.value,
                        },
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="trackingId">Tracking ID</Label>
                  <Input
                    id="trackingId"
                    type="text"
                    placeholder="Enter tracking ID..."
                    value={formData.scanBooking?.trackingId || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scanBooking: {
                          ...formData.scanBooking,
                          trackingId: e.target.value,
                        },
                      })
                    }
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
  // Step 7: Final Details & Accessories
  if (currentStep === 7) {
    const summaryGroups = buildSummaryGroups(
      formData.toothGroups || [],
      formData.selectedTeeth || []
    );
    return (
      <div className="space-y-4 sm:space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold">
              Additional Notes
            </CardTitle>
            <CardDescription className="text-xs sm:text-base">
              Add any special instructions or notes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="additionalNotes">
                Special Instructions or Notes
              </Label>
              <Textarea
                id="additionalNotes"
                value={formData.notes || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    notes: e.target.value,
                  })
                }
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
            <CardTitle className="text-lg sm:text-xl font-semibold">
              Complete Order Summary
            </CardTitle>
            <CardDescription className="text-xs sm:text-base">
              Review all your order details before submission
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            {/* Patient Information Summary */}
            <div className="border-b pb-4">
              <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-blue-600">
                Patient Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label className="font-medium text-xs sm:text-sm">
                    Name:
                  </Label>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {formData.firstName} {formData.lastName}
                  </p>
                </div>
                <div>
                  <Label className="font-medium text-xs sm:text-sm">Age:</Label>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {formData.age ? formData.age : "Not specified"}
                  </p>
                </div>
                <div>
                  <Label className="font-medium text-xs sm:text-sm">Sex:</Label>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {formData.sex || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* Case Information Summary */}
            <div className="border-b pb-4">
              <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-green-600">
                Case Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label className="font-medium text-xs sm:text-sm">
                    Case Handled By:
                  </Label>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {formData.caseHandledBy || "Not specified"}
                  </p>
                </div>
                <div>
                  <Label className="font-medium text-xs sm:text-sm">
                    Consulting Doctor:
                  </Label>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {formData.consultingDoctor || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* Restoration Details Summary */}
            <div className="border-b pb-4">
              <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-purple-600">
                Restoration Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label className="font-medium text-xs sm:text-sm">
                    Prescription Type:
                  </Label>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {formData.prescriptionType === "crown-bridge"
                      ? "Crown and Bridge"
                      : formData.prescriptionType === "implant"
                        ? "Implant"
                        : "Not specified"}
                  </p>
                </div>
                <div>
                  <Label className="font-medium text-xs sm:text-sm">
                    Order Method:
                  </Label>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {formData.orderMethod === "digital"
                      ? "Digital"
                      : formData.orderMethod === "manual"
                        ? "Manual"
                        : "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* Teeth and Products Summary */}
            <div className="border-b pb-4">
              <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-orange-600">
                Teeth and Products
              </h4>
              <div>
                <Label className="font-medium text-xs sm:text-sm">
                  Selected Teeth Groups:
                </Label>
                <p className="text-xs sm:text-sm text-gray-600">
                  {summaryGroups && summaryGroups.length > 0
                    ? `${summaryGroups.length} group(s) configured`
                    : "No teeth groups selected"}
                </p>
              </div>
              <div className="mt-2">
                <Label className="font-medium text-xs sm:text-sm">
                  Restoration Products:
                </Label>
                <p className="text-xs sm:text-sm text-gray-600">
                  {formData.restoration_products &&
                    formData.restoration_products.length > 0
                    ? `${formData.restoration_products.length} product(s) selected`
                    : "No products selected"}
                </p>
              </div>
              <div className="mt-4">
                <SelectedTeethViewer
                  selectedTeeth={formData.selectedTeeth || []}
                  toothGroups={summaryGroups}
                />
              </div>
            </div>

            {/* Files and Accessories Summary */}
            <div className="border-b pb-4">
              <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-red-600">
                Files and Accessories
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label className="font-medium text-xs sm:text-sm">
                    Uploaded Files:
                  </Label>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {formData.files && formData.files.length > 0
                      ? `${formData.files.length} file(s) uploaded`
                      : "No files uploaded"}
                  </p>
                </div>
                <div>
                  <Label className="font-medium text-xs sm:text-sm">
                    Accessories:
                  </Label>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {formData.accessories && formData.accessories.length > 0
                      ? `${formData.accessories.length} accessory(ies) selected`
                      : "No accessories selected"}
                  </p>
                </div>
              </div>
            </div>

            {/* Pickup/Scan Information Summary */}
            {(formData.pickupDate ||
              formData.pickupTime ||
              formData.scanBooking) && (
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-indigo-600">
                    Pickup/Scan Information
                  </h4>
                  {formData.orderType === "pickup-from-lab" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label className="font-medium text-xs sm:text-sm">
                          Pickup Date:
                        </Label>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {formData.pickupDate || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <Label className="font-medium text-xs sm:text-sm">
                          Pickup Time:
                        </Label>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {formData.pickupTime || "Not specified"}
                        </p>
                      </div>
                      {formData.pickupRemarks && (
                        <div className="col-span-1 sm:col-span-2">
                          <Label className="font-medium text-xs sm:text-sm">
                            Pickup Remarks:
                          </Label>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {formData.pickupRemarks}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  {formData.orderType === "send-by-courier" &&
                    formData.scanBooking && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <Label className="font-medium text-xs sm:text-sm">
                            Courier Name:
                          </Label>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {formData.scanBooking.courierName || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <Label className="font-medium text-xs sm:text-sm">
                            Tracking ID:
                          </Label>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {formData.scanBooking.trackingId || "Not specified"}
                          </p>
                        </div>
                      </div>
                    )}
                </div>
              )}

            {/* Notes Summary */}
            {formData.notes && (
              <div>
                <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-gray-600">
                  Additional Notes
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {formData.notes}
                </p>
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
