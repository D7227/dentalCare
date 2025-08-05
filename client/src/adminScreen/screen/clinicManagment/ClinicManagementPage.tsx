
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Plus, Search, Eye, Edit, CheckCircle, XCircle, Phone, Mail, MapPin, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Clinic {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  contactPerson: string;
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  onboardingDate: string;
  lastOrderDate?: string;
  totalOrders: number;
  areaManager: string;
  engagementScore: number;
  billingPreference: 'prepaid' | 'postpaid' | 'credit';
  creditLimit?: number;
  visitingCard?: string;
}

interface Doctor {
  id: string;
  name: string;
  qualification: string;
  specialization: string;
  clinicId: string;
  clinicName: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended';
  registrationNumber: string;
  joinDate: string;
  lastLogin?: string;
  totalOrders: number;
  billingPreference: 'prepaid' | 'postpaid' | 'credit';
  paymentCategory: 'regular' | 'priority' | 'vip';
  creditLimit?: number;
  outstandingAmount: number;
  preferredPaymentMethod: 'digital' | 'cash' | 'cheque' | 'mixed';
  autoApproval: boolean;
}

const ClinicManagementPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('clinics');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');

  const [clinics, setClinics] = useState<Clinic[]>([
    {
      id: '1',
      name: 'Smile Care Dental Clinic',
      address: '123 Main Street, Sector 15',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      phone: '+91 98765 43210',
      email: 'info@smilecare.com',
      contactPerson: 'Dr. Ravi Sharma',
      status: 'approved',
      onboardingDate: '2024-01-15',
      lastOrderDate: '2025-06-03',
      totalOrders: 45,
      areaManager: 'Nidhi Shah',
      engagementScore: 85,
      billingPreference: 'postpaid',
      creditLimit: 50000
    },
    {
      id: '2',
      name: 'Advanced Dentistry Center',
      address: '456 Park Avenue, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      phone: '+91 87654 32109',
      email: 'contact@advanceddent.com',
      contactPerson: 'Dr. Priya Patel',
      status: 'pending',
      onboardingDate: '2025-06-01',
      totalOrders: 0,
      areaManager: 'Vikram Patel',
      engagementScore: 0,
      billingPreference: 'prepaid'
    },
    {
      id: '3',
      name: 'Elite Dental Solutions',
      address: '789 Business District, Andheri',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400058',
      phone: '+91 76543 21098',
      email: 'admin@elitedental.com',
      contactPerson: 'Dr. Amit Gupta',
      status: 'approved',
      onboardingDate: '2023-08-20',
      lastOrderDate: '2025-05-28',
      totalOrders: 120,
      areaManager: 'Nidhi Shah',
      engagementScore: 92,
      billingPreference: 'credit',
      creditLimit: 100000
    }
  ]);

  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: '1',
      name: 'Dr. Ravi Sharma',
      qualification: 'BDS, MDS',
      specialization: 'Orthodontics',
      clinicId: '1',
      clinicName: 'Smile Care Dental Clinic',
      phone: '+91 98765 43210',
      email: 'dr.ravi@smilecare.com',
      status: 'active',
      registrationNumber: 'MH-DEN-12345',
      joinDate: '2024-01-15',
      lastLogin: '2025-06-04 10:30',
      totalOrders: 45,
      billingPreference: 'postpaid',
      paymentCategory: 'priority',
      creditLimit: 50000,
      outstandingAmount: 15000,
      preferredPaymentMethod: 'digital',
      autoApproval: true
    },
    {
      id: '2',
      name: 'Dr. Priya Patel',
      qualification: 'BDS',
      specialization: 'General Dentistry',
      clinicId: '2',
      clinicName: 'Advanced Dentistry Center',
      phone: '+91 87654 32109',
      email: 'dr.priya@advanceddent.com',
      status: 'active',
      registrationNumber: 'MH-DEN-67890',
      joinDate: '2025-06-01',
      lastLogin: '2025-06-04 09:15',
      totalOrders: 8,
      billingPreference: 'prepaid',
      paymentCategory: 'regular',
      outstandingAmount: 0,
      preferredPaymentMethod: 'cash',
      autoApproval: false
    },
    {
      id: '3',
      name: 'Dr. Amit Gupta',
      qualification: 'BDS, MDS, PhD',
      specialization: 'Prosthodontics',
      clinicId: '3',
      clinicName: 'Elite Dental Solutions',
      phone: '+91 76543 21098',
      email: 'dr.amit@elitedental.com',
      status: 'active',
      registrationNumber: 'MH-DEN-11111',
      joinDate: '2023-08-20',
      lastLogin: '2025-06-04 08:45',
      totalOrders: 120,
      billingPreference: 'credit',
      paymentCategory: 'vip',
      creditLimit: 100000,
      outstandingAmount: 25000,
      preferredPaymentMethod: 'mixed',
      autoApproval: true
    }
  ]);

  const filteredClinics = clinics.filter(clinic => {
    const matchesSearch = clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || clinic.status === statusFilter;
    const matchesCity = cityFilter === 'all' || clinic.city === cityFilter;

    return matchesSearch && matchesStatus && matchesCity;
  });

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.clinicName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doctor.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleApproveClinic = (clinicId: string) => {
    setClinics(clinics.map(clinic =>
      clinic.id === clinicId
        ? { ...clinic, status: 'approved' as const }
        : clinic
    ));
    toast({
      title: "Success",
      description: "Clinic approved successfully",
    });
  };

  const handleRejectClinic = (clinicId: string) => {
    setClinics(clinics.map(clinic =>
      clinic.id === clinicId
        ? { ...clinic, status: 'rejected' as const }
        : clinic
    ));
    toast({
      title: "Success",
      description: "Clinic rejected",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      case 'rejected':
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getEngagementBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">High</Badge>;
    if (score >= 50) return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
    if (score > 0) return <Badge className="bg-red-100 text-red-800">Low</Badge>;
    return <Badge variant="secondary">New</Badge>;
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'vip':
        return <Badge className="bg-purple-100 text-purple-800">VIP</Badge>;
      case 'priority':
        return <Badge className="bg-blue-100 text-blue-800">Priority</Badge>;
      case 'regular':
        return <Badge className="bg-gray-100 text-gray-800">Regular</Badge>;
      default:
        return <Badge variant="secondary">{category}</Badge>;
    }
  };

  const cities = [...new Set(clinics.map(clinic => clinic.city))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Building2 className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Clinic & Doctor Management</h2>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-600">Total Clinics</div>
            <div className="text-2xl font-bold">{clinics.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-600">Total Doctors</div>
            <div className="text-2xl font-bold">{doctors.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-600">Active Clinics</div>
            <div className="text-2xl font-bold text-green-600">
              {clinics.filter(c => c.status === 'approved').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-600">Outstanding Amount</div>
            <div className="text-2xl font-bold text-red-600">
              ₹{doctors.reduce((sum, d) => sum + d.outstandingAmount, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="clinics">Clinics</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
        </TabsList>

        {/* Clinics Tab */}
        <TabsContent value="clinics" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search clinics..."
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={cityFilter} onValueChange={setCityFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Clinic
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Clinics Table */}
          <Card>
            <CardHeader>
              <CardTitle>Clinics ({filteredClinics.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Clinic Details</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Area Manager</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClinics.map((clinic) => (
                    <TableRow key={clinic.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{clinic.name}</div>
                          <div className="text-sm text-gray-500">{clinic.contactPerson}</div>
                          <div className="text-xs text-gray-400 flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {clinic.city}, {clinic.state}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {clinic.phone}
                          </div>
                          <div className="text-sm flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {clinic.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(clinic.status)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{clinic.totalOrders}</div>
                          {clinic.lastOrderDate && (
                            <div className="text-xs text-gray-500">
                              Last: {clinic.lastOrderDate}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getEngagementBadge(clinic.engagementScore)}</TableCell>
                      <TableCell>{clinic.areaManager}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {clinic.status === 'pending' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleApproveClinic(clinic.id)}
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRejectClinic(clinic.id)}
                              >
                                <XCircle className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Doctors Tab */}
        <TabsContent value="doctors" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search doctors..."
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Doctor
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Doctors Table */}
          <Card>
            <CardHeader>
              <CardTitle>Doctors ({filteredDoctors.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor Details</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Clinic</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Outstanding</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDoctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{doctor.name}</div>
                          <div className="text-sm text-gray-500">{doctor.qualification}</div>
                          <div className="text-xs text-gray-400">{doctor.specialization}</div>
                          <div className="text-xs text-gray-400">Reg: {doctor.registrationNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {doctor.phone}
                          </div>
                          <div className="text-sm flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {doctor.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-1" />
                          <span className="text-sm">{doctor.clinicName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(doctor.status)}</TableCell>
                      <TableCell>{getCategoryBadge(doctor.paymentCategory)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{doctor.totalOrders}</div>
                          {doctor.lastLogin && (
                            <div className="text-xs text-gray-500">
                              Last: {doctor.lastLogin.split(' ')[0]}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`font-medium ${doctor.outstandingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ₹{doctor.outstandingAmount.toLocaleString()}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClinicManagementPage;
