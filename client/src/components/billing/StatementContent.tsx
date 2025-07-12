
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Filter, CreditCard } from 'lucide-react';
import { useOrders } from '../../hooks/shared/useOrders';
import PaymentOptionModal from '../shared/PaymentOptionModal';

const StatementContent = ({ onBack }: { onBack: () => void }) => {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const { data: orders = [] } = useOrders();

  // Calculate financial data
  const financialData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const financialYearStart = `01-04-${currentYear}`;
    const financialYearEnd = `19-06-${currentYear + 1}`;

    // Calculate total due
    const totalDue = orders
      .filter(order => order.paymentStatus === 'pending' || order.paymentStatus === 'partial')
      .reduce((sum, order) => sum + parseInt(order.outstandingAmount || '0'), 0);

    // Generate transaction history
    const transactions = [
      {
        id: 1,
        type: 'Opening Balance',
        label: 'Dr',
        amount: 665170.00,
        date: '18-06-2025',
        paymentId: null,
        invoiceId: null,
        category: 'balance'
      },
      {
        id: 2,
        type: 'Payment',
        label: 'Cr',
        amount: 400000.00,
        date: '16-06-2025',
        paymentId: '01234',
        invoiceId: null,
        category: 'payment'
      },
      {
        id: 3,
        type: 'Invoice',
        label: 'Cr',
        amount: 400000.00,
        date: '18-06-2025',
        paymentId: null,
        invoiceId: '01777',
        category: 'invoice'
      },
      {
        id: 4,
        type: 'Payment',
        label: 'Cr',
        amount: 400000.00,
        date: '16-06-2025',
        paymentId: '01234',
        invoiceId: null,
        category: 'payment'
      },
      {
        id: 5,
        type: 'Payment',
        label: 'Cr',
        amount: 400000.00,
        date: '16-06-2025',
        paymentId: '01234',
        invoiceId: null,
        category: 'payment'
      },
      {
        id: 6,
        type: 'Invoice',
        label: 'Cr',
        amount: 400000.00,
        date: '18-06-2025',
        paymentId: null,
        invoiceId: '01777',
        category: 'invoice'
      }
    ];

    return {
      financialYearStart,
      financialYearEnd,
      totalDue: totalDue || 35000, // Fallback to image value
      transactions
    };
  }, [orders]);

  const handlePayNow = () => {
    setPaymentModalOpen(true);
  };

  const getBadgeVariant = (category: string) => {
    switch (category) {
      case 'balance':
        return 'secondary';
      case 'payment':
        return 'default';
      case 'invoice':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getBadgeColor = (category: string) => {
    switch (category) {
      case 'balance':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'payment':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'invoice':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Statement</h1>
        </div>
        <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 rounded-full">
          <Filter className="h-5 w-5" />
        </Button>
      </div>

      {/* Financial Year Info */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Current Financial Year: {financialData.financialYearStart} to {financialData.financialYearEnd}
        </p>
      </div>

      {/* Total Due Card */}
      <Card className="mb-6 border-red-200 bg-red-50/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Due</p>
                <p className="text-2xl font-bold text-red-600">
                  ₹{financialData.totalDue.toLocaleString()}
                </p>
              </div>
            </div>
            <Button
              onClick={handlePayNow}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Pay
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <div className="space-y-3">
        {financialData.transactions.map((transaction) => (
          <Card key={transaction.id} className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getBadgeColor(transaction.category)}>
                      {transaction.type}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    {transaction.paymentId && (
                      <p className="text-sm text-gray-600">
                        Payment ID: {transaction.paymentId}
                      </p>
                    )}
                    {transaction.invoiceId && (
                      <p className="text-sm text-gray-600">
                        Invoice ID: {transaction.invoiceId}
                      </p>
                    )}
                    <p className="text-sm font-medium text-gray-700">
                      {transaction.label} {transaction.amount.toLocaleString()}.00
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900 mb-1">
                    ₹{(transaction.amount / 100 * 166.5175).toLocaleString()}.00
                  </p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Modal */}
      <PaymentOptionModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        orderId="STATEMENT-001"
        amount={`₹${financialData.totalDue.toLocaleString()}`}
      />
    </div>
  );
};

export default StatementContent;