
import { ArrowRight, Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OrderStatusBadgeProps {
  status: string;
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'New':
        return { 
          className: 'bg-gray-100 text-gray-800 border-gray-200', 
          icon: Clock 
        };
      case 'In Progress':
        return { 
          className: 'bg-blue-100 text-blue-800 border-blue-200', 
          icon: ArrowRight 
        };
      case 'Trial Work Ready':
      case 'Trial Ready':
        return { 
          className: 'bg-purple-100 text-purple-800 border-purple-200', 
          icon: Package 
        };
      case 'Completed':
        return { 
          className: 'bg-green-100 text-green-800 border-green-200', 
          icon: CheckCircle 
        };
      case 'Rejected':
        return { 
          className: 'bg-red-100 text-red-800 border-red-200', 
          icon: XCircle 
        };
      default:
        return { 
          className: 'bg-gray-100 text-gray-800 border-gray-200', 
          icon: Clock 
        };
    }
  };
  
  const config = getStatusConfig(status);
  const Icon = config.icon;
  
  // Display "Trial Ready" instead of "Trial Work Ready"
  const displayStatus = status === 'Trial Work Ready' ? 'Trial Ready' : status;
  
  return (
    <Badge className={`${config.className} border flex items-center gap-1 px-3 py-1 rounded-full font-medium text-xs`}>
      <Icon size={12} />
      {displayStatus}
    </Badge>
  );
};

export default OrderStatusBadge;
