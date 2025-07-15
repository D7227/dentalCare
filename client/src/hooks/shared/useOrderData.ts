import { useGetOrdersQuery } from '@/store/slices/orderApi';
import { OrderData } from '../../types';
import { useAppSelector } from '@/store/hooks';

export interface UseOrderDataResult {
  orders: OrderData[];
  isOrdersLoading: boolean;
  ordersError: Error | null;
  getToothGroupsByOrder: (referenceId: string) => any[];
}

export const useOrderData = (): UseOrderDataResult => {
  const UserData = useAppSelector((state) => state.userData);
  const { 
    data: orders = [], 
    isLoading: isOrdersLoading, 
    error: ordersError 
  } = useGetOrdersQuery();

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