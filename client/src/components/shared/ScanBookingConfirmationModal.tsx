
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import BaseModal from './BaseModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface ScanBookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bookingData: any) => void;
}

const ScanBookingConfirmationModal = ({ isOpen, onClose, onConfirm }: ScanBookingConfirmationModalProps) => {
  const [bookingData, setBookingData] = useState({
    patientName: '',
    date: '',
    time: '',
    scanType: '',
    address: '',
    notes: ''
  });

  const handleSubmit = () => {
    onConfirm(bookingData);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Book Scan Appointment"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="patient-name">Patient Name</Label>
          <Input
            id="patient-name"
            value={bookingData.patientName}
            onChange={(e) => setBookingData(prev => ({ ...prev, patientName: e.target.value }))}
            placeholder="Enter patient name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="scan-date">Date</Label>
            <Input
              id="scan-date"
              type="date"
              value={bookingData.date}
              onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="scan-time">Time</Label>
            <Input
              id="scan-time"
              type="time"
              value={bookingData.time}
              onChange={(e) => setBookingData(prev => ({ ...prev, time: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="scan-type">Scan Type</Label>
          <Select value={bookingData.scanType} onValueChange={(value) => setBookingData(prev => ({ ...prev, scanType: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select scan type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-arch">Full Arch Scan</SelectItem>
              <SelectItem value="impression">Impression Scan</SelectItem>
              <SelectItem value="bite-registration">Bite Registration</SelectItem>
              <SelectItem value="prep-scan">Prep Scan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Clinic Address</Label>
          <Textarea
            id="address"
            value={bookingData.address}
            onChange={(e) => setBookingData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="Enter clinic address"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={bookingData.notes}
            onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Any special instructions"
            rows={2}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="flex-1 bg-[#11AB93] hover:bg-[#11AB93]/90"
            disabled={!bookingData.patientName || !bookingData.date || !bookingData.time || !bookingData.scanType}
          >
            Confirm Booking
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ScanBookingConfirmationModal;
