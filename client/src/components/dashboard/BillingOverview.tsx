import React, { useState } from "react";
import BillingStatCard from "@/components/ui/BillingStatCard.tsx";
import { Button } from "@/components/ui/button";
import { FileChartColumnIncreasing } from "lucide-react";
import {
  AlertCircle,
  FileText,
  IndianRupee,
  Receipt,
  CheckCircle,
  CreditCard,
  Eye, // <- add this
} from "lucide-react";
import CustomButton from "../common/customButtom";
import SettlementModal from "./SettlementModal";

interface BillingOverviewProps {
  onStatementClick?: () => void;
}

const BillingOverview = ({ onStatementClick }: BillingOverviewProps = {}) => {
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);

  const stats = [
    {
      title: "Total Due",
      icon: <AlertCircle className="text-red-500" />,
      value: "₹35,000",
      actions: (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1 px-3 py-1.5 text-sm"
          >
            <Eye className="w-4 h-4" /> View
          </Button>
          <Button
            variant="default"
            size="sm"
            className="gap-1 px-3 py-1.5 text-sm"
          >
            <CreditCard className="w-4 h-4" /> Pay
          </Button>
        </div>
      ),
      gradient:
        "linear-gradient(120deg, rgba(255, 255, 255, 0.00) 45.8%, rgba(219, 26, 26, 0.05) 98.55%)",
      // borderColor: "#fbcaca",
      isTotalDue: true, // <- This triggers the special layout
    },
    {
      title: "Invoice Amount",
      icon: <FileText className="text-purple-600" />,
      value: "₹35,000",
      valueClassName: 'text-purple-600',
      subtext: "Pending Invoice",
      subvalue: "3",
      gradient:
        "linear-gradient(120deg, rgba(255, 255, 255, 0.00) 42.43%, rgba(107, 33, 168, 0.05) 91.33%)",
      // borderColor: "#e2ccff",
      variant: "default",
    },
    {
      title: "Invoice Amount",
      icon: <IndianRupee className="text-orange-500" />,
      value: "₹17,000",
      valueClassName: 'text-orange-500',
      subtext: "No. of Invoice",
      subvalue: "3",
      gradient:
        "linear-gradient(120deg, rgba(255, 255, 255, 0.00) 45.86%, rgba(254, 132, 10, 0.05) 98.69%)",
      // borderColor: "#ffe1b4",
      variant: "default",
    },
    {
      title: "Order Amount",
      icon: <Receipt className="text-yellow-500" />,
      value: "₹20,000",
      valueClassName: 'text-yellow-500',
      subtext: "Delivered Order",
      subvalue: "5",
      gradient:
        "linear-gradient(120deg, rgba(255, 255, 255, 0.00) 45.86%, rgba(254, 132, 10, 0.05) 98.69%)",
      // borderColor: "#fef1aa",
      variant: "default",
    },
    {
      title: "Payment Done",
      icon: <CheckCircle className="text-green-600" />,
      value: "₹17,000",
      valueClassName: 'text-green-600',
      subtext: "Total Invoice Done",
      subvalue: "5",
      gradient:
        "linear-gradient(103deg, rgba(255, 255, 255, 0.00) 45.86%, rgba(11, 128, 67, 0.05) 98.69%)",
      // borderColor: "#b3f2d2",
      variant: "default",
    },
    {
      title: "Paid Amount",
      icon: <CreditCard className="text-purple-600" />,
      value: "₹17,000",
      valueClassName: 'text-purple-600',
      subtext: "No. of Payment",
      subvalue: "5",
      gradient:
        "linear-gradient(120deg, rgba(255, 255, 255, 0.00) 45.86%, rgba(254, 132, 10, 0.05) 98.69%)",
      // borderColor: "#d4ccff",
      variant: "default",
    },
  ];

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[20px] leading-[28px] font-semibold">
          Billing Overview
        </h2>
        <div className="flex gap-2">
          {onStatementClick && (
            <CustomButton
              variant="outline"
              leftIcon={FileText}
              className="w-fit"
              onClick={onStatementClick}
            >
              Download Statement
            </CustomButton>
          )}
          <CustomButton
            variant="primary"
            leftIcon={FileChartColumnIncreasing}
            className="w-fit"
            onClick={() => setIsSettlementModalOpen(true)}
          >
            Settlement
          </CustomButton>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <BillingStatCard key={idx} {...stat} />
        ))}
      </div>

      <SettlementModal
        isOpen={isSettlementModalOpen}
        onClose={() => setIsSettlementModalOpen(false)}
      />
    </div>
  );
};

export default BillingOverview;