
import React, { useState } from 'react';
import BaseModal from '@/components/shared/BaseModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Order {
  id: string;
  patient: string;
  type: string;
  status: string;
}

interface PickupRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PickupRequestModal = ({ isOpen, onClose }: PickupRequestModalProps) => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Mock completed orders for pickup
  const completedOrders: Order[] = [
    { id: 'DL-2024-004', patient: 'Alice Johnson', type: 'Crown', status: 'Completed' },
    { id: 'DL-2024-005', patient: 'Bob Wilson', type: 'Bridge', status: 'Completed' },
    { id: 'DL-2024-006', patient: 'Carol Davis', type: 'Implant', status: 'Completed' },
  ];

  const handleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSubmit = () => {
    console.log('Pickup request submitted:', {
      selectedOrders,
      preferredDate,
      preferredTime,
      specialInstructions
    });
    // Reset form
    setSelectedOrders([]);
    setPreferredDate('');
    setPreferredTime('');
    setSpecialInstructions('');
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="New Pickup Request"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-4 block">Select Orders for Pickup</Label>
          <div className="space-y-3">
            {completedOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={order.id}
                    checked={selectedOrders.includes(order.id)}
                    onCheckedChange={() => handleOrderSelection(order.id)}
                  />
                  <div>
                    <span className="font-medium">{order.id}</span>
                    <span className="text-muted-foreground ml-2">- {order.patient} ({order.type})</span>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600">{order.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="preferred-date">Preferred Pickup Date *</Label>
            <Input
              id="preferred-date"
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              placeholder="dd-mm-yyyy"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferred-time">Preferred Time Slot *</Label>
            <Select value={preferredTime} onValueChange={setPreferredTime}>
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
          <Label htmlFor="special-instructions">Special Instructions (Optional)</Label>
          <Textarea
            id="special-instructions"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Any special pickup instructions..."
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
            disabled={selectedOrders.length === 0 || !preferredDate || !preferredTime}
          >
            Submit Pickup Request
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default PickupRequestModal;
