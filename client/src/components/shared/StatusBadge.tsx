
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertTriangle, XCircle, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'icon' | 'detailed';
  className?: string;
}

const StatusBadge = ({ status, variant = 'default', className }: StatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-800 border-green-200',
          text: 'Completed'
        };
      case 'in progress':
        return {
          icon: Clock,
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          text: 'In Progress'
        };
      case 'trial work ready':
        return {
          icon: Package,
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          text: 'Trial Ready'
        };
      case 'trial ready':
        return {
          icon: Package,
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          text: 'Trial Ready'
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          text: 'Pending'
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'bg-red-100 text-red-800 border-red-200',
          text: 'Rejected'
        };
      default:
        return {
          icon: AlertTriangle,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          text: status
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  if (variant === 'icon') {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        <Icon size={16} className={config.color.split(' ')[1]} />
      </div>
    );
  }

  return (
    <Badge className={cn(config.color, 'font-medium px-3 py-1 flex items-center gap-1', className)}>
      {variant === 'detailed' && <Icon size={14} />}
      {config.text}
    </Badge>
  );
};

export default StatusBadge;
