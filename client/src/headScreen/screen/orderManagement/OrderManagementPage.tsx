import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Search, Filter, Eye, UserCheck, AlertTriangle, RefreshCw, Building2, User, Hash } from 'lucide-react';
import MaterialUsageModal from '@/headScreen/component/order-management/MaterialUsageModal';

interface Order {
  id: string;
  caseId: string;
  doctor: string;
  clinic: string;
  patient: string;
  type: string;
  status: 'pending' | 'in_progress' | 'qa_pending' | 'trial' | 'rework' | 'completed' | 'urgent';
  technician: string;
  department: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  createdDate: string;
}

const OrderManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [clinicFilter, setClinicFilter] = useState('all');
  const [isMaterialUsageModalOpen, setIsMaterialUsageModalOpen] = useState(false);
  const [selectedOrderForMaterials, setSelectedOrderForMaterials] = useState<string | null>(null);

  const [orders] = useState<Order[]>([
    {
      id: '1',
      caseId: 'ADE-2025-034',
      doctor: 'Dr. Pooja Verma',
      clinic: 'Smile Care Dental',
      patient: 'Rahul Sharma',
      type: 'Crown & Bridge',
      status: 'in_progress',
      technician: 'Riya Patel',
      department: 'Crown & Bridge',
      dueDate: '2025-06-06',
      priority: 'high',
      createdDate: '2025-06-01'
    },
    {
      id: '2',
      caseId: 'ADE-2025-035',
      doctor: 'Dr. Amit Kumar',
      clinic: 'Smile Dental',
      patient: 'Priya Singh',
      type: 'Orthodontics',
      status: 'qa_pending',
      technician: 'Anita Gupta',
      department: 'Orthodontics',
      dueDate: '2025-06-04',
      priority: 'medium',
      createdDate: '2025-05-30'
    },
    {
      id: '3',
      caseId: 'ADE-2025-036',
      doctor: 'Dr. Rajesh Patel',
      clinic: 'Perfect Smile',
      patient: 'Neha Joshi',
      type: 'Implants',
      status: 'trial',
      technician: 'Karan Singh',
      department: 'Crown & Bridge',
      dueDate: '2025-06-08',
      priority: 'low',
      createdDate: '2025-06-02'
    },
    {
      id: '4',
      caseId: 'ADE-2025-037',
      doctor: 'Dr. Sunita Shah',
      clinic: 'Care Plus Dental',
      patient: 'Vikram Gupta',
      type: 'Crown',
      status: 'urgent',
      technician: 'Riya Patel',
      department: 'Crown & Bridge',
      dueDate: '2025-06-05',
      priority: 'high',
      createdDate: '2025-06-03'
    },
    {
      id: '5',
      caseId: 'ADE-2025-038',
      doctor: 'Dr. Manish Agarwal',
      clinic: 'Dental Care Center',
      patient: 'Deepika Rao',
      type: 'Bridge',
      status: 'completed',
      technician: 'Anita Gupta',
      department: 'Crown & Bridge',
      dueDate: '2025-06-03',
      priority: 'medium',
      createdDate: '2025-05-28'
    },
    {
      id: '6',
      caseId: 'ADE-2025-039',
      doctor: 'Dr. Kavita Desai',
      clinic: 'Modern Dentistry',
      patient: 'Arjun Mehta',
      type: 'Partial Denture',
      status: 'pending',
      technician: 'Unassigned',
      department: 'Prosthodontics',
      dueDate: '2025-06-10',
      priority: 'low',
      createdDate: '2025-06-04'
    },
    {
      id: '7',
      caseId: 'ADE-2025-040',
      doctor: 'Dr. Sanjay Trivedi',
      clinic: 'Bright Smile',
      patient: 'Meera Iyer',
      type: 'Orthodontic Appliance',
      status: 'in_progress',
      technician: 'Dr. Pooja Verma',
      department: 'Orthodontics',
      dueDate: '2025-06-07',
      priority: 'medium',
      createdDate: '2025-06-01'
    },
    {
      id: '8',
      caseId: 'ADE-2025-041',
      doctor: 'Dr. Pooja Verma',
      clinic: 'Smile Care Dental',
      patient: 'Rohit Bansal',
      type: 'Implant Crown',
      status: 'rework',
      technician: 'Karan Singh',
      department: 'Implants',
      dueDate: '2025-06-09',
      priority: 'high',
      createdDate: '2025-05-29'
    }
  ]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.clinic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.patient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || order.department === departmentFilter;
    const matchesDoctor = doctorFilter === 'all' || order.doctor === doctorFilter;
    const matchesClinic = clinicFilter === 'all' || order.clinic === clinicFilter;

    return matchesSearch && matchesStatus && matchesDepartment && matchesDoctor && matchesClinic;
  });

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { variant: any, className: string } } = {
      'pending': { variant: 'secondary', className: 'bg-gray-100 text-gray-800' },
      'in_progress': { variant: 'default', className: 'bg-blue-100 text-blue-800' },
      'qa_pending': { variant: 'secondary', className: 'bg-yellow-100 text-yellow-800' },
      'trial': { variant: 'outline', className: 'bg-purple-100 text-purple-800' },
      'rework': { variant: 'destructive', className: 'bg-orange-100 text-orange-800' },
      'completed': { variant: 'default', className: 'bg-green-100 text-green-800' },
      'urgent': { variant: 'destructive', className: 'bg-red-100 text-red-800' }
    };

    return statusMap[status] || statusMap['pending'];
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'high': 'text-red-600 font-semibold',
      'medium': 'text-yellow-600 font-medium',
      'low': 'text-green-600 font-normal'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
  };

  const handleViewOrder = (orderId: string) => {
    console.log(`View order ${orderId}`);
  };

  const handleReassignOrder = (orderId: string) => {
    console.log(`Reassign order ${orderId}`);
  };

  const handleMarkUrgent = (orderId: string) => {
    console.log(`Mark urgent order ${orderId}`);
  };

  const handleOverrideStatus = (orderId: string) => {
    console.log(`Override status for order ${orderId}`);
  };

  const handleViewMaterialUsage = (orderId: string) => {
    setSelectedOrderForMaterials(orderId);
    setIsMaterialUsageModalOpen(true);
  };

  // Get unique doctors and clinics for filter options
  const uniqueDoctors = [...new Set(orders.map(order => order.doctor))];
  const uniqueClinics = [...new Set(orders.map(order => order.clinic))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Package className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Order Management</h2>
      </div>

      {/* Quick View Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              View by Clinic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={clinicFilter} onValueChange={setClinicFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select clinic to view orders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clinics</SelectItem>
                {uniqueClinics.map(clinic => (
                  <SelectItem key={clinic} value={clinic}>
                    {clinic} ({orders.filter(o => o.clinic === clinic).length} orders)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              View by Doctor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={doctorFilter} onValueChange={setDoctorFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select doctor to view orders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Doctors</SelectItem>
                {uniqueDoctors.map(doctor => (
                  <SelectItem key={doctor} value={doctor}>
                    {doctor} ({orders.filter(o => o.doctor === doctor).length} orders)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredOrders.length}</div>
              <div className="text-sm text-gray-600">
                {clinicFilter !== 'all' && doctorFilter !== 'all'
                  ? `Orders from ${doctorFilter} at ${clinicFilter}`
                  : clinicFilter !== 'all'
                    ? `Orders from ${clinicFilter}`
                    : doctorFilter !== 'all'
                      ? `Orders from ${doctorFilter}`
                      : 'Total Orders'
                }
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Advanced Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search cases, patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="qa_pending">QA Pending</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="rework">Rework</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Crown & Bridge">Crown & Bridge</SelectItem>
                <SelectItem value="Orthodontics">Orthodontics</SelectItem>
                <SelectItem value="Implants">Implants</SelectItem>
                <SelectItem value="Prosthodontics">Prosthodontics</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDepartmentFilter('all');
                setDoctorFilter('all');
                setClinicFilter('all');
              }}
            >
              Clear All Filters
            </Button>

            <div className="text-sm text-gray-600 flex items-center">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {clinicFilter !== 'all' || doctorFilter !== 'all'
              ? `Filtered Orders (${filteredOrders.length})`
              : `All Orders (${filteredOrders.length})`
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Doctor & Clinic</TableHead>
                <TableHead>Patient & Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className={
                  clinicFilter !== 'all' && order.clinic === clinicFilter ? 'bg-blue-50' :
                    doctorFilter !== 'all' && order.doctor === doctorFilter ? 'bg-green-50' : ''
                }>
                  <TableCell>
                    <div className="font-medium">{order.caseId}</div>
                    <div className="text-sm text-gray-500">Created: {order.createdDate}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{order.doctor}</div>
                    <div className="text-sm text-gray-600">{order.clinic}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{order.patient}</div>
                    <div className="text-sm text-gray-600">{order.type}</div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status).className}`}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{order.technician}</div>
                  </TableCell>
                  <TableCell>{order.department}</TableCell>
                  <TableCell>
                    <div className={order.dueDate < '2025-06-04' ? 'text-red-600 font-semibold' : ''}>
                      {order.dueDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={getPriorityColor(order.priority)}>
                      {order.priority.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewOrder(order.id)}
                        title="View Order"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReassignOrder(order.id)}
                        title="Reassign Order"
                      >
                        <UserCheck className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewMaterialUsage(order.caseId)}
                        title="View Material Usage"
                      >
                        <Hash className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkUrgent(order.id)}
                        title="Mark Urgent"
                      >
                        <AlertTriangle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOverrideStatus(order.id)}
                        title="Override Status"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Material Usage Modal */}
      <MaterialUsageModal
        isOpen={isMaterialUsageModalOpen}
        onClose={() => setIsMaterialUsageModalOpen(false)}
        orderId={selectedOrderForMaterials}
      />
    </div>
  );
};

export default OrderManagementPage;
