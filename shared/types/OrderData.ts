export interface OrderData {
  referenceId: string;
  orderId?: string;
  status:
    | "pending_approval"
    | "approved"
    | "in_process"
    | "completed"
    | "delivered"
    | "rejected";
  paymentStatus: "paid" | "pending_payment" | "partial";
  createdAt: string;
  updatedAt: string;
  patientFirstName: string;
  patientLastName: string;
  patientAge: number;
  patientSex: string;
  caseHandledBy: string;
  consultingDoctor: string;
  prescriptionType: string;
  orderType: string;
  restorationProducts: any[];
  category: string;
  restorationType: string;
  productSelection: string;
  notes?: string;

  toothGroups: any[];
  accessories: string[];
  otherAccessory?: string;
  returnAccessories: boolean;

  pickupDate?: string;
  pickupTime?: string;
  pickupRemarks?: string;

  // scanBooking?: {
  //   areaManagerId: string;
  //   scanDate: string;
  //   scanTime: string;
  //   notes?: string;
  // };

  orderType: "new" | "repeat" | "repair";
  previousOrderId?: string;
  repairType?: string;
  issueDescription?: string;
  returnWithTrial?: boolean;

  files: {
    fileName: string;
    fileType: string;
    url: string;
  }[];
}
