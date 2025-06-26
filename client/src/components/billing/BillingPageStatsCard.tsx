
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CircleDollarSign, FileText, CheckCircle, BarChart } from 'lucide-react';
import PaymentOptionModal from '@/components/shared/PaymentOptionModal';
import InvoiceListModal from '@/components/dashboard/modals/InvoiceListModal';
import PaymentReceiptModal from '@/components/dashboard/modals/PaymentReceiptModal';
import { usePaymentFlow } from '@/hooks/usePaymentFlow';
import { useOrders } from '@/hooks/shared/useOrders';

const BillingPageStatsCard = () => {
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  
  const { paymentModalOpen, currentPayment, initiatePayment, closePaymentModal } = usePaymentFlow();
  const { data: orders = [], isLoading } = useOrders();

  // Calculate real billing data
  const billingData = React.useMemo(() => {
    const outstandingOrders = orders.filter((order: any) => 
      order.paymentStatus === 'pending' || order.paymentStatus === 'partial'
    );
    
    const paidOrders = orders.filter((order: any) => order.paymentStatus === 'paid');
    
    const totalOutstanding = outstandingOrders.reduce((sum: number, order: any) => 
      sum + parseInt(order.outstandingAmount || '0'), 0
    );
    
    const lastPayment = paidOrders
      .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
    
    const lastPaymentAmount = lastPayment ? parseInt(lastPayment.paidAmount || '0') : 0;
    const lastPaymentDate = lastPayment ? new Date(lastPayment.updatedAt).toLocaleDateString() : 'No payments';

    // Calculate this month's billing summary
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthOrders = orders.filter((order: any) => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });
    
    const thisMonthBilled = thisMonthOrders.reduce((sum: number, order: any) => 
      sum + parseInt(order.totalAmount || '0'), 0
    );
    
    const thisMonthPaid = thisMonthOrders
      .filter((order: any) => order.paymentStatus === 'paid')
      .reduce((sum: number, order: any) => sum + parseInt(order.paidAmount || '0'), 0);

    return {
      totalOutstanding,
      pendingInvoicesCount: outstandingOrders.length,
      lastPaymentAmount,
      lastPaymentDate,
      thisMonthBilled,
      thisMonthPaid
    };
  }, [orders]);

  const handlePayNow = () => {
    initiatePayment({
      orderId: 'MULTI-001',
      amount: `₹${billingData.totalOutstanding.toLocaleString()}`,
    });
  };

  const billingCards = [
    {
      title: 'Total Due',
      value: `₹${billingData.totalOutstanding.toLocaleString()}`,
      subtext: `Due across ${billingData.pendingInvoicesCount} invoices`,
      icon: CircleDollarSign,
      cta: billingData.totalOutstanding > 0 ? 'Pay Now' : 'No dues',
      onClick: billingData.totalOutstanding > 0 ? handlePayNow : () => {},
      tooltip: 'Outstanding amount across all pending orders',
      ctaVariant: 'default' as const,
      disabled: billingData.totalOutstanding === 0
    },
    {
      title: 'Pending Invoices',
      value: billingData.pendingInvoicesCount.toString(),
      subtext: billingData.pendingInvoicesCount > 0 ? 'Awaiting payment' : 'All caught up!',
      icon: FileText,
      cta: 'View Invoices',
      onClick: () => setInvoiceModalOpen(true),
      ctaVariant: 'outline' as const
    },
    {
      title: 'Last Payment',
      value: billingData.lastPaymentAmount > 0 ? `₹${billingData.lastPaymentAmount.toLocaleString()}` : 'No payments',
      subtext: billingData.lastPaymentDate !== 'No payments' ? `Paid on ${billingData.lastPaymentDate}` : 'No payment history',
      icon: CheckCircle,
      cta: 'View Receipt',
      onClick: () => setReceiptModalOpen(true),
      ctaVariant: 'outline' as const,
      disabled: billingData.lastPaymentAmount === 0
    },
    {
      title: 'This Month Summary',
      value: `₹${billingData.thisMonthBilled.toLocaleString()} billed / ₹${billingData.thisMonthPaid.toLocaleString()} paid`,
      subtext: billingData.thisMonthBilled > 0 ? `${Math.round((billingData.thisMonthPaid / billingData.thisMonthBilled) * 100)}% collected` : 'No billing this month',
      icon: BarChart,
      cta: 'Download Statement',
      onClick: () => {
        console.log('Downloading billing statement...');
      },
      ctaVariant: 'outline' as const
    }
  ];

  const handleDownloadStatement = () => {
    console.log('Downloading billing statement...');
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Desktop Grid Layout - All 4 cards in one row */}
        <div className="hidden md:block">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {billingCards.map((card, index) => {
              const Icon = card.icon;
              const CardComponent = (
                <Card key={index} className="hover:shadow-lg transition-all duration-200 hover-lift border border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="text-primary" size={20} />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">{card.title}</h3>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-2xl font-bold text-foreground leading-tight">{card.value}</p>
                        {card.subtext && (
                          <p className="text-sm text-muted-foreground mt-1">{card.subtext}</p>
                        )}
                      </div>
                      
                      <Button 
                        onClick={card.onClick} 
                        variant={card.ctaVariant}
                        size="sm"
                        className="w-full"
                        disabled={card.disabled}
                      >
                        {card.cta}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );

              return card.tooltip ? (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    {CardComponent}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{card.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ) : CardComponent;
            })}
          </div>
        </div>

        {/* Mobile Compact List */}
        <div className="md:hidden space-y-3">
          <Card className="border border-border">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CircleDollarSign size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Outstanding: ₹{billingData.totalOutstanding.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{billingData.pendingInvoicesCount} Invoices</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={handlePayNow} 
                    className="btn-primary"
                    disabled={billingData.totalOutstanding === 0}
                  >
                    {billingData.totalOutstanding > 0 ? 'Pay' : 'Paid'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CheckCircle size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Last Paid: {billingData.lastPaymentAmount > 0 ? `₹${billingData.lastPaymentAmount.toLocaleString()}` : 'None'}
                      </p>
                      <p className="text-xs text-muted-foreground">{billingData.lastPaymentDate}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setReceiptModalOpen(true)}
                    disabled={billingData.lastPaymentAmount === 0}
                  >
                    Receipt
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{billingData.pendingInvoicesCount} Invoices Pending</p>
                      <p className="text-xs text-muted-foreground">
                        {billingData.pendingInvoicesCount > 0 ? 'Awaiting payment' : 'All caught up!'}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setInvoiceModalOpen(true)}>
                    View
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <BarChart size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        ₹{(billingData.thisMonthBilled / 1000).toFixed(0)}K billed / ₹{(billingData.thisMonthPaid / 1000).toFixed(0)}K paid
                      </p>
                      <p className="text-xs text-muted-foreground">This Month</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleDownloadStatement}>
                    Download
                  </Button>
                </div>
              </div>
              
              <Button className="w-full mt-4 btn-primary">
                View All Billing Details
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Modals */}
        {currentPayment && (
          <PaymentOptionModal
            isOpen={paymentModalOpen}
            onClose={closePaymentModal}
            orderId={currentPayment.orderId || ''}
            amount={currentPayment.amount}
          />
        )}
        <InvoiceListModal 
          isOpen={invoiceModalOpen} 
          onClose={() => setInvoiceModalOpen(false)} 
        />
        <PaymentReceiptModal 
          isOpen={receiptModalOpen} 
          onClose={() => setReceiptModalOpen(false)} 
        />
      </div>
    </TooltipProvider>
  );
};

export default BillingPageStatsCard;
