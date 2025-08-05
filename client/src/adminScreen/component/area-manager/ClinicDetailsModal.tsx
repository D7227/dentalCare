
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Building, MapPin, Phone, Mail, Calendar, DollarSign, TrendingDown, Activity } from 'lucide-react';

interface ClinicDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clinic: {
    id: string;
    name: string;
    location: string;
    doctor: string;
    phone?: string;
    email?: string;
    status: string;
    lastOrder: string;
    engagement: string;
    monthlyOrders: number;
    pendingAmount: number;
  };
}

const ClinicDetailsModal = ({ isOpen, onClose, clinic }: ClinicDetailsModalProps) => {
  const orderHistory = [
    { id: 'ADE-2025-001', date: '2025-01-10', amount: 5000, status: 'completed' },
    { id: 'ADE-2025-015', date: '2025-01-05', amount: 3500, status: 'completed' },
    { id: 'ADE-2024-289', date: '2024-12-28', amount: 7200, status: 'completed' },
    { id: 'ADE-2024-265', date: '2024-12-20', amount: 2800, status: 'completed' }
  ];

  const engagementData = [
    { month: 'December 2024', orders: 8, amount: 42000 },
    { month: 'November 2024', orders: 6, amount: 31500 },
    { month: 'October 2024', orders: 12, amount: 68000 },
    { month: 'September 2024', orders: 15, amount: 89000 }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {clinic.name} - Detailed Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Clinic Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{clinic.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{clinic.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{clinic.phone || '+91 98765 43210'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{clinic.email || 'contact@clinic.com'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Performance Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <div className="text-2xl font-bold">{clinic.monthlyOrders}</div>
                  <div className="text-sm text-gray-600">Orders This Month</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-2xl font-bold">₹{clinic.pendingAmount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Pending Amount</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <Badge variant={clinic.engagement === 'high' ? 'default' : 'destructive'}>
                    {clinic.engagement} engagement
                  </Badge>
                  <div className="text-sm text-gray-600 mt-1">Engagement Level</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-sm font-medium">{clinic.lastOrder}</div>
                  <div className="text-sm text-gray-600">Last Order</div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Recent Orders */}
          <div>
            <h3 className="text-lg font-medium mb-4">Recent Order History</h3>
            <div className="space-y-2">
              {orderHistory.map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">{order.id}</span>
                    <span className="text-gray-500 ml-2">{order.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">₹{order.amount.toLocaleString()}</span>
                    <Badge variant="default">{order.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Engagement Trend */}
          <div>
            <h3 className="text-lg font-medium mb-4">Monthly Engagement Trend</h3>
            <div className="space-y-2">
              {engagementData.map(month => (
                <div key={month.month} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">{month.month}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="font-medium">{month.orders}</div>
                      <div className="text-xs text-gray-500">Orders</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">₹{month.amount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Revenue</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Visit
            </Button>
            <Button variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Call Clinic
            </Button>
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            <Button>
              <Activity className="h-4 w-4 mr-2" />
              Create Follow-up Task
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClinicDetailsModal;
