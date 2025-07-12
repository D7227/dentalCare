
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  FileText, 
  CheckCircle, 
  Clock,
  CreditCard,
  Download,
  Eye
} from 'lucide-react';
import CashCollectionModal from './CashCollectionModal';
import InvoiceDetailModal from './InvoiceDetailModal';
import { DoctorInfo } from '../shared/DoctorInfo';
import { ToothSummary } from '../shared/ToothSummary';
import BillingPageStatsCard from './BillingPageStatsCard';
import { useOrders } from '../../hooks/shared/useOrders';
import BillingOverview from '../dashboard/BillingOverview';

const BillingContent = () => {
  const [activeTab, setActiveTab] = useState('outstanding');
  const [cashCollectionModalOpen, setCashCollectionModalOpen] = useState(false);
  const [selectedBillForCollection, setSelectedBillForCollection] = useState<any>(null);
  const [invoiceDetailModalOpen, setInvoiceDetailModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const { data: orders = [], isLoading } = useOrders();

  // Filter and calculate billing statistics from orders
  const billingData = useMemo(() => {
    const outstandingOrders = orders.filter((order: any) => 
      order.paymentStatus === 'pending' || order.paymentStatus === 'partial'
    );
    
    const overdueOrders = orders.filter((order: any) => 
      order.paymentStatus === 'pending' && order.dueDate && new Date(order.dueDate) < new Date()
    );
    
    const thisMonthPaidOrders = orders.filter((order: any) => {
      const orderDate = new Date(order.updatedAt);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      return order.paymentStatus === 'paid' && 
             orderDate.getMonth() === currentMonth && 
             orderDate.getFullYear() === currentYear;
    });

    const totalOutstanding = outstandingOrders.reduce((sum: number, order: any) => 
      sum + parseInt(order.outstandingAmount || '0'), 0
    );
    
    const thisMonthPaid = thisMonthPaidOrders.reduce((sum: number, order: any) => 
      sum + parseInt(order.paidAmount || '0'), 0
    );

    return {
      outstandingOrders,
      overdueOrders,
      thisMonthPaidOrders,
      totalOutstanding,
      thisMonthPaid
    };
  }, [orders]);

  const billingStats = [
    {
      title: 'Total Outstanding',
      amount: `₹${billingData.totalOutstanding.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800'
    },
    {
      title: 'Overdue Bills',
      amount: billingData.overdueOrders.length.toString(),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800'
    },
    {
      title: 'This Month Paid',
      amount: `₹${billingData.thisMonthPaid.toLocaleString()}`,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800'
    }
  ];

  // Convert outstanding orders to billing format
  const outstandingBills = billingData.outstandingOrders.map((order: any) => ({
    id: `INV-${order.id}`,
    orderNumber: order.orderId,
    patient: `${order.patient?.firstName || ''} ${order.patient?.lastName || ''}`.trim(),
    totalAmount: parseInt(order.totalAmount || '0'),
    paidAmount: parseInt(order.paidAmount || '0'),
    dueAmount: parseInt(order.outstandingAmount || '0'),
    dueDate: order.dueDate || new Date().toISOString().split('T')[0],
    status: new Date(order.dueDate || Date.now()) < new Date() ? 'overdue' : 'unpaid'
  }));

  const handlePayNow = (bill: any) => {
    console.log('Redirecting to ICICI payment gateway for order:', bill.id);
    // Redirect to ICICI payment gateway
    window.open('https://www.icicibank.com/payment-gateway', '_blank');
  };

  const handleRequestCashCollection = (bill: any) => {
    setSelectedBillForCollection(bill);
    setCashCollectionModalOpen(true);
  };

  const handleViewInvoice = (bill: any) => {
    setSelectedInvoice(bill);
    setInvoiceDetailModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unpaid':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Unpaid</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Overdue</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
    }
  };

  const tabs = [
    { id: 'outstanding', label: 'Outstanding Bills', count: 2 },
    { id: 'history', label: 'Payment History', count: null },
    { id: 'all', label: 'All Bills', count: null }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Billing & Payments</h1>
          <p className="page-subtitle">Manage your invoices and payment history</p>
        </div>
      </div> */}

      {/* Billing Page Stats */}
      {/* <BillingPageStatsCard /> */}
      <BillingOverview />

      {/* Tabs and Content */}
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {tab.label}
                {tab.count && (
                  <Badge className="bg-red-100 text-red-800 border-red-200 text-xs rounded-full w-5 h-5 flex items-center justify-center p-0">
                    {tab.count}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-4">
          {activeTab === 'outstanding' && (
            <div className="space-y-4">
              {outstandingBills.map((bill) => (
                <div
                  key={bill.id}
                  className={`border rounded-lg p-4 ${
                    bill.status === 'overdue' 
                      ? 'border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-900/10' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{bill.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        Order: {bill.orderNumber} - {bill.patient}
                      </p>
                    </div>
                    <Badge className={bill.status === 'overdue' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}>
                      {bill.status === 'overdue' ? 'Overdue' : 'Unpaid'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Amount</p>
                      <p className="font-semibold">₹{bill.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Paid Amount</p>
                      <p className="font-semibold">₹{bill.paidAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Due Amount</p>
                      <p className="font-semibold text-red-600">₹{bill.dueAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Due Date</p>
                      <p className="font-semibold">{bill.dueDate}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="btn-pay-now"
                      onClick={() => handlePayNow(bill)}
                    >
                      <CreditCard className="h-4 w-4 mr-1" />
                      Pay Now - ₹{bill.dueAmount.toLocaleString()}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="btn-outline"
                      onClick={() => handleRequestCashCollection(bill)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Request Cash Collection
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="btn-ghost"
                      onClick={() => handleViewInvoice(bill)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Invoice
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab !== 'outstanding' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No data available</h3>
              <p className="text-sm text-muted-foreground">
                {activeTab === 'history' ? 'No payment history found' : 'No bills found'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <CashCollectionModal
        isOpen={cashCollectionModalOpen}
        onClose={() => {
          setCashCollectionModalOpen(false);
          setSelectedBillForCollection(null);
        }}
        billId={selectedBillForCollection?.id || ''}
        amount={selectedBillForCollection?.dueAmount || 0}
      />

      <InvoiceDetailModal
        isOpen={invoiceDetailModalOpen}
        onClose={() => {
          setInvoiceDetailModalOpen(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
      />
    </div>
  );
};

export default BillingContent;
