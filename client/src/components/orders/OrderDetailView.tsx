import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Truck,
  CreditCard,
  FileChartColumnIncreasing,
  MessageCircle,
} from "lucide-react";
import ChatModule from "../chat/ChatModule";
import { useToast } from "@/hooks/use-toast";
import OverviewTab from "./tabs/OverviewTab";
import PickupTab from "./tabs/PickupTab";
import PaymentTab from "./tabs/PaymentTab";
import { useAppSelector } from "@/store/hooks";
import { getLifecycleStages } from "../shared/progress/lifecycleData";
import {
  useGetOrderByOrderIdQuery,
  useGetOrderChatQuery,
} from "@/store/slices/orderApi";

interface OrderDetailViewProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  isEmbedded?: boolean;
  initialTab?: string;
}

const OrderDetailView: React.FC<OrderDetailViewProps> = ({
  isOpen,
  onClose,
  orderId,
  isEmbedded = false,
  initialTab = "overview",
}) => {
  const { toast } = useToast();
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orderId);
  const [activeTab, setActiveTab] = useState(initialTab);
  const {
    data: orderData,
    error: orderGetError,
    isLoading: orderIsLoding,
    refetch,
  } = useGetOrderByOrderIdQuery(selectedOrderId);

  useEffect(() => {
    setSelectedOrderId(orderId);
    refetch();
  }, [orderId]);

  const {
    data: chatData,
    isLoading: chatLoading,
    error: chatError,
  } = useGetOrderChatQuery(orderId, { skip: !orderId });
  const chatId = chatData?.id || null;
  const UserData = useAppSelector((state) => state.userData);
  const user = UserData.userData;

  const doctor = orderData?.caseHandleBy
    ? {
        caseHandleBy: orderData?.caseHandleBy || "-",
        consultingDoctor: orderData?.consultingDoctorName || "-",
        location: "-",
      }
    : undefined;

  useEffect(() => {
    setActiveTab(initialTab);
  }, [selectedOrderId, initialTab]);

  if (!isOpen || !orderData) return null;

  const handlePaymentClick = (type: "online" | "collection") => {
    if (type === "online") {
      toast({
        title: "Payment Gateway",
        description: "Redirecting to secure payment gateway...",
      });
      setTimeout(() => {
        toast({
          title: "Payment Successful",
          description: `Payment of ₹${
            orderData?.totalAmount || "10,000"
          } processed successfully.`,
        });
      }, 2000);
    } else {
      toast({
        title: "Collection Request Sent",
        description: "Agent will collect payment during delivery.",
      });
    }
  };

  const tabs = [
    { value: "overview", label: "Overview", icon: FileChartColumnIncreasing },
    { value: "chat", label: "Chat", icon: MessageCircle },
    { value: "pickup", label: "Pickup", icon: Truck },
    { value: "payment", label: "Payment", icon: CreditCard },
  ];

  const content = (
    <div className="h-full flex flex-col">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full flex-1 flex flex-col p-4 bg-[#F9FAFB]"
      >
        <TabsList className="grid w-full bg-teal-50 rounded-xl p-1 h-fit grid-cols-4">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center justify-center gap-2 px-2 py-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm data-[state=active]:border border-[#07AD94] w-full"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent
          value="overview"
          className="flex-1 w-full overflow-y-auto p-4 pb-6"
        >
          <OverviewTab data={orderData} />
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat" className="flex-1 w-full p-4 pb-6">
          <Card className="w-full h-full max-h-[90vh] flex flex-col">
            <CardContent className="p-0  max-h-[70vh] flex-1 flex flex-col">
              <div className="flex-1 min-h-0 overflow-y-auto">
                {chatLoading ? (
                  <div className="flex items-center justify-center h-full">
                    Loading chat...
                  </div>
                ) : chatError ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No chat found for this orderData
                  </div>
                ) : chatId ? (
                  <ChatModule chatId={chatId} userData={user} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No chat available for this order.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pickup Tab */}
        <TabsContent
          value="pickup"
          className="flex-1 w-full overflow-y-auto p-4 pb-6"
        >
          <PickupTab order={orderData} doctor={doctor} />
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent
          value="payment"
          className="flex-1 w-full overflow-y-auto p-4 pb-6"
        >
          <PaymentTab order={orderData} onPayment={handlePaymentClick} />
        </TabsContent>
      </Tabs>
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[900px] h-[90vh] max-w-none max-h-none overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle className="sr-only">Order Details</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailView;
