// Function to create comprehensive order object
export const createOrderObject = (formData: any, clinicId: string) => {
  // Handle subcategory-specific conditions
  const getOrderTypeBasedOnSubcategory = () => {
    if (formData.subcategoryType) {
      switch (formData.subcategoryType) {
        case "full-dentures":
        case "partial-dentures":
          return "dentures";
        case "implant-crown":
        case "implant-bridge":
        case "all-on-4":
        case "all-on-6":
          return "implant";
        case "night-guard":
        case "sports-guard":
        case "tmj-splint":
          return "splints-guards";
        case "invisalign":
        case "retainers":
        case "expanders":
          return "ortho";
        default:
          return formData.prescriptionType || "crown-bridge";
      }
    }
    return formData.prescriptionType || "crown-bridge";
  };

  return {
    // Order basic info
    referenceId: `REF-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 4)
      .toUpperCase()}`,
    type: getOrderTypeBasedOnSubcategory(),
    category: formData.category || "new",
    status: "pending",
    priority: "standard",
    urgency: "standard",
    paymentStatus: "pending",
    clinicId: clinicId,

    // Patient Information
    patientFirstName: formData.firstName || "",
    patientLastName: formData.lastName || "",
    patientAge: formData.age ? parseInt(formData.age, 10) : null,
    patientSex: formData.sex || "",

    // Case Information
    caseHandledBy: formData.caseHandledBy || "",
    consultingDoctor: formData.consultingDoctor || "",
    consultingDoctorMobile: formData.consultingDoctorMobile || "",

    // Order Details
    prescriptionType: formData.prescriptionType || "",
    subcategoryType: formData.subcategoryType || "",
    orderType: formData.orderType || "",
    orderMethod: formData.orderMethod || "",
    restorationType: formData.restorationType || "",

    // Teeth Configuration - Store as separate fields for database
    toothGroups: formData.toothGroups || [],
    selectedTeeth: formData.selectedTeeth || [],

    // Product Information
    restorationProducts:
      formData.restoration_products || formData.restorationProducts || [],

    // Implant Specific Fields
    abutmentType: formData.abutmentType || "",
    implantPhoto: formData.implantPhoto || "",
    implantCompany: formData.implantCompany || "",
    implantRemark: formData.implantRemark || "",

    // Design Specifications
    pontic: formData.pontic || "Ridge Lap",
    ponticDesign: formData.ponticDesign || "",
    occlusalStaining: formData.occlusalStaining || "",
    trial: formData.trial || "",
    expectedDeliveryDate: formData.expectedDeliveryDate || "",

    // Shade Information
    shade: formData.shade || [],
    shadeGuide: formData.shadeGuide || [],
    shadeNotes: formData.shadeNotes || "",
    shadeInstruction: formData.shadeInstruction || "",

    // Files and Documentation
    files: formData.files || [],
    intraOralScans: formData.intraOralScans || [],
    faceScans: formData.faceScans || [],
    patientPhotos: formData.patientPhotos || [],
    referralFiles: formData.referralFiles || [],
    selectedFileType: formData.selectedFileType || "",

    // Additional Specifications
    clearance: formData.clearance || "",
    selectedCompany: formData.selectedCompany || "",

    // Accessories and Additional Items
    accessories: formData.accessories || [],
    otherAccessory: formData.otherAccessory || "",
    handlingType: formData.handlingType || "",

    // Pickup/Delivery Information
    pickupDate: formData.pickupDate || "",
    pickupTime: formData.pickupTime || "",
    pickupRemarks: formData.pickupRemarks || "",

    // Scan Booking Information
    scanBooking: formData.scanBooking || {},

    // Repair/Issue Information
    issueDescription: formData.issueDescription || "",
    issueCategory: formData.issueCategory || "",
    repairType: formData.repairType || "",
    trialApproval: formData.trialApproval || false,
    reapirInstructions: formData.reapirInstructions || "",
    returnWithTrial: formData.returnWithTrial || false,

    // Order References
    previousOrderId: formData.previousOrderId || "",
    repairOrderId: formData.repairOrderId || "",

    // Notes and Instructions
    notes: formData.notes || "",
    additionalNotes: formData.additionalNotes || "",

    // Technical Specifications
    teethEditedByUser: formData.teethEditedByUser || false,

    // Timestamps
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
