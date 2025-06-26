
import React from 'react';
import OrderDetailView from '../OrderDetailView';
import { FileText } from 'lucide-react';
import { OrderData } from '../../types';

interface OrderDetailPanelProps {
  order: OrderData | null;
  onClose?: () => void;
}

const OrderDetailPanel: React.FC<OrderDetailPanelProps> = ({ order, onClose }) => {
  if (!order) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Select an Order</h3>
          <p className="text-muted-foreground">Choose an order from the list to view details</p>
        </div>
      </div>
    );
  }

  return (
    <OrderDetailView 
      isOpen={true} 
      onClose={onClose || (() => {})} 
      order={order}
      isEmbedded={true}
    />
  );
};

export default OrderDetailPanel;
