
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock } from 'lucide-react';

interface ScheduleScanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleScanModal = ({ isOpen, onClose }: ScheduleScanModalProps) => {
  const [formData, setFormData] = useState({
    clinic: '',
    doctor: '',
    patientName: '',
    patientPhone: '',
    caseType: '',
    scanType: '',
    appointmentDate: '',
    appointmentTime: '',
    duration: '60',
    notes: ''
  });

  const clinics = [
    { id: '1', name: 'Smile Dental Clinic', doctor: 'Dr. Pooja Verma' },
    { id: '2', name: 'Perfect Smile', doctor: 'Dr. Rajesh Patel' },
    { id: '3', name: 'Care Dental', doctor: 'Dr. Sneha Kumar' }
  ];

  const scanTypes = [
    'Intraoral Scan',
    'Impression Scan',
    'Bite Registration',
    'Full Arch Scan',
    'Partial Scan'
  ];

  const caseTypes = [
    'Crown',
    'Bridge',
    'Implant',
    'Orthodontic',
    'Denture',
    'Veneer'
  ];

  const handleSubmit = () => {
    console.log('Scheduling scan appointment:', formData);
    // Here you would typically send the data to your backend
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Scan Appointment
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Clinic *</Label>
            <Select value={formData.clinic} onValueChange={(value) => {
              const clinic = clinics.find(c => c.id === value);
              setFormData({
                ...formData,
                clinic: value,
                doctor: clinic?.doctor || ''
              });
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select clinic" />
              </SelectTrigger>
              <SelectContent>
                {clinics.map(clinic => (
                  <SelectItem key={clinic.id} value={clinic.id}>{clinic.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Doctor</Label>
            <Input value={formData.doctor} readOnly className="bg-gray-50" />
          </div>

          <div>
            <Label>Patient Name *</Label>
            <Input
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              placeholder="Patient full name"
            />
          </div>

          <div>
            <Label>Patient Phone</Label>
            <Input
              value={formData.patientPhone}
              onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
              placeholder="+91 XXXXX XXXXX"
            />
          </div>

          <div>
            <Label>Case Type *</Label>
            <Select value={formData.caseType} onValueChange={(value) => setFormData({ ...formData, caseType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select case type" />
              </SelectTrigger>
              <SelectContent>
                {caseTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Scan Type *</Label>
            <Select value={formData.scanType} onValueChange={(value) => setFormData({ ...formData, scanType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select scan type" />
              </SelectTrigger>
              <SelectContent>
                {scanTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Appointment Date *</Label>
            <Input
              type="date"
              value={formData.appointmentDate}
              onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
            />
          </div>

          <div>
            <Label>Appointment Time *</Label>
            <Input
              type="time"
              value={formData.appointmentTime}
              onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
            />
          </div>

          <div>
            <Label>Duration (minutes)</Label>
            <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
                <SelectItem value="120">120 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Notes</Label>
          <Textarea
            placeholder="Any special requirements or notes..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={2}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Schedule Appointment</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleScanModal;
