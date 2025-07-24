
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Plus, Search, Eye, Edit, Clock, CheckCircle } from 'lucide-react';

interface Accessory {
  id: string;
  caseId: string;
  clinic: string;
  doctor: string;
  accessoryType: 'bite_block' | 'tray' | 'mock_up' | 'other';
  accessoryName: string;
  owner: 'doctor' | 'lab';
  status: 'received' | 'in_use' | 'returned' | 'lost' | 'replaced';
  receivedDate: string;
  returnedDate?: string;
  condition: 'good' | 'fair' | 'poor' | 'damaged';
  usedByTechnician?: string;
  notes?: string;
  replacement?: {
    replacedWith: string;
    reason: string;
  };
}

const AccessoryManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [isAddAccessoryOpen, setIsAddAccessoryOpen] = useState(false);

  const [accessories, setAccessories] = useState<Accessory[]>([
    {
      id: '1',
      caseId: 'ADE-2025-034',
      clinic: 'Smile Care Dental',
      doctor: 'Dr. Pooja Verma',
      accessoryType: 'bite_block',
      accessoryName: 'Silicon Bite Block - Medium',
      owner: 'doctor',
      status: 'returned',
      receivedDate: '2025-06-01',
      returnedDate: '2025-06-03',
      condition: 'good',
      usedByTechnician: 'Rahul Sharma',
      notes: 'Used for crown impression, returned in good condition'
    },
    {
      id: '2',
      caseId: 'ADE-2025-035',
      clinic: 'Care Plus Dental',
      doctor: 'Dr. Sunita Shah',
      accessoryType: 'tray',
      accessoryName: 'Impression Tray - Large',
      owner: 'doctor',
      status: 'lost',
      receivedDate: '2025-06-02',
      condition: 'good',
      usedByTechnician: 'Priya Patel',
      notes: 'Tray was damaged during processing',
      replacement: {
        replacedWith: 'Lab Standard Tray - Large',
        reason: 'Original tray damaged beyond repair'
      }
    },
    {
      id: '3',
      caseId: 'ADE-2025-036',
      clinic: 'Perfect Smile',
      doctor: 'Dr. Rajesh Patel',
      accessoryType: 'mock_up',
      accessoryName: 'Acrylic Mock-up Template',
      owner: 'lab',
      status: 'in_use',
      receivedDate: '2025-06-03',
      condition: 'good',
      usedByTechnician: 'Amit Kumar',
      notes: 'Currently being used for denture trial'
    }
  ]);

  const filteredAccessories = accessories.filter(accessory => {
    const matchesSearch = accessory.clinic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accessory.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accessory.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accessory.accessoryName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || accessory.status === statusFilter;
    const matchesOwner = ownerFilter === 'all' || accessory.owner === ownerFilter;

    return matchesSearch && matchesStatus && matchesOwner;
  });

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'received': 'bg-blue-100 text-blue-800',
      'in_use': 'bg-yellow-100 text-yellow-800',
      'returned': 'bg-green-100 text-green-800',
      'lost': 'bg-red-100 text-red-800',
      'replaced': 'bg-purple-100 text-purple-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getOwnerBadge = (owner: string) => {
    return owner === 'doctor'
      ? 'bg-indigo-100 text-indigo-800'
      : 'bg-orange-100 text-orange-800';
  };

  const getStats = () => {
    const total = accessories.length;
    const doctorOwned = accessories.filter(a => a.owner === 'doctor').length;
    const labOwned = accessories.filter(a => a.owner === 'lab').length;
    const inUse = accessories.filter(a => a.status === 'in_use').length;
    const lost = accessories.filter(a => a.status === 'lost').length;

    return { total, doctorOwned, labOwned, inUse, lost };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Package className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Accessory Management</h2>
        </div>

        <Button onClick={() => setIsAddAccessoryOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Accessory
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Accessories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-indigo-600">{stats.doctorOwned}</div>
            <div className="text-sm text-gray-600">Doctor Owned</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.labOwned}</div>
            <div className="text-sm text-gray-600">Lab Owned</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.inUse}</div>
            <div className="text-sm text-gray-600">In Use</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.lost}</div>
            <div className="text-sm text-gray-600">Lost/Damaged</div>
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
                placeholder="Search accessories..."
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
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="in_use">In Use</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
                <SelectItem value="replaced">Replaced</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ownerFilter} onValueChange={setOwnerFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by owner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Owners</SelectItem>
                <SelectItem value="doctor">Doctor Owned</SelectItem>
                <SelectItem value="lab">Lab Owned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Accessories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Accessories ({filteredAccessories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case & Clinic</TableHead>
                <TableHead>Accessory Details</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccessories.map((accessory) => (
                <TableRow key={accessory.id}>
                  <TableCell>
                    <div>
                      <div className="font-mono text-sm">{accessory.caseId}</div>
                      <div className="font-medium">{accessory.clinic}</div>
                      <div className="text-sm text-gray-600">{accessory.doctor}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{accessory.accessoryName}</div>
                      <div className="text-sm text-gray-600 capitalize">
                        {accessory.accessoryType.replace('_', ' ')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOwnerBadge(accessory.owner)}`}>
                      {accessory.owner.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(accessory.status)}`}>
                      {accessory.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${accessory.condition === 'good' ? 'bg-green-100 text-green-800' :
                      accessory.condition === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                      {accessory.condition.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{accessory.usedByTechnician || '-'}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Received: {accessory.receivedDate}</div>
                      {accessory.returnedDate && (
                        <div>Returned: {accessory.returnedDate}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Accessory Modal */}
      <Dialog open={isAddAccessoryOpen} onOpenChange={setIsAddAccessoryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Accessory</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="caseId">Case ID</Label>
              <Input id="caseId" placeholder="Enter case ID" />
            </div>
            <div>
              <Label htmlFor="accessoryType">Accessory Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bite_block">Bite Block</SelectItem>
                  <SelectItem value="tray">Tray</SelectItem>
                  <SelectItem value="mock_up">Mock-up</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="accessoryName">Accessory Name</Label>
              <Input id="accessoryName" placeholder="Enter accessory name" />
            </div>
            <div>
              <Label htmlFor="owner">Owner</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="lab">Lab</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setIsAddAccessoryOpen(false)} className="w-full">
              Add Accessory
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccessoryManagementPage;
