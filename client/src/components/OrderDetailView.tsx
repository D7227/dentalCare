import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Truck,
  CreditCard,
  FileChartColumnIncreasing,
  MessageCircle,
} from "lucide-react";
import ChatModule from "./chat/ChatModule";
import { useToast } from "@/hooks/use-toast";
import OverviewTab from "./orders/tabs/OverviewTab";
import PickupTab from "./orders/tabs/PickupTab";
import PaymentTab from "./orders/tabs/PaymentTab";
import { useAppSelector } from "@/store/hooks";

interface OrderDetailViewProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  isEmbedded?: boolean;
  initialTab?: string;
}

const OrderDetailView: React.FC<OrderDetailViewProps> = ({
  isOpen,
  onClose,
  order,
  isEmbedded = false,
  initialTab = 'overview',
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { toast } = useToast();
  const [attachments, setAttachments] = useState<{ name: string }[]>(order?.files?.map((f: string) => ({ name: f })) || []);
  const [chatId, setChatId] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const user = useAppSelector(state => state.auth.user);

  const patient = order?.patientFirstName
    ? {
        firstName: order.patientFirstName || '-',
        lastName: order.patientLastName || '-',
        age: order.patientAge || '-',
        gender: order.patientSex || '-',
      }
    : undefined;

  const doctor = order?.caseHandledBy
    ? {
        caseHandledBy: order.caseHandledBy || '-',
        consultingDoctor: order.consultingDoctor || '-',
        location:
          order.clinicAddress ||
          order.location ||
          [order.city, order.state, order.pincode].filter(Boolean).join(', ') ||
          '-',
      }
    : undefined;

  useEffect(() => {
    if (!order?.orderId && !order?.referenceId) {
      setChatId(null);
      return;
    }
    setChatLoading(true);
    setChatError(null);
    fetch(`/api/orders/${order.id}/chat`)
      .then((res) => {
        if (!res.ok) throw new Error('No chat found');
        return res.json();
      })
      .then((data) => setChatId(data.id))
      .catch((err) => setChatError('No chat found for this order'))
      .finally(() => setChatLoading(false));
  }, [order?.orderId, order?.referenceId]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [order, initialTab]);

  if (!isOpen || !order) return null;

  const handlePaymentClick = (type: "online" | "collection") => {
    if (type === "online") {
      toast({
        title: "Payment Gateway",
        description: "Redirecting to secure payment gateway...",
      });
      setTimeout(() => {
        toast({
          title: "Payment Successful",
          description: `Payment of ₹${order.outstandingAmount || "10,000"} processed successfully.`,
        });
      }, 2000);
    } else {
      toast({
        title: "Collection Request Sent",
        description: "Agent will collect payment during delivery.",
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const stages = [
    { label: "Submitted", date: order.createdAt, completed: true },
    { label: "Picked Up", date: order.createdAt, completed: true },
    { label: "Lab Received", date: order.createdAt, completed: true },
    { label: "Lab-Approval", date: order.createdAt, completed: true },
    { label: "In Progress", date: order.createdAt, completed: order.statusLabel !== "pending" },
    { label: "Final Review", date: order.dueDate, completed: order.statusLabel === "dispatched" || order.statusLabel === "delivered" },
    { label: "Dispatched", date: order.dueDate, completed: order.statusLabel === "dispatched" || order.statusLabel === "delivered" },
    { label: "Delivered", date: order.dueDate, completed: order.statusLabel === "delivered" },
  ];

  const details = {
    restorationType: order.restorationType,
    selectedTeeth: order.selectedTeeth,
    teethGroup: order.teethNo,
    productSelection: order.restorationProducts?.map((p: any) => ({ name: p.product, count: p.quantity })) || [],
    accessories: order.accessories?.map((a: string) => ({ name: a, count: null })) || [],
    pontic: order.pontic || "-",
    trial: order.trial || "-",
    occlusalStaining: order.occlusalStaining || "-",
    shade: order.shade || [],
  };

  const notes = order.notes || "No additional notes provided.";

  const onRemoveFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddFile = (fileName: string) => {
    setAttachments((prev) => [...prev, { name: fileName }]);
  };

  const tabs = [
    { value: "overview", label: "Overview", icon: FileChartColumnIncreasing },
    { value: "chat", label: "Chat", icon: MessageCircle },
    { value: "pickup", label: "Pickup", icon: Truck },
    { value: "payment", label: "Payment", icon: CreditCard },
  ];

  const overViewData = {
    stages,
    details,
    message: notes ? [notes] : [],
    patient,
    doctor,
    order,
  };

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
        <TabsContent value="overview" className="flex-1 w-full overflow-y-auto p-4 pb-6">
          <OverviewTab data={overViewData} attachments={attachments} onRemoveFile={onRemoveFile} />
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat" className="flex-1 w-full p-4 pb-6">
  <Card className="w-full h-full max-h-[90vh] flex flex-col">
    <CardContent className="p-0  max-h-[70vh] flex-1 flex flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto">
        {chatLoading ? (
          <div className="flex items-center justify-center h-full">Loading chat...</div>
        ) : chatError ? (
          <div className="flex items-center justify-center h-full text-gray-500">{chatError}</div>
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
        <TabsContent value="pickup" className="flex-1 w-full overflow-y-auto p-4 pb-6">
          <PickupTab order={order} doctor={doctor} />
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment" className="flex-1 w-full overflow-y-auto p-4 pb-6">
          <PaymentTab order={order} onPayment={handlePaymentClick} />
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
