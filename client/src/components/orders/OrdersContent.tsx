import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import {
  Clock,
  Search,
  Loader2,
  FileText,
  Calendar,
  RefreshCw,
  XCircle,
  MessageSquare,
  CreditCard,
  CheckCircle2,
  Plus,
  MessageCircle,
  Package,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderDetailView from "@/components/OrderDetailView";
import { OrderStatusBadge } from "../shared/OrderStatusBadge";
import { DoctorInfo } from "../shared/DoctorInfo";
import { ToothSummary } from "../shared/ToothSummary";
import { useApiGet } from "@/hooks/useApi";
import DropdownSelector from "../common/DropdownSelector";
import TabNavButtons from "../common/TabNavButtons";
import { DentalOrder, OrderCard } from "./OrderCard.tsx";
import { useAppSelector } from '@/store/hooks';
// import CustomStatusLabel from '../common/CustomStatusLabel';

interface OrdersContentProps {
  onViewOrder?: (order: any) => void;
  onPayNow?: (orderId: string) => void;
}

const OrdersContent = ({ onViewOrder, onPayNow }: OrdersContentProps) => {
  const { user } = useAppSelector(state => state.auth);
  const [location, setLocation] = useLocation();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [activeTab, setAvtiveTab] = useState();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [detailsHeight, setDetailsHeight] = useState(600);
  const orderDetailRef = useRef(null);

  const {
    data: dbOrders = [],
    isLoading,
    isError: error,
    errorMessage,
    refetch,
  } = useApiGet<any[]>(`/api/orders/filter/${user?.clinicId}`, {
    enabled: !!user?.clinicId,
    refetchInterval: 30000,
    onSuccess: (data) => console.log('Orders fetched:', data),
    onError: (error) => console.error('Failed to fetch orders:', error),
  });

  // Orders page shows all orders - no filtering needed

  const { data: patients = [] } = useApiGet<any[]>("/api/patients", {
    refetchInterval: 30000,
  });

  const { data: allToothGroups = [] } = useApiGet<any[]>("/api/tooth-groups/all", {
    enabled: !!dbOrders && dbOrders.length > 0,
    refetchInterval: 30000,
    queryFn: async () => {
      if (!dbOrders || dbOrders.length === 0) return [];
      const toothGroupPromises = dbOrders.map(async (order: any) => {
        const response = await fetch(`/api/orders/${order.id}/tooth-groups`);
        const toothGroups = await response.json();
        return { orderId: order.id, toothGroups };
      });
      return Promise.all(toothGroupPromises);
    },
  });

  const getPatientName = (patientId: number) => {
    const patient = patients.find((p: any) => p.id === patientId);
    return patient
      ? `${patient.firstName} ${patient.lastName}`
      : "Unknown Patient";
  };

  const getOrderTeeth = (orderId: number) => {
    const orderToothGroups = allToothGroups.find(
      (otg: any) => otg.orderId === orderId
    );
    if (!orderToothGroups || !orderToothGroups.toothGroups) return [];

    const allTeeth: string[] = [];
    orderToothGroups.toothGroups.forEach((group: any) => {
      if (group.teeth && Array.isArray(group.teeth)) {
        allTeeth.push(...group.teeth.map((tooth: any) => tooth.toString()));
      }
    });
    return Array.from(new Set(allTeeth)).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );
  };

  const getOrderToothGroups = (orderId: number) => {
    const orderToothGroups = allToothGroups.find(
      (otg: any) => otg.orderId === orderId
    );
    if (!orderToothGroups || !orderToothGroups.toothGroups) return [];
    return orderToothGroups.toothGroups;
  };

  const getOrderType = (orderId: number) => {
    const order = dbOrders.find((o: any) => o.id === orderId);
    if (!order) return "New Order";

    // Check if orderType exists in the order data
    if (order.orderType === "repeat") return "Repeat Order";
    if (order.orderType === "repair") return "Repair Order";
    return "New Order";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: any }> = {
      pending: { label: "Pending", variant: "outline" },
      in_progress: { label: "In Progress", variant: "default" },
      trial_ready: { label: "Trial Ready", variant: "secondary" },
      completed: { label: "Completed", variant: "default" },
      delivered: { label: "Delivered", variant: "default" },
    };
    return statusMap[status] || { label: status, variant: "outline" };
  };

  const filters = [
    { id: "all", label: "All", count: dbOrders.length },
    {
      id: "new_today",
      label: "New Today",
      count: dbOrders.filter((o: any) => {
        const today = new Date().toDateString();
        return new Date(o.createdAt).toDateString() === today;
      }).length,
    },
    {
      id: "trial_ready",
      label: "Trial Work Ready",
      count: dbOrders.filter((o: any) => o.status === "trial_ready").length,
    },
    {
      id: "in_progress",
      label: "In Progress",
      count: dbOrders.filter((o: any) => o.status === "in_progress").length,
    },
    {
      id: "completed",
      label: "Completed",
      count: dbOrders.filter((o: any) => o.status === "completed").length,
    },
    {
      id: "rejected",
      label: "Rejected",
      count: dbOrders.filter((o: any) => o.status === "rejected").length,
    },
  ];

  const filteredOrders = dbOrders.filter((order: any) => {
    const patientName = getPatientName(order.patientId);
    const matchesSearch =
      searchTerm === "" ||
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.refId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getOrderType(order.id).toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (activeFilter === "new_today") {
      const today = new Date().toDateString();
      matchesFilter = new Date(order.createdAt).toDateString() === today;
    } else if (activeFilter !== "all") {
      matchesFilter = order.status === activeFilter;
    }

    return matchesSearch && matchesFilter;
  });

  // Helper to map API order data to DentalOrder structure for OrderCard
  const mapApiOrderToDentalOrder = (order: any): DentalOrder & any => {
    // Map status to statusLabel/orderStatus for UI
    let statusLabel: DentalOrder["statusLabel"] = "pending";
    let orderStatus: DentalOrder["orderStatus"] = "pending";
    // Map API status/orderType to UI enums
    switch (order.orderStatus) {
      case "pending_approval":
        statusLabel = "pending";
        orderStatus = "pending";
        break;
      case "approved":
      case "in_process":
        statusLabel = "active";
        orderStatus = "active";
        break;
      case "trial_ready":
        statusLabel = "trial";
        orderStatus = "trial";
        break;
      case "completed":
        statusLabel = "dispatched";
        orderStatus = "dispatched";
        break;
      case "delivered":
        statusLabel = "delivered";
        orderStatus = "delivered";
        break;
      case "rejected":
        statusLabel = "rejected";
        orderStatus = "rejected";
        break;
      default:
        statusLabel = "pending";
        orderStatus = "pending";
    }
    // switch (order.orderType) {
    //   case "repeat":
    //     orderStatus = "repeat";
    //     break;
    //   case "repair":
    //     orderStatus = "repair";
    //     break;
    //   default:
    //     orderStatus = "new";
    // }
    // Payment status mapping
    let paymentStatus: DentalOrder["paymentStatus"] = "pending";
    if (order.paymentStatus === "paid") paymentStatus = "paid";
    else if (order.paymentStatus === "rejected") paymentStatus = "rejected";
    else paymentStatus = "pending";
    // Compose teeth string
    let teethNo = Array.isArray(order.toothGroups) && order.toothGroups.length > 0
      ? order.toothGroups.map((tg: any) => tg.teeth).flat().join(", ")
      : "";
    // Compose patient name
    const patientName = order.patient?.firstName && order.patient?.lastName
      ? `${order.patient.firstName} ${order.patient.lastName}`
      : "Unknown Patient";
    // Compose messages (demo: show status as message)
    const messages = [
      { label: `Status: ${statusLabel}`, messageBy: "lab" as const }
    ];
    // Compose product name
    const productName = order.productSelection || order.restorationType || "-";
    // Compose order date
    const orderDate = order.createdAt ? formatDate(order.createdAt) : "-";
    // Compose quantity (if available)
    const quantity = 1;
    // Compose percentage (demo: based on status)
    let percentage = 10;
    if (statusLabel === "active") percentage = 30;
    else if (statusLabel === "trial") percentage = 60;
    else if (statusLabel === "dispatched" || statusLabel === "delivered") percentage = 100;
    else if (statusLabel === "rejected") percentage = 0;
    // Compose chatConnection (demo: true if delivered or active)
    const chatConnection = ["active", "trial", "dispatched", "delivered"].includes(statusLabel);
    // Compose unreadMessages (demo: 0)
    const unreadMessages = 0;
    // Compose currency/exportQuality/category
    const currency = "INR";
    const exportQuality = "Standard";
    const category = order.category || "crown_bridge";
    // Return all original fields, but override/add the mapped ones for the card
    return {
      ...order,
      id: order.id,
      refId: order.refId,
      orderId: order.orderId, // Use orderId if exists, otherwise refId, fallback to id
      prescription: order.restorationType || order.productSelection || "-",
      patientName,
      teethNo,
      productName,
      quantity,
      orderDate,
      orderCategory: order.category || "-",
      orderStatus,
      statusLabel,
      percentage,
      chatConnection,
      unreadMessages,
      messages,
      isUrgent: false,
      currency,
      exportQuality,
      paymentStatus,
      category,
    };
  };

  console.log('filteredOrders dashbored', filteredOrders)

  // Use filteredOrders (from API) and map to DentalOrder for rendering
  const dentalOrders = filteredOrders.map(mapApiOrderToDentalOrder);

  useEffect(() => {
    const el = orderDetailRef.current as HTMLElement | null;
    if (el) {
      setDetailsHeight(el.offsetHeight);
    }
  }, [selectedOrder, dentalOrders]); // update height when selected order or orders list changes

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    // Don't trigger popup on dashboard - just update selection
  };

  const handleResubmitFromCard = (order: any) => {
    setLocation(`/resubmit-order/${order.id}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Error Loading Orders
            </h3>
            <p className="text-muted-foreground">
              {error instanceof Error ? error.message : 'Failed to load orders'}
            </p>
            {!user?.clinicId && (
              <p className="text-sm text-red-500 mt-2">
                No clinic ID available. Please check your authentication.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user?.clinicId) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No Clinic ID Available
            </h3>
            <p className="text-muted-foreground">
              Please ensure you are properly authenticated with a clinic ID.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleViewOrder2 = (orderId: string) => {
    console.log("Viewing order:", orderId);
    setSelectedOrderId(orderId);
  };

  const handlePricing = (orderId: string) => {
    console.log("Viewing pricing for order:", orderId);
  };

  const handlePayNow = (orderId: string) => {
    console.log("Processing payment for order:", orderId);
  };

  const handleResubmit = (order: any) => {
    console.log("Resubmitting order:", order);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          {/* Filter Tabs */}
          <div className="flex-1 w-full lg:w-auto">
            <Tabs value={activeFilter} onValueChange={setActiveFilter}>
              {/* <TabsList className="w-full justify-end overflow-x-auto bg-white border border-gray-200 rounded-lg p-1"> */}
              {/* {filters.map((filter) => (
                  <TabsTrigger 
                    key={filter.id} 
                    value={filter.id} 
                    className="flex items-center gap-2 whitespace-nowrap px-3 py-2 text-sm font-medium rounded-md transition-colors data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
                  >
                    {filter.label}
                    <Badge variant="secondary" className="text-xs h-5 min-w-[20px] px-1.5 rounded-full bg-gray-200 text-gray-700">
                      {filter.count}
                    </Badge>
                  </TabsTrigger>
                ))} */}
              <div className="w-full flex justify-end ">
                <DropdownSelector
                  value="Active Orders"
                  options={[
                    "All",
                    "New Today",
                    "Active Orders",
                    "Trial Work Ready",
                    "In Progress",
                    "Completed",
                    "Rejected",
                  ]}
                  onChange={(val: any) => console.log("Selected:", val)}
                />
              </div>
              {/* </TabsList> */}
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Tabs value={activeFilter} onValueChange={setActiveFilter}>
            <TabsContent value={activeFilter} className="mt-4">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" style={{ alignItems: 'stretch' }}>
                {/* Orders List */}
                <div className="xl:col-span-1 flex flex-col" style={{ minHeight: 600, maxHeight: detailsHeight }}>
                  {/* Search Bar - sticky */}
                  <div className="sticky top-0 z-10 bg-white pb-2">
                    <div className="relative w-full">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search orders by patient, ID, or type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  {/* Card List */}
                  <div
                    className="flex-1 overflow-y-auto pr-2 pb-2 pt-1"
                    style={{ minHeight: 0, maxHeight: detailsHeight - 60 }} // adjust for sticky search bar
                  >
                    {dentalOrders.map((order) => (
                      <div key={order.id} className="mb-4 last:mb-0 px-1">
                        <OrderCard
                          order={order}
                          onView={() => handleViewOrder(order)}
                          onPricing={handlePricing}
                          onPayNow={handlePayNow}
                          onResubmit={handleResubmit}
                          isSelected={selectedOrder?.id === order.id}
                        />
                      </div>
                    ))}
                    {dentalOrders.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          No orders found matching your criteria
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Details */}
                <div
                  className="xl:col-span-2 border rounded-lg bg-background h-full flex flex-col overflow-y-auto"
                  ref={orderDetailRef}
                >
                  {selectedOrder ? (
                    <OrderDetailView
                      isOpen={!!selectedOrder}
                      onClose={() => setSelectedOrder(null)}
                      order={selectedOrder}
                      isEmbedded={true}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full min-h-[400px]">
                      <div className="text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">
                          Select an Order
                        </h3>
                        <p className="text-muted-foreground">
                          Choose an order from the list to view details
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersContent;