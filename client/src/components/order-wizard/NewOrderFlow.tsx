import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";
import ToothSelector from "./ToothSelector";
import ProductSelection from "./ProductSelection";
import PatientInfoCard from "./components/PatientInfoCard";
import CaseInfoCard from "./components/CaseInfoCard";
import AccessorySelection from "./components/AccessorySelection";
import OrderTypeSection from "./components/OrderTypeSection";
import { SelectPrescriptionSection } from "./components/SelectPrescriptionSection";
import { FormData } from "./types/orderTypes";
import UploadFileSection from "./components/UploadFileSection";
import { useLocation } from "react-router-dom";

interface NewOrderFlowProps {
  currentStep: number;
  formData: FormData;
  setFormData: (data: any) => void;
  onAddMoreProducts?: () => void;
  onSaveOrder?: (orderData: any) => void;
  setCurrentStep?: any;
}

// Helper to build deduplicated, prioritized group list for summary
function buildSummaryGroups(teethGroup: any[], selectedTeeth: any[]) {
  // Priority: bridge > joint > individual
  const usedTeeth = new Set<number>();
  const summaryGroups: any[] = [];
  // Add bridge groups first
  teethGroup
    .filter((g) => g.type === "bridge")
    .forEach((group) => {
      const teeth = group.teeth.filter((t: number) => !usedTeeth.has(t));
      if (teeth.length > 0) {
        summaryGroups.push({ ...group, teeth });
        teeth.forEach((t: number) => usedTeeth.add(t));
      }
    });
  // Then joint groups
  teethGroup
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

// function CameraCapture({ onPhoto }: { onPhoto: (file: File) => void }) {
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [imgSrc, setImgSrc] = useState<string | null>(null);
//   const [cameraError, setCameraError] = useState<string | null>(null);
//   const webcamRef = useRef<Webcam>(null);

//   // Detect if device is mobile
//   const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

//   // Use environment camera for mobile, user camera for desktop
//   const videoConstraints = isMobile
//     ? { facingMode: { ideal: "environment" } }
//     : { facingMode: "user" };

//   const handleDivClick = () => {
//     if (isMobile) {
//       fileInputRef.current?.click();
//     } else {
//       setShowModal(true);
//       setCameraError(null);
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file && onPhoto) {
//       onPhoto(file);
//     }
//   };

//   const capture = () => {
//     const imageSrc = webcamRef.current?.getScreenshot();
//     setImgSrc(imageSrc || null);
//   };

//   const handleConfirm = () => {
//     if (imgSrc) {
//       fetch(imgSrc)
//         .then((res) => res.arrayBuffer())
//         .then((buf) => {
//           const file = new File([buf], "captured-photo.png", {
//             type: "image/png",
//           });
//           onPhoto(file);
//           setShowModal(false);
//           setImgSrc(null);
//         });
//     }
//   };

//   const handleRetake = () => {
//     setImgSrc(null);
//   };

//   const handleClose = () => {
//     setShowModal(false);
//     setImgSrc(null);
//     setCameraError(null);
//   };

//   return (
//     <>
//       <div
//         className="border-2 border-dashed border-teal-400 rounded-xl flex flex-col items-center justify-center py-12 cursor-pointer hover:bg-teal-50 transition"
//         onClick={handleDivClick}
//       >
//         <Camera size={64} className="text-gray-400 mb-4" />
//         <span className="text-base font-semibold text-teal-600 underline">
//           Take Your Photo
//         </span>
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept="image/*"
//           capture="environment"
//           className="hidden"
//           onChange={handleFileChange}
//         />
//       </div>
//       {/* Modal for webcam capture */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
//           <div className="bg-white rounded-lg p-4 sm:p-6 flex flex-col items-center w-full max-w-xs sm:max-w-md mx-2 my-8">
//             {cameraError ? (
//               <>
//                 <div className="text-red-600 font-semibold mb-4 text-center text-sm sm:text-base">
//                   {cameraError}
//                 </div>
//                 <button
//                   type="button"
//                   className="bg-gray-300 text-gray-800 px-4 py-2 rounded font-semibold w-full"
//                   onClick={handleClose}
//                 >
//                   Close
//                 </button>
//               </>
//             ) : !imgSrc ? (
//               <>
//                 <Webcam
//                   audio={false}
//                   ref={webcamRef}
//                   screenshotFormat="image/png"
//                   videoConstraints={videoConstraints}
//                   className="rounded-lg mb-4 w-full max-w-xs h-48 sm:w-80 sm:h-60 object-cover"
//                   onUserMediaError={(err) => {
//                     setCameraError("Attach Camera");
//                   }}
//                 />
//                 <button
//                   type="button"
//                   className="bg-teal-600 text-white px-4 py-2 rounded font-semibold mb-2 w-full"
//                   onClick={capture}
//                 >
//                   Capture
//                 </button>
//                 <button
//                   type="button"
//                   className="text-gray-500 underline text-sm w-full"
//                   onClick={handleClose}
//                 >
//                   Cancel
//                 </button>
//               </>
//             ) : (
//               <>
//                 <img
//                   src={imgSrc}
//                   alt="Captured"
//                   className="rounded-lg mb-4 w-full max-w-xs h-48 sm:w-80 sm:h-60 object-cover"
//                 />
//                 <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
//                   <button
//                     type="button"
//                     className="bg-teal-600 text-white px-4 py-2 rounded font-semibold w-full"
//                     onClick={handleConfirm}
//                   >
//                     Confirm
//                   </button>
//                   <button
//                     type="button"
//                     className="bg-gray-300 text-gray-800 px-4 py-2 rounded font-semibold w-full"
//                     onClick={handleRetake}
//                   >
//                     Retake
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

const NewOrderFlow = ({
  currentStep: propCurrentStep,
  formData: propFormData,
  setFormData,
  onAddMoreProducts,
  onSaveOrder,
  setCurrentStep,
}: NewOrderFlowProps) => {
  const location = useLocation();
  const { draftOrder, step } = location.state || {};
  const [initialized, setInitialized] = useState(false);

  // Defensive defaulting for arrays in propFormData
  const safeFormData = {
    ...propFormData,
    intraOralScans: propFormData?.intraOralScans || [],
    faceScans: propFormData?.faceScans || [],
    patientPhotos: propFormData?.patientPhotos || [],
    referralFiles: propFormData?.referralFiles || [],
    toothGroups: propFormData?.teethGroup || [],
    selectedTeeth: propFormData?.selectedTeeth || [],
  };

  useEffect(() => {
    if (!initialized && draftOrder && step) {
      setFormData(draftOrder);
      if (setCurrentStep) setCurrentStep(step);
      setInitialized(true);
    }
  }, [draftOrder, step, setFormData, setCurrentStep, initialized]);

  // Step 1: Patient & Case Information
  if (propCurrentStep === 1) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <PatientInfoCard formData={safeFormData} setFormData={setFormData} />
          <CaseInfoCard formData={safeFormData} setFormData={setFormData} />
        </div>

        {/* Order Method */}
        {(safeFormData?.teethGroup?.length === 0 ||
          !safeFormData?.teethGroup) &&
          (!safeFormData?.selectedTeeth ||
            safeFormData?.selectedTeeth.length === 0) && (
            <OrderTypeSection
              formData={safeFormData}
              setFormData={setFormData}
            />
          )}
      </div>
    );
  }

  // Step 2: Restoration Type Selection
  if (propCurrentStep === 2) {
    return (
      <SelectPrescriptionSection
        formData={safeFormData}
        setFormData={setFormData}
        mode="prescription"
        onNextStep={() => {
          setCurrentStep(propCurrentStep + 1);
        }}
      />
    );
  }

  // Step 3: Subcategory Selection
  if (propCurrentStep === 3) {
    return (
      <SelectPrescriptionSection
        formData={safeFormData}
        setFormData={setFormData}
        mode="subcategory"
        onNextStep={() => {
          setCurrentStep(propCurrentStep + 1);
        }}
      />
    );
  }

  // Step 4: Teeth Selection
  if (propCurrentStep === 4) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <Card className="border-none p-0 bg-transparent">
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
              prescriptionType={safeFormData?.prescriptionType}
              selectedGroups={safeFormData?.teethGroup || []}
              selectedTeeth={safeFormData?.selectedTeeth || []}
              onSelectionChange={(groups, teeth) =>
                setFormData({
                  ...safeFormData,
                  teethGroup: groups,
                  selectedTeeth: teeth,
                })
              }
              subPrescriptionTypes={safeFormData?.subPrescriptionTypes}
              formData={safeFormData}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 5: Product Selection & Details
  if (propCurrentStep === 5) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <Card className="border-none p-0 bg-transparent">
          <div className="p-0 mt-4">
            <ProductSelection
              formData={safeFormData}
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
  if (propCurrentStep === 6) {
    const summaryGroups = buildSummaryGroups(
      safeFormData.toothGroups || [],
      safeFormData.selectedTeeth || []
    );
    return (
      <div className="space-y-4 sm:space-y-6">
        <UploadFileSection formData={safeFormData} setFormData={setFormData} />
        <AccessorySelection formData={safeFormData} setFormData={setFormData} />
      </div>
    );
  }
  // // Step 7: Final Details & Accessories
  // if (currentStep === 7) {
  //   const summaryGroups = buildSummaryGroups(
  //     formData.teethGroups || [],
  //     formData.selectedTeeth || []
  //   );
  //   return (
  //     <div className="space-y-4 sm:space-y-6">
  //       <Card>
  //         <CardHeader>
  //           <CardTitle className="text-lg sm:text-xl font-semibold">
  //             Additional Notes
  //           </CardTitle>
  //           <CardDescription className="text-xs sm:text-base">
  //             Add any special instructions or notes
  //           </CardDescription>
  //         </CardHeader>
  //         <CardContent>
  //           <div>
  //             <Label htmlFor="additionalNotes">
  //               Special Instructions or Notes
  //             </Label>
  //             <Textarea
  //               id="additionalNotes"
  //               value={formData.notes || ""}
  //               onChange={(e) =>
  //                 setFormData({
  //                   ...formData,
  //                   notes: e.target.value,
  //                 })
  //               }
  //               placeholder="Any special instructions, preferences, or additional information..."
  //               className="mt-1"
  //               rows={4}
  //             />
  //           </div>
  //         </CardContent>
  //       </Card>

  //       <AccessoryTagging formData={formData} setFormData={setFormData} />

  //       {/* Comprehensive Order Summary */}
  //       <Card>
  //         <CardHeader>
  //           <CardTitle className="text-lg sm:text-xl font-semibold">
  //             Complete Order Summary
  //           </CardTitle>
  //           <CardDescription className="text-xs sm:text-base">
  //             Review all your order details before submission
  //           </CardDescription>
  //         </CardHeader>
  //         <CardContent className="space-y-4 sm:space-y-6">
  //           {/* Patient Information Summary */}
  //           <div className="border-b pb-4">
  //             <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-blue-600">
  //               Patient Information
  //             </h4>
  //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
  //               <div>
  //                 <Label className="font-medium text-xs sm:text-sm">
  //                   Name:
  //                 </Label>
  //                 <p className="text-xs sm:text-sm text-gray-600">
  //                   {formData.firstName} {formData.lastName}
  //                 </p>
  //               </div>
  //               <div>
  //                 <Label className="font-medium text-xs sm:text-sm">Age:</Label>
  //                 <p className="text-xs sm:text-sm text-gray-600">
  //                   {formData.age ? formData.age : "Not specified"}
  //                 </p>
  //               </div>
  //               <div>
  //                 <Label className="font-medium text-xs sm:text-sm">Sex:</Label>
  //                 <p className="text-xs sm:text-sm text-gray-600">
  //                   {formData.sex || "Not specified"}
  //                 </p>
  //               </div>
  //             </div>
  //           </div>

  //           {/* Case Information Summary */}
  //           <div className="border-b pb-4">
  //             <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-green-600">
  //               Case Information
  //             </h4>
  //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
  //               <div>
  //                 <Label className="font-medium text-xs sm:text-sm">
  //                   Case Handled By:
  //                 </Label>
  //                 <p className="text-xs sm:text-sm text-gray-600">
  //                   {formData.caseHandleBy || "Not specified"}
  //                 </p>
  //               </div>
  //               <div>
  //                 <Label className="font-medium text-xs sm:text-sm">
  //                   Consulting Doctor:
  //                 </Label>
  //                 <p className="text-xs sm:text-sm text-gray-600">
  //                   {formData.consultingDoctor || "Not specified"}
  //                 </p>
  //               </div>
  //             </div>
  //           </div>

  //           {/* Restoration Details Summary */}
  //           <div className="border-b pb-4">
  //             <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-purple-600">
  //               Restoration Details
  //             </h4>
  //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
  //               <div>
  //                 <Label className="font-medium text-xs sm:text-sm">
  //                   Prescription Type:
  //                 </Label>
  //                 <p className="text-xs sm:text-sm text-gray-600">
  //                   {formData.prescriptionType === "crown-bridge"
  //                     ? "Crown and Bridge"
  //                     : formData.prescriptionType === "implant"
  //                     ? "Implant"
  //                     : "Not specified"}
  //                 </p>
  //               </div>
  //               <div>
  //                 <Label className="font-medium text-xs sm:text-sm">
  //                   Order Method:
  //                 </Label>
  //                 <p className="text-xs sm:text-sm text-gray-600">
  //                   {formData.orderMethod === "digital"
  //                     ? "Digital"
  //                     : formData.orderMethod === "manual"
  //                     ? "Manual"
  //                     : "Not specified"}
  //                 </p>
  //               </div>
  //             </div>
  //           </div>

  //           {/* Teeth and Products Summary */}
  //           <div className="border-b pb-4">
  //             <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-orange-600">
  //               Teeth and Products
  //             </h4>
  //             <div>
  //               <Label className="font-medium text-xs sm:text-sm">
  //                 Selected Teeth Groups:
  //               </Label>
  //               <p className="text-xs sm:text-sm text-gray-600">
  //                 {summaryGroups && summaryGroups.length > 0
  //                   ? `${summaryGroups.length} group(s) configured`
  //                   : "No teeth groups selected"}
  //               </p>
  //             </div>
  //             <div className="mt-2">
  //               <Label className="font-medium text-xs sm:text-sm">
  //                 Restoration Products:
  //               </Label>
  //               <p className="text-xs sm:text-sm text-gray-600">
  //                 {formData.restoration_products &&
  //                 formData.restoration_products.length > 0
  //                   ? `${formData.restoration_products.length} product(s) selected`
  //                   : "No products selected"}
  //               </p>
  //             </div>
  //             <div className="mt-4">
  //               <SelectedTeethViewer
  //                 selectedTeeth={formData.selectedTeeth || []}
  //                 teethGroups={summaryGroups}
  //               />
  //             </div>
  //           </div>

  //           {/* Files and Accessories Summary */}
  //           <div className="border-b pb-4">
  //             <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-red-600">
  //               Files and Accessories
  //             </h4>
  //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
  //               <div>
  //                 <Label className="font-medium text-xs sm:text-sm">
  //                   Uploaded Files:
  //                 </Label>
  //                 <p className="text-xs sm:text-sm text-gray-600">
  //                   {formData.files && formData.files.length > 0
  //                     ? `${formData.files.length} file(s) uploaded`
  //                     : "No files uploaded"}
  //                 </p>
  //               </div>
  //               <div>
  //                 <Label className="font-medium text-xs sm:text-sm">
  //                   Accessories:
  //                 </Label>
  //                 <p className="text-xs sm:text-sm text-gray-600">
  //                   {formData.accessories && formData.accessories.length > 0
  //                     ? `${formData.accessories.length} accessory(ies) selected`
  //                     : "No accessories selected"}
  //                 </p>
  //               </div>
  //             </div>
  //           </div>

  //           {/* Pickup/Scan Information Summary */}
  //           {(formData.pickupDate ||
  //             formData.pickupTime ||
  //             formData.scanBooking) && (
  //             <div className="border-b pb-4">
  //               <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-indigo-600">
  //                 Pickup/Scan Information
  //               </h4>
  //               {formData.orderType === "pickup-from-lab" && (
  //                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
  //                   <div>
  //                     <Label className="font-medium text-xs sm:text-sm">
  //                       Pickup Date:
  //                     </Label>
  //                     <p className="text-xs sm:text-sm text-gray-600">
  //                       {formData.pickupDate || "Not specified"}
  //                     </p>
  //                   </div>
  //                   <div>
  //                     <Label className="font-medium text-xs sm:text-sm">
  //                       Pickup Time:
  //                     </Label>
  //                     <p className="text-xs sm:text-sm text-gray-600">
  //                       {formData.pickupTime || "Not specified"}
  //                     </p>
  //                   </div>
  //                   {formData.pickupRemarks && (
  //                     <div className="col-span-1 sm:col-span-2">
  //                       <Label className="font-medium text-xs sm:text-sm">
  //                         Pickup Remarks:
  //                       </Label>
  //                       <p className="text-xs sm:text-sm text-gray-600">
  //                         {formData.pickupRemarks}
  //                       </p>
  //                     </div>
  //                   )}
  //                 </div>
  //               )}
  //               {formData.orderType === "send-by-courier" &&
  //                 formData.scanBooking && (
  //                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
  //                     <div>
  //                       <Label className="font-medium text-xs sm:text-sm">
  //                         Courier Name:
  //                       </Label>
  //                       <p className="text-xs sm:text-sm text-gray-600">
  //                         {formData.scanBooking.courierName || "Not specified"}
  //                       </p>
  //                     </div>
  //                     <div>
  //                       <Label className="font-medium text-xs sm:text-sm">
  //                         Tracking ID:
  //                       </Label>
  //                       <p className="text-xs sm:text-sm text-gray-600">
  //                         {formData.scanBooking.trackingId || "Not specified"}
  //                       </p>
  //                     </div>
  //                   </div>
  //                 )}
  //             </div>
  //           )}

  //           {/* Notes Summary */}
  //           {formData.notes && (
  //             <div>
  //               <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-gray-600">
  //                 Additional Notes
  //               </h4>
  //               <p className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
  //                 {formData.notes}
  //               </p>
  //             </div>
  //           )}
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // }

  return null;
};

export default NewOrderFlow;
