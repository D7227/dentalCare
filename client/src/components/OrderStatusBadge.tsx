import React from 'react';
import { Badge } from '@/components/ui/badge';

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

const OrderStatusBadge = ({ status, className }: OrderStatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    const statusMap: Record<string, { label: string; variant: any; className?: string }> = {
      pending: { 
        label: 'Pending', 
        variant: 'outline',
        className: 'border-amber-300 text-amber-700 bg-amber-50'
      },
      in_progress: { 
        label: 'In Progress', 
        variant: 'default',
        className: 'bg-blue-500 text-white'
      },
      trial_ready: { 
        label: 'Trial Ready', 
        variant: 'secondary',
        className: 'bg-purple-100 text-purple-700 border-purple-300'
      },
      completed: { 
        label: 'Completed', 
        variant: 'default',
        className: 'bg-green-500 text-white'
      },
      delivered: { 
        label: 'Delivered', 
        variant: 'default',
        className: 'bg-emerald-600 text-white'
      },
      rejected: {
        label: 'Rejected',
        variant: 'destructive',
        className: 'bg-red-100 text-red-700 border-red-300'
      },
      cancelled: {
        label: 'Cancelled',
        variant: 'outline',
        className: 'border-gray-300 text-gray-600 bg-gray-50'
      }
    };
    
    return statusMap[status.toLowerCase()] || { 
      label: status.charAt(0).toUpperCase() + status.slice(1), 
      variant: 'outline',
      className: 'border-gray-300 text-gray-600 bg-gray-50'
    };
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      variant={config.variant} 
      className={`text-xs font-medium ${config.className} ${className || ''}`}
    >
      {config.label}
    </Badge>
  );
};

export default OrderStatusBadge;