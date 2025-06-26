import React from 'react';
import { TrendingUp, Calendar, Truck, Receipt, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppSelector, hasPermission } from '@/store/hooks';

interface QuickActionsCardProps {
  onSectionChange?: (section: string) => void;
  onScanBooking?: () => void;
}

const QuickActionsCard = ({ onSectionChange, onScanBooking }: QuickActionsCardProps) => {
  const { user } = useAppSelector((state) => state.auth);

  const handleQuickAction = (section: string) => {
    if (section === 'appointments' && onScanBooking) {
      onScanBooking();
    } else if (onSectionChange) {
      onSectionChange(section);
    }
  };

  const quickActions = [
    { id: 'appointments', label: 'Book Scan', icon: Calendar },
    { id: 'pickup', label: 'Request Pickup', icon: Truck },
    { id: 'billing', label: 'View Bills', icon: Receipt },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp size={20} />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const permissionName = `quick_action:${action.id}`;
            const isMainDoctor = user?.roleName === 'main_doctor';
            const isDisabled = !isMainDoctor && !hasPermission(user, permissionName);
            return (
              <Button 
                key={action.id}
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center hover-lift focus-ring"
                onClick={() => handleQuickAction(action.id)}
                aria-label={action.label}
                disabled={isDisabled}
                title={isDisabled ? 'You do not have permission to perform this action' : ''}
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
