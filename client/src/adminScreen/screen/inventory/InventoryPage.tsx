
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Plus, Check, X, Search, AlertTriangle, TrendingUp, FileText, Warehouse } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MaterialRequest {
  id: string;
  materialName: string;
  requestedBy: string;
  department: string;
  quantity: number;
  unit: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  requestDate: string;
  approvedBy?: string;
  urgency: 'low' | 'medium' | 'high';
}

interface MaterialUsage {
  id: string;
  technician: string;
  department: string;
  materialName: string;
  quantityUsed: number;
  unit: string;
  orderIds: string[];
  date: string;
  efficiency: number;
}

interface PurchaseOrder {
  id: string;
  supplier: string;
  materials: string[];
  totalAmount: number;
  status: 'draft' | 'sent' | 'confirmed' | 'delivered' | 'cancelled';
  orderDate: string;
  expectedDelivery: string;
  createdBy: string;
}

interface Material {
  id: string;
  name: string;
  code: string;
  category: string;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  costPerUnit: number;
  supplier: string;
  location: string;
  batchNumber: string;
  expiryDate: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired';
}

const InventoryPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('materials');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isNewPOOpen, setIsNewPOOpen] = useState(false);

  const [materials, setMaterials] = useState<Material[]>([
    {
      id: '1',
      name: 'Zirconia Blocks',
      code: 'ZIR001',
      category: 'Crown Material',
      unit: 'pieces',
      currentStock: 25,
      minStock: 10,
      maxStock: 100,
      costPerUnit: 150.00,
      supplier: 'DentalMart Pvt Ltd',
      location: 'A-1-15',
      batchNumber: 'ZIR2024001',
      expiryDate: '2026-12-31',
      status: 'in-stock'
    },
    {
      id: '2',
      name: 'Orthodontic Wire',
      code: 'ORW001',
      category: 'Orthodontics',
      unit: 'rolls',
      currentStock: 5,
      minStock: 10,
      maxStock: 50,
      costPerUnit: 85.00,
      supplier: 'Ortho Supplies India',
      location: 'B-2-08',
      batchNumber: 'ORW2024001',
      expiryDate: '2027-06-15',
      status: 'low-stock'
    }
  ]);

  const [materialRequests, setMaterialRequests] = useState<MaterialRequest[]>([
    {
      id: '1',
      materialName: 'Zirconia Blocks',
      requestedBy: 'Riya Patel',
      department: 'Crown & Bridge',
      quantity: 10,
      unit: 'pieces',
      reason: 'Stock running low for urgent orders',
      status: 'pending',
      requestDate: '2025-06-04',
      urgency: 'high'
    },
    {
      id: '2',
      materialName: 'Orthodontic Wire',
      requestedBy: 'Dr. Pooja Verma',
      department: 'Orthodontics',
      quantity: 5,
      unit: 'rolls',
      reason: 'New case requirements',
      status: 'approved',
      requestDate: '2025-06-03',
      approvedBy: 'Store Manager',
      urgency: 'medium'
    }
  ]);

  const [materialUsage] = useState<MaterialUsage[]>([
    {
      id: '1',
      technician: 'Riya Patel',
      department: 'Crown & Bridge',
      materialName: 'Zirconia Blocks',
      quantityUsed: 3,
      unit: 'pieces',
      orderIds: ['ADE-2025-034', 'ADE-2025-037'],
      date: '2025-06-04',
      efficiency: 95
    },
    {
      id: '2',
      technician: 'Anita Gupta',
      department: 'Orthodontics',
      materialName: 'Orthodontic Wire',
      quantityUsed: 2,
      unit: 'rolls',
      orderIds: ['ADE-2025-035'],
      date: '2025-06-03',
      efficiency: 88
    }
  ]);

  const [purchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: 'PO-2025-001',
      supplier: 'DentalMart Pvt Ltd',
      materials: ['Zirconia Blocks', 'Dental Wax'],
      totalAmount: 25000,
      status: 'sent',
      orderDate: '2025-06-04',
      expectedDelivery: '2025-06-10',
      createdBy: 'Store Manager'
    },
    {
      id: 'PO-2025-002',
      supplier: 'Ortho Supplies India',
      materials: ['Orthodontic Wire', 'Brackets'],
      totalAmount: 15000,
      status: 'confirmed',
      orderDate: '2025-06-02',
      expectedDelivery: '2025-06-08',
      createdBy: 'Admin'
    }
  ]);

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || material.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredRequests = materialRequests.filter(request => {
    const matchesSearch = request.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApproveRequest = (id: string) => {
    setMaterialRequests(prev => prev.map(req =>
      req.id === id ? { ...req, status: 'approved', approvedBy: 'Admin' } : req
    ));
  };

  const handleRejectRequest = (id: string) => {
    setMaterialRequests(prev => prev.map(req =>
      req.id === id ? { ...req, status: 'rejected', approvedBy: 'Admin' } : req
    ));
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'in-stock': 'bg-green-100 text-green-800',
      'low-stock': 'bg-yellow-100 text-yellow-800',
      'out-of-stock': 'bg-red-100 text-red-800',
      'expired': 'bg-gray-100 text-gray-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'fulfilled': 'bg-blue-100 text-blue-800',
      'draft': 'bg-gray-100 text-gray-800',
      'sent': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-green-100 text-green-800',
      'delivered': 'bg-purple-100 text-purple-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      'high': 'text-red-600 font-semibold',
      'medium': 'text-yellow-600 font-medium',
      'low': 'text-green-600 font-normal'
    };
    return colors[urgency as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Warehouse className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Inventory Management</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materials.length}</div>
            <p className="text-xs text-muted-foreground">Active items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {materialRequests.filter(r => r.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Need approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {materials.filter(m => m.status === 'low-stock').length}
            </div>
            <p className="text-xs text-muted-foreground">Need reordering</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active POs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {purchaseOrders.filter(po => po.status !== 'delivered' && po.status !== 'cancelled').length}
            </div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="purchase">Purchase Orders</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>

        {/* Materials Tab */}
        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Material Inventory</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Material
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search materials..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="low-stock">Low Stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Min/Max</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cost/Unit</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{material.name}</div>
                          <div className="text-sm text-gray-500">{material.code}</div>
                        </div>
                      </TableCell>
                      <TableCell>{material.category}</TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {material.currentStock} {material.unit}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {material.minStock} / {material.maxStock}
                        </div>
                      </TableCell>
                      <TableCell>{material.location}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(material.status)}`}>
                          {material.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>₹{material.costPerUnit}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Material Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Material Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="font-medium">{request.materialName}</div>
                        <div className="text-sm text-gray-600">{request.reason}</div>
                      </TableCell>
                      <TableCell>{request.requestedBy}</TableCell>
                      <TableCell>{request.department}</TableCell>
                      <TableCell>{request.quantity} {request.unit}</TableCell>
                      <TableCell>
                        <span className={getUrgencyColor(request.urgency)}>
                          {request.urgency.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(request.status)}`}>
                          {request.status.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>{request.requestDate}</TableCell>
                      <TableCell>
                        {request.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApproveRequest(request.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRejectRequest(request.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usage Tracking Tab */}
        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Material Usage Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Technician</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Quantity Used</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Efficiency</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materialUsage.map((usage) => (
                    <TableRow key={usage.id}>
                      <TableCell className="font-medium">{usage.technician}</TableCell>
                      <TableCell>{usage.department}</TableCell>
                      <TableCell>{usage.materialName}</TableCell>
                      <TableCell>{usage.quantityUsed} {usage.unit}</TableCell>
                      <TableCell>{usage.orderIds.join(', ')}</TableCell>
                      <TableCell>
                        <span className={usage.efficiency >= 90 ? 'text-green-600' : usage.efficiency >= 80 ? 'text-yellow-600' : 'text-red-600'}>
                          {usage.efficiency}%
                        </span>
                      </TableCell>
                      <TableCell>{usage.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Purchase Orders Tab */}
        <TabsContent value="purchase" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Purchase Orders</CardTitle>
                <Dialog open={isNewPOOpen} onOpenChange={setIsNewPOOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create PO
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Purchase Order</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Supplier</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select supplier" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dentalmart">DentalMart Pvt Ltd</SelectItem>
                            <SelectItem value="orthosupplies">Ortho Supplies India</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Materials</Label>
                        <Input placeholder="Select materials" />
                      </div>
                      <div>
                        <Label>Expected Delivery</Label>
                        <Input type="date" />
                      </div>
                      <Button onClick={() => setIsNewPOOpen(false)} className="w-full">
                        Create Purchase Order
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Materials</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Expected Delivery</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrders.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell className="font-medium">{po.id}</TableCell>
                      <TableCell>{po.supplier}</TableCell>
                      <TableCell>{po.materials.join(', ')}</TableCell>
                      <TableCell>₹{po.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(po.status)}`}>
                          {po.status.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>{po.orderDate}</TableCell>
                      <TableCell>{po.expectedDelivery}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Supplier Management</h3>
                <p className="text-gray-600 mb-4">
                  Manage supplier information and purchase relationships
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supplier
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryPage;
