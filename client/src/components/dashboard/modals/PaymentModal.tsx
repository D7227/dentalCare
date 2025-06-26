
import React, { useState } from 'react';
import BaseModal from '@/components/shared/BaseModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal = ({ isOpen, onClose }: PaymentModalProps) => {
  const [amount, setAmount] = useState('12000');
  const [paymentMode, setPaymentMode] = useState('');

  const handleSubmit = () => {
    console.log('Payment submitted:', { amount, paymentMode });
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Pay Outstanding Dues"
      maxWidth="max-w-md"
    >
      <div className="form-stack">
        <div className="form-field">
          <Label htmlFor="amount">Amount (₹)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>
        
        <div className="form-field">
          <Label htmlFor="payment-mode">Payment Mode</Label>
          <Select value={paymentMode} onValueChange={setPaymentMode}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="icici">ICICI Gateway</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="card">Credit/Debit Card</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="modal-footer">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="default"
            disabled={!paymentMode}
          >
            Submit Payment
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default PaymentModal;
