// components/shared/CustomStatusLabel.tsx

import React from "react";
import {
  Clock,
  CircleX,
  CircleCheck,
  CircleCheckBigIcon,
  FlaskConical,
  Truck,
} from "lucide-react";
import { teethProcess } from "@/assets/svg";

const STATUS_CLASSES: Record<string, string> = {
  pending: "bg-[#FEF9C3] text-[#A16207] border-[#A16207]",
  active: "bg-[#DDE5F9] text-[#1D4ED8] border-[#1D4ED8]",
  trial: "bg-[#CCECF0] text-[#00A2B5] border-[#00A2B5]",
  rejected: "bg-[#FAD4CF] text-[#DB1A1A] border-[#DB1A1A]",
  dispatched: "bg-purple-100 text-purple-700 border-purple-500",
  delivered: "bg-green-100 text-green-700 border-green-500",
  default: "bg-gray-100 text-gray-600 border-gray-400",
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  pending: Clock,
  active: CircleCheck,
  trial: FlaskConical,
  rejected: CircleX,
  dispatched: Truck,
  delivered: CircleCheckBigIcon,
  default: Clock,
};

interface CustomStatusLabelProps {
  label: string;
  status:
    | "pending"
    | "active"
    | "trial"
    | "rejected"
    | "dispatched"
    | "delivered"
    | string;
  className?: string;
  rounded?: boolean;
}

const CustomStatusLabel: React.FC<CustomStatusLabelProps> = ({
  label,
  status,
  className = "",
  rounded = false,
}) => {
  const colorClass = STATUS_CLASSES[status] || STATUS_CLASSES.default;
  const Icon = STATUS_ICONS[status] || STATUS_ICONS.default;

  if (rounded) {
    return (
      <div
        className={`inline-flex items-center justify-center px-3 py-2 border text-12/16 rounded-full font-semibold  ${colorClass} ${className}`}
      >
        {label}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 border text-[14px] rounded-[8px] font-medium ${colorClass} ${className}`}
    >
      {status === "trial" ? (
        <img src={teethProcess} alt="status-icon" className="w-4 h-4" />
      ) : (
        <Icon size={16} />
      )}
      {label}
    </div>
  );
};

export default CustomStatusLabel;
