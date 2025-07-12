import { teethGroup1, teethGroup2 } from "@/assets/svg";
import OrderSummary from "@/components/order-wizard/OrderSummary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Activity,
  Check,
  CircleSlash,
  ClipboardList,
  Clock,
  File,
  FileChartColumnIncreasing,
  FileText,
  Paperclip,
  Pen,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import React from "react";

// Types for props
interface OverviewTabProps {
  data: {
    stages: { label: string; date?: string; completed: boolean }[];
    details: {
      restorationType?: string;
      teethGroup?: string;
      productSelection?: { name: string; count?: number }[];
      accessories?: { name: string; count?: number | null }[];
      pontic?: string;
      trial?: string;
      occlusalStaining?: string;
      shade?: string[];
      selectedTeeth?: any[];
    };
    message?: string[];
    patient?: {
      firstName?: string;
      lastName?: string;
      age?: number;
      gender?: string;
    };
    doctor?: {
      caseHandledBy?: string;
      consultingDoctor?: string;
      location?: string;
    };
    order?: any;
  };
  attachments: { name: string }[];
  onRemoveFile: (index: number) => void;
}


const OverviewTab: React.FC<OverviewTabProps> = ({ data, attachments, onRemoveFile }) => {
  console.log("order attachments", attachments)
  console.log(data)
  // Merge teeth from both toothGroups and selectedTeeth, deduplicate
  const groupTeeth = (data?.order?.toothGroups ?? []).flatMap((g: any) => g.teeth ?? []);
  const individualTeeth = (data?.order?.selectedTeeth ?? []).map((t: any) => t.toothNumber);
  const allSelectedTeeth = Array.from(new Set([...groupTeeth, ...individualTeeth]));

  const isGroupConfigured = (group: any) => {
    if (group.groupId === 'individual-group') {
      // Check if all individual teeth have products configured
      const individualTeeth = (data?.order?.selectedTeeth || []).filter((t: any) => group.teeth.includes(t.toothNumber));
      return individualTeeth.length > 0 && individualTeeth.every((t: any) => t.selectedProducts && t.selectedProducts.length > 0);
    }
    return group.selectedProducts &&
      group.selectedProducts.length > 0 &&
      group.productDetails;
  };

  const allGroupsConfigured = data?.order?.toothGroups?.length > 0 && data?.order?.toothGroups.every((group: any) => isGroupConfigured(group));

  return (
    <>
      <p></p>
      <OrderSummary formData={data?.order} orderCategory={data?.order?.category} showHeading={false} />
    </>
  );
};

export default OverviewTab;