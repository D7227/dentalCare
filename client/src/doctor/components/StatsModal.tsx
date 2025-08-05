
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';
import { Order } from '@/data/ordersData';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  orders: Order[];
}

const StatsModal = ({ isOpen, onClose, title, orders }: StatsModalProps) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'New': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      'In Progress': { bg: 'bg-blue-50 text-blue-700 border-blue-200' },
      'Trial Work Ready': { bg: 'bg-purple-50 text-purple-700 border-purple-200' },
      'Completed': { bg: 'bg-green-50 text-green-700 border-green-200' },
      'Rejected': { bg: 'bg-red-50 text-red-700 border-red-200' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      bg: 'bg-gray-50 text-gray-700 border-gray-200'
    };

    return (
      <Badge className={`${config.bg} border font-medium text-xs px-2 py-1 rounded-full`}>
        {status}
      </Badge>
    );
  };

  const getUrgencyBadge = (urgency?: string) => {
    switch (urgency) {
      case 'critical':
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200 border font-medium text-xs px-2 py-1 rounded-full">
            Critical
          </Badge>
        );
      case 'high':
        return (
          <Badge className="bg-orange-50 text-orange-700 border-orange-200 border font-medium text-xs px-2 py-1 rounded-full">
            High
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-50 text-gray-600 border-gray-200 border font-medium text-xs px-2 py-1 rounded-full">
            Standard
          </Badge>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No orders found for this category</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-gray-500" />
                        {order.patient}
                      </div>
                    </TableCell>
                    <TableCell>{order.type}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{getUrgencyBadge(order.urgency)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-500" />
                        {order.time ? `${order.time} - ${order.date}` : order.date}
                      </div>
                    </TableCell>
                    <TableCell>{order.dueDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatsModal;
