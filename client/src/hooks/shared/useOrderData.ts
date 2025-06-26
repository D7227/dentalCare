import { useQuery } from '@tanstack/react-query';
import { OrderData } from '../../types';

export interface UseOrderDataResult {
  orders: OrderData[];
  isOrdersLoading: boolean;
  ordersError: Error | null;
  getToothGroupsByOrder: (referenceId: string) => any[];
}

export const useOrderData = (): UseOrderDataResult => {
  const { 
    data: orders = [], 
    isLoading: isOrdersLoading, 
    error: ordersError 
  } = useQuery<OrderData[]>({ 
    queryKey: ['/api/orders'] 
  });

  const getToothGroupsByOrder = (referenceId: string): any[] => {
    const order = orders.find(o => o.referenceId === referenceId);
    return order?.toothGroups || [];
  };

  return {
    orders,
    isOrdersLoading,
    ordersError: ordersError as Error | null,
    getToothGroupsByOrder
  };
};