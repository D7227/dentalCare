
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package } from 'lucide-react';

interface MaterialUsageModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string | null;
}

interface MaterialUsage {
  id: string;
  materialName: string;
  quantity: number;
  unit: string;
  batchNumber: string;
  expiryDate: string;
  supplier: string;
  costPerUnit: number;
  totalCost: number;
}

const MaterialUsageModal: React.FC<MaterialUsageModalProps> = ({ isOpen, onClose, orderId }) => {
  const [materialUsage] = useState<MaterialUsage[]>([
    {
      id: '1',
      materialName: 'Dental Ceramic',
      quantity: 15,
      unit: 'grams',
      batchNumber: 'BAT001',
      expiryDate: '2025-12-31',
      supplier: 'DentalCorp',
      costPerUnit: 25.50,
      totalCost: 382.50
    },
    {
      id: '2',
      materialName: 'Gold Alloy',
      quantity: 2,
      unit: 'grams',
      batchNumber: 'BAT002',
      expiryDate: '2026-06-15',
      supplier: 'MetalSupply Inc',
      costPerUnit: 45.00,
      totalCost: 90.00
    }
  ]);

  if (!orderId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Material Usage - Order #{orderId}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Material Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Materials Used</label>
                  <div className="text-2xl font-bold">{materialUsage.length}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Cost</label>
                  <div className="text-2xl font-bold text-green-600">
                    ${materialUsage.reduce((sum, item) => sum + item.totalCost, 0).toFixed(2)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Order Status</label>
                  <Badge variant="default" className="bg-blue-100 text-blue-800">In Production</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <div className="font-medium">Today, 2:30 PM</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Material Usage Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Material Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Batch Number</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Cost/Unit</TableHead>
                    <TableHead>Total Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materialUsage.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">{material.materialName}</TableCell>
                      <TableCell>
                        {material.quantity} {material.unit}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{material.batchNumber}</Badge>
                      </TableCell>
                      <TableCell>{material.expiryDate}</TableCell>
                      <TableCell>{material.supplier}</TableCell>
                      <TableCell>${material.costPerUnit}</TableCell>
                      <TableCell className="font-bold text-green-600">
                        ${material.totalCost.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialUsageModal;
