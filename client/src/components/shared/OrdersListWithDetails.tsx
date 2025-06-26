
import React, { useState, useEffect } from 'react';
import { OrderData } from '../../types';
import OrderCard from './OrderCard';
import OrderDetailPanel from './OrderDetailPanel';

interface OrdersListWithDetailsProps {
  orders: OrderData[];
  defaultSelectedOrderId?: string;
  onOrderClick?: (order: OrderData) => void;
  showDetailPanel?: boolean;
}

const OrdersListWithDetails: React.FC<OrdersListWithDetailsProps> = ({
  orders,
  defaultSelectedOrderId,
  onOrderClick,
  showDetailPanel = true
}) => {
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

  // Set default selected order on mount
  useEffect(() => {
    if (defaultSelectedOrderId && orders.length > 0) {
      const defaultOrder = orders.find(order => 
        order.orderId === defaultSelectedOrderId || 
        order.referenceId === defaultSelectedOrderId
      );
      if (defaultOrder) {
        setSelectedOrder(defaultOrder);
      }
    }
  }, [defaultSelectedOrderId, orders]);

  const handleOrderClick = (order: OrderData) => {
    setSelectedOrder(order);
    onOrderClick?.(order);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
      <div className="lg:col-span-1 space-y-4 overflow-y-auto pl-[8px] pr-[8px]">
        <h3 className="text-lg font-semibold text-foreground">Orders List</h3>
        {orders.map((order: OrderData) => (
          <OrderCard
            key={order.referenceId}
            order={order}
            onClick={() => handleOrderClick(order)}
            className={`cursor-pointer ${
              selectedOrder?.referenceId === order.referenceId 
                ? 'ring-2 ring-[#00A3C8] bg-blue-50' 
                : 'hover:bg-gray-50'
            }`}
          />
        ))}
      </div>

      {showDetailPanel && (
        <div className="lg:col-span-2">
          <OrderDetailPanel 
            order={selectedOrder} 
            onClose={() => setSelectedOrder(null)} 
          />
        </div>
      )}
    </div>
  );
};

export default OrdersListWithDetails;
