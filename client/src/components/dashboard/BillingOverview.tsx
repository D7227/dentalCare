import React from "react";
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

const BillingOverview = () => {
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
      gradient: "linear-gradient(135deg, #ffffff 40%, #ffe5e5 100%)",
      borderColor: "#fbcaca",
      isTotalDue: true, // <- This triggers the special layout
    },
    {
      title: "Invoice Amount",
      icon: <FileText className="text-purple-600" />,
      value: "₹35,000",
      subtext: "Pending Invoice",
      subvalue: "3",
      gradient: "linear-gradient(135deg, #ffffff 40%, #f3e8ff 100%)",
      borderColor: "#e2ccff",
      variant: "default",
    },
    {
      title: "Invoice Amount",
      icon: <IndianRupee className="text-orange-500" />,
      value: "₹17,000",
      subtext: "No. of Invoice",
      subvalue: "3",
      gradient: "linear-gradient(135deg, #ffffff 40%, #fff1db 100%)",
      borderColor: "#ffe1b4",
      variant: "default",
    },
    {
      title: "Order Amount",
      icon: <Receipt className="text-yellow-500" />,
      value: "₹20,000",
      subtext: "Delivered Order",
      subvalue: "5",
      gradient: "linear-gradient(135deg, #ffffff 40%, #fffbd1 100%)",
      borderColor: "#fef1aa",
      variant: "default",
    },
    {
      title: "Payment Done",
      icon: <CheckCircle className="text-green-600" />,
      value: "₹17,000",
      subtext: "Total Invoice Done",
      subvalue: "5",
      gradient: "linear-gradient(135deg, #ffffff 40%, #e5fff1 100%)",
      borderColor: "#b3f2d2",
      variant: "default",
    },
    {
      title: "Paid Amount",
      icon: <CreditCard className="text-purple-600" />,
      value: "₹17,000",
      subtext: "No. of Payment",
      subvalue: "5",
      gradient: "linear-gradient(135deg, #ffffff 40%, #ece7ff 100%)",
      borderColor: "#d4ccff",
      variant: "default",
    },
  ];

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[20px] leading-[28px] font-semibold">
          Billing Overview
        </h2>
        <CustomButton variant="primary" 
        leftIcon={FileChartColumnIncreasing}
        className='w-fit'
        >
          Settlement
          </CustomButton>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <BillingStatCard key={idx} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default BillingOverview;