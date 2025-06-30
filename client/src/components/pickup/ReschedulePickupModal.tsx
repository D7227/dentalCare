
import React, { useState } from 'react';
import BaseModal from '@/components/shared/BaseModal';
import { Button } from '@/components/ui/button';
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

interface ReschedulePickupModalProps {
  isOpen: boolean;
  onClose: () => void;
  pickupRequestId: string | null;
}

const ReschedulePickupModal = ({ isOpen, onClose, pickupRequestId }: ReschedulePickupModalProps) => {
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    console.log('Pickup rescheduled:', {
      pickupRequestId,
      newDate,
      newTime,
      reason
    });
    // Reset form
    setNewDate('');
    setNewTime('');
    setReason('');
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Reschedule Pickup"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Reschedule pickup request: <span className="font-medium">{pickupRequestId}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="new-date">New Date *</Label>
            <Input
              id="new-date"
              type="date"
              value={newDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-time">New Time Slot *</Label>
            <Select value={newTime} onValueChange={setNewTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="09:00-11:00">09:00 AM - 11:00 AM</SelectItem>
                <SelectItem value="11:00-13:00">11:00 AM - 01:00 PM</SelectItem>
                <SelectItem value="13:00-15:00">01:00 PM - 03:00 PM</SelectItem>
                <SelectItem value="15:00-17:00">03:00 PM - 05:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Reason for Reschedule (Optional)</Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why do you need to reschedule?"
            rows={3}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="flex-1 bg-[#11AB93] hover:bg-[#11AB93]/90"
            disabled={!newDate || !newTime}
          >
            Reschedule
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ReschedulePickupModal;
