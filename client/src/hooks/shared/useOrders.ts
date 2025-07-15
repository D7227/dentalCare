import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { OrderFormData, OrderData, convertToOrderData } from '@/types';
import { useAppSelector } from '@/store/hooks';

// API functions
const createOrderAPI = async (formData: OrderFormData): Promise<OrderData> => {
  const orderData = convertToOrderData(formData);
  
  const response = await fetch('/api/orders/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to create order: ${response.status}`);
  }

  return response.json();
};

const getOrdersAPI = async (): Promise<OrderData[]> => {
  const UserData = useAppSelector(state => state.userData);
  const user = UserData.userData;
  const ordersResponse = await fetch(`/api/orders/${user?.clinicId}`);
  const patientsResponse = await fetch('/api/patients');
  
  if (!ordersResponse.ok) {
    throw new Error(`Failed to fetch orders: ${ordersResponse.status}`);
  }
  
  if (!patientsResponse.ok) {
    throw new Error(`Failed to fetch patients: ${patientsResponse.status}`);
  }

  const orders = await ordersResponse.json();
  const patients = await patientsResponse.json();
  
  // Map orders with embedded patient data to match OrderData interface
  return orders.map((order: any) => {
    const patient = patients.find((p: any) => p.id === order.patientId);
    return {
      ...order,
      patient: patient ? {
        firstName: patient.firstName,
        lastName: patient.lastName,
        age: patient.age,
        sex: patient.sex
      } : {
        firstName: 'Unknown',
        lastName: 'Patient',
        age: 0,
        sex: 'other'
      },
      doctor: {
        name: order.consultingDoctor || 'Dr. Not Assigned',
        phone: '+1-555-0123',
        email: 'doctor@clinic.com',
        clinicName: 'Advanced Dental Lab',
        clinicAddress: '123 Dental Street',
        city: 'Medical City',
        state: 'CA',
        pincode: '90210'
      },
      toothGroups: order.toothGroups || [],
      paymentStatus: order.paymentStatus || 'pending_payment'
    };
  });
};

const getOrderByIdAPI = async (id: number): Promise<OrderData> => {
  const response = await fetch(`/api/orders/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch order: ${response.status}`);
  }

  return response.json();
};

const updateOrderStatusAPI = async ({ id, status }: { id: number; status: string }): Promise<OrderData> => {
  const response = await fetch(`/api/orders/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to update order status: ${response.status}`);
  }

  return response.json();
};

// Custom hooks
export const useCreateOrder = (onSuccessCallback?: (data: OrderData) => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OrderFormData) => createOrderAPI(data),
    onSuccess: (data) => {
      // Show success toast
      toast({
        title: "Order Created Successfully",
        description: `Order ${data.orderId || data.referenceId} has been submitted and is being processed.`,
      });

      // Invalidate and refetch orders list
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      // Call optional success callback (can be used to reset form)
      if (onSuccessCallback) {
        onSuccessCallback(data);
      }
    },
    onError: (error: Error) => {
      console.error('Order creation error:', error);
      toast({
        title: "Order Creation Failed",
        description: error.message || "Failed to create order. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Hook for fetching all orders (for clinic dashboard and OrdersTab)
export const useOrders = () => {
  const UserData = useAppSelector(state => state.userData);
  const user = UserData.userData;
  const clinicId = user?.clinicId;
  return useQuery({
    queryKey: ['orders'],
    queryFn: getOrdersAPI,
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: false,
  });
};

// Standalone query function for orders (can be used in components that need the query config)
export const getOrders = async () => {
  const UserData = useAppSelector(state => state.userData);
  const user = UserData.userData;
  const clinicId = user?.clinicId;
  let ordersResponse;
  if (clinicId) {
    ordersResponse = await fetch(`/api/orders/${clinicId}`);
  } else {
    ordersResponse = await fetch('/api/orders');
  }
  return await ordersResponse.json();
};

export const useOrder = (id: number) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => getOrderByIdAPI(id),
    enabled: !!id,
    staleTime: 60000, // Consider individual order data fresh for 1 minute
  });
};

export const useUpdateOrderStatus = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderStatusAPI,
    onSuccess: (data) => {
      toast({
        title: "Order Status Updated",
        description: `Order ${data.orderId || data.referenceId} status has been updated.`,
      });

      // Invalidate both orders list and individual order queries
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: Error) => {
      console.error('Order status update error:', error);
      toast({
        title: "Status Update Failed",
        description: error.message || "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Helper function to get orders query for use in other components
export const getOrdersQuery = () => ({
  queryKey: ['orders'],
  queryFn: getOrdersAPI,
});

// Export the functions for direct use if needed
export { 
  createOrderAPI, 
  getOrdersAPI, 
  getOrderByIdAPI, 
  updateOrderStatusAPI 
};