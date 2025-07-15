import { OrderType } from "@/types/orderType";

// Define a local type for the form data that includes all fields used below
export type OrderFormData = OrderType & {
  subcategoryType?: string;
  prescriptionType?: string;
  intraOralScan?: File[];
  faceScan?: File[];
  addPatientPhotos?: File[];
  referralImages?: File[];
  pickupDate?: string;
  pickupTime?: string;
  pickupRemarks?: string;
  scanBooking?: {
    areaManagerId: string;
    scanDate: string;
    scanTime: string;
    notes: string;
    trackingId: string;
    courierName: string;
  };
  issueDescription?: string;
  issueCategory?: string;
  repairType?: string;
  trialApproval?: boolean;
  reapirInstructions?: string;
  returnWithTrial?: boolean;
  previousOrderId?: string;
  repairOrderId?: string;
  notes?: string;
  additionalNotes?: string;
  teethEditedByUser?: boolean;
  percentage?: number;
  isUrgent?: boolean;
  currency?: string;
  exportQuality?: string;
  totalAmount?: string;
};

// Function to create comprehensive order object
export const createOrderObject = (formData: OrderFormData, clinicId: string) => {
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
    refId: formData.refId || `REF-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 4)
      .toUpperCase()}`,
    orderId: formData.orderId || "",
    type: getOrderTypeBasedOnSubcategory(),
    orderType: formData.orderType || "new",
    orderStatus: formData.orderStatus || "pending",
    paymentType: formData.paymentType || "pending",
    clinicId: formData.clinicId || "",

    // Patient Information
    firstName: formData.firstName || "",
    lastName: formData.lastName || "",
    age: formData.age,
    sex: formData.sex || "",

    // Case Information
    caseHandleBy: formData.caseHandleBy || "",
    doctorMobileNumber: formData.doctorMobileNumber || "",
    consultingDoctorName: formData.consultingDoctorName || "",
    consultingDoctorMobileNumber: formData.consultingDoctorMobileNumber || "",

    // Order Details
    prescriptionTypesId: formData.prescriptionTypesId || "",
    subPrescriptionTypesId: formData.subPrescriptionTypesId || "",
    orderMethod: formData.orderMethod || "",

    // Teeth Configuration - Store as separate fields for database
    teethGroup: formData.teethGroup || [],
    selectedTeeth: formData.selectedTeeth || [],
    teethNumber: formData.teethNumber || [],

    // Files and Documentation
    files: {
      intraOralScan: formData.intraOralScan || [],
      faceScan: formData.faceScan || [],
      addPatientPhotos: formData.addPatientPhotos || [],
      referralImages: formData.referralImages || [],
    },

    // Accessories and Additional Items
    accessorios: formData.accessorios || [],
    handllingType: formData.handllingType || "",

    // Pickup/Delivery Information
    pickupDate: formData.pickupDate || "",
    pickupTime: formData.pickupTime || "",
    pickupRemarks: formData.pickupRemarks || "",

    // Scan Booking Information
    scanBooking: formData.scanBooking || {
      areaManagerId: '',
      scanDate: '',
      scanTime: '',
      notes: '',
      trackingId: '',
      courierName: ''
    },

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

    // Order display fields
    percentage: formData.percentage || 10,
    isUrgent: formData.isUrgent || false,
    currency: formData.currency || "INR",
    exportQuality: formData.exportQuality || "Standard",
    totalAmount: formData.totalAmount || "0",

    // Timestamps
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
