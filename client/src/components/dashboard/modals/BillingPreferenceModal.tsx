
import React, { useState } from 'react';
import BaseModal from '@/components/shared/BaseModal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BillingPreferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BillingPreferenceModal = ({ isOpen, onClose }: BillingPreferenceModalProps) => {
  const [preference, setPreference] = useState('icici');

  const handleSave = () => {
    console.log('Saving preference:', preference);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Billing Preference"
      maxWidth="max-w-md"
    >
      <div className="form-stack">
        <div className="form-field">
          <Label htmlFor="payment-preference">Payment Method</Label>
          <Select value={preference} onValueChange={setPreference}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="icici">ICICI Bank Gateway</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="card">Credit/Debit Card</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="cheque">Cheque</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="modal-footer">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="default">
            Save
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default BillingPreferenceModal;
