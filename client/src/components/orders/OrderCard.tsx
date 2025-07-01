import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Calendar,
  CreditCard,
  XCircle,
  RefreshCw,
  MessageCircle,
  CalendarArrowUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CrownBridgeTeeth, ImpantTeeth } from "@/assets/svg";
import CustomStatusBatch from "../common/customStatusBatch";
import CustomStatusLabel from "../common/customStatusLabel";
import dayjs from "dayjs";

export interface OrderMessage {
  label: string;
  messageBy: "lab" | "pickup" | "our";
}

export interface DentalOrder {
  id: string;
  refId: string;
  orderId: string;
  prescription: string;
  patientName: string;
  teethNo: string;
  productName: string;
  quantity: number;
  orderDate: string;
  orderCategory: string;
  orderStatus: "new" | "repair" | "repeat" | "custom";
  statusLabel:
  | "pending"
  | "active"
  | "trial"
  | "rejected"
  | "dispatched"
  | "delivered";
  percentage: number;
  chatConnection: boolean;
  unreadMessages?: number;
  messages?: OrderMessage[];
  isUrgent?: boolean;
  currency?: string;
  exportQuality?: string;
  paymentStatus?: "pending" | "paid" | "rejected";
  category?: string;
}

const statusConfig = {
  pending: {
    color: "bg-[#FEF9C3] text-[#A16207] border-[#A16207]",
    leftBorder: "#A16207",
    gradient: "linear-gradient(104deg, #FFFFFF 36%, #FEF9C3 100%)",
    progressColor: "#A16207",
  },
  active: {
    color: "bg-[#DDE5F9] text-[#1D4ED8] border-[#1D4ED8]",
    leftBorder: "#1D4ED8",
    gradient: "linear-gradient(104deg, #FFFFFF 36%, #DDE5F9 100%)",
    progressColor: "#1D4ED8",
  },
  trial: {
    color: "bg-[#CCECF0] text-[#00A2B5] border-[#00A2B5]",
    leftBorder: "#00A2B5",
    gradient: "linear-gradient(104deg, #FFFFFF 36%, #CCECF0 100%)",
    progressColor: "#00A2B5",
  },
  rejected: {
    color: "bg-[#FAD4CF] text-[#DB1A1A] border-[#DB1A1A]",
    leftBorder: "#DB1A1A",
    gradient: "linear-gradient(104deg, #FFFFFF 36%, #FAD4CF 100%)",
    progressColor: "#DB1A1A",
  },
  dispatched: {
    color: "bg-purple-100 text-purple-700 border-purple-500",
    leftBorder: "#9333EA", // Closest to purple-700
    gradient: "linear-gradient(104deg, #FFFFFF 36%, #E9D5FF 100%)", // Approx. purple-100
    progressColor: "#9333EA",
  },
  delivered: {
    color: "bg-green-100 text-green-700 border-green-500",
    leftBorder: "#15803D", // Closest to green-700
    gradient: "linear-gradient(104deg, #FFFFFF 36%, #DCFCE7 100%)", // Approx. green-100
    progressColor: "#15803D",
  },
};

const orderStatusConfig = {
  new: {
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    label: "New",
  },
  repair: {
    color: "bg-cyan-100 text-cyan-700 border-cyan-200",
    label: "Repair",
  },
  repeat: {
    color: "bg-blue-100 text-blue-700 border-blue-200",
    label: "Repeat",
  },
  custom: {
    color: "bg-purple-100 text-purple-700 border-purple-200",
    label: "Custom",
  },
};

interface DentalOrderCardProps {
  order: DentalOrder;
  onView?: (orderId: string) => void;
  onPricing?: (orderId: string) => void;
  onPayNow?: (orderId: string) => void;
  onResubmit?: (order: DentalOrder) => void;
  isSelected?: boolean;
}

export const OrderCard: React.FC<DentalOrderCardProps> = ({
  order,
  onView,
  onPricing,
  onPayNow,
  onResubmit,
  isSelected = false,
}) => {
  const statusStyle = statusConfig[order?.statusLabel];
  const orderStatusStyle = orderStatusConfig[order?.orderStatus];

  const isPaymentCompleted =
    order?.paymentStatus === "paid" || order?.statusLabel === "delivered";
  const isRejected =
    order?.statusLabel === "rejected" || order?.paymentStatus === "rejected";
  return (
    <Card
      className={cn(
        "hover:shadow-md transition-all cursor-pointer border border-gray-200 rounded-lg w-full",
        isSelected ? "ring-2 ring-[#00A3C8]" : ""
      )}
      style={{
        background: statusStyle?.gradient,
        // minHeight: "294px",
      }}
    >
      <CardContent className="p-4 relative">
        {/* Vertical divider line */}
        <div
          className="absolute left-0 top-4 bottom-4 w-1 rounded-r-sm"
          style={{
            backgroundColor: statusStyle?.leftBorder,
          }}
        />

        {/* Header with category icon, order info, and progress */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            {/* Category Icon */}
            <div className="w-10 h-10 bg-teal-500 rounded-[6px] flex items-center justify-center flex-shrink-0">
              {order.category === "implant" ? (
                <img src={ImpantTeeth} alt="CrownBridgeTeeth" />
              ) : (
                <img src={CrownBridgeTeeth} alt="CrownBridgeTeeth" />
              )}
            </div>

            {/* Order Details */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-customBlack-100 text-14/20">
                  {order?.orderId ?? order?.refId}
                </h3>
              </div>
              <p className="text-14/20 text-customBlack-100 font-medium">
                {order?.prescription}
              </p>
            </div>
          </div>

          {/* Circular Progress Indicator */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              {/* Background Circle */}
              <svg
                className="w-12 h-12 transform -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="2"
                />
                {/* Progress Circle */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={statusStyle?.progressColor}
                  strokeWidth="2"
                  strokeDasharray={`${order?.percentage}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              {/* Percentage Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-900">
                  {order?.percentage}%
                </span>
              </div>
            </div>

            {/* Chat Icon with notification */}
            {order.chatConnection && (
              <div className="relative">
                <div className="w-12 h-12 bg-white rounded-[8px] border border-gray-200 flex items-center justify-center shadow-sm">
                  <MessageCircle className="w-5 h-5 text-gray-700" />
                </div>
                {order.unreadMessages && order.unreadMessages > 0 && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-xs font-bold text-white">
                      {order.unreadMessages}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reference Section */}
        <div className="mb-3">
          <div className="flex items-start justify-between">
            {/* Left side - Reference, Patient, Teeth */}
            <div className="flex-1">
              <div className="text-base text-gray-600 font-semibold mb-1">
                {((order as any).patientFirstName || (order as any).patientLastName)
                  ? `${(order as any).patientFirstName || ''} ${(order as any).patientLastName || ''}`.trim()
                  : order?.patientName || 'Unknown Patient'}
              </div>
              <div className="text-sm text-gray-600">
                Teeth No :{" "}
                <span className="text-gray-900 font-medium">
                  {order?.teethNo}
                  , {(Array.isArray((order as any).selectedTeeth) ? (order as any).selectedTeeth.map((t: any) => t.toothNumber || t).join(', ') : '')}
                </span>
              </div>
              {/* Dates */}
              <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                <div className="">
                  <div className="flex items-center gap-1 mt-[12px] font-medium text-customGray-100 text-12/16">
                    <CalendarArrowUp className="w-4 h-4 text-customGreen-100" />
                    <span>Order Date</span>
                  </div>
                  <span className="text-customGray-100 font-medium text-12/16">
                    {(order as any)?.createdAt
                      ? dayjs((order as any).createdAt).format("DD-MM-YYYY | hh:mm A")
                      : order?.orderDate || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right side - Product info and Order type */}
            <div className="flex flex-col items-end text-right">
              <div className="text-sm text-customGray-100">
                {order?.currency || "USD"} /{" "}
                {order?.exportQuality || "Export Quality"}
              </div>
              <div className="text-sm text-customGray-100">
                E-max 10 year x {order?.quantity}
              </div>
              <div className="flex items-center my-2">
                <CustomStatusBatch label={order?.orderStatus as "new" | "repair" | "repeat"} />
              </div>
              <CustomStatusLabel
                label={order?.statusLabel}
                status={order?.statusLabel}
              />
            </div>
          </div>
        </div>

        {/* Status Messages for non-rejected orders */}
        {!isRejected && order?.messages && order?.messages?.length > 0 && (
          <div className="flex items-start gap-2">
            <div className="flex-1 space-y-2 my-2">
              {order?.messages?.map((msg, idx) => (
                <div key={idx} className="text-sm leading-5">
                  {msg.messageBy === "pickup" ? (
                    <p className="font-semibold text-red-600 text-[12px] leading-[16px]">
                      • {msg.label ?? ""}
                    </p>
                  ) : (
                    <p className="font-semibold text-blue-600 text-[12px] leading-[16px]">
                      • {msg.label ?? ""}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rejection Info */}
        {/* {isRejected && (
          <div className="my-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <XCircle
                size={16}
                className="text-red-600 mt-0.5 flex-shrink-0"
              />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-red-800">Rejected</p>
                {order.messages &&
                  order.messages.map((message, index) => (
                    <p key={index} className="text-sm text-red-700">
                      {message}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        )} */}

        {/* Action Buttons - 3 buttons in a single row */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={(e) => {
                e.stopPropagation();
                onView?.(order?.id);
              }}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              View
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={(e) => {
                e.stopPropagation();
                onPricing?.(order?.id);
              }}
            >
              <CreditCard className="w-4 h-4 mr-1" />
              Pricing
            </Button>

            {/* Pay Now Button - Only enabled for delivered status */}
            <Button
              size="sm"
              className={cn(
                "flex-1",
                order?.statusLabel === "delivered"
                  ? "bg-teal-500 hover:bg-teal-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              )}
              disabled={order?.statusLabel !== "delivered"}
              onClick={(e) => {
                e.stopPropagation();
                if (order?.statusLabel === "delivered") {
                  onPayNow?.(order?.id);
                }
              }}
            >
              <CreditCard className="w-4 h-4 mr-1" />
              Pay Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};