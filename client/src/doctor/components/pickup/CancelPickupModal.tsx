
import React, { useState } from 'react';
import BaseModal from '@/components/shared/BaseModal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle } from 'lucide-react';

interface CancelPickupModalProps {
  isOpen: boolean;
  onClose: () => void;
  pickupRequestId: string | null;
}

const CancelPickupModal = ({ isOpen, onClose, pickupRequestId }: CancelPickupModalProps) => {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    console.log('Pickup cancelled:', {
      pickupRequestId,
      reason
    });
    setReason('');
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Cancel Pickup Request"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          <div className="text-sm">
            <p className="font-medium text-yellow-800 dark:text-yellow-200">Are you sure?</p>
            <p className="text-yellow-700 dark:text-yellow-300">
              This will cancel pickup request: <span className="font-medium">{pickupRequestId}</span>
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cancel-reason">Reason for Cancellation (Optional)</Label>
          <Textarea
            id="cancel-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why are you cancelling this pickup request?"
            rows={3}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Keep Request
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="destructive"
            className="flex-1"
          >
            Cancel Pickup
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default CancelPickupModal;
