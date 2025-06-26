
import React from 'react';
import BaseModal from '@/components/shared/BaseModal';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface PaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentReceiptModal = ({ isOpen, onClose }: PaymentReceiptModalProps) => {
  const handleDownload = () => {
    console.log('Downloading receipt...');
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Receipt"
      maxWidth="max-w-md"
    >
      <div className="receipt-container">
        <Card className="receipt-details">
          <div className="receipt-row">
            <span className="receipt-label">Receipt #:</span>
            <span className="receipt-value">RCP-2024-001</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Amount:</span>
            <span className="receipt-value">₹15,000</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Date:</span>
            <span className="receipt-value">May 28, 2024</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Method:</span>
            <span className="receipt-value">ICICI Gateway</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Transaction ID:</span>
            <span className="receipt-value">TXN123456789</span>
          </div>
        </Card>

        <div className="modal-footer">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleDownload} variant="default">
            <Download size={16} />
            Download
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default PaymentReceiptModal;
