import React from 'react';
import { useGetDraftOrdersQuery } from '@/store/slices/draftOrderApi';
import { Card, CardContent } from '@/components/ui/card';
import CircularProgress from '../../components/shared/LoadingSpinner';
import { useAppSelector } from '@/store/hooks';
import { useNavigate } from 'react-router-dom';

const DraftOrdersTable = () => {
  const user = useAppSelector(state => state.userData.userData);
  const clinicId = user?.clinicId;
  const navigate = useNavigate();
  const { data: draftOrders = [], isLoading, isError, error } = useGetDraftOrdersQuery(clinicId ?? '', { skip: !clinicId });

  if (!clinicId) {
    return <div className="text-red-500">No clinic ID found for user.</div>;
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Draft Orders</h2>
      <Card>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8"><CircularProgress /></div>
          ) : isError ? (
            <div className="text-red-500 py-8">Failed to load draft orders.</div>
          ) : draftOrders.length === 0 ? (
            <div className="text-gray-500 py-8">No draft orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">reference ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Patient Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order Method</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {draftOrders.map((order) => (
                    <tr key={order.orderId}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{order.refId}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{order.firstName} {order.lastName}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{order.orderMethod}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '-'}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => {
                            console.log("order", order);
                            localStorage.setItem('draftOrderEdit', JSON.stringify({ draftOrder: order, step: 6 }));
                            navigate('/place-order');
                          }}
                        >
                            Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DraftOrdersTable;