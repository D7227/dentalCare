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

export interface FormData {
  orderId:string;
  refId:string;
  category: OrderCategoryType;
  type: OrderCategoryType;
  firstName: string; // Patient
  lastName: string; // Patient
  age: string; // Patient
  sex: string; // Patient
  caseHandledBy: string; // Doctor
  doctorMobile: string; // Doctor
  consultingDoctor: string; // Doctor
  consultingDoctorMobile: string; // Doctor
  orderMethod: OrderMethodType; // digital | manual
  prescriptionType: PrescriptionType; // fixed-restoration | implant | splints-guards | ortho | dentures | sleep-accessories
  subcategoryType: string; // based on the prescriptionType
  restorationType: string;
  productSelection: string;
  orderType: string;
  selectedFileType: string;
  selectedTeeth: SelectedTooth[];
  toothGroups: ToothGroup[];
  toothNumbers: string[];
  abutmentDetails?: {
    abutmentType: string;
    quantity: number;
    cementType?: string;
    product: {
      name: string;
      provider: string;
    }[];
  };
  clinicId: string;
  abutmentType: string;
  restorationProducts: any[];
  ponticDesign: string;
  occlusalStaining: string;
  shadeInstruction: string;
  clearance: string;
  accessories: string[];
  otherAccessory: string;
  returnAccessories: boolean | undefined;
  notes: string;
  files: File[];
  expectedDeliveryDate: string;
  pickupDate: string;
  pickupTime: string;
  pickupRemarks: string;
  scanBooking: {
    areaManagerId: string;
    scanDate: string;
    scanTime: string;
    notes: string;
    trackingId: string;
    courierName: string;
  };
  previousOrderId: string;
  repairOrderId: string;
  issueDescription: string;
  repairType: string;
  returnWithTrial: boolean;
  teethEditedByUser?: boolean;
  intraOralScans: any; // TODO:Update the Type
  faceScans: any;
  patientPhotos: any;
  referralFiles: any;
}

export interface Step {
  number: number;
  title: string;
  description: string;
}
