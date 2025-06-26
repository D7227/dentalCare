
import React, { useState } from 'react';
import { CreditCard, Banknote } from 'lucide-react';
import BaseModal from './BaseModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CashCollectionModal from '../billing/CashCollectionModal';

interface PaymentOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  amount: string;
}

const PaymentOptionModal = ({ isOpen, onClose, orderId, amount }: PaymentOptionModalProps) => {
  const [cashCollectionModalOpen, setCashCollectionModalOpen] = useState(false);

  const handleOnlinePayment = () => {
    console.log('Redirecting to ICICI payment gateway for order:', orderId);
    // Redirect to ICICI payment gateway
    window.open('https://www.icicibank.com/payment-gateway', '_blank');
    onClose();
  };

  const handleCashCollection = () => {
    setCashCollectionModalOpen(true);
    onClose();
  };

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title={`Payment for ${orderId}`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-lg font-semibold">Amount: {amount}</p>
            <p className="text-sm text-muted-foreground">Choose your payment method</p>
          </div>

          <div className="space-y-3">
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary" onClick={handleOnlinePayment}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Online Payment</h3>
                    <p className="text-sm text-muted-foreground">Pay securely via ICICI Gateway</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary" onClick={handleCashCollection}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Banknote className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Cash/Cheque Collection</h3>
                    <p className="text-sm text-muted-foreground">Request cash or cheque pickup</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </BaseModal>

      <CashCollectionModal
        isOpen={cashCollectionModalOpen}
        onClose={() => setCashCollectionModalOpen(false)}
        billId={orderId}
        amount={parseInt(amount.replace('₹', '').replace(',', ''))}
      />
    </>
  );
};

export default PaymentOptionModal;
