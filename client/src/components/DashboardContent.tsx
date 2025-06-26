import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrderDetailView from "./OrderDetailView";
import StatsCards from "./dashboard/StatsCards";
import OrdersContent from "./orders/OrdersContent";
import QuickActionsCard from "./dashboard/QuickActionsCard";
import BillingOverview from "./dashboard/BillingOverview";
import PaymentOptionModal from "./shared/PaymentOptionModal";
import ScanBookingConfirmationModal from "./shared/ScanBookingConfirmationModal";
import { useOrders } from "../hooks/shared/useOrders";
import { tooth } from "@/assets/svg";
import CustomButton from "./common/customButtom";

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

  const { data: allOrders = [], isLoading } = useOrders();

  // Filter orders for dashboard: only ongoing orders (not completed or rejected)
  const orders = allOrders.filter((order) => {
    // Show only ongoing orders (not completed, not rejected)
    return order.status !== "completed" && order.status !== "rejected";
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