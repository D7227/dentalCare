
import React from 'react';
import BaseModal from '@/components/shared/BaseModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Printer } from 'lucide-react';

interface InvoiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: any;
}

const InvoiceDetailModal = ({ isOpen, onClose, invoice }: InvoiceDetailModalProps) => {
  if (!invoice) return null;

  const handleDownload = () => {
    console.log('Downloading invoice:', invoice.id);
    // Implement download logic
  };

  const handlePrint = () => {
    console.log('Printing invoice:', invoice.id);
    window.print();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Invoice ${invoice.id}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Invoice Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{invoice.id}</h3>
            <p className="text-sm text-muted-foreground">
              Order: {invoice.orderNumber} - {invoice.patient}
            </p>
          </div>
          <Badge className={invoice.status === 'overdue' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}>
            {invoice.status === 'overdue' ? 'Overdue' : 'Unpaid'}
          </Badge>
        </div>

        {/* Invoice Details */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Invoice Date</p>
                <p className="font-semibold">{invoice.dueDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-semibold">{invoice.dueDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Patient</p>
                <p className="font-semibold">{invoice.patient}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-semibold">{invoice.orderNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amount Details */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-semibold">₹{invoice.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Paid Amount:</span>
                <span className="font-semibold">₹{invoice.paidAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-red-600 text-lg">
                <span>Due Amount:</span>
                <span className="font-bold">₹{invoice.dueAmount.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Close
          </Button>
          <Button onClick={handlePrint} variant="outline">
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
          <Button onClick={handleDownload} variant="outline">
            <Download className="h-4 w-4 mr-1" />
            Download PDF
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default InvoiceDetailModal;
