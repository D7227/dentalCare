export type OrderCategoryType = "new" | "repeat" | "repair" | null;

export type OrderMethodType = "digital" | "manual";

export type PrescriptionType =
  | "fixed-restoration"
  | "implant"
  | "splints-guards"
  | "ortho"
  | "dentures"
  | "sleep-accessories"
  | "";

export interface ShadeGuide {
  type: "anterior" | "posterior";
  shades: string[];
}

export interface Product {
  id: string;
  name: string;
  category: PrescriptionType;
  material: string;
  description: string;
  quantity: number;
}

export interface SelectedTooth {
  type: "abutment" | "pontic";
  toothNumber: number;
  prescriptionType: "implant" | "crown-bridge";
  subcategoryType: string;
  productName: string[];
  shadeDetails: string;
  occlusalStaining: string;
  shadeGuide: ShadeGuide | null;
  shadeNotes: string;
  trialRequirements: string;
  implantDetails?: {
    companyName: string;
    systemName: string;
    remarks: string;
    photo?: File;
  };
  selectedProducts: Product[];
}

export interface ToothDetail {
  teethNumber: number;
  type: "abutment" | "pontic";
  productName: string[];
  productQuantity: number;
  shadeDetails?: string;
  occlusalStaining?: string;
  shadeGuide?: ShadeGuide | null;
  shadeNotes?: string;
  trialRequirements?: string;
  implantDetails?: {
    companyName: string;
    systemName: string;
    remarks: string;
    photo?: File;
  };
}

export interface ToothGroup {
  groupType: "bridge" | "joint" | "separate" | "individual";
  prescriptionType: PrescriptionType;
  subcategoryType: string;
  shadeDetails: string;
  occlusalStaining: string;
  shadeGuide: ShadeGuide | null;
  shadeNotes: string;
  trialRequirements: string;
  selectedProducts: Product[];
  teethDetails: ToothDetail[][];
}

// Legacy interface for backward compatibility
export interface LegacyToothGroup {
  groupId: string;
  teeth: number[];
  type: "separate" | "joint" | "bridge";
  productType: "implant" | "crown-bridge";
  notes: string;
  material: string;
  shade: string;
  pontics?: number[];
  warning?: string;
  occlusalStaining?: string;
  ponticDesign?: string;
  trial?: string;
  selectedTrials?: string[];
  products?: Array<{
    id: string;
    name: string;
    category: string;
    material: string;
    description: string;
    quantity: number;
  }>;
}

export interface Message {
  label: string;
  messageBy: string;
}

export interface FormData {
  // --- Core order fields ---
  id: string;
  orderId: string;
  refId: string;
  category: OrderCategoryType;
  type: OrderCategoryType;
  firstName: string;
  lastName: string;
  age: string;
  sex: string;
  caseHandleBy: string;
  doctorMobile: string;
  consultingDoctor: string;
  consultingDoctorMobile: string;
  orderMethod: OrderMethodType;
  prescriptionType: PrescriptionType;
  subcategoryType: string;
  restorationType: string | null;
  productSelection: string | null;
  orderType: string;
  selectedFileType: string | null;
  selectedTeeth: SelectedTooth[];
  toothGroups: ToothGroup[];
  toothNumbers: string[] | null;
  abutmentDetails?: {
    abutmentType: string;
    quantity: number;
    cementType?: string;
    product: {
      name: string;
      provider: string;
    }[];
  } | null;
  clinicId: string;
  abutmentType: string;
  restorationProducts: any[];
  ponticDesign: string | null;
  occlusalStaining: string;
  shadeInstruction: string | null;
  clearance: string | null;
  accessories: string[] | null;
  otherAccessory: string | null;
  returnAccessories: boolean | undefined;
  notes: string | null;
  files: File[] | null;
  expectedDeliveryDate: string | null;
  pickupDate: string | null;
  pickupTime: string | null;
  pickupRemarks: string | null;
  scanBooking: {
    areaManagerId: string;
    scanDate: string;
    scanTime: string;
    notes: string;
    trackingId: string;
    courierName: string;
  };
  previousOrderId: string | null;
  repairOrderId: string | null;
  issueDescription: string | null;
  repairType: string | null;
  returnWithTrial: boolean;
  teethEditedByUser?: boolean;
  intraOralScans: any[];
  faceScans: any[];
  patientPhotos: any[];
  referralFiles: any[];
  
  // --- Order display fields (for OrderCard) ---
  percentage: number;
  isUrgent: boolean;
  currency: string;
  exportQuality: string;
  paymentStatus: string;
  orderStatus: string | null;
  totalAmount:string | null;
}

export interface Step {
  number: number;
  title: string;
  description: string;
}
