
import React from 'react';
import { Eye, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface OrderActionsProps {
  order: any;
  onViewOrder: (order: any) => void;
  onResubmitOrder?: (order: any) => void;
  isRejected?: boolean;
}

const OrderActions = ({ order, onViewOrder, onResubmitOrder, isRejected = false }: OrderActionsProps) => {
  if (isRejected && onResubmitOrder) {
    return (
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onViewOrder(order)}
              className="btn-ghost hover:bg-primary/10 hover:text-primary transition-colors hover-lift focus-ring"
            >
              <Eye size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Details</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onResubmitOrder(order)}
              className="btn-ghost hover:bg-primary/10 hover:text-primary transition-colors hover-lift focus-ring"
            >
              <RefreshCw size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Resubmit Order</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onViewOrder(order)}
            className="btn-ghost hover:bg-primary/10 hover:text-primary transition-colors hover-lift focus-ring"
          >
            <Eye size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View Case</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="btn-ghost hover:bg-primary/10 hover:text-primary transition-colors hover-lift focus-ring"
          >
            <Download size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Download Files</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default OrderActions;
