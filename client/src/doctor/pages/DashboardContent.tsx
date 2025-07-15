import React, { useState } from "react";
import { Plus } from "lucide-react";
import OrderDetailView from "../../components/orders/OrderDetailView";
import StatsCards from "../components/StatsCards";
import OrdersContent from "../../components/orders/OrdersContent";
import QuickActionsCard from "../components/QuickActionsCard";
import BillingOverview from "../components/billing/BillingOverview";
import PaymentOptionModal from "../../components/shared/PaymentOptionModal";
import ScanBookingConfirmationModal from "../../components/shared/ScanBookingConfirmationModal";
import { tooth } from "@/assets/svg";
import CustomButton from "../../components/common/customButtom";
import { useGetOrderByIdQuery, useGetOrdersQuery } from '@/store/slices/orderApi';
import { useSelector, useDispatch } from 'react-redux';
import { setOrder, setStep } from '@/store/slices/orderLocalSlice';
import { useAppSelector } from "@/store/hooks";

interface DashboardContentProps {
  onNewCase: () => void;
  onSectionChange?: (section: string) => void;
}

const DashboardContent = ({
  onNewCase,
  onSectionChange,
}: DashboardContentProps) => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentOrderId, setPaymentOrderId] = useState("");
  const [scanBookingModalOpen, setScanBookingModalOpen] = useState(false);
  const user = useAppSelector((state) => state.userData.userData);

  const dispatch = useDispatch();
  const { data: allOrders = [], isLoading } = useGetOrderByIdQuery(user?.clinicId);
  // Optionally, sync to local slice
  React.useEffect(() => {
    if (allOrders) {
      allOrders.forEach(order => dispatch(setOrder(order)));
    }
  }, [allOrders, dispatch]);

  // Filter orders for dashboard: only ongoing orders (not completed or rejected)
  const orders = allOrders.filter((order: any) => {
    // Show only ongoing orders (not completed, not rejected)
    return order.orderStatus !== "completed" && order.orderStatus !== "rejected";
  });

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handlePayNow = (orderId: string) => {
    setPaymentOrderId(orderId);
    setPaymentModalOpen(true);
  };

  const handleScanBooking = () => {
    setScanBookingModalOpen(true);
  };

  const handleScanBookingConfirm = (bookingData: any) => {
    console.log("Scan booking confirmed:", bookingData);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-[16px]">
          <img src={tooth} alt="tooth-image" width={64} />
          <div>
            <h1 className="text-[20px] font-semibold text-primary leading-[28px]">
              Hello , Smile Dental Clinic!
            </h1>
            <p className="text-muted-foreground text-[14px] font-medium">
              Welcome back, manage your dental lab cases efficiently
            </p>
          </div>
        </div>
        <CustomButton onClick={onNewCase} leftIcon={Plus} variant='primary'>
          Place Order
        </CustomButton>
      </div>

      <StatsCards />
      <BillingOverview />
      <OrdersContent onViewOrder={handleViewOrder} onPayNow={handlePayNow} />
      <QuickActionsCard
        onSectionChange={onSectionChange}
        onScanBooking={handleScanBooking}
      />

      <OrderDetailView
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        order={selectedOrder}
      />

      <PaymentOptionModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        orderId={paymentOrderId}
        amount="₹12,000"
      />

      <ScanBookingConfirmationModal
        isOpen={scanBookingModalOpen}
        onClose={() => setScanBookingModalOpen(false)}
        onConfirm={handleScanBookingConfirm}
      />
    </div>
  );
};

export default DashboardContent;