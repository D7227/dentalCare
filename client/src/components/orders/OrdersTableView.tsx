
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import OrderStatusBadge from './OrderStatusBadge';
import OrderActions from './OrderActions';

interface OrdersTableViewProps {
  orders: any[];
  onViewOrder: (order: any) => void;
  onResubmitOrder?: (order: any) => void;
  isRejectedTab?: boolean;
}

const OrdersTableView = ({ orders, onViewOrder, onResubmitOrder, isRejectedTab = false }: OrdersTableViewProps) => {
  const handleOrderIdClick = (order: any) => {
    onViewOrder(order);
  };

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
            <TableHead className="text-gray-600 dark:text-gray-300 font-medium text-xs uppercase tracking-wide px-6 py-4">Article</TableHead>
            <TableHead className="text-gray-600 dark:text-gray-300 font-medium text-xs uppercase tracking-wide px-6 py-4">Patient</TableHead>
            <TableHead className="text-gray-600 dark:text-gray-300 font-medium text-xs uppercase tracking-wide px-6 py-4">Catégorie</TableHead>
            <TableHead className="text-gray-600 dark:text-gray-300 font-medium text-xs uppercase tracking-wide px-6 py-4">Status</TableHead>
            {isRejectedTab ? (
              <>
                <TableHead className="text-gray-600 dark:text-gray-300 font-medium text-xs uppercase tracking-wide px-6 py-4">Rejection Reason</TableHead>
                <TableHead className="text-gray-600 dark:text-gray-300 font-medium text-xs uppercase tracking-wide px-6 py-4">Rejected By</TableHead>
                <TableHead className="text-gray-600 dark:text-gray-300 font-medium text-xs uppercase tracking-wide px-6 py-4">Rejected On</TableHead>
              </>
            ) : (
              <>
                <TableHead className="text-gray-600 dark:text-gray-300 font-medium text-xs uppercase tracking-wide px-6 py-4">Order Date</TableHead>
                <TableHead className="text-gray-600 dark:text-gray-300 font-medium text-xs uppercase tracking-wide px-6 py-4">Due Date</TableHead>
              </>
            )}
            <TableHead className="text-gray-600 dark:text-gray-300 font-medium text-xs uppercase tracking-wide px-6 py-4 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => (
            <TableRow 
              key={order.id} 
              className={`border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors ${
                index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/30 dark:bg-gray-800/50'
              }`}
            >
              <TableCell className="px-6 py-4">
                <button
                  onClick={() => handleOrderIdClick(order)}
                  className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
                >
                  {order.id}
                </button>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="font-medium text-gray-900 dark:text-gray-100">{order.patient}</div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <span className="text-gray-600 dark:text-gray-300">{order.type}</span>
              </TableCell>
              <TableCell className="px-6 py-4">
                <OrderStatusBadge status={order.status} />
              </TableCell>
              {isRejectedTab ? (
                <>
                  <TableCell className="px-6 py-4 max-w-xs">
                    <p className="text-sm text-red-700 dark:text-red-300 truncate">{order.rejectionReason}</p>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-gray-600 dark:text-gray-400">{order.rejectedBy}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-gray-600 dark:text-gray-400">{order.rejectedOn}</span>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell className="px-6 py-4">
                    <span className="text-gray-600 dark:text-gray-400">{order.date}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-gray-600 dark:text-gray-400">{order.dueDate}</span>
                  </TableCell>
                </>
              )}
              <TableCell className="px-6 py-4 text-center">
                <OrderActions 
                  order={order} 
                  onViewOrder={onViewOrder} 
                  onResubmitOrder={onResubmitOrder}
                  isRejected={isRejectedTab}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {orders.length === 0 && (
        <div className="text-center py-16">
          <div className="text-muted-foreground">
            <p className="text-lg mb-2">No orders found</p>
            <p className="text-sm">Try adjusting your search criteria or filters</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTableView;
