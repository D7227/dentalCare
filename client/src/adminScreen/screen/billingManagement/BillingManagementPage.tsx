
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CreditCard, Search, Plus, Eye, Edit, IndianRupee, User, Calendar, AlertCircle } from 'lucide-react';

interface BillingRecord {
  id: string;
  clinic: string;
  doctor: string;
  caseId: string;
  amount: number;
  paymentCategory: 'prepaid' | 'postpaid' | 'credit';
  paymentMethod: 'digital' | 'cash' | 'cheque' | 'bank_transfer';
  status: 'pending' | 'paid' | 'overdue' | 'partial' | 'cancelled';
  dueDate: string;
  paidDate?: string;
  collectionAssignedTo?: string;
  gatewayTransactionId?: string;
  iciciReference?: string;
  fieldAgentId?: string;
  depositProof?: string;
  notes?: string;
}

const BillingManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAssignCollectionOpen, setIsAssignCollectionOpen] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState<BillingRecord | null>(null);

  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([
    {
      id: '1',
      clinic: 'Smile Care Dental',
      doctor: 'Dr. Pooja Verma',
      caseId: 'ADE-2025-034',
      amount: 12400,
      paymentCategory: 'postpaid',
      paymentMethod: 'digital',
      status: 'paid',
      dueDate: '2025-06-10',
      paidDate: '2025-06-08',
      gatewayTransactionId: 'ICICI_TXN_123456',
      iciciReference: 'ICR_987654321',
      notes: 'Payment completed via ICICI gateway'
    },
    {
      id: '2',
      clinic: 'Care Plus Dental',
      doctor: 'Dr. Sunita Shah',
      caseId: 'ADE-2025-035',
      amount: 7250,
      paymentCategory: 'prepaid',
      paymentMethod: 'cash',
      status: 'pending',
      dueDate: '2025-06-05',
      collectionAssignedTo: 'Field Agent - Rahul Kumar',
      fieldAgentId: 'FA001',
      notes: 'Cash collection assigned to field agent'
    },
    {
      id: '3',
      clinic: 'Perfect Smile',
      doctor: 'Dr. Rajesh Patel',
      caseId: 'ADE-2025-036',
      amount: 15800,
      paymentCategory: 'credit',
      paymentMethod: 'cheque',
      status: 'overdue',
      dueDate: '2025-06-02',
      collectionAssignedTo: 'Field Agent - Priya Singh',
      fieldAgentId: 'FA002',
      notes: 'Cheque collection overdue by 2 days'
    }
  ]);

  const filteredRecords = billingRecords.filter(record => {
    const matchesSearch = record.clinic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.caseId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || record.paymentCategory === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'paid': 'bg-green-100 text-green-800',
      'overdue': 'bg-red-100 text-red-800',
      'partial': 'bg-orange-100 text-orange-800',
      'cancelled': 'bg-gray-100 text-gray-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryBadge = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'prepaid': 'bg-blue-100 text-blue-800',
      'postpaid': 'bg-purple-100 text-purple-800',
      'credit': 'bg-indigo-100 text-indigo-800'
    };
    return categoryMap[category] || 'bg-gray-100 text-gray-800';
  };

  const handleAssignCollection = (recordId: string) => {
    setSelectedBilling(billingRecords.find(r => r.id === recordId) || null);
    setIsAssignCollectionOpen(true);
  };

  const getStats = () => {
    const total = billingRecords.reduce((sum, record) => sum + record.amount, 0);
    const paid = billingRecords.filter(r => r.status === 'paid').reduce((sum, record) => sum + record.amount, 0);
    const pending = billingRecords.filter(r => r.status === 'pending').reduce((sum, record) => sum + record.amount, 0);
    const overdue = billingRecords.filter(r => r.status === 'overdue').reduce((sum, record) => sum + record.amount, 0);
    const digital = billingRecords.filter(r => r.paymentMethod === 'digital').length;

    return { total, paid, pending, overdue, digital };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <CreditCard className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Billing Management</h2>
        </div>

        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">₹{(stats.total / 1000).toFixed(1)}K</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
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
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.digital}</div>
            <div className="text-sm text-gray-600">Digital Payments</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search billing records..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="prepaid">Prepaid</SelectItem>
                <SelectItem value="postpaid">Postpaid</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Billing Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Records ({filteredRecords.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Clinic & Doctor</TableHead>
                <TableHead>Case Details</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Collection Info</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{record.clinic}</div>
                      <div className="text-sm text-gray-600">{record.doctor}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-mono text-sm">{record.caseId}</div>
                      <div className="text-xs text-gray-500">Due: {record.dueDate}</div>
                      {record.paidDate && (
                        <div className="text-xs text-green-600">Paid: {record.paidDate}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">₹{record.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadge(record.paymentCategory)}`}>
                      {record.paymentCategory.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(record.status)}`}>
                      {record.status.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="capitalize">{record.paymentMethod.replace('_', ' ')}</div>
                      {record.gatewayTransactionId && (
                        <div className="text-xs text-gray-500">TXN: {record.gatewayTransactionId}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {record.collectionAssignedTo ? (
                      <div className="text-sm">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {record.collectionAssignedTo}
                        </div>
                        <div className="text-xs text-gray-500">ID: {record.fieldAgentId}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {(record.paymentMethod === 'cash' || record.paymentMethod === 'cheque') &&
                        record.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAssignCollection(record.id)}
                          >
                            <User className="h-4 w-4" />
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

      {/* Assign Collection Modal */}
      <Dialog open={isAssignCollectionOpen} onOpenChange={setIsAssignCollectionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Collection Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Billing Details</Label>
              <div className="text-sm text-gray-600">
                {selectedBilling?.clinic} - {selectedBilling?.caseId} - ₹{selectedBilling?.amount?.toLocaleString()}
              </div>
            </div>
            <div>
              <Label htmlFor="fieldAgent">Field Agent</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select field agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FA001">Rahul Kumar (FA001)</SelectItem>
                  <SelectItem value="FA002">Priya Singh (FA002)</SelectItem>
                  <SelectItem value="FA003">Amit Sharma (FA003)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">Instructions</Label>
              <Textarea id="notes" placeholder="Special instructions for collection..." />
            </div>
            <Button onClick={() => setIsAssignCollectionOpen(false)} className="w-full">
              Assign Collection Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BillingManagementPage;
