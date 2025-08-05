
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Search, Plus, Eye, Edit, Clock, MapPin, User, CheckCircle, XCircle } from 'lucide-react';

interface ScanAppointment {
  id: string;
  clinic: string;
  doctor: string;
  caseId?: string;
  appointmentDate: string;
  timeSlot: string;
  duration: number; // in minutes
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
  areaManager: string;
  scanningAgent?: string;
  address: string;
  contactPerson: string;
  phone: string;
  scanType: 'impression' | 'bite_registration' | 'color_matching' | 'trial_fitting';
  equipmentRequired: string[];
  notes?: string;
  completedAt?: string;
  rescheduleReason?: string;
}

const ScanAppointmentPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [isScheduleAppointmentOpen, setIsScheduleAppointmentOpen] = useState(false);

  const [appointments, setAppointments] = useState<ScanAppointment[]>([
    {
      id: '1',
      clinic: 'Smile Care Dental',
      doctor: 'Dr. Pooja Verma',
      caseId: 'ADE-2025-034',
      appointmentDate: '2025-06-05',
      timeSlot: '10:00 AM - 11:00 AM',
      duration: 60,
      status: 'confirmed',
      areaManager: 'Nidhi Shah',
      scanningAgent: 'Scanning Agent - Mumbai West',
      address: '123 Main Street, Sector 15, Mumbai',
      contactPerson: 'Dr. Pooja Verma',
      phone: '+91 98765 43210',
      scanType: 'impression',
      equipmentRequired: ['Scanner Kit', 'Color Chart', 'Sterilization Kit'],
      notes: 'Patient prefers morning appointments'
    },
    {
      id: '2',
      clinic: 'Care Plus Dental',
      doctor: 'Dr. Sunita Shah',
      appointmentDate: '2025-06-06',
      timeSlot: '2:00 PM - 3:00 PM',
      duration: 60,
      status: 'scheduled',
      areaManager: 'Vikram Patel',
      address: '456 Park Avenue, Bandra West, Mumbai',
      contactPerson: 'Dr. Sunita Shah',
      phone: '+91 87654 32109',
      scanType: 'color_matching',
      equipmentRequired: ['Color Chart', 'Camera', 'Light Box'],
      notes: 'Anterior crown shade matching required'
    },
    {
      id: '3',
      clinic: 'Perfect Smile',
      doctor: 'Dr. Rajesh Patel',
      caseId: 'ADE-2025-036',
      appointmentDate: '2025-06-07',
      timeSlot: '4:00 PM - 5:30 PM',
      duration: 90,
      status: 'completed',
      areaManager: 'Nidhi Shah',
      scanningAgent: 'Scanning Agent - Mumbai Central',
      address: '789 Business District, Andheri, Mumbai',
      contactPerson: 'Dr. Rajesh Patel',
      phone: '+91 76543 21098',
      scanType: 'trial_fitting',
      equipmentRequired: ['Trial Kit', 'Adjustment Tools'],
      completedAt: '2025-06-07 17:15',
      notes: 'Trial denture fitting completed successfully'
    }
  ]);

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.clinic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (appointment.caseId && appointment.caseId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;

    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = appointment.appointmentDate === '2025-06-04';
    } else if (dateFilter === 'tomorrow') {
      matchesDate = appointment.appointmentDate === '2025-06-05';
    } else if (dateFilter === 'this_week') {
      // Simple week check for demo
      matchesDate = appointment.appointmentDate >= '2025-06-04' && appointment.appointmentDate <= '2025-06-10';
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-green-100 text-green-800',
      'in_progress': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-emerald-100 text-emerald-800',
      'cancelled': 'bg-red-100 text-red-800',
      'rescheduled': 'bg-purple-100 text-purple-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getScanTypeBadge = (scanType: string) => {
    const typeMap: { [key: string]: string } = {
      'impression': 'bg-indigo-100 text-indigo-800',
      'bite_registration': 'bg-orange-100 text-orange-800',
      'color_matching': 'bg-pink-100 text-pink-800',
      'trial_fitting': 'bg-teal-100 text-teal-800'
    };
    return typeMap[scanType] || 'bg-gray-100 text-gray-800';
  };

  const handleConfirmAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.map(appointment =>
      appointment.id === appointmentId
        ? { ...appointment, status: 'confirmed' as const }
        : appointment
    ));
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.map(appointment =>
      appointment.id === appointmentId
        ? { ...appointment, status: 'cancelled' as const }
        : appointment
    ));
  };

  const getStats = () => {
    const total = appointments.length;
    const today = appointments.filter(a => a.appointmentDate === '2025-06-04').length;
    const scheduled = appointments.filter(a => a.status === 'scheduled').length;
    const confirmed = appointments.filter(a => a.status === 'confirmed').length;
    const completed = appointments.filter(a => a.status === 'completed').length;

    return { total, today, scheduled, confirmed, completed };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Scan Appointment Management</h2>
        </div>

        <Button onClick={() => setIsScheduleAppointmentOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Appointment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Appointments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.today}</div>
            <div className="text-sm text-gray-600">Today's Appointments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
            <div className="text-sm text-gray-600">Scheduled</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search appointments..."
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
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="rescheduled">Rescheduled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="this_week">This Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Appointments ({filteredAppointments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Clinic & Doctor</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Scan Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{appointment.clinic}</div>
                      <div className="text-sm text-gray-600">{appointment.doctor}</div>
                      {appointment.caseId && (
                        <div className="text-xs font-mono text-gray-500">{appointment.caseId}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {appointment.appointmentDate}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {appointment.timeSlot}
                      </div>
                      <div className="text-xs text-gray-500">{appointment.duration} min</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScanTypeBadge(appointment.scanType)}`}>
                      {appointment.scanType.replace('_', ' ').toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(appointment.status)}`}>
                      {appointment.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{appointment.areaManager}</div>
                      {appointment.scanningAgent && (
                        <div className="text-xs text-gray-600">{appointment.scanningAgent}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{appointment.contactPerson}</div>
                      <div className="text-xs text-gray-600">{appointment.phone}</div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {appointment.address.split(',')[0]}
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
                      {appointment.status === 'scheduled' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleConfirmAppointment(appointment.id)}
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelAppointment(appointment.id)}
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

      {/* Schedule Appointment Modal */}
      <Dialog open={isScheduleAppointmentOpen} onOpenChange={setIsScheduleAppointmentOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clinic">Clinic</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select clinic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="smile_care">Smile Care Dental</SelectItem>
                  <SelectItem value="care_plus">Care Plus Dental</SelectItem>
                  <SelectItem value="perfect_smile">Perfect Smile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="doctor">Doctor</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dr_pooja">Dr. Pooja Verma</SelectItem>
                  <SelectItem value="dr_sunita">Dr. Sunita Shah</SelectItem>
                  <SelectItem value="dr_rajesh">Dr. Rajesh Patel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="appointmentDate">Date</Label>
              <Input id="appointmentDate" type="date" />
            </div>
            <div>
              <Label htmlFor="timeSlot">Time Slot</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00-10:00">9:00 AM - 10:00 AM</SelectItem>
                  <SelectItem value="10:00-11:00">10:00 AM - 11:00 AM</SelectItem>
                  <SelectItem value="11:00-12:00">11:00 AM - 12:00 PM</SelectItem>
                  <SelectItem value="14:00-15:00">2:00 PM - 3:00 PM</SelectItem>
                  <SelectItem value="15:00-16:00">3:00 PM - 4:00 PM</SelectItem>
                  <SelectItem value="16:00-17:00">4:00 PM - 5:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="scanType">Scan Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select scan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="impression">Impression</SelectItem>
                  <SelectItem value="bite_registration">Bite Registration</SelectItem>
                  <SelectItem value="color_matching">Color Matching</SelectItem>
                  <SelectItem value="trial_fitting">Trial Fitting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="areaManager">Area Manager</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select area manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nidhi_shah">Nidhi Shah</SelectItem>
                  <SelectItem value="vikram_patel">Vikram Patel</SelectItem>
                  <SelectItem value="rahul_kumar">Rahul Kumar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Button onClick={() => setIsScheduleAppointmentOpen(false)} className="w-full">
                Schedule Appointment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScanAppointmentPage;
