
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const ScanBookingContent = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');

  // Mock data for previous scan bookings
  const previousBookings = [
    {
      id: 'SCAN-001',
      patient: 'John Smith',
      type: 'Full Arch Scan',
      date: '2024-01-15',
      time: '10:00 AM',
      status: 'Completed',
      areaManager: 'Sarah Johnson'
    },
    {
      id: 'SCAN-002',
      patient: 'Mary Johnson',
      type: 'Impression Scan',
      date: '2024-01-18',
      time: '2:00 PM',
      status: 'Scheduled',
      areaManager: 'John Smith'
    },
    {
      id: 'SCAN-003',
      patient: 'Robert Brown',
      type: 'Bite Registration',
      date: '2024-01-12',
      time: '4:30 PM',
      status: 'Completed',
      areaManager: 'Mike Wilson'
    },
    {
      id: 'SCAN-004',
      patient: 'Lisa Davis',
      type: 'Full Arch Scan',
      date: '2024-01-10',
      time: '11:00 AM',
      status: 'Cancelled',
      areaManager: 'Sarah Johnson'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submitted:', {
      date: selectedDate,
      time: selectedTime,
      notes
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'Scheduled':
        return 'secondary';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Request New Scan</h1>
          <p className="text-muted-foreground">Schedule a scan appointment for your patients</p>
        </div>
      </div>

      {/* Booking Form */}
      <Card className="card clinical-shadow max-w-4xl">
        <CardHeader className="card-header">
          <CardTitle className="card-title flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Scan Appointment Booking
          </CardTitle>
        </CardHeader>
        <CardContent className="card-content">
          <form onSubmit={handleSubmit} className="form-stack">
            <div className="form-grid">
              <div className="form-field">
                <Label htmlFor="area-manager" className="form-label">
                  Area Manager <span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger className="input-field">
                    <SelectValue placeholder="Select area manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager1">John Smith</SelectItem>
                    <SelectItem value="manager2">Sarah Johnson</SelectItem>
                    <SelectItem value="manager3">Mike Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="form-field">
                <Label htmlFor="scan-date" className="form-label">
                  Scan Date <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="scan-date"
                  type="date" 
                  className="input-field"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div className="form-field">
                <Label htmlFor="time-slot" className="form-label">
                  Time Slot <span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger className="input-field">
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">09:00 AM - 10:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM - 11:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM - 12:00 PM</SelectItem>
                    <SelectItem value="14:00">02:00 PM - 03:00 PM</SelectItem>
                    <SelectItem value="15:00">03:00 PM - 04:00 PM</SelectItem>
                    <SelectItem value="16:00">04:00 PM - 05:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="form-field">
              <Label htmlFor="notes" className="form-label">
                Notes (Optional)
              </Label>
              <Textarea 
                id="notes"
                placeholder="Any special scan requirements..."
                className="input-field resize-none"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Information Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Scan Appointment Details:
              </h3>
              <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                <li className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Our technician will visit your clinic at the scheduled time
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Please ensure the patient is available during the appointment
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Confirmation will be sent via email and SMS
                </li>
              </ul>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="btn-primary">
                Book Scan Appointment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Previous Scan Bookings Table */}
      <Card className="card">
        <CardHeader className="card-header">
          <CardTitle className="card-title">Previous Scan Bookings</CardTitle>
        </CardHeader>
        <CardContent className="card-content">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Scan Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Area Manager</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previousBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>{booking.patient}</TableCell>
                  <TableCell>{booking.type}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell>{booking.areaManager}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(booking.status)}>
                      {booking.status}
                    </Badge>
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

export default ScanBookingContent;
