import React from 'react';
import { Calendar, Truck, Receipt, MessageSquare, ChartLine } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppSelector, hasPermission } from '@/store/hooks';

interface QuickActionsCardProps {
  onSectionChange?: (section: string) => void;
  onScanBooking?: () => void;
}

const QuickActionsCard = ({ onSectionChange, onScanBooking }: QuickActionsCardProps) => {
  const UserData = useAppSelector((state) => state.userData);
  const user = UserData.userData;

  const handleQuickAction = (section: string) => {
    if (section === 'appointments' && onScanBooking) {
      onScanBooking();
    } else if (onSectionChange) {
      onSectionChange(section);
    }
  };

  const quickActions = [
    { 
      id: 'appointments', 
      label: 'Book Scan', 
      icon: Calendar,
      permission: 'scan_booking'
    },
    { 
      id: 'pickup', 
      label: 'Request Pickup', 
      icon: Truck,
      permission: 'pickup_requests'
    },
    { 
      id: 'billing', 
      label: 'View Bills', 
      icon: Receipt,
      permission: 'billing'
    },
    { 
      id: 'messages', 
      label: 'Messages', 
      icon: MessageSquare,
      permission: 'chat'
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartLine size={20} />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const hasAccess = hasPermission(user, action.permission);
            
            return (
              <Button 
                key={action.id}
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center hover-lift focus-ring"
                onClick={() => handleQuickAction(action.id)}
                aria-label={action.label}
                disabled={!hasAccess}
                title={!hasAccess ? 'You do not have permission to perform this action' : ''}
              >
                <Icon className="mb-2" size={20} />
                <span className="text-sm">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
