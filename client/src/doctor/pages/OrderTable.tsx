// INFOR : This is the order table component that is used to display the orders in the order table page. in Order tab in sidebar

import React, { useState } from "react";
import { useLocation } from "wouter";
import {
  Search,
  Plus,
  MessageCircle,
  Eye,
  DollarSign,
  CreditCard,
  Truck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrderDetailView from "@/components/orders/OrderDetailView";
import { OrderStatusBadge } from "../../components/shared/OrderStatusBadge";
import { useQuery } from "@tanstack/react-query";
import CustomStatusBatch from "../../components/common/customStatusBatch";
import CustomStatusLabel from "../../components/common/customStatusLabel";
import OptionsMenu from "../../components/common/OptionsMenu";
import CircularProgress from "../../components/common/CircularProgress";
import { useAppSelector } from '@/store/hooks';
import { useApiGet } from "@/hooks/useApi";
import ProductDetailsPopOver from "@/components/common/ProductDetailsPopOver";

interface OrderTableProps {
  onViewOrder?: (order: any) => void;
  onPayNow?: (orderId: string) => void;
}

const OrderTable = ({ onViewOrder, onPayNow }: OrderTableProps) => {
  const [location, setLocation] = useLocation();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [patientFilter, setPatientFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [orderTypeFilter, setOrderTypeFilter] = useState("all");
  const [orderDetailTab, setOrderDetailTab] = useState<string>("overview");

  const { user } = useAppSelector(state => state.auth);
  const clinicId = user?.clinicId;
  console.log('clinicId', clinicId)
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

  console.log('dbOrders   ---table', dbOrders)


  //   const clinicId = user?.clinicId;
  // const filters = {
  //   patientName: "Jane",
  //   prescription: "Bridge",
  //   reference_id: "REF123",
  //   order_id: "ORD456"
  // };

  // const params = new URLSearchParams();
  // Object.entries(filters).forEach(([key, value]) => {
  //   if (value) params.append(key, value);
  // });

  // const response = await fetch(`/api/orders/filter/${clinicId}?${params.toString()}`);
  // const data = await response.json();
  // Orders page shows all orders - no filtering needed

  const { data: patients = [] } = useQuery<any[]>({
    queryKey: ["/api/patients"],
    refetchInterval: 30000,
  });

  const { data: allToothGroups = [] } = useQuery<any[]>({
    queryKey: ["/api/tooth-groups/all", dbOrders?.length],
    queryFn: async () => {
      if (!dbOrders || dbOrders.length === 0) return [];
      const toothGroupPromises = dbOrders.map(async (order: any) => {
        const response = await fetch(`/api/orders/${order.id}/tooth-groups`);
        const toothGroups = await response.json();
        return { orderId: order.id, toothGroups };
      });
      return Promise.all(toothGroupPromises);
    },
    enabled: !!dbOrders && dbOrders.length > 0,
    refetchInterval: 30000,
  });

  const { data: chats = [] } = useQuery({
    queryKey: ['/api/chats', user?.fullName],
    queryFn: async () => {
      const url = user?.fullName
        ? `/api/chats?userId=${encodeURIComponent(user.fullName)}`
        : '/api/chats';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch chats');
      return response.json();
    },
    enabled: !!user?.fullName
  });

  const getPatientName = (patientId: number) => {
    const patient = patients.find((p: any) => p.id === patientId);
    return patient
      ? `${patient.firstName} ${patient.lastName}`
      : "Unknown Patient";
  };

  const getOrderTeeth = (orderId: number) => {
    const orderToothGroups = allToothGroups.find(
      (otg: any) => otg.orderId === orderId,
    );
    if (!orderToothGroups || !orderToothGroups.toothGroups) return [];

    const allTeeth: string[] = [];
    orderToothGroups.toothGroups.forEach((group: any) => {
      if (group.teeth && Array.isArray(group.teeth)) {
        allTeeth.push(...group.teeth.map((tooth: any) => tooth.toString()));
      }
    });
    return Array.from(new Set(allTeeth)).sort(
      (a, b) => parseInt(a) - parseInt(b),
    );
  };

  const getOrderToothGroups = (orderId: number) => {
    const orderToothGroups = allToothGroups.find(
      (otg: any) => otg.orderId === orderId,
    );
    if (!orderToothGroups || !orderToothGroups.toothGroups || !Array.isArray(orderToothGroups.toothGroups)) return [];
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

  // Get unique patient names for filter dropdown
  const uniquePatients = Array.from(
    new Set(dbOrders.map((order: any) => getPatientName(order.patientId))),
  ).sort();

  // Clear all filters function
  const clearAllFilters = () => {
    setSearchTerm("");
    setActiveFilter("all");
    setPatientFilter("all");
    setPaymentFilter("all");
    setCategoryFilter("all");
    setDateFilter("all");
    setOrderTypeFilter("all");
  };

  const getUnreadCountForOrder = (orderId: string) => {
    const chat = chats.find((chat: any) => chat.orderId === orderId);
    return chat?.unreadCount || 0;
  };

  const filteredOrders = dbOrders.filter((order: any) => {
    const patientName = getPatientName(order.patientId);
    const matchesSearch =
      searchTerm === "" ||
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
    //  ||
    // getOrderType(order.id).toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    let matchesStatusFilter = true;
    if (activeFilter === "new_today") {
      const today = new Date().toDateString();
      matchesStatusFilter = new Date(order.createdAt).toDateString() === today;
    } else if (activeFilter !== "all") {
      matchesStatusFilter = order.status === activeFilter;
    }

    // Patient filter
    const matchesPatientFilter =
      patientFilter === "all" ||
      patientName.toLowerCase().includes(patientFilter.toLowerCase());

    // Payment filter
    const matchesPaymentFilter =
      paymentFilter === "all" || order.paymentStatus === paymentFilter;

    // Category filter (using status as category for now)
    const matchesCategoryFilter =
      categoryFilter === "all" ||
      order.category === categoryFilter ||
      order.status === categoryFilter;

    // Date filter
    let matchesDateFilter = true;
    if (dateFilter !== "all") {
      const orderDate = new Date(order.createdAt);
      const today = new Date();
      const daysDiff = Math.floor(
        (today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      switch (dateFilter) {
        case "today":
          matchesDateFilter = daysDiff === 0;
          break;
        case "week":
          matchesDateFilter = daysDiff <= 7;
          break;
        case "month":
          matchesDateFilter = daysDiff <= 30;
          break;
        case "quarter":
          matchesDateFilter = daysDiff <= 90;
          break;
      }
    }

    // Order type filter
    const matchesOrderTypeFilter =
      orderTypeFilter === "all" ||
      getOrderType(order.id)
        .toLowerCase()
        .includes(orderTypeFilter.toLowerCase());

    return (
      matchesSearch &&
      matchesStatusFilter &&
      matchesPatientFilter &&
      matchesPaymentFilter &&
      matchesCategoryFilter &&
      matchesDateFilter &&
      matchesOrderTypeFilter
    );
  });

  // Pagination state and logic (moved after filteredOrders)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);


  console.log('filteredOrders', filteredOrders)

  const handleViewOrder = (order: any, tab: string = "overview") => {
    setSelectedOrder(order);
    setOrderDetailTab(tab);
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

  return (
    <div className="space-y-2">
      {/* Page Header */}
      {/* <div>
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground">
          View and manage all your dental lab orders
        </p>
      </div> */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="space-y-3">
            <div className="flex gap-3 items-center">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-[40px] text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {/* Patient Filter */}
                <Select value={patientFilter} onValueChange={setPatientFilter}>
                  <SelectTrigger className="h-[40px] text-xs w-36">
                    <SelectValue placeholder="Patient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Patients</SelectItem>
                    {uniquePatients.map((patient) => (
                      <SelectItem key={patient} value={patient}>
                        {patient}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Payment Status Filter */}
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger className="h-[40px] text-xs w-32">
                    <SelectValue placeholder="Payment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending_payment">Pending</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                  </SelectContent>
                </Select>

                {/* Order Type Filter */}
                <Select
                  value={orderTypeFilter}
                  onValueChange={setOrderTypeFilter}
                >
                  <SelectTrigger className="h-[40px] text-xs w-28">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="new">New Order</SelectItem>
                    <SelectItem value="repair">Repair Order</SelectItem>
                    <SelectItem value="repeat">Repeat Order</SelectItem>
                  </SelectContent>
                </Select>

                {/* Date Filter */}
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="h-[40px] text-xs w-28">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">Last 3 Months</SelectItem>
                  </SelectContent>
                </Select>

                {/* Category/Status Filter */}
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-[40px] text-xs w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="trial_ready">Trial Ready</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(patientFilter !== "all" ||
              paymentFilter !== "all" ||
              categoryFilter !== "all" ||
              dateFilter !== "all" ||
              orderTypeFilter !== "all" ||
              searchTerm !== "") && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {searchTerm && (
                    <Badge variant="secondary" className="text-xs">
                      Search: {searchTerm}
                      <button
                        onClick={() => setSearchTerm("")}
                        className="ml-1 hover:bg-secondary-foreground/20 rounded-full w-3 h-3 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {patientFilter !== "all" && (
                    <Badge variant="secondary" className="text-xs">
                      Patient: {patientFilter}
                      <button
                        onClick={() => setPatientFilter("all")}
                        className="ml-1 hover:bg-secondary-foreground/20 rounded-full w-3 h-3 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {paymentFilter !== "all" && (
                    <Badge variant="secondary" className="text-xs">
                      Payment: {paymentFilter}
                      <button
                        onClick={() => setPaymentFilter("all")}
                        className="ml-1 hover:bg-secondary-foreground/20 rounded-full w-3 h-3 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {orderTypeFilter !== "all" && (
                    <Badge variant="secondary" className="text-xs">
                      Type: {orderTypeFilter}
                      <button
                        onClick={() => setOrderTypeFilter("all")}
                        className="ml-1 hover:bg-secondary-foreground/20 rounded-full w-3 h-3 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {dateFilter !== "all" && (
                    <Badge variant="secondary" className="text-xs">
                      Date: {dateFilter}
                      <button
                        onClick={() => setDateFilter("all")}
                        className="ml-1 hover:bg-secondary-foreground/20 rounded-full w-3 h-3 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {categoryFilter !== "all" && (
                    <Badge variant="secondary" className="text-xs">
                      Category: {categoryFilter}
                      <button
                        onClick={() => setCategoryFilter("all")}
                        className="ml-1 hover:bg-secondary-foreground/20 rounded-full w-3 h-3 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                </div>
              )}
          </div>
        </div>
        <Button
          onClick={() => setLocation("/place-order")}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          New Order
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="space-y-4">
            {/* Orders Table */}
            <div className="mt-1">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50 rounded-t-[10px]">
                      <th className="text-left p-3 text-sm font-medium text-gray-600">Order Date</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-600">ID</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-600">Patient name</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-600">Prescription</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-600">Product</th>
                      <th className="text-center p-3 text-sm font-medium text-gray-600">Progress</th>
                      <th className="text-center p-3 text-sm font-medium text-gray-600">Order Method</th>
                      <th className="text-center p-3 text-sm font-medium text-gray-600">Category</th>
                      <th className="text-center p-3 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-center p-3 text-sm font-medium text-gray-600">Message</th>
                      <th className="text-center p-3 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map((order: any, index: number) => {
                      const orderTeeth = getOrderTeeth(order?.id);
                      const toothGroups = getOrderToothGroups(order?.id);
                      // Get real unread count for this order's chat
                      const unreadCount = getUnreadCountForOrder(order?.id);
                      return (
                        <tr
                          key={order.id}
                          className={`border-b hover:bg-gray-50 ${selectedOrder?.id === order?.id ? "bg-blue-50" : ""}`}
                        >
                          <td className="p-3 text-sm">{formatDate(order?.createdAt)}</td>
                          <td className="p-3 text-sm font-medium text-blue-600 cursor-pointer" onClick={() => handleViewOrder(order, "overview")}>
                            {order?.orderId || order?.refId}
                          </td>
                          <td className="p-3 text-sm">{order?.firstName} {order?.lastName}</td>
                          <td className="p-3 text-sm capitalize">{order?.prescriptionType}</td>
                          <td className="p-3 text-sm">
                            <ProductDetailsPopOver products={order.restorationProducts || []} />
                          </td>
                          <td className="p-3 text-sm text-center">
                            {/* Circular Progress UI */}
                            <div className="flex justify-center items-center">
                              <CircularProgress value={order?.percentage ?? 0} size={48} />
                            </div>
                          </td>
                          <td className="p-3 text-center capitalize">
                            {order?.orderMethod}
                          </td>
                          <td className="p-3 text-center ">
                            <CustomStatusBatch label={order?.category} variant='outline' className='m-auto' />
                          </td>
                          <td className="p-3 text-center">
                            <CustomStatusLabel label={order?.orderStatus} status={order?.orderStatus} rounded={true} />
                          </td>
                          <td className="p-3 text-center">
                            {/* Message Icon in rounded box with badge */}
                            <div className="relative inline-block">
                              <button
                                className="w-10 h-10 flex items-center justify-center rounded-xl shadow border border-gray-200 bg-white hover:bg-gray-50 focus:outline-none"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewOrder(order, "chat");
                                }}
                              >
                                <MessageCircle size={20} className="text-gray-500" />
                              </button>
                              {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 border-2 border-white shadow" style={{ minWidth: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {unreadCount}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            {/* Actions: OptionsMenu in rounded box */}
                            <div className="inline-block">
                              <OptionsMenu
                                options={[
                                  {
                                    icon: <Eye size={20} />, label: "View", onClick: () => handleViewOrder(order, "overview")
                                  },
                                  {
                                    icon: <DollarSign size={20} />, label: "Pricing", onClick: () => alert("Pricing clicked")
                                  },
                                  {
                                    icon: <CreditCard size={20} />, label: "Pay now", onClick: () => alert("Pay now clicked")
                                  },
                                  {
                                    icon: <Truck size={20} />, label: "Pickup Request", onClick: () => alert("Pickup Request clicked")
                                  },
                                ]}
                                trigger={
                                  <div className="w-10 h-10 flex items-center justify-center rounded-xl shadow border border-gray-200 bg-white hover:bg-gray-50">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <circle cx="12" cy="6" r="1" />
                                      <circle cx="12" cy="12" r="1" />
                                      <circle cx="12" cy="18" r="1" />
                                    </svg>
                                  </div>
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {filteredOrders.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No orders found matching your criteria
                    </p>
                  </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <div className="text-sm text-gray-500">
                    {filteredOrders.length === 0
                      ? "No entries"
                      : `Showing ${(currentPage - 1) * pageSize + 1} to ${Math.min(currentPage * pageSize, filteredOrders.length)} of ${filteredOrders.length} entries`}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      ←
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        className={`px-3 py-1 text-sm border rounded hover:bg-gray-50 ${currentPage === page ? "bg-teal-600 text-white" : ""}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Details Modal/Panel - Only show when order is selected */}
              {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
                    <OrderDetailView
                      isOpen={true}
                      onClose={() => setSelectedOrder(null)}
                      order={selectedOrder}
                      isEmbedded={false}
                      initialTab={orderDetailTab}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderTable;