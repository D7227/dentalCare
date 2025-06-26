
import { useState } from 'react';

interface PaymentFlowOptions {
  orderId?: string;
  amount: string;
  onSuccess?: () => void;
}

export const usePaymentFlow = () => {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<PaymentFlowOptions | null>(null);

  const initiatePayment = (options: PaymentFlowOptions) => {
    setCurrentPayment(options);
    setPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setPaymentModalOpen(false);
    setCurrentPayment(null);
  };

  return {
    paymentModalOpen,
    currentPayment,
    initiatePayment,
    closePaymentModal,
  };
};
