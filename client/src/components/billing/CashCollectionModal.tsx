
import React, { useState } from 'react';
import BaseModal from '@/components/shared/BaseModal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

interface CashCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  billId: string;
  amount: number;
}

const CashCollectionModal = ({ isOpen, onClose, billId, amount }: CashCollectionModalProps) => {
  const [collectionTime, setCollectionTime] = useState<'before' | 'after'>('before');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!date || !timeSlot) {
      toast({
        title: "Missing Information",
        description: "Please select date and time slot.",
        variant: "destructive"
      });
      return;
    }

    console.log('Cash collection request:', {
      billId,
      amount,
      collectionTime,
      date,
      timeSlot,
      notes
    });

    toast({
      title: "Collection Request Submitted",
      description: `Field agent will collect ₹${amount.toLocaleString()} ${collectionTime} work hours on ${date}.`,
    });

    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Cash/Cheque Collection"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Amount Display */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#11AB93]/10">
                <DollarSign className="h-5 w-5 text-[#11AB93]" />
              </div>
              <div>
                <p className="text-lg font-semibold">Collection Amount: ₹{amount.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Bill ID: {billId}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Collection Time Preference */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Collection Time Preference</Label>
          <RadioGroup 
            value={collectionTime} 
            onValueChange={(value: 'before' | 'after') => setCollectionTime(value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="before" id="before" />
              <Label htmlFor="before" className="text-sm cursor-pointer">
                Before Work Hours (8:00 AM - 10:00 AM)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="after" id="after" />
              <Label htmlFor="after" className="text-sm cursor-pointer">
                After Work Hours (6:00 PM - 8:00 PM)
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Date and Time Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="collection-date">Preferred Date</Label>
            <Input
              id="collection-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              placeholder="dd-mm-yyyy"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time-slot">Time Slot</Label>
            <select
              id="time-slot"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select Time</option>
              {collectionTime === 'before' ? (
                <>
                  <option value="8:00-8:30">8:00 AM - 8:30 AM</option>
                  <option value="8:30-9:00">8:30 AM - 9:00 AM</option>
                  <option value="9:00-9:30">9:00 AM - 9:30 AM</option>
                  <option value="9:30-10:00">9:30 AM - 10:00 AM</option>
                </>
              ) : (
                <>
                  <option value="6:00-6:30">6:00 PM - 6:30 PM</option>
                  <option value="6:30-7:00">6:30 PM - 7:00 PM</option>
                  <option value="7:00-7:30">7:00 PM - 7:30 PM</option>
                  <option value="7:30-8:00">7:30 PM - 8:00 PM</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Special Instructions */}
        <div className="space-y-2">
          <Label htmlFor="collection-notes">Special Instructions (Optional)</Label>
          <Textarea
            id="collection-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special instructions for the field agent..."
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="flex-1 bg-[#11AB93] hover:bg-[#0f9b84]"
          >
            Submit Request
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default CashCollectionModal;
