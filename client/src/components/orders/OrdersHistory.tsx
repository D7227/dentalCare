import React, { useState } from "react";
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
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrderDetailView from "@/components/OrderDetailView";
import { OrderStatusBadge } from "../shared/OrderStatusBadge";
import { DoctorInfo } from "../shared/DoctorInfo";
import { ToothSummary } from "../shared/ToothSummary";
import { useQuery } from "@tanstack/react-query";

interface OrdersHistoryProps {
  onViewOrder?: (order: any) => void;
  onPayNow?: (orderId: string) => void;
}

const OrdersHistory = ({ onViewOrder, onPayNow }: OrdersHistoryProps) => {
  const [location, setLocation] = useLocation();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [patientFilter, setPatientFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [orderTypeFilter, setOrderTypeFilter] = useState("all");

  const {
    data: dbOrders = [],
    isLoading,
    error,
  } = useQuery<any[]>({
    queryKey: ["/api/orders"],
    refetchInterval: 30000,
  });

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

  const filteredOrders = dbOrders.filter((order: any) => {
    const patientName = getPatientName(order.patientId);
    const matchesSearch =
      searchTerm === "" ||
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getOrderType(order.id).toLowerCase().includes(searchTerm.toLowerCase());

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

  return (
    <div className="space-y-2">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground">
            View and manage all your dental lab orders
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setLocation("/place-order")}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            New Order
          </Button>
        </div>
      </div>

      <Card>
        {/* Search Bar and Filters */}
        <div className="p-4 pb-2 space-y-3">
          <div className="flex gap-3 items-center">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-8 text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Patient Filter */}
              <Select value={patientFilter} onValueChange={setPatientFilter}>
                <SelectTrigger className="h-8 text-xs w-36">
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
                <SelectTrigger className="h-8 text-xs w-32">
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
                <SelectTrigger className="h-8 text-xs w-28">
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
                <SelectTrigger className="h-8 text-xs w-28">
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
                <SelectTrigger className="h-8 text-xs w-32">
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

        <CardContent className="p-2">
          <div className="space-y-4">
            {/* Orders Content */}
            <div className="mt-1">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 h-[calc(100vh-200px)]">
                {/* Orders List */}
                <div className="lg:col-span-1 space-y-4 overflow-y-auto ml-[0px] mr-[0px] pl-[4px] pr-[4px] mt-[0.24rem] mb-[0.24rem]">
                  <h3 className="text-lg font-semibold text-foreground">
                    Orders List
                  </h3>
                  {filteredOrders.map((order: any) => (
                    <Card
                      key={order.id}
                      className={`hover:shadow-md transition-all cursor-pointer flex flex-col bg-[#FBFBFB] border-border ${
                        selectedOrder?.id === order.id
                          ? "ring-2 ring-[#00A3C8] bg-blue-50"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleViewOrder(order)}
                    >
                      <CardContent className="p-4 flex-1 flex flex-col">
                        <div className="space-y-3 flex-1">
                          {/* Order ID/Reference ID + Patient Name */}
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-card-foreground text-sm">
                                {order.orderId || order.referenceId}
                              </h3>
                              <p className="text-sm font-medium text-[#020817] leading-tight">
                                {getPatientName(order.patientId)}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <OrderStatusBadge status={order.status} />
                              <Badge
                                variant={
                                  order.paymentStatus === "paid"
                                    ? "default"
                                    : order.paymentStatus === "partial"
                                      ? "secondary"
                                      : "outline"
                                }
                                className="text-xs"
                              >
                                {order.paymentStatus === "pending_payment"
                                  ? "Payment Pending"
                                  : order.paymentStatus === "partial"
                                    ? "Partial Payment"
                                    : "Paid"}
                              </Badge>
                            </div>
                          </div>

                          {/* Order type + Date */}
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-[#047869] text-[14px]">
                              {getOrderType(order.id)}
                            </span>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar size={14} />
                              <span>{formatDate(order.createdAt)}</span>
                            </div>
                          </div>

                          {/* Teeth */}
                          <ToothSummary
                            toothGroups={getOrderToothGroups(order.id)}
                            compact={true}
                            maxDisplay={3}
                          />

                          {/* Doctor Info */}
                          <DoctorInfo
                            doctor={{
                              name:
                                order.consultingDoctor || "Dr. Not Assigned",
                              phone: "+1-555-0123",
                              email: "doctor@clinic.com",
                              clinicName: "Advanced Dental Lab",
                              clinicAddress: "123 Dental Street",
                              city: "Medical City",
                              state: "CA",
                              pincode: "90210",
                            }}
                            compact={true}
                          />

                          {/* Notes if available */}
                          {order.notes && (
                            <div className="p-2 bg-muted/20 rounded text-xs">
                              <span className="font-medium text-muted-foreground">
                                Notes:{" "}
                              </span>
                              <span className="text-card-foreground">
                                {order.notes}
                              </span>
                            </div>
                          )}

                          {/* Rejection Info */}
                          {order.status === "rejected" && (
                            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                              <div className="flex items-start gap-2">
                                <XCircle
                                  size={16}
                                  className="text-destructive mt-0.5 flex-shrink-0"
                                />
                                <div className="flex-1 space-y-1">
                                  <p className="text-sm font-medium text-destructive">
                                    Rejected
                                  </p>
                                  <p className="text-xs text-destructive/80">
                                    Missing bite registration
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Resubmit Button if Rejected */}
                          {order.status === "rejected" && (
                            <div className="flex gap-2 pt-3 mt-auto">
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleResubmitFromCard(order);
                                }}
                                className="flex-1"
                              >
                                <RefreshCw size={14} className="mr-1" />{" "}
                                Resubmit
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {filteredOrders.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No orders found matching your criteria
                      </p>
                    </div>
                  )}
                </div>

                {/* Order Details */}
                <div className="lg:col-span-2 border rounded-lg bg-background overflow-y-auto">
                  {selectedOrder ? (
                    <OrderDetailView
                      isOpen={true}
                      onClose={() => setSelectedOrder(null)}
                      order={selectedOrder}
                      isEmbedded={true}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
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
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersHistory;
