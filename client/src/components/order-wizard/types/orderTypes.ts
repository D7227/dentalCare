export type OrderCategory = 'new' | 'repeat' | 'repair' | null;

export interface ToothGroup {
  groupId: string;
  teeth: number[];
  type: 'joint' | 'separate' | 'bridge';
  notes: string;
  material: string;
  shade: string;
  warning?: string;
}

export interface FormData {
  category: OrderCategory;
  type: string;
  caseHandledBy: string;
  doctorMobile: string;
  consultingDoctor: string;
  firstName: string;
  lastName: string;
  age: string;
  sex: string;
  restorationType: string;
  productSelection: string;
  prescriptionType: string;
  orderType: string;
  orderMethod?: string;
  selectedFileType: string;
  toothGroups: ToothGroup[];
  toothNumbers: string[];
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
  };
  previousOrderId: string;
  repairOrderId: string;
  issueDescription: string;
  repairType: string;
  returnWithTrial: boolean;
  teethEditedByUser?: boolean;
}

export interface Step {
  number: number;
  title: string;
  description: string;
}
