import { OrderData } from './OrderData';

// Form data interface that matches OrderData but with optional fields for in-progress forms
export interface OrderFormData {
  // Core identifiers (optional for new forms)
  referenceId?: string;
  
  // Status and timestamps (handled automatically)
  status?: OrderData['status'];
  createdAt?: string;
  updatedAt?: string;
  
  // Patient information (optional for form building)
  patient?: {
    firstName?: string;
    lastName?: string;
    age?: number;
    sex?: 'male' | 'female' | 'other';
  };

  // Doctor information (optional for form building)
  doctor?: {
    name?: string;
    phone?: string;
    email?: string;
    clinicName?: string;
    clinicAddress?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };

  // Order details (optional for progressive form filling)
  category?: string;
  restorationType?: string;
  productSelection?: string;
  notes?: string;
  prescriptionType?: string;
  subcategoryType?: string;

  // Tooth groups and accessories (optional arrays)
  toothGroups?: any[];
  accessories?: string[];
  otherAccessory?: string;
  returnAccessories?: boolean;

  // Pickup details (optional scheduling)
  pickupDate?: string;
  pickupTime?: string;
  pickupRemarks?: string;

  // Scan booking (optional service)
  scanBooking?: {
    areaManagerId?: string;
    scanDate?: string;
    scanTime?: string;
    notes?: string;
  };

  // Order type and related fields
  orderType?: 'new' | 'repeat' | 'repair';
  previousOrderId?: string;
  repairType?: string;
  issueDescription?: string;
  returnWithTrial?: boolean;

  // Files (optional uploads)
  files?: Array<{
    fileName: string;
    fileType: string;
    url: string;
  }>;

  // Context fields for logged-in users
  clinicId?: string;
  consultingDoctorMobile?: string;
}

// Helper to convert OrderFormData to OrderData for submission
export const convertToOrderData = (formData: OrderFormData): Partial<OrderData> => {
  return {
    referenceId: formData.referenceId || '',
    status: formData.status || 'pending_approval',
    createdAt: formData.createdAt || new Date().toISOString(),
    updatedAt: formData.updatedAt || new Date().toISOString(),
    patient: {
      firstName: formData.patient?.firstName || '',
      lastName: formData.patient?.lastName || '',
      age: formData.patient?.age || 0,
      sex: formData.patient?.sex || 'male'
    },
    doctor: {
      name: formData.doctor?.name || '',
      phone: formData.doctor?.phone || '',
      email: formData.doctor?.email || '',
      clinicName: formData.doctor?.clinicName || '',
      clinicAddress: formData.doctor?.clinicAddress || '',
      city: formData.doctor?.city || '',
      state: formData.doctor?.state || '',
      pincode: formData.doctor?.pincode || ''
    },
    category: formData.category || '',
    restorationType: formData.restorationType || '',
    productSelection: formData.productSelection || '',
    notes: formData.notes,
    prescriptionType: formData.prescriptionType,
    subcategoryType: formData.subcategoryType,
    toothGroups: formData.toothGroups || [],
    accessories: formData.accessories || [],
    otherAccessory: formData.otherAccessory,
    returnAccessories: formData.returnAccessories || false,
    pickupDate: formData.pickupDate,
    pickupTime: formData.pickupTime,
    pickupRemarks: formData.pickupRemarks,
    scanBooking: formData.scanBooking ? {
      areaManagerId: formData.scanBooking.areaManagerId || '',
      scanDate: formData.scanBooking.scanDate || '',
      scanTime: formData.scanBooking.scanTime || '',
      notes: formData.scanBooking.notes
    } : undefined,
    orderType: formData.orderType || 'new',
    previousOrderId: formData.previousOrderId,
    repairType: formData.repairType,
    issueDescription: formData.issueDescription,
    returnWithTrial: formData.returnWithTrial || false,
    files: formData.files || [],
    consultingDoctorMobile: formData.consultingDoctorMobile,
    clinicId: formData.clinicId,
  };
};

// Default empty form data
export const getDefaultOrderFormData = (): OrderFormData => ({
  patient: {
    firstName: '',
    lastName: '',
    age: 0,
    sex: 'male'
  },
  doctor: {
    name: '',
    phone: '',
    email: '',
    clinicName: '',
    clinicAddress: '',
    city: '',
    state: '',
    pincode: ''
  },
  category: '',
  restorationType: '',
  productSelection: '',
  toothGroups: [],
  accessories: [],
  returnAccessories: false,
  orderType: 'new',
  files: []
});