
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Search, Upload, Check, Percent, Eye, Download } from 'lucide-react';

interface Payment {
  id: string;
  clinic: string;
  doctor: string;
  caseId: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'partial' | 'overdue';
  method: 'cash' | 'cheque' | 'bank_transfer' | 'upi' | 'card';
  dueDate: string;
  paidDate?: string;
  receiptUrl?: string;
  notes?: string;
}

const PaymentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [isUploadReceiptOpen, setIsUploadReceiptOpen] = useState(false);
  const [isApplyDiscountOpen, setIsApplyDiscountOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      clinic: 'Smile Care Dental',
      doctor: 'Dr. Pooja Verma',
      caseId: 'ADE-2025-034',
      amount: 12400,
      status: 'unpaid',
      method: 'cheque',
      dueDate: '2025-06-10',
      notes: 'Awaiting cheque clearance'
    },
    {
      id: '2',
      clinic: 'Care Plus Dental',
      doctor: 'Dr. Sunita Shah',
      caseId: 'ADE-2025-035',
      amount: 7250,
      status: 'paid',
      method: 'bank_transfer',
      dueDate: '2025-06-05',
      paidDate: '2025-06-03',
      receiptUrl: '/receipts/payment-2.pdf'
    },
    {
      id: '3',
      clinic: 'Perfect Smile',
      doctor: 'Dr. Rajesh Patel',
      caseId: 'ADE-2025-036',
      amount: 15800,
      status: 'partial',
      method: 'cash',
      dueDate: '2025-06-08',
      paidDate: '2025-06-04',
      notes: 'Received ₹10,000, balance ₹5,800 pending'
    },
    {
      id: '4',
      clinic: 'Bright Smile',
      doctor: 'Dr. Sanjay Trivedi',
      caseId: 'ADE-2025-037',
      amount: 9500,
      status: 'overdue',
      method: 'upi',
      dueDate: '2025-06-02',
      notes: 'Payment overdue by 2 days'
    },
    {
      id: '5',
      clinic: 'Modern Dentistry',
      doctor: 'Dr. Kavita Desai',
      caseId: 'ADE-2025-038',
      amount: 18200,
      status: 'paid',
      method: 'card',
      dueDate: '2025-06-06',
      paidDate: '2025-06-05',
      receiptUrl: '/receipts/payment-5.pdf'
    },
    {
      id: '6',
      clinic: 'Dental Care Center',
      doctor: 'Dr. Manish Agarwal',
      caseId: 'ADE-2025-039',
      amount: 6800,
      status: 'unpaid',
      method: 'bank_transfer',
      dueDate: '2025-06-12',
      notes: 'New invoice sent'
    },
    {
      id: '7',
      clinic: 'Elite Dental',
      doctor: 'Dr. Priya Jain',
      caseId: 'ADE-2025-040',
      amount: 22400,
      status: 'paid',
      method: 'cheque',
      dueDate: '2025-06-04',
      paidDate: '2025-06-04',
      receiptUrl: '/receipts/payment-7.pdf'
    },
    {
      id: '8',
      clinic: 'Smile Plus',
      doctor: 'Dr. Rohit Mehta',
      caseId: 'ADE-2025-041',
      amount: 11200,
      status: 'partial',
      method: 'cash',
      dueDate: '2025-06-09',
      paidDate: '2025-06-06',
      notes: 'Received ₹8,000, balance ₹3,200 pending'
    }
  ]);

  const [discountForm, setDiscountForm] = useState({
    percentage: '',
    reason: '',
    approvedBy: ''
  });

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.clinic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.caseId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'paid': 'bg-green-100 text-green-800',
      'unpaid': 'bg-red-100 text-red-800',
      'partial': 'bg-yellow-100 text-yellow-800',
      'overdue': 'bg-orange-100 text-orange-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getMethodBadge = (method: string) => {
    const methodMap: { [key: string]: string } = {
      'cash': 'bg-gray-100 text-gray-800',
      'cheque': 'bg-blue-100 text-blue-800',
      'bank_transfer': 'bg-purple-100 text-purple-800',
      'upi': 'bg-green-100 text-green-800',
      'card': 'bg-indigo-100 text-indigo-800'
    };
    return methodMap[method] || 'bg-gray-100 text-gray-800';
  };

  const handleMarkReceived = (paymentId: string) => {
    setPayments(prev => prev.map(payment =>
      payment.id === paymentId
        ? { ...payment, status: 'paid', paidDate: new Date().toISOString().split('T')[0] }
        : payment
    ));
  };

  const handleUploadReceipt = (paymentId: string) => {
    setSelectedPayment(payments.find(p => p.id === paymentId) || null);
    setIsUploadReceiptOpen(true);
  };

  const handleApplyDiscount = (paymentId: string) => {
    setSelectedPayment(payments.find(p => p.id === paymentId) || null);
    setIsApplyDiscountOpen(true);
  };

  const getTotalStats = () => {
    const total = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const paid = payments.filter(p => p.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
    const pending = payments.filter(p => p.status === 'unpaid' || p.status === 'partial').reduce((sum, payment) => sum + payment.amount, 0);
    const overdue = payments.filter(p => p.status === 'overdue').reduce((sum, payment) => sum + payment.amount, 0);

    return { total, paid, pending, overdue };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <CreditCard className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Payments Management</h2>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">₹{(stats.total / 1000).toFixed(1)}K</div>
            <div className="text-sm text-gray-600">Total Amount</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">₹{(stats.paid / 1000).toFixed(1)}K</div>
            <div className="text-sm text-gray-600">Collected</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">₹{(stats.pending / 1000).toFixed(1)}K</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">₹{(stats.overdue / 1000).toFixed(1)}K</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search clinic, doctor, case..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>

            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="card">Card</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Records ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Clinic & Doctor</TableHead>
                <TableHead>Case ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Paid Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className="font-medium">{payment.clinic}</div>
                    <div className="text-sm text-gray-600">{payment.doctor}</div>
                  </TableCell>
                  <TableCell className="font-mono">{payment.caseId}</TableCell>
                  <TableCell className="font-semibold">₹{payment.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(payment.status)}`}>
                      {payment.status.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMethodBadge(payment.method)}`}>
                      {payment.method.replace('_', ' ').toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className={payment.dueDate < '2025-06-04' && payment.status !== 'paid' ? 'text-red-600 font-semibold' : ''}>
                      {payment.dueDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    {payment.paidDate ? (
                      <div className="text-green-600">{payment.paidDate}</div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {payment.status !== 'paid' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkReceived(payment.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUploadReceipt(payment.id)}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApplyDiscount(payment.id)}
                      >
                        <Percent className="h-4 w-4" />
                      </Button>
                      {payment.receiptUrl && (
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Upload Receipt Modal */}
      <Dialog open={isUploadReceiptOpen} onOpenChange={setIsUploadReceiptOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Payment Receipt</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Payment Details</Label>
              <div className="text-sm text-gray-600">
                {selectedPayment?.clinic} - {selectedPayment?.caseId} - ₹{selectedPayment?.amount?.toLocaleString()}
              </div>
            </div>
            <div>
              <Label htmlFor="receipt">Receipt File</Label>
              <Input id="receipt" type="file" accept=".pdf,.jpg,.png" />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" placeholder="Add payment notes..." />
            </div>
            <Button onClick={() => setIsUploadReceiptOpen(false)} className="w-full">
              Upload Receipt
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Apply Discount Modal */}
      <Dialog open={isApplyDiscountOpen} onOpenChange={setIsApplyDiscountOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply Discount</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Payment Details</Label>
              <div className="text-sm text-gray-600">
                {selectedPayment?.clinic} - {selectedPayment?.caseId} - ₹{selectedPayment?.amount?.toLocaleString()}
              </div>
            </div>
            <div>
              <Label htmlFor="percentage">Discount Percentage</Label>
              <Input
                id="percentage"
                type="number"
                value={discountForm.percentage}
                onChange={(e) => setDiscountForm({ ...discountForm, percentage: e.target.value })}
                placeholder="Enter discount percentage"
              />
            </div>
            <div>
              <Label htmlFor="reason">Reason for Discount</Label>
              <Input
                id="reason"
                value={discountForm.reason}
                onChange={(e) => setDiscountForm({ ...discountForm, reason: e.target.value })}
                placeholder="Enter reason for discount"
              />
            </div>
            <div>
              <Label htmlFor="approvedBy">Approved By</Label>
              <Input
                id="approvedBy"
                value={discountForm.approvedBy}
                onChange={(e) => setDiscountForm({ ...discountForm, approvedBy: e.target.value })}
                placeholder="Enter approver name"
              />
            </div>
            <Button onClick={() => setIsApplyDiscountOpen(false)} className="w-full">
              Apply Discount
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentsPage;
