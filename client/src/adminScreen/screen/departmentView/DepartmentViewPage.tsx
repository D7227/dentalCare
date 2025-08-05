import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import CaseChatModal from '@/components/chat/CaseChatModal';
import { Users, Clock, AlertCircle, CheckCircle, User, MessageSquare, AlertTriangle, ChevronUp, ChevronDown, Minus, ArrowRight, ArrowLeft, UserPlus, Package, Search, Eye, Download, Plus, FileText, Package2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

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

const DepartmentViewPage = () => {
  const { toast } = useToast();
  const [selectedDepartment, setSelectedDepartment] = useState('crown-bridge');
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedCaseForChat, setSelectedCaseForChat] = useState<{ caseId: string; caseType: string } | null>(null);
  const [technicianSearch, setTechnicianSearch] = useState('');
  const [activeTab, setActiveTab] = useState('waiting-inward');
  const [caseSearch, setCaseSearch] = useState('');
  const [selectedCaseDetails, setSelectedCaseDetails] = useState<any>(null);
  const [isCaseDetailsOpen, setIsCaseDetailsOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductQuantity, setNewProductQuantity] = useState(1);
  const [newProductCost, setNewProductCost] = useState(0);
  const [newAccessoryName, setNewAccessoryName] = useState('');
  const [newAccessoryQuantity, setNewAccessoryQuantity] = useState(1);
  const [newAccessoryProvider, setNewAccessoryProvider] = useState<'lab' | 'doctor'>('lab');
  const [newAccessoryNotes, setNewAccessoryNotes] = useState('');

  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 'crown-bridge',
      name: 'Crown & Bridge',
      description: 'Specializing in crowns, bridges, and fixed prosthetics',
      totalCases: 45,
      pendingCases: 12,
      completedToday: 8,
      waitingInward: [
        {
          id: 'WAIT001',
          caseNumber: 'ADE-2025-045',
          doctorName: 'Dr. Amit Sharma',
          clinicName: 'City Dental Hub',
          patientName: 'Priya Reddy',
          caseType: 'Crown',
          priority: 'medium',
          expectedDate: '2025-06-09',
          notes: 'Case ready for inward processing',
          logs: [
            { id: 'L1', timestamp: '2025-06-04 10:00', action: 'Case Received', user: 'Dr. Amit Sharma', details: 'Initial case submission' }
          ],
          digitalFiles: [
            { id: 'F1', name: 'impression.stl', type: 'STL', size: '2.4 MB', uploadedBy: 'Dr. Amit Sharma', uploadedAt: '2025-06-04', url: '#' }
          ],
          products: [],
          accessories: []
        },
        {
          id: 'WAIT002',
          caseNumber: 'ADE-2025-046',
          doctorName: 'Dr. Neha Gupta',
          clinicName: 'Smile Studio',
          patientName: 'Raj Patel',
          caseType: 'Bridge',
          priority: 'high',
          expectedDate: '2025-06-08',
          notes: 'Urgent case - patient traveling',
          logs: [
            { id: 'L2', timestamp: '2025-06-04 11:00', action: 'Case Received', user: 'Dr. Neha Gupta', details: 'Urgent case submission' }
          ],
          digitalFiles: [
            { id: 'F2', name: 'scan.dcm', type: 'DICOM', size: '5.1 MB', uploadedBy: 'Dr. Neha Gupta', uploadedAt: '2025-06-04', url: '#' }
          ],
          products: [],
          accessories: []
        }
      ],
      inwardPending: [
        {
          id: 'IN001',
          caseNumber: 'ADE-2025-040',
          doctorName: 'Dr. Kavita Singh',
          clinicName: 'Elite Dental Care',
          patientName: 'Rohit Kumar',
          caseType: 'Crown',
          priority: 'high',
          receivedDate: '2025-06-04',
          dueDate: '2025-06-10',
          notes: 'Patient requires ceramic crown',
          logs: [
            { id: 'L3', timestamp: '2025-06-04 09:00', action: 'Made Inward', user: 'Admin', details: 'Case processed for assignment' }
          ],
          digitalFiles: [
            { id: 'F3', name: 'xray.jpg', type: 'Image', size: '1.2 MB', uploadedBy: 'Dr. Kavita Singh', uploadedAt: '2025-06-04', url: '#' }
          ],
          products: [],
          accessories: [
            { id: 'A1', name: 'Impression Material', quantity: 1, providedBy: 'doctor', notes: 'High quality silicone' }
          ]
        }
      ],
      outwardPending: [
        {
          id: 'OUT001',
          caseNumber: 'ADE-2025-032',
          doctorName: 'Dr. Rajesh Kumar',
          clinicName: 'Smile Dental',
          patientName: 'Anita Sharma',
          caseType: 'Crown',
          priority: 'medium',
          completedDate: '2025-06-03',
          technicianName: 'Riya Patel',
          readyForOutward: true,
          logs: [
            { id: 'L4', timestamp: '2025-06-03 16:00', action: 'Work Completed', user: 'Riya Patel', details: 'Crown fabrication completed' }
          ],
          digitalFiles: [
            { id: 'F4', name: 'final_crown.stl', type: 'STL', size: '3.1 MB', uploadedBy: 'Riya Patel', uploadedAt: '2025-06-03', url: '#' }
          ],
          products: [
            { id: 'P1', name: 'Zirconia Crown', quantity: 1, cost: 150, addedBy: 'Riya Patel', addedAt: '2025-06-03' }
          ],
          accessories: []
        }
      ],
      technicians: [
        {
          id: 'T001',
          name: 'Riya Patel',
          email: 'riya.patel@adelabs.com',
          department: 'Crown & Bridge',
          specialization: 'Ceramic Crowns',
          experience: '5 years',
          status: 'busy',
          currentCases: 3,
          assignments: [
            {
              id: 'A001',
              caseId: 'ADE-2025-034',
              caseNumber: 'ADE-2025-034',
              doctorName: 'Dr. Pooja Verma',
              clinicName: 'Smile Care Dental',
              patientName: 'Rahul Sharma',
              caseType: 'Crown',
              priority: 'high',
              status: 'in_progress',
              assignedDate: '2025-06-01',
              dueDate: '2025-06-06',
              estimatedCompletion: '2025-06-05',
              notes: 'Patient prefers ceramic material',
              technicianId: 'T001',
              technicianName: 'Riya Patel',
              logs: [
                { id: 'L5', timestamp: '2025-06-01 09:00', action: 'Assigned', user: 'Manager', details: 'Assigned to Riya Patel' },
                { id: 'L6', timestamp: '2025-06-01 10:00', action: 'Work Started', user: 'Riya Patel', details: 'Started crown fabrication' }
              ],
              digitalFiles: [
                { id: 'F5', name: 'prep_scan.stl', type: 'STL', size: '2.8 MB', uploadedBy: 'Dr. Pooja Verma', uploadedAt: '2025-06-01', url: '#' }
              ],
              products: [
                { id: 'P2', name: 'Ceramic Block', quantity: 1, cost: 80, addedBy: 'Riya Patel', addedAt: '2025-06-01' }
              ],
              accessories: []
            }
          ]
        },
        {
          id: 'T002',
          name: 'Anita Gupta',
          email: 'anita.gupta@adelabs.com',
          department: 'Crown & Bridge',
          specialization: 'Zirconia Crowns',
          experience: '7 years',
          status: 'available',
          currentCases: 1,
          assignments: []
        }
      ]
    },
    {
      id: 'orthodontics',
      name: 'Orthodontics',
      description: 'Specializing in clear aligners and orthodontic appliances',
      totalCases: 32,
      pendingCases: 8,
      completedToday: 6,
      waitingInward: [
        {
          id: 'WAIT003',
          caseNumber: 'ADE-2025-047',
          doctorName: 'Dr. Sanjay Mehta',
          clinicName: 'Orthodontic Center',
          patientName: 'Lisa Thomas',
          caseType: 'Clear Aligner',
          priority: 'medium',
          expectedDate: '2025-06-10',
          notes: 'First time aligner patient',
          logs: [],
          digitalFiles: [],
          products: [],
          accessories: []
        }
      ],
      inwardPending: [],
      outwardPending: [],
      technicians: [
        {
          id: 'T003',
          name: 'Kiran Shah',
          email: 'kiran.shah@adelabs.com',
          department: 'Orthodontics',
          specialization: 'Clear Aligners',
          experience: '4 years',
          status: 'available',
          currentCases: 2,
          assignments: []
        }
      ]
    },
    {
      id: 'dentures',
      name: 'Dentures',
      description: 'Complete and partial dentures, implant-supported prosthetics',
      totalCases: 28,
      pendingCases: 5,
      completedToday: 4,
      waitingInward: [],
      inwardPending: [
        {
          id: 'IN002',
          caseNumber: 'ADE-2025-048',
          doctorName: 'Dr. Ramesh Iyer',
          clinicName: 'Complete Dental Solutions',
          patientName: 'Elderly Patient',
          caseType: 'Complete Denture',
          priority: 'low',
          receivedDate: '2025-06-05',
          dueDate: '2025-06-15',
          notes: 'Patient requires comfortable fit',
          logs: [],
          digitalFiles: [],
          products: [],
          accessories: []
        }
      ],
      outwardPending: [],
      technicians: [
        {
          id: 'T004',
          name: 'Pradeep Kumar',
          email: 'pradeep.kumar@adelabs.com',
          department: 'Dentures',
          specialization: 'Complete Dentures',
          experience: '8 years',
          status: 'busy',
          currentCases: 3,
          assignments: []
        }
      ]
    }
  ]);

  const currentDepartment = departments.find(dept => dept.id === selectedDepartment);

  // Get all assignments across all technicians
  const allAssignments = currentDepartment?.technicians.flatMap(tech =>
    tech.assignments.map(assignment => ({
      ...assignment,
      technicianId: tech.id,
      technicianName: tech.name
    }))
  ) || [];

  // Filter technicians for search
  const filteredTechnicians = currentDepartment?.technicians.filter(tech =>
    tech.name.toLowerCase().includes(technicianSearch.toLowerCase()) ||
    tech.specialization.toLowerCase().includes(technicianSearch.toLowerCase())
  ) || [];

  // Search for a case across all stages
  const searchCaseInAllStages = (searchTerm: string) => {
    if (!searchTerm.trim() || !currentDepartment) return null;

    const lowerSearchTerm = searchTerm.toLowerCase();

    // Search in waiting inward
    const waitingCase = currentDepartment.waitingInward?.find(c =>
      c.caseNumber.toLowerCase().includes(lowerSearchTerm)
    );
    if (waitingCase) {
      return { stage: 'waiting-inward', case: waitingCase, tab: 'waiting-inward' };
    }

    // Search in inward pending
    const inwardCase = currentDepartment.inwardPending.find(c =>
      c.caseNumber.toLowerCase().includes(lowerSearchTerm)
    );
    if (inwardCase) {
      return { stage: 'inward-pending', case: inwardCase, tab: 'inward-pending' };
    }

    // Search in assigned (pending)
    const assignedPendingCase = allAssignments.find(a =>
      a.caseNumber.toLowerCase().includes(lowerSearchTerm) && a.status === 'pending'
    );
    if (assignedPendingCase) {
      return { stage: 'assigned-pending', case: assignedPendingCase, tab: 'assigned-pending' };
    }

    // Search in progress
    const inProgressCase = allAssignments.find(a =>
      a.caseNumber.toLowerCase().includes(lowerSearchTerm) && a.status === 'in_progress'
    );
    if (inProgressCase) {
      return { stage: 'in-progress', case: inProgressCase, tab: 'in-progress' };
    }

    // Search in outward pending
    const outwardCase = currentDepartment.outwardPending.find(c =>
      c.caseNumber.toLowerCase().includes(lowerSearchTerm)
    );
    if (outwardCase) {
      return { stage: 'outward-pending', case: outwardCase, tab: 'outward-pending' };
    }

    return null;
  };

  const handleCaseSearch = () => {
    const result = searchCaseInAllStages(caseSearch);
    if (result) {
      setActiveTab(result.tab);
      toast({
        title: "Case Found",
        description: `Case ${result.case.caseNumber} found in ${result.stage.replace('-', ' ')} stage`,
      });
    } else {
      toast({
        title: "Case Not Found",
        description: `No case found with identifier: ${caseSearch}`,
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Available</Badge>;
      case 'busy':
        return <Badge className="bg-yellow-100 text-yellow-800">Busy</Badge>;
      case 'on_break':
        return <Badge className="bg-blue-100 text-blue-800">On Break</Badge>;
      case 'offline':
        return <Badge className="bg-gray-100 text-gray-800">Offline</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'qa_pending':
        return <Badge className="bg-purple-100 text-purple-800">QA Pending</Badge>;
      case 'trial_ready':
        return <Badge className="bg-indigo-100 text-indigo-800">Trial Ready</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'on_hold':
        return <Badge className="bg-red-100 text-red-800">On Hold</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high':
        return <ChevronUp className="h-4 w-4 text-orange-600" />;
      case 'medium':
        return <Minus className="h-4 w-4 text-yellow-600" />;
      case 'low':
        return <ChevronDown className="h-4 w-4 text-green-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const handlePriorityChange = (caseNumber: string, newPriority: string, stage: string) => {
    setDepartments(prev => prev.map(dept => {
      if (dept.id === selectedDepartment) {
        let updated = { ...dept };

        if (stage === 'waiting-inward') {
          updated.waitingInward = dept.waitingInward?.map(c =>
            c.caseNumber === caseNumber ? { ...c, priority: newPriority as any } : c
          ) || [];
        } else if (stage === 'inward-pending') {
          updated.inwardPending = dept.inwardPending.map(c =>
            c.caseNumber === caseNumber ? { ...c, priority: newPriority as any } : c
          );
        } else if (stage === 'outward-pending') {
          updated.outwardPending = dept.outwardPending.map(c =>
            c.caseNumber === caseNumber ? { ...c, priority: newPriority as any } : c
          );
        } else {
          updated.technicians = dept.technicians.map(tech => ({
            ...tech,
            assignments: tech.assignments.map(a =>
              a.caseNumber === caseNumber ? { ...a, priority: newPriority as any } : a
            )
          }));
        }

        return updated;
      }
      return dept;
    }));

    toast({
      title: "Priority Updated",
      description: `Case ${caseNumber} priority changed to ${newPriority}`,
    });
  };

  const handleViewCaseDetails = (caseData: any) => {
    setSelectedCaseDetails(caseData);
    setIsCaseDetailsOpen(true);
  };

  const handleDownloadFile = (file: DigitalFile) => {
    toast({
      title: "Download Started",
      description: `Downloading ${file.name}`,
    });
    // In real implementation, this would trigger actual file download
  };

  const handleAddProduct = () => {
    if (!newProductName.trim() || !selectedCaseDetails) return;

    const newProduct: Product = {
      id: `P${Date.now()}`,
      name: newProductName,
      quantity: newProductQuantity,
      cost: newProductCost,
      addedBy: 'Admin',
      addedAt: new Date().toISOString().split('T')[0]
    };

    setSelectedCaseDetails({
      ...selectedCaseDetails,
      products: [...selectedCaseDetails.products, newProduct]
    });

    setNewProductName('');
    setNewProductQuantity(1);
    setNewProductCost(0);

    toast({
      title: "Product Added",
      description: `${newProduct.name} added to case`,
    });
  };

  const handleAddAccessory = () => {
    if (!newAccessoryName.trim() || !selectedCaseDetails) return;

    const newAccessory: Accessory = {
      id: `A${Date.now()}`,
      name: newAccessoryName,
      quantity: newAccessoryQuantity,
      providedBy: newAccessoryProvider,
      notes: newAccessoryNotes
    };

    setSelectedCaseDetails({
      ...selectedCaseDetails,
      accessories: [...selectedCaseDetails.accessories, newAccessory]
    });

    setNewAccessoryName('');
    setNewAccessoryQuantity(1);
    setNewAccessoryProvider('lab');
    setNewAccessoryNotes('');

    toast({
      title: "Accessory Added",
      description: `${newAccessory.name} added to case`,
    });
  };

  const handleSelfAssign = (caseId: string, technicianId: string) => {
    setDepartments(prev => prev.map(dept => {
      if (dept.id === selectedDepartment) {
        const inwardCase = dept.inwardPending.find(c => c.id === caseId);
        const technician = dept.technicians.find(t => t.id === technicianId);

        if (inwardCase && technician) {
          const newAssignment: CaseAssignment = {
            id: `A${Date.now()}`,
            caseId: inwardCase.caseNumber,
            caseNumber: inwardCase.caseNumber,
            doctorName: inwardCase.doctorName,
            clinicName: inwardCase.clinicName,
            patientName: inwardCase.patientName,
            caseType: inwardCase.caseType,
            priority: inwardCase.priority,
            status: 'pending',
            assignedDate: new Date().toISOString().split('T')[0],
            dueDate: inwardCase.dueDate,
            estimatedCompletion: inwardCase.dueDate,
            notes: inwardCase.notes,
            technicianId,
            technicianName: technician.name,
            logs: [...inwardCase.logs, { id: `L${Date.now()}`, timestamp: new Date().toISOString(), action: 'Assigned', user: 'Admin', details: `Assigned to ${technician.name}` }],
            digitalFiles: inwardCase.digitalFiles,
            products: inwardCase.products,
            accessories: inwardCase.accessories
          };

          return {
            ...dept,
            inwardPending: dept.inwardPending.filter(c => c.id !== caseId),
            technicians: dept.technicians.map(t =>
              t.id === technicianId
                ? { ...t, assignments: [...t.assignments, newAssignment], currentCases: t.currentCases + 1 }
                : t
            )
          };
        }
      }
      return dept;
    }));

    toast({
      title: "Case Assigned",
      description: `Case assigned successfully`,
    });
  };

  const handleAdminAssign = (caseId: string, technicianId: string) => {
    handleSelfAssign(caseId, technicianId);
  };

  const handleStartWork = (assignmentId: string) => {
    setDepartments(prev => prev.map(dept => {
      if (dept.id === selectedDepartment) {
        return {
          ...dept,
          technicians: dept.technicians.map(t => ({
            ...t,
            assignments: t.assignments.map(a =>
              a.id === assignmentId
                ? { ...a, status: 'in_progress' as const, logs: [...a.logs, { id: `L${Date.now()}`, timestamp: new Date().toISOString(), action: 'Work Started', user: a.technicianName || 'Technician', details: 'Started working on case' }] }
                : a
            )
          }))
        };
      }
      return dept;
    }));

    toast({
      title: "Work Started",
      description: "Case status updated to In Progress",
    });
  };

  const handleCompleteTask = (assignmentId: string, technicianId: string) => {
    setDepartments(prev => prev.map(dept => {
      if (dept.id === selectedDepartment) {
        const technician = dept.technicians.find(t => t.id === technicianId);
        const assignment = technician?.assignments.find(a => a.id === assignmentId);

        if (assignment && technician) {
          const outwardCase: OutwardCase = {
            id: `OUT${Date.now()}`,
            caseNumber: assignment.caseNumber,
            doctorName: assignment.doctorName,
            clinicName: assignment.clinicName,
            patientName: assignment.patientName,
            caseType: assignment.caseType,
            priority: assignment.priority,
            completedDate: new Date().toISOString().split('T')[0],
            technicianName: assignment.technicianName || technician.name,
            readyForOutward: true,
            logs: [...assignment.logs, { id: `L${Date.now()}`, timestamp: new Date().toISOString(), action: 'Work Completed', user: technician.name, details: 'Case work completed' }],
            digitalFiles: assignment.digitalFiles,
            products: assignment.products,
            accessories: assignment.accessories
          };

          return {
            ...dept,
            outwardPending: [...dept.outwardPending, outwardCase],
            technicians: dept.technicians.map(t =>
              t.id === technicianId
                ? {
                  ...t,
                  assignments: t.assignments.filter(a => a.id !== assignmentId),
                  currentCases: Math.max(0, t.currentCases - 1)
                }
                : t
            )
          };
        }
      }
      return dept;
    }));

    toast({
      title: "Task Completed",
      description: `Task completed and moved to outward pending`,
    });
  };

  const handleMakeOutward = (outwardCaseId: string) => {
    setDepartments(prev => prev.map(dept => {
      if (dept.id === selectedDepartment) {
        return {
          ...dept,
          outwardPending: dept.outwardPending.filter(c => c.id !== outwardCaseId)
        };
      }
      return dept;
    }));

    toast({
      title: "Case Processed",
      description: `Case has been sent outward`,
    });
  };

  const handleMakeInward = (waitingCaseId: string) => {
    setDepartments(prev => prev.map(dept => {
      if (dept.id === selectedDepartment) {
        const waitingCase = dept.waitingInward?.find(c => c.id === waitingCaseId);

        if (waitingCase) {
          const inwardCase: InwardCase = {
            id: `IN${Date.now()}`,
            caseNumber: waitingCase.caseNumber,
            doctorName: waitingCase.doctorName,
            clinicName: waitingCase.clinicName,
            patientName: waitingCase.patientName,
            caseType: waitingCase.caseType,
            priority: waitingCase.priority,
            receivedDate: new Date().toISOString().split('T')[0],
            dueDate: waitingCase.expectedDate,
            notes: waitingCase.notes,
            logs: [...waitingCase.logs, { id: `L${Date.now()}`, timestamp: new Date().toISOString(), action: 'Made Inward', user: 'Admin', details: 'Case processed for assignment' }],
            digitalFiles: waitingCase.digitalFiles,
            products: waitingCase.products,
            accessories: waitingCase.accessories
          };

          return {
            ...dept,
            waitingInward: dept.waitingInward?.filter(c => c.id !== waitingCaseId) || [],
            inwardPending: [...dept.inwardPending, inwardCase]
          };
        }
      }
      return dept;
    }));

    toast({
      title: "Case Made Inward",
      description: `Case has been moved to inward pending`,
    });
  };

  const handleChatOpen = (caseId: string, caseType: string) => {
    setSelectedCaseForChat({ caseId, caseType });
    setIsChatModalOpen(true);
  };

  const handleChatClose = () => {
    setIsChatModalOpen(false);
    setSelectedCaseForChat(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Department View</h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Case Search */}
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search case (e.g., ADE-2025-034)..."
              value={caseSearch}
              onChange={(e) => setCaseSearch(e.target.value)}
              className="w-64"
              onKeyPress={(e) => e.key === 'Enter' && handleCaseSearch()}
            />
            <Button onClick={handleCaseSearch} variant="outline" size="sm">
              Search Case
            </Button>
          </div>

          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Department Overview */}
      {currentDepartment && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{currentDepartment.name}</CardTitle>
              <p className="text-sm text-gray-600">{currentDepartment.description}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{currentDepartment.waitingInward?.length || 0}</div>
                  <div className="text-sm text-gray-600">Waiting Inward</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{currentDepartment.inwardPending.length}</div>
                  <div className="text-sm text-gray-600">Inward Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{allAssignments.filter(a => a.status === 'pending').length}</div>
                  <div className="text-sm text-gray-600">Assigned (Pending)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{allAssignments.filter(a => a.status === 'in_progress').length}</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{currentDepartment.outwardPending.length}</div>
                  <div className="text-sm text-gray-600">Outward Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{currentDepartment.technicians.length}</div>
                  <div className="text-sm text-gray-600">Total Technicians</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabbed Interface for Better Organization */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="waiting-inward">Waiting Inward</TabsTrigger>
              <TabsTrigger value="inward-pending">Inward Pending</TabsTrigger>
              <TabsTrigger value="assigned-pending">Assigned (Pending)</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="outward-pending">Outward Pending</TabsTrigger>
              <TabsTrigger value="technicians">Technicians</TabsTrigger>
            </TabsList>

            {/* Waiting to be Inward Cases */}
            <TabsContent value="waiting-inward">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-600" />
                    Waiting to be Inward ({currentDepartment.waitingInward?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentDepartment.waitingInward && currentDepartment.waitingInward.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Case Details</TableHead>
                          <TableHead>Patient/Doctor</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Expected Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentDepartment.waitingInward.map((waitingCase) => (
                          <TableRow key={waitingCase.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{waitingCase.caseNumber}</div>
                                <div className="text-sm text-gray-500">{waitingCase.caseType}</div>
                                <div className="text-xs text-gray-400">{waitingCase.clinicName}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{waitingCase.patientName}</div>
                                <div className="text-sm text-gray-500">{waitingCase.doctorName}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getPriorityIcon(waitingCase.priority)}
                                <Select
                                  value={waitingCase.priority}
                                  onValueChange={(value) => handlePriorityChange(waitingCase.caseNumber, value, 'waiting-inward')}
                                >
                                  <SelectTrigger className="w-[100px] h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className={waitingCase.expectedDate < '2025-06-08' ? 'text-red-600 font-semibold' : ''}>
                                {waitingCase.expectedDate}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMakeInward(waitingCase.id)}
                                  title="Make Inward"
                                >
                                  <ArrowRight className="h-4 w-4 mr-1" />
                                  Make Inward
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewCaseDetails(waitingCase)}
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleChatOpen(waitingCase.caseNumber, waitingCase.caseType)}
                                  title="Case Chat"
                                >
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No cases waiting to be inward
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Inward Pending Cases */}
            <TabsContent value="inward-pending">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRight className="h-5 w-5 text-blue-600" />
                    Inward Pending Cases ({currentDepartment.inwardPending.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentDepartment.inwardPending.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Case Details</TableHead>
                          <TableHead>Patient/Doctor</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentDepartment.inwardPending.map((inwardCase) => (
                          <TableRow key={inwardCase.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{inwardCase.caseNumber}</div>
                                <div className="text-sm text-gray-500">{inwardCase.caseType}</div>
                                <div className="text-xs text-gray-400">{inwardCase.clinicName}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{inwardCase.patientName}</div>
                                <div className="text-sm text-gray-500">{inwardCase.doctorName}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getPriorityIcon(inwardCase.priority)}
                                <Select
                                  value={inwardCase.priority}
                                  onValueChange={(value) => handlePriorityChange(inwardCase.caseNumber, value, 'inward-pending')}
                                >
                                  <SelectTrigger className="w-[100px] h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className={inwardCase.dueDate < '2025-06-08' ? 'text-red-600 font-semibold' : ''}>
                                {inwardCase.dueDate}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Select onValueChange={(technicianId) => handleAdminAssign(inwardCase.id, technicianId)}>
                                  <SelectTrigger className="w-[140px] h-8">
                                    <SelectValue placeholder="Assign to..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {currentDepartment.technicians.map((tech) => (
                                      <SelectItem key={tech.id} value={tech.id}>
                                        {tech.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewCaseDetails(inwardCase)}
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleChatOpen(inwardCase.caseNumber, inwardCase.caseType)}
                                  title="Case Chat"
                                >
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No inward pending cases
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Assigned Pending Cases */}
            <TabsContent value="assigned-pending">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    Assigned (Pending) Cases ({allAssignments.filter(a => a.status === 'pending').length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {allAssignments.filter(a => a.status === 'pending').length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Case Details</TableHead>
                          <TableHead>Patient/Doctor</TableHead>
                          <TableHead>Technician</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allAssignments.filter(a => a.status === 'pending').map((assignment) => (
                          <TableRow key={assignment.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{assignment.caseNumber}</div>
                                <div className="text-sm text-gray-500">{assignment.caseType}</div>
                                <div className="text-xs text-gray-400">{assignment.clinicName}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{assignment.patientName}</div>
                                <div className="text-sm text-gray-500">{assignment.doctorName}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{assignment.technicianName}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getPriorityIcon(assignment.priority)}
                                <Select
                                  value={assignment.priority}
                                  onValueChange={(value) => handlePriorityChange(assignment.caseNumber, value, 'assigned')}
                                >
                                  <SelectTrigger className="w-[100px] h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className={assignment.dueDate < '2025-06-08' ? 'text-red-600 font-semibold' : ''}>
                                {assignment.dueDate}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStartWork(assignment.id)}
                                  title="Start Work"
                                >
                                  Start Work
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewCaseDetails(assignment)}
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleChatOpen(assignment.caseId, assignment.caseType)}
                                  title="Case Chat"
                                >
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No assigned pending cases
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* In Progress Cases */}
            <TabsContent value="in-progress">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-purple-600" />
                    In Progress Cases ({allAssignments.filter(a => a.status === 'in_progress').length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {allAssignments.filter(a => a.status === 'in_progress').length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Case Details</TableHead>
                          <TableHead>Patient/Doctor</TableHead>
                          <TableHead>Technician</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allAssignments.filter(a => a.status === 'in_progress').map((assignment) => (
                          <TableRow key={assignment.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{assignment.caseNumber}</div>
                                <div className="text-sm text-gray-500">{assignment.caseType}</div>
                                <div className="text-xs text-gray-400">{assignment.clinicName}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{assignment.patientName}</div>
                                <div className="text-sm text-gray-500">{assignment.doctorName}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{assignment.technicianName}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getPriorityIcon(assignment.priority)}
                                <Select
                                  value={assignment.priority}
                                  onValueChange={(value) => handlePriorityChange(assignment.caseNumber, value, 'assigned')}
                                >
                                  <SelectTrigger className="w-[100px] h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className={assignment.dueDate < '2025-06-08' ? 'text-red-600 font-semibold' : ''}>
                                {assignment.dueDate}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCompleteTask(assignment.id, assignment.technicianId!)}
                                  title="Complete Task"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Complete
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewCaseDetails(assignment)}
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleChatOpen(assignment.caseId, assignment.caseType)}
                                  title="Case Chat"
                                >
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No cases in progress
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Outward Pending Cases */}
            <TabsContent value="outward-pending">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowLeft className="h-5 w-5 text-green-600" />
                    Outward Pending Cases ({currentDepartment.outwardPending.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentDepartment.outwardPending.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Case Details</TableHead>
                          <TableHead>Patient/Doctor</TableHead>
                          <TableHead>Technician</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Completed Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentDepartment.outwardPending.map((outwardCase) => (
                          <TableRow key={outwardCase.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{outwardCase.caseNumber}</div>
                                <div className="text-sm text-gray-500">{outwardCase.caseType}</div>
                                <div className="text-xs text-gray-400">{outwardCase.clinicName}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{outwardCase.patientName}</div>
                                <div className="text-sm text-gray-500">{outwardCase.doctorName}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{outwardCase.technicianName}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getPriorityIcon(outwardCase.priority)}
                                <Select
                                  value={outwardCase.priority}
                                  onValueChange={(value) => handlePriorityChange(outwardCase.caseNumber, value, 'outward-pending')}
                                >
                                  <SelectTrigger className="w-[100px] h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                            <TableCell>{outwardCase.completedDate}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMakeOutward(outwardCase.id)}
                                  title="Process Outward"
                                >
                                  <Package className="h-4 w-4 mr-1" />
                                  Make Outward
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewCaseDetails(outwardCase)}
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleChatOpen(outwardCase.caseNumber, outwardCase.caseType)}
                                  title="Case Chat"
                                >
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No outward pending cases
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Technicians Tab */}
            <TabsContent value="technicians">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Technicians ({currentDepartment.technicians.length})
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Search className="h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search technicians..."
                        value={technicianSearch}
                        onChange={(e) => setTechnicianSearch(e.target.value)}
                        className="w-64"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Specialization</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Current Cases</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTechnicians.map((technician) => (
                        <TableRow key={technician.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{technician.name}</div>
                              <div className="text-sm text-gray-500">{technician.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{technician.specialization}</TableCell>
                          <TableCell>{technician.experience}</TableCell>
                          <TableCell>{getStatusBadge(technician.status)}</TableCell>
                          <TableCell>
                            <div className="text-center">
                              <span className="text-lg font-bold">{technician.currentCases}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Select onValueChange={(caseId) => handleSelfAssign(caseId, technician.id)}>
                                <SelectTrigger className="w-[140px] h-8">
                                  <SelectValue placeholder="Assign case..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {currentDepartment.inwardPending.map((inwardCase) => (
                                    <SelectItem key={inwardCase.id} value={inwardCase.id}>
                                      {inwardCase.caseNumber}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Case Details Modal */}
      <Dialog open={isCaseDetailsOpen} onOpenChange={setIsCaseDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Case Details - {selectedCaseDetails?.caseNumber}
              <Badge variant="outline" className="text-xs">
                {selectedCaseDetails?.caseType}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          {selectedCaseDetails && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Patient Information</h3>
                  <p><strong>Name:</strong> {selectedCaseDetails.patientName}</p>
                  <p><strong>Doctor:</strong> {selectedCaseDetails.doctorName}</p>
                  <p><strong>Clinic:</strong> {selectedCaseDetails.clinicName}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Case Information</h3>
                  <p><strong>Type:</strong> {selectedCaseDetails.caseType}</p>
                  <p><strong>Priority:</strong> {selectedCaseDetails.priority}</p>
                  <p><strong>Status:</strong> {selectedCaseDetails.status || 'Waiting'}</p>
                </div>
              </div>

              {/* Notes */}
              {selectedCaseDetails.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="text-sm bg-gray-50 p-3 rounded">{selectedCaseDetails.notes}</p>
                </div>
              )}

              {/* Case Logs */}
              <div>
                <h3 className="font-semibold mb-2">Case Logs</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedCaseDetails.logs.map((log: CaseLog) => (
                    <div key={log.id} className="text-sm bg-gray-50 p-2 rounded">
                      <div className="flex justify-between">
                        <span className="font-medium">{log.action}</span>
                        <span className="text-gray-500">{log.timestamp}</span>
                      </div>
                      <p className="text-gray-600">{log.details} - {log.user}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Digital Files */}
              <div>
                <h3 className="font-semibold mb-2">Digital Files</h3>
                {selectedCaseDetails.digitalFiles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedCaseDetails.digitalFiles.map((file: DigitalFile) => (
                      <div key={file.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-gray-500">{file.type} • {file.size}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadFile(file)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No digital files available</p>
                )}
              </div>

              {/* Products */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Products</h3>
                </div>

                {/* Add Product Form */}
                <div className="bg-gray-50 p-3 rounded mb-3">
                  <h4 className="text-sm font-medium mb-2">Add Product</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="Product name"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={newProductQuantity}
                      onChange={(e) => setNewProductQuantity(Number(e.target.value))}
                    />
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Cost"
                        value={newProductCost}
                        onChange={(e) => setNewProductCost(Number(e.target.value))}
                      />
                      <Button onClick={handleAddProduct} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Products List */}
                {selectedCaseDetails.products.length > 0 ? (
                  <div className="space-y-2">
                    {selectedCaseDetails.products.map((product: Product) => (
                      <div key={product.id} className="flex items-center justify-between bg-white border p-2 rounded">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">Qty: {product.quantity} • Cost: ₹{product.cost}</p>
                        </div>
                        <Badge variant="secondary">{product.addedBy}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No products added</p>
                )}
              </div>

              {/* Accessories */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Accessories</h3>
                </div>

                {/* Add Accessory Form */}
                <div className="bg-gray-50 p-3 rounded mb-3">
                  <h4 className="text-sm font-medium mb-2">Add Accessory</h4>
                  <div className="grid grid-cols-4 gap-2">
                    <Input
                      placeholder="Accessory name"
                      value={newAccessoryName}
                      onChange={(e) => setNewAccessoryName(e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={newAccessoryQuantity}
                      onChange={(e) => setNewAccessoryQuantity(Number(e.target.value))}
                    />
                    <Select value={newAccessoryProvider} onValueChange={(value: 'lab' | 'doctor') => setNewAccessoryProvider(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lab">Lab</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Notes"
                        value={newAccessoryNotes}
                        onChange={(e) => setNewAccessoryNotes(e.target.value)}
                      />
                      <Button onClick={handleAddAccessory} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Accessories List */}
                {selectedCaseDetails.accessories.length > 0 ? (
                  <div className="space-y-2">
                    {selectedCaseDetails.accessories.map((accessory: Accessory) => (
                      <div key={accessory.id} className="flex items-center justify-between bg-white border p-2 rounded">
                        <div>
                          <p className="font-medium">{accessory.name}</p>
                          <p className="text-sm text-gray-500">Qty: {accessory.quantity}</p>
                          {accessory.notes && <p className="text-xs text-gray-400">{accessory.notes}</p>}
                        </div>
                        <Badge variant={accessory.providedBy === 'lab' ? 'default' : 'secondary'}>
                          {accessory.providedBy === 'lab' ? 'By Lab' : 'By Doctor'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No accessories added</p>
                )}
              </div>

              {/* Chat for Approvals */}
              <div className="bg-blue-50 p-3 rounded">
                <h4 className="text-sm font-medium mb-2">Need Approval?</h4>
                <p className="text-sm text-gray-600 mb-2">Use chat to request approval for changes or additions to this case.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsCaseDetailsOpen(false);
                    handleChatOpen(selectedCaseDetails.caseNumber, selectedCaseDetails.caseType);
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Request Approval
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Case Chat Modal */}
      {/* {selectedCaseForChat && (
          <CaseChatModal
            isOpen={isChatModalOpen}
            onClose={handleChatClose}
            caseId={selectedCaseForChat.caseId}
            caseType={selectedCaseForChat.caseType}
          />
        )} */}
    </div>
  );
};

export default DepartmentViewPage;
