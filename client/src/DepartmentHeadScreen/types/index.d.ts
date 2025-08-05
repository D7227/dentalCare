
interface CaseLog {
    id: string;
    timestamp: string;
    action: string;
    user: string;
    details: string;
  }
  
  interface DigitalFile {
    id: string;
    name: string;
    type: string;
    size: string;
    uploadedBy: string;
    uploadedAt: string;
    url: string;
  }
  
  interface Product {
    id: string;
    name: string;
    quantity: number;
    cost: number;
    addedBy: string;
    addedAt: string;
  }
  
  interface Accessory {
    id: string;
    name: string;
    quantity: number;
    providedBy: 'lab' | 'doctor';
    notes?: string;
  }
  
  interface CaseAssignment {
    id: string;
    caseId: string;
    caseNumber: string;
    doctorName: string;
    clinicName: string;
    patientName: string;
    caseType: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'in_progress' | 'qa_pending' | 'trial_ready' | 'completed' | 'on_hold';
    assignedDate: string;
    dueDate: string;
    estimatedCompletion: string;
    notes?: string;
    technicianId?: string;
    technicianName?: string;
    logs: CaseLog[];
    digitalFiles: DigitalFile[];
    products: Product[];
    accessories: Accessory[];
  }
  
  interface InwardCase {
    id: string;
    caseNumber: string;
    doctorName: string;
    clinicName: string;
    patientName: string;
    caseType: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    receivedDate: string;
    dueDate: string;
    notes?: string;
    logs: CaseLog[];
    digitalFiles: DigitalFile[];
    products: Product[];
    accessories: Accessory[];
  }
  
  interface WaitingInwardCase {
    id: string;
    caseNumber: string;
    doctorName: string;
    clinicName: string;
    patientName: string;
    caseType: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    expectedDate: string;
    notes?: string;
    logs: CaseLog[];
    digitalFiles: DigitalFile[];
    products: Product[];
    accessories: Accessory[];
  }
  
  interface OutwardCase {
    id: string;
    caseNumber: string;
    doctorName: string;
    clinicName: string;
    patientName: string;
    caseType: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    completedDate: string;
    technicianName: string;
    readyForOutward: boolean;
    logs: CaseLog[];
    digitalFiles: DigitalFile[];
    products: Product[];
    accessories: Accessory[];
  }
  
  interface Technician {
    id: string;
    name: string;
    email: string;
    department: string;
    specialization: string;
    experience: string;
    status: 'available' | 'busy' | 'on_break' | 'offline';
    currentCases: number;
    assignments: CaseAssignment[];
  }
  
  interface Department {
    id: string;
    name: string;
    description: string;
    technicians: Technician[];
    totalCases: number;
    pendingCases: number;
    completedToday: number;
    inwardPending: InwardCase[];
    outwardPending: OutwardCase[];
    waitingInward: WaitingInwardCase[];
  }
  