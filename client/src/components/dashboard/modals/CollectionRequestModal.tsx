
import React, { useState } from 'react';
import BaseModal from '@/components/shared/BaseModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CollectionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CollectionRequestModal = ({ isOpen, onClose }: CollectionRequestModalProps) => {
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    console.log('Collection request submitted:', { address, date, time, notes });
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Collection"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pickup-address">Pickup Address</Label>
          <Textarea
            id="pickup-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter pickup address"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pickup-date">Date</Label>
            <Input
              id="pickup-date"
              type="date"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pickup-time">Time</Label>
            <Input
              id="pickup-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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
            disabled={!address || !date || !time}
          >
            Submit Request
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default CollectionRequestModal;
