// INFOR : This is the order table component that is used to display the orders in the order table page. in Order tab in sidebar

import React, { useState } from "react";
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
import CustomStatusBatch from "../../components/common/customStatusBatch";
import CustomStatusLabel from "../../components/common/customStatusLabel";
import OptionsMenu from "../../components/common/OptionsMenu";
import CircularProgress from "../../components/common/CircularProgress";
import { useAppSelector } from "@/store/hooks";
import {
  useGetOrderByIdQuery,
} from "@/store/slices/orderApi";
import { useGetChatsQuery } from "@/store/slices/chatApi"; // <-- Add this import
import ProductDetailsPopOver from "@/components/common/ProductDetailsPopOver";
import { useNavigate } from "react-router-dom";

interface OrderTableProps {
  onViewOrder?: (order: any) => void;
  onPayNow?: (orderId: string) => void;
}

const OrderTable = ({ onViewOrder, onPayNow }: OrderTableProps) => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>("");
  const [patientFilter, setPatientFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [orderTypeFilter, setOrderTypeFilter] = useState("all");
  const [orderDetailTab, setOrderDetailTab] = useState<string>("overview");

  const UserData = useAppSelector((state) => state.userData);
  const user = UserData.userData;
  const clinicId = user?.clinicId;
  console.log("clinicId", clinicId);

  // Only call the query if clinicId is defined
  const {
    data: dbOrders = [],
    isLoading,
    isError: error,
    error: errorMessage,
    refetch,
  } = useGetOrderByIdQuery(clinicId ?? "", { skip: !clinicId });
  // Add type annotation to dbOrders
  const orders: any[] = dbOrders as any[];

  // Fetch all chats for this clinic and user
  const { data: chats = [] } = useGetChatsQuery({ clinicId, userId: user?.fullName });

  // Map orderId to chat unreadCount
  const orderIdToUnreadCount: Record<string, number> = {};
  chats.forEach((chat: any) => {
    if (chat.orderId) {
      orderIdToUnreadCount[chat.orderId] = chat.unreadCount || 0;
    }
  });

  const imageData = '<svg width=\"545\" height=\"545\" viewBox=\"0 0 545 545\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect width=\"545\" height=\"545\" fill=\"white\"/>\n<g clip-path=\"url(#clip0_22122_7059)\">\n<path d=\"M122.638 225.739C122.638 225.739 122.128 236.498 106.773 236.823C91.4175 237.148 91.7422 213.171 91.7422 213.171C91.7422 213.171 90.3969 194.805 104.824 191.002C104.824 191.002 121.756 187.385 122.684 219.988\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M116.329 197.309C116.329 197.309 114.798 178.804 131.545 172.636C131.545 172.636 143.653 167.767 155.807 178.573\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M155.76 193.135C155.76 193.135 147.178 136.044 184.429 151.905\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M185.96 176.393C185.96 176.393 181.321 154.781 185.96 140.265C190.599 125.749 200.526 114.711 219.453 126.815\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M220.381 148.984C220.381 148.984 216.067 125.888 224.371 108.728C232.628 91.5219 258.096 90.548 268.023 110.073\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M267.977 135.812C267.977 135.812 255.73 89.852 290.801 85.9099C290.801 85.9099 321.882 83.3128 319.563 122.316\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M313.207 95.6035C313.207 95.6035 323.552 77.2843 343.082 79.9279C362.612 82.5714 373.189 96.4382 375.833 124.218\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M366.23 93.1916C366.23 93.1916 410.533 74.3623 414.847 135.859\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M407.889 107.708C407.889 107.708 416.332 102.746 422.78 114.665C429.228 126.584 433.032 136.462 434.377 144.068C435.723 151.674 434.563 154.967 429.924 154.317\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M425.888 121.62C425.888 121.62 442.913 119.162 446.717 145.737C450.521 172.357 446.392 175.326 442.727 177.134C439.109 178.943 434.795 176.485 432.15 171.847\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M443.284 176.81C443.284 176.81 450.752 197.309 437.114 204.915C437.114 204.915 439.758 219.895 428.068 220.684C428.068 220.684 429.552 232.046 418.326 233.53C418.326 233.53 420.97 254.354 393.183 247.397C393.183 247.397 387.848 262.887 374.395 261.125C374.395 261.125 359.086 257.925 352.684 245.124C352.684 245.124 350.365 236.545 358.947 235.988C358.947 235.988 348.927 207.883 377.596 208.115C377.596 208.115 371.426 194.248 387.291 187.848C387.291 187.848 380.008 172.405 395.456 166.051C395.456 166.051 383.766 153.482 397.868 144.021\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M417.027 176.393C417.027 176.393 392.997 181.03 403.342 199.999C403.342 199.999 386.596 207.28 394.946 220.498C394.946 220.498 369.153 222.724 376.854 241.878\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M417.027 140.126C417.027 140.126 392.348 149.773 375.787 130.572C375.787 130.572 353.983 148.428 321.232 130.572C321.232 130.572 311.305 154.457 270.621 143.975C270.621 143.975 263.013 168.88 228.963 161.599C228.963 161.599 218.061 199.628 188.604 187.709C188.604 187.709 183.64 216.139 159.518 206.539C159.518 206.539 151.91 233.669 122.638 226.574\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M116.282 234.69C116.282 234.69 122.73 247.351 134.189 247.351C145.647 247.351 154.925 233.901 154.925 233.901C154.925 233.901 167.45 240.626 180.022 230.701C192.593 220.777 192.918 212.197 192.918 212.197C192.918 212.197 214.257 222.168 220.381 193.136C220.381 193.136 250.488 199.165 247.333 162.434\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M128.112 324.291C128.112 324.291 124.818 361.995 102.319 350.401C102.319 350.401 91.0928 337.508 98.0049 319.004C104.917 300.499 124.772 307.085 128.112 317.659C128.112 317.659 158.868 312.372 163.183 339.131C163.183 339.131 188.651 329.856 194.264 357.636C194.264 357.636 221.031 343.398 233.602 383.422C233.602 383.422 265.008 374.842 273.637 400.628C273.637 400.628 309.032 391.028 324.897 413.196C324.897 413.196 352.035 395.248 380.89 413.196C380.89 413.196 394.343 394.553 423.012 403.596\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M120.504 346.552C120.504 346.552 120.04 366.819 134.838 371.688C149.637 376.558 161.745 367.932 161.745 351.421\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M160.538 359.77C160.538 359.77 156.41 391.399 171.115 395.016C185.821 398.634 189.949 391.213 189.949 391.213\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M190.785 366.123C190.785 366.123 185.311 396.547 194.078 413.243C202.846 429.939 221.866 419.364 224.649 416.535\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M224.649 395.017C224.649 395.017 220.01 427.249 231.747 440.327C243.483 453.406 263.477 452.896 272.43 433.371\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M272.477 408.744C272.477 408.744 261.39 455.864 293.167 458.925C324.897 462.032 324.48 423.863 324.48 423.863\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M318.264 446.589C318.264 446.589 327.031 465.093 347.211 464.258C367.39 463.424 378.942 445.104 380.426 420.432\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M370.081 451.458C370.081 451.458 387.709 460.872 402.508 449.232C417.259 437.591 419.254 408.744 419.254 408.744\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M411.739 437.127C411.739 437.127 422.965 444.269 431.362 422.426C439.758 400.535 441.289 392.419 435.769 389.08\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M120.504 309.264C120.504 309.264 125.468 298.829 138.689 297.67C151.91 296.51 158.868 311.908 158.868 311.908C158.868 311.908 170.93 304.302 182.991 313.067C195.052 321.832 196.212 331.433 196.212 331.433C196.212 331.433 209.619 327.305 217.227 335.746C224.835 344.186 224.649 351.468 224.649 351.468C224.649 351.468 237.545 349.01 244.829 356.94C252.112 364.871 251.787 382.216 251.787 382.216\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M402.6 401.324C402.6 401.324 387.384 392.187 400.281 377.903C400.281 377.903 383.07 375.862 392.023 356.662C392.023 356.662 375.138 352.674 382.745 335.514C382.745 335.514 362.241 338.807 362.241 320.627L364.236 307.316C364.236 307.316 350.69 306.76 359.597 296.186C368.504 285.612 378.106 283.942 378.106 283.942C378.106 283.942 385.622 281.299 391.096 287.235C396.616 293.171 398.24 297.16 398.24 297.16C398.24 297.16 407.378 293.542 415.775 298.041C424.172 302.539 422.919 312.696 422.919 312.696C422.919 312.696 434.424 311.537 432.939 325.264C432.939 325.264 439.202 325.264 441.197 330.876C443.191 336.488 441.197 341.45 441.197 341.45C441.197 341.45 449.361 344.975 450.011 354.019C450.66 363.062 448.48 367.236 448.48 367.236\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M436.186 372.106C436.186 372.106 441.521 365.474 450.196 369.694C450.196 369.694 454.928 371.225 452.701 389.08C450.474 406.935 441.011 425.44 430.898 423.446\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M95.7319 211.872C95.7319 211.872 94.6186 196.985 107.144 197.634C119.391 198.283 116.236 211.872 116.236 211.872\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M121.617 196.01C121.617 196.01 120.365 180.427 135.163 177.83C149.961 175.233 151.399 183.442 151.399 183.442\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M158.868 171.569C158.868 171.569 157.987 160.3 166.151 158.12C174.316 155.894 173.898 154.363 178.955 156.589\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M189.207 149.633C189.207 149.633 188.094 135.024 198.346 132.148C208.598 129.273 208.088 127.279 214.397 130.154\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M226.783 123.569C226.783 123.569 225.484 109.934 237.638 107.244C249.839 104.554 249.189 102.699 256.751 105.389\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M272.523 113.829C272.523 113.829 271.039 100.194 284.817 97.5045C298.594 94.8146 297.898 92.9595 306.388 95.6494\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M322.995 104.09C322.995 104.09 321.65 92.9596 334.268 90.7798C346.932 88.6001 346.283 87.0696 354.123 89.2494\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M100.881 321.183C100.881 321.183 104.87 313.252 113.684 312.789C122.498 312.325 123.148 321.369 123.612 323.827\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M130.014 342.285C130.014 342.285 134.513 329.531 144.534 328.836C154.554 328.14 155.296 342.61 155.806 346.506\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M165.27 357.404C165.27 357.404 168.981 344.651 177.239 343.955C185.496 343.259 186.099 357.729 186.517 361.625\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M194.264 382.494C194.264 382.494 199.413 369.74 210.871 369.045C222.329 368.349 223.211 382.819 223.768 386.715\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M232.767 404.524C232.767 404.524 237.916 391.77 249.375 391.074C260.833 390.378 261.714 404.848 262.271 408.744\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M279.064 422.193C279.064 422.193 285.512 409.44 299.847 408.744C314.181 408.048 315.248 422.518 315.944 426.414\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n<path d=\"M423.847 398.355C423.847 398.355 401.116 398.819 411.507 376.743C411.507 376.743 396.523 369.462 403.435 354.714C403.435 354.714 385.018 348.082 393.415 332.221C393.415 332.221 362.751 335.746 372.493 304.023\" stroke=\"#231F20\" stroke-width=\"2.5\" stroke-miterlimit=\"10\"/>\n</g>\n<defs>\n<clipPath id=\"clip0_22122_7059\">\n<rect width=\"363\" height=\"386\" fill=\"white\" transform=\"translate(91 79)\"/>\n</clipPath>\n</defs>\n</svg>\n';

  function iconToImage(iconData: any, mimeType = 'image/png') {
    if (!iconData) return '';
    let uint8Array;
    if (Array.isArray(iconData)) {
      uint8Array = new Uint8Array(iconData);
    } else if (iconData instanceof Uint8Array) {
      uint8Array = iconData;
    } else if (iconData instanceof ArrayBuffer) {
      uint8Array = new Uint8Array(iconData);
    } else {
      return '';
    }
    let binary = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    const base64 = btoa(binary);
    return `data:${mimeType};base64,${base64}`;
  }

  // Replace getOrderTeeth and getOrderToothGroups to use order data directly
  const getOrderTeeth = (orderId: number) => {
    const order = orders.find((o: any) => o.id === orderId);
    if (!order || !order.teethGroup) return [];
    const allTeeth: string[] = [];
    order.teethGroup.forEach((group: any) => {
      if (group.teeth && Array.isArray(group.teeth)) {
        allTeeth.push(...group.teeth.map((tooth: any) => tooth.toString()));
      }
    });
    return Array.from(new Set(allTeeth)).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );
  };

  const getOrderToothGroups = (orderId: number) => {
    const order = orders.find((o: any) => o.id === orderId);
    if (!order || !order.teethGroup || !Array.isArray(order.teethGroup))
      return [];
    return order.teethGroup;
  };

  const getOrderType = (orderId: number) => {
    const order = orders.find((o: any) => o.id === orderId);
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
    { id: "all", label: "All", count: orders.length },
    {
      id: "new_today",
      label: "New Today",
      count: orders.filter((o: any) => {
        const today = new Date().toDateString();
        return new Date(o.createdAt).toDateString() === today;
      }).length,
    },
    {
      id: "trial_ready",
      label: "Trial Work Ready",
      count: orders.filter((o: any) => o.status === "trial_ready").length,
    },
    {
      id: "in_progress",
      label: "In Progress",
      count: orders.filter((o: any) => o.status === "in_progress").length,
    },
    {
      id: "completed",
      label: "Completed",
      count: orders.filter((o: any) => o.status === "completed").length,
    },
    {
      id: "rejected",
      label: "Rejected",
      count: orders.filter((o: any) => o.status === "rejected").length,
    },
  ];

  // Get unique patient names for filter dropdown
  const uniquePatients = Array.from(
    new Set(
      orders.map((order: any) => `${order.firstName} ${order.lastName}`)
    )
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

  // Replace getUnreadCountForOrder to use chat unread count
  const getUnreadCountForOrder = (id: string) => {
    if (!id) return 0;
    return orderIdToUnreadCount[id] || 0;
  };

  const filteredOrders = orders.filter((order: any) => {
    const patientName = `${order.firstName} ${order.lastName}`;
    const matchesSearch =
      searchTerm === "" ||
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase());
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
        (today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
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
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  console.log("filteredOrders", filteredOrders);

  const handleViewOrder = (
    selectedOrderId: string,
    tab: string = "overview"
  ) => {
    setSelectedOrderId(selectedOrderId);
    setOrderDetailTab(tab);
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
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
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
          onClick={() => navigate("/place-order")}
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
                      <th className="text-left p-3 text-sm font-medium text-gray-600">
                        Order Date
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-gray-600">
                        ID
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-gray-600">
                        Patient name
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-gray-600">
                        Prescription
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-gray-600">
                        Product
                      </th>
                      <th className="text-center p-3 text-sm font-medium text-gray-600">
                        Progress
                      </th>
                      <th className="text-center p-3 text-sm font-medium text-gray-600">
                        Order Method
                      </th>
                      <th className="text-center p-3 text-sm font-medium text-gray-600">
                        Category
                      </th>
                      <th className="text-center p-3 text-sm font-medium text-gray-600">
                        Status
                      </th>
                      <th className="text-center p-3 text-sm font-medium text-gray-600">
                        Message
                      </th>
                      <th className="text-center p-3 text-sm font-medium text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map((order: any, index: number) => {
                      const orderTeeth = getOrderTeeth(order?.id);
                      const teethGroup = getOrderToothGroups(order?.id);
                      // Get real unread count for this order's chat
                      const unreadCount = getUnreadCountForOrder(order?.id);
                      return (
                        <tr
                          key={order.id}
                          className={`border-b hover:bg-gray-50 ${selectedOrderId === order?.id ? "bg-blue-50" : ""
                            }`}
                        >
                          <td className="p-3 text-sm">
                            {formatDate(order?.createdAt)}
                          </td>
                          <td
                            className="p-3 text-sm font-medium text-blue-600 cursor-pointer"
                            onClick={() =>
                              handleViewOrder(order?.id, "overview")
                            }
                          >
                            {order?.orderId || order?.refId}
                          </td>
                          <td className="p-3 text-sm">
                            {order?.firstName} {order?.lastName}
                          </td>
                          <td className="p-3 text-sm capitalize">
                            {order?.prescriptionTypes}
                          </td>
                          <td className="p-3 text-sm">
                            <ProductDetailsPopOver
                              products={order.products || []}
                            />
                          </td>
                          <td className="p-3 text-sm text-center">
                            {/* Circular Progress UI */}
                            <div className="flex justify-center items-center">
                              <CircularProgress
                                value={order?.percentage ?? 0}
                                size={48}
                              />
                            </div>
                          </td>
                          <td className="p-3 text-center capitalize">
                            {order?.orderMethod}
                          </td>
                          <td className="p-3 text-center ">
                            <CustomStatusBatch
                              label={order?.category}
                              variant="outline"
                              className="m-auto"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <CustomStatusLabel
                              label={order?.orderStatus}
                              status={order?.orderStatus}
                              rounded={true}
                            />
                          </td>
                          <td className="p-3 text-center">
                            {/* Message Icon in rounded box with badge */}
                            <div className="relative inline-block">
                              <button
                                className="w-10 h-10 flex items-center justify-center rounded-xl shadow border border-gray-200 bg-white hover:bg-gray-50 focus:outline-none"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewOrder(order?.id, "chat");
                                }}
                              >
                                <MessageCircle
                                  size={20}
                                  className="text-gray-500"
                                />
                              </button>
                              {unreadCount > 0 && (
                                <span
                                  className="absolute -top-1 -right-1 bg-teal-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 border-2 border-white shadow"
                                  style={{
                                    minWidth: "20px",
                                    height: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
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
                                    icon: <Eye size={20} />,
                                    label: "View",
                                    onClick: () =>
                                      handleViewOrder(order?.id, "overview"),
                                  },
                                  {
                                    icon: <DollarSign size={20} />,
                                    label: "Pricing",
                                    onClick: () => alert("Pricing clicked"),
                                  },
                                  {
                                    icon: <CreditCard size={20} />,
                                    label: "Pay now",
                                    onClick: () => alert("Pay now clicked"),
                                  },
                                  {
                                    icon: <Truck size={20} />,
                                    label: "Pickup Request",
                                    onClick: () =>
                                      alert("Pickup Request clicked"),
                                  },
                                ]}
                                trigger={
                                  <div className="w-10 h-10 flex items-center justify-center rounded-xl shadow border border-gray-200 bg-white hover:bg-gray-50">
                                    <svg
                                      width="20"
                                      height="20"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    >
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
                      : `Showing ${(currentPage - 1) * pageSize + 1
                      } to ${Math.min(
                        currentPage * pageSize,
                        filteredOrders.length
                      )} of ${filteredOrders.length} entries`}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      ←
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          className={`px-3 py-1 text-sm border rounded hover:bg-gray-50 ${currentPage === page ? "bg-teal-600 text-white" : ""
                            }`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Details Modal/Panel - Only show when order is selected */}
              {selectedOrderId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
                    <OrderDetailView
                      isOpen={true}
                      onClose={() => setSelectedOrderId(null)}
                      orderId={selectedOrderId}
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
      <img src={iconToImage(imageData, 'image/svg+xml')} alt="icon" />
    </div>
  );
};

export default OrderTable;
