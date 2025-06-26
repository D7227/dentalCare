
import React, { useState } from 'react';
import BaseModal from '@/components/shared/BaseModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import PaymentOptionModal from '@/components/shared/PaymentOptionModal';
import InvoiceDetailModal from '@/components/billing/InvoiceDetailModal';
import { usePaymentFlow } from '@/hooks/usePaymentFlow';

interface InvoiceListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InvoiceListModal = ({ isOpen, onClose }: InvoiceListModalProps) => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceDetailOpen, setInvoiceDetailOpen] = useState(false);
  
  const { paymentModalOpen, currentPayment, initiatePayment, closePaymentModal } = usePaymentFlow();

  const invoices = [
    { 
      id: 'INV-001', 
      amount: 5000, 
      date: 'May 28, 2024', 
      status: 'overdue',
      orderNumber: 'ORD-001',
      patient: 'John Doe',
      dueDate: 'May 28, 2024',
      totalAmount: 5000,
      paidAmount: 0,
      dueAmount: 5000
    },
    { 
      id: 'INV-002', 
      amount: 4000, 
      date: 'May 15, 2024', 
      status: 'pending',
      orderNumber: 'ORD-002',
      patient: 'Jane Smith',
      dueDate: 'May 30, 2024',
      totalAmount: 4000,
      paidAmount: 0,
      dueAmount: 4000
    },
    { 
      id: 'INV-003', 
      amount: 3000, 
      date: 'April 30, 2024', 
      status: 'pending',
      orderNumber: 'ORD-003',
      patient: 'Bob Johnson',
      dueDate: 'May 15, 2024',
      totalAmount: 3000,
      paidAmount: 0,
      dueAmount: 3000
    },
  ];

  const handleViewPDF = (invoice: any) => {
    console.log('Opening PDF for invoice:', invoice.id);
    // Create a blob URL for PDF simulation
    const pdfUrl = `data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVGl0bGUgKEludm9pY2UgJHtpbnZvaWNlLmlkfSkKL0NyZWF0b3IgKERlbnRhbCBDbGluaWMpCi9Qcm9kdWNlciAoRGVudGFsIENsaW5pYykKL0NyZWF0aW9uRGF0ZSAoRDoyMDI0MDUyOCkKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDMgMCBSCj4+CmVuZG9iago==`;
    
    // Open PDF in new tab
    window.open(pdfUrl, '_blank');
  };

  const handlePayInvoice = (invoice: any) => {
    console.log('Initiating payment for invoice:', invoice.id);
    initiatePayment({
      orderId: invoice.id,
      amount: `₹${invoice.amount.toLocaleString()}`,
    });
  };

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setInvoiceDetailOpen(true);
  };

  const handlePaySelected = () => {
    const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
    initiatePayment({
      orderId: 'MULTI-001',
      amount: `₹${totalAmount.toLocaleString()}`,
    });
  };

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="Pending Invoices"
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id} className="border border-border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">{invoice.id}</span>
                    <Badge 
                      variant={invoice.status === 'overdue' ? 'destructive' : 'secondary'}
                      className={invoice.status === 'overdue' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-muted-foreground">{invoice.date}</p>
                  <p className="text-xl font-bold">₹{invoice.amount.toLocaleString()}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleViewPDF(invoice)}
                    className="flex-1"
                  >
                    View PDF
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handlePayInvoice(invoice)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Pay
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button 
              onClick={handlePaySelected}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              Pay Selected
            </Button>
          </div>
        </div>
      </BaseModal>

      {/* Payment Modal */}
      {currentPayment && (
        <PaymentOptionModal
          isOpen={paymentModalOpen}
          onClose={closePaymentModal}
          orderId={currentPayment.orderId || ''}
          amount={currentPayment.amount}
        />
      )}

      {/* Invoice Detail Modal */}
      <InvoiceDetailModal
        isOpen={invoiceDetailOpen}
        onClose={() => setInvoiceDetailOpen(false)}
        invoice={selectedInvoice}
      />
    </>
  );
};

export default InvoiceListModal;
