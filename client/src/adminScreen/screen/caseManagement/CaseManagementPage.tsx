
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Plus, Search, Eye, Edit, Clock, CheckCircle, AlertCircle, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Case {
  id: string;
  caseNumber: string;
  doctorName: string;
  clinicName: string;
  patientName: string;
  caseType: string;
  department: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'submitted' | 'in_progress' | 'trial_ready' | 'trial_sent' | 'trial_feedback' | 'completed' | 'dispatched' | 'delivered';
  createdDate: string;
  dueDate: string;
  estimatedDelivery: string;
  currentDepartment?: string;
  assignedTechnician?: string;
  isTrialRequired: boolean;
  trialStatus?: 'pending' | 'sent' | 'approved' | 'revision_needed';
  accessories: {
    doctorAccessories: string[];
    labAccessories: string[];
    returnRequired: boolean;
  };
  totalAmount: number;
  paidAmount: number;
  paymentStatus: 'pending' | 'partial' | 'paid' | 'overdue';
}

const CaseManagementPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const [cases, setCases] = useState<Case[]>([
    {
      id: '1',
      caseNumber: 'ADE-2025-001',
      doctorName: 'Dr. Ravi Sharma',
      clinicName: 'Smile Care Dental Clinic',
      patientName: 'Rajesh Kumar',
      caseType: 'Crown & Bridge',
      department: 'Crown & Bridge',
      priority: 'medium',
      status: 'in_progress',
      createdDate: '2025-06-01',
      dueDate: '2025-06-08',
      estimatedDelivery: '2025-06-10',
      currentDepartment: 'Crown & Bridge',
      assignedTechnician: 'Riya Patel',
      isTrialRequired: true,
      trialStatus: 'pending',
      accessories: {
        doctorAccessories: ['Bite Block', 'Impression Tray'],
        labAccessories: [],
        returnRequired: true
      },
      totalAmount: 15000,
      paidAmount: 5000,
      paymentStatus: 'partial'
    },
    {
      id: '2',
      caseNumber: 'ADE-2025-002',
      doctorName: 'Dr. Priya Patel',
      clinicName: 'Advanced Dentistry Center',
      patientName: 'Sunita Devi',
      caseType: 'Orthodontics',
      department: 'Orthodontics',
      priority: 'high',
      status: 'trial_sent',
      createdDate: '2025-05-28',
      dueDate: '2025-06-05',
      estimatedDelivery: '2025-06-07',
      currentDepartment: 'Dispatch',
      isTrialRequired: true,
      trialStatus: 'sent',
      accessories: {
        doctorAccessories: [],
        labAccessories: ['Lab Tray', 'Bite Registration'],
        returnRequired: false
      },
      totalAmount: 25000,
      paidAmount: 25000,
      paymentStatus: 'paid'
    },
    {
      id: '3',
      caseNumber: 'ADE-2025-003',
      doctorName: 'Dr. Amit Gupta',
      clinicName: 'Elite Dental Solutions',
      patientName: 'Mohan Lal',
      caseType: 'Implants',
      department: 'Implants',
      priority: 'urgent',
      status: 'completed',
      createdDate: '2025-05-20',
      dueDate: '2025-05-30',
      estimatedDelivery: '2025-06-02',
      currentDepartment: 'Quality Check',
      assignedTechnician: 'Anita Gupta',
      isTrialRequired: false,
      accessories: {
        doctorAccessories: ['Custom Tray'],
        labAccessories: ['Implant Analog'],
        returnRequired: true
      },
      totalAmount: 45000,
      paidAmount: 20000,
      paymentStatus: 'partial'
    }
  ]);

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.clinicName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || caseItem.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || caseItem.department === departmentFilter;
    const matchesPriority = priorityFilter === 'all' || caseItem.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesDepartment && matchesPriority;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-800">Submitted</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case 'trial_ready':
        return <Badge className="bg-purple-100 text-purple-800">Trial Ready</Badge>;
      case 'trial_sent':
        return <Badge className="bg-indigo-100 text-indigo-800">Trial Sent</Badge>;
      case 'trial_feedback':
        return <Badge className="bg-orange-100 text-orange-800">Trial Feedback</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'dispatched':
        return <Badge className="bg-teal-100 text-teal-800">Dispatched</Badge>;
      case 'delivered':
        return <Badge className="bg-emerald-100 text-emerald-800">Delivered</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge className="bg-red-100 text-red-800">Urgent</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-gray-100 text-gray-800">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>;
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const departments = [...new Set(cases.map(c => c.department))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Package className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Case Management</h2>
        </div>

        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Case
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-600">Total Cases</div>
            <div className="text-2xl font-bold">{cases.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-600">In Progress</div>
            <div className="text-2xl font-bold text-yellow-600">
              {cases.filter(c => c.status === 'in_progress').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-600">Trial Cases</div>
            <div className="text-2xl font-bold text-purple-600">
              {cases.filter(c => c.isTrialRequired).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-600">Urgent Priority</div>
            <div className="text-2xl font-bold text-red-600">
              {cases.filter(c => c.priority === 'urgent').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="trial_ready">Trial Ready</SelectItem>
                <SelectItem value="trial_sent">Trial Sent</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="dispatched">Dispatched</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cases Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cases ({filteredCases.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case Details</TableHead>
                <TableHead>Patient/Doctor</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead>Trial</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.map((caseItem) => (
                <TableRow key={caseItem.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{caseItem.caseNumber}</div>
                      <div className="text-sm text-gray-500">{caseItem.caseType}</div>
                      <div className="text-xs text-gray-400">{caseItem.clinicName}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{caseItem.patientName}</div>
                      <div className="text-sm text-gray-500">{caseItem.doctorName}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{caseItem.department}</div>
                      {caseItem.assignedTechnician && (
                        <div className="text-xs text-gray-500">{caseItem.assignedTechnician}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(caseItem.status)}</TableCell>
                  <TableCell>{getPriorityBadge(caseItem.priority)}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Due: {caseItem.dueDate}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Truck className="h-3 w-3 mr-1" />
                        Est: {caseItem.estimatedDelivery}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {caseItem.isTrialRequired ? (
                        <>
                          <Badge variant="outline" className="text-xs">Trial Required</Badge>
                          {caseItem.trialStatus && (
                            <div className="text-xs text-gray-500 capitalize">
                              {caseItem.trialStatus.replace('_', ' ')}
                            </div>
                          )}
                        </>
                      ) : (
                        <Badge variant="secondary" className="text-xs">No Trial</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getPaymentBadge(caseItem.paymentStatus)}
                      <div className="text-xs text-gray-500">
                        ₹{caseItem.paidAmount.toLocaleString()}/₹{caseItem.totalAmount.toLocaleString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CaseManagementPage;
