export interface OrderData {
  referenceId: string;
  orderId?: string;
  status: 'pending_approval' | 'approved' | 'in_process' | 'completed' | 'delivered' | 'rejected';
  paymentStatus: 'paid' | 'pending_payment' | 'partial';
  createdAt: string;
  updatedAt: string;

  patient: {
    firstName: string;
    lastName: string;
    age: number;
    sex: 'male' | 'female' | 'other';
  };

  doctor: {
    name: string;
    phone: string;
    email: string;
    clinicName: string;
    clinicAddress: string;
    city: string;
    state: string;
    pincode: string;
  };

  category: string;
  restorationType: string;
  productSelection: string;
  notes?: string;

  toothGroups: any[]; // Replace with ToothGroup[] later
  accessories: string[];
  otherAccessory?: string;
  returnAccessories: boolean;

  pickupDate?: string;
  pickupTime?: string;
  pickupRemarks?: string;

  scanBooking?: {
    areaManagerId: string;
    scanDate: string;
    scanTime: string;
    notes?: string;
  };

  orderType: 'new' | 'repeat' | 'repair';
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