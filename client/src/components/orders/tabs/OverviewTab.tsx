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
    };
    notes?: string;
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
  return (
    <>
      <Card className="rounded-lg border border-customPurple-30 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="flex items-center gap-2 text-16/18 font-semibold">
            <div className="p-2 border border-customPurple-30 text-customPurple-100 h-[32px] w-[32px] rounded-[6px]">
              <FileChartColumnIncreasing className="h-4 w-4" />
            </div>
            Case Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-y-4 px-4 pb-4 pt-2">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Order Type:</p>
            <p className="text-sm font-medium leading-tight">{data?.order?.category || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Order Date:</p>
            <p className="text-sm font-medium leading-tight">
              {data?.order?.createdAt ? new Date(data.order.createdAt).toLocaleDateString() : "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Due Date:</p>
            <p className="text-sm font-medium leading-tight">
              {data?.order?.dueDate ? new Date(data.order.dueDate).toLocaleDateString() : "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Order Date:</p>
            <p className="text-sm font-medium leading-tight">
              {data?.order?.createdAt ? new Date(data.order.createdAt).toLocaleDateString() : "-"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg border border-customCyan-30 shadow-sm !mt-[12px]">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="flex items-center gap-2 text-16/18 font-semibold">
            <div className="p-2 border border-customCyan-30 text-customCyan-100 h-[32px] w-[32px] rounded-[6px]">
              <User className="h-4 w-4" />
            </div>
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-y-4 px-4 pb-4 pt-2">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Patient Name:</p>
            <p className="text-sm font-medium leading-tight">
              {data?.patient
                ? `${data?.patient.firstName ?? ""} ${data?.patient.lastName ?? ""}`.trim() || "-"
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Age:</p>
            <p className="text-sm font-medium leading-tight">
              {data?.patient?.age ? `${data?.patient.age} years` : "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Gender:</p>
            <p className="text-sm font-medium leading-tight">
              {data?.patient?.gender || "-"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg border border-customOrange-30 shadow-sm !mt-[12px]">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="flex items-center gap-2 text-16/18 font-semibold">
            <div className="p-2 border border-customOrange-30 text-customOrange-100 h-[32px] w-[32px] rounded-[6px]">
              <User className="h-4 w-4" />
            </div>
            Doctor Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-y-4 px-4 pb-4 pt-2">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Case handle by:</p>
            <p className="text-sm font-medium leading-tight">
              {data?.doctor?.caseHandledBy || "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Consulting Doctor:</p>
            <p className="text-sm font-medium leading-tight">{data?.doctor?.consultingDoctor || "-"}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-muted-foreground mb-1">Location:</p>
            <p className="text-sm font-medium leading-tight">
              {data?.doctor?.location || "-"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg border border-customGreen-15 shadow-sm !mt-[12px]">
        <CardHeader className="pb-1 pt-4 px-4">
          <CardTitle className="flex items-center gap-2 text-16/18 font-semibold">
            <div className="p-2 border border-customGreen-15 text-customGreen-100 h-[32px] w-[32px] rounded-[6px]">
              <Activity className="h-4 w-4" />
            </div>
            Order Lifecycle Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pt-2 pb-4">
          <div className="relative overflow-x-auto">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-teal-100 z-0"></div>
            <div className="flex justify-between items-start relative z-10 min-w-[720px]">
              {data?.stages.map((stage: { label: string; date?: string; completed: boolean }, index: number) => {
                // Determine the display state based on first false
                const prevSteps = data?.stages.slice(0, index);
                const allPreviousComplete = prevSteps.every((s: typeof stage) => s.completed);
                const isCompleted = stage.completed && allPreviousComplete;
                const isCurrent = !stage.completed && allPreviousComplete;
                // const isBlocked = !allPreviousComplete;
                return (
                  <div key={index} className="flex flex-col items-center">
                    {/* Icon Box */}
                    <div
                      className={cn(
                        "w-8 h-8 rounded-md flex items-center justify-center transition-all",
                        isCompleted
                          ? "bg-teal-100 text-teal-600"
                          : isCurrent
                          ? "border-2 border-teal-500 text-teal-500 bg-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : isCurrent ? (
                        <Clock className="h-4 w-4" />
                      ) : (
                        <CircleSlash className="h-4 w-4" />
                      )}
                    </div>
                    {/* Label Info */}
                    <div className="mt-2 text-center text-xs">
                      <div
                        className={cn(
                          "font-medium",
                          isCompleted || isCurrent
                            ? "text-foreground"
                            : "text-muted-foreground opacity-50"
                        )}
                      >
                        {stage.label}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {stage.date || "--"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg border border-customYellow-15 shadow-sm !mt-[12px]">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="flex items-center gap-2 text-16/18 font-semibold">
            <div className="p-2 rounded-md border border-customYellow-15 text-customYellow-100">
              <ClipboardList className="h-4 w-4" />
            </div>
            Restoration & Treatment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-4 px-4 pb-4 pt-2">
          {data?.details?.restorationType && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Type of Restoration</p>
              <p className="text-sm font-medium flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-teal-600" />
                {data?.details.restorationType}
              </p>
            </div>
          )}
          {data?.details?.teethGroup && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Teeth (Group 1):</p>
              <p className="text-sm font-medium">{data?.details.teethGroup}</p>
            </div>
          )}
          {(data?.details?.productSelection?.length ?? 0) > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Product Selection</p>
              {(data?.details?.productSelection ?? []).map((item: { name: string; count?: number }, idx: number) => (
                <p key={idx} className="text-sm font-medium">
                  {item.name}
                  {item.count && (
                    <span className="text-blue-600 font-semibold ml-1">X {item.count}</span>
                  )}
                </p>
              ))}
            </div>
          )}
          {(data?.details?.accessories?.length ?? 0) > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Accessories</p>
              <p className="text-sm font-medium">
                {(data?.details?.accessories ?? []).map((item: { name: string; count?: number | null }, idx: number) => (
                  <span key={idx}>
                    {item.name}
                    {item.count && (
                      <span className="text-blue-600 font-semibold ml-1">X {item.count}</span>
                    )}
                    {idx < ((data?.details?.accessories?.length ?? 0) - 1) && ", "}
                  </span>
                ))}
              </p>
            </div>
          )}
          {data?.details?.pontic && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Pontic</p>
              <p className="text-sm font-medium">{data?.details.pontic}</p>
            </div>
          )}
          {data?.details?.trial && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Trial</p>
              <p className="text-sm font-medium">{data?.details.trial}</p>
            </div>
          )}
          {data?.details?.occlusalStaining && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Occlusal Staining</p>
              <p className="text-sm font-medium">{data?.details.occlusalStaining}</p>
            </div>
          )}
          {(data?.details?.shade?.length ?? 0) > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Shade</p>
              {(data?.details?.shade ?? []).map((item: string, idx: number) => (
                <p key={idx} className="text-sm font-medium">{item}</p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border border-customRed-15 rounded-lg !mt-[12px]">
        <CardHeader className="px-4 pt-4 pb-1">
          <CardTitle className="flex items-center gap-2 text-16/18 font-semibold">
            <div className="p-2 rounded-md border border-customRed-15 text-customRed-100">
              <Pen className="w-4 h-4" />
            </div>
            Additional Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 text-sm text-muted-foreground">
          {data?.notes ? data?.notes : "No additional notes provided."}
        </CardContent>
      </Card>

      <Card className="border border-customPrimery-20 rounded-lg !mt-[12px]">
        <CardHeader className="px-4 pt-4 pb-1">
          <CardTitle className="flex items-center gap-2 font-semibold text-16/18">
            <div className="p-2 rounded-md border border-customPrimery-20 text-customPrimery-100">
              <Paperclip className="w-4 h-4" />
            </div>
            Files & Attachments
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center px-4 pb-4 text-sm text-muted-foreground">
          {attachments.length === 0 ? (
            <>
              <FileChartColumnIncreasing className="w-[64px] h-[64px] mb-2 text-[#5B6664]" />
              <p className="text-center text-customGray-100">No files attached to this order.</p>
            </>
          ) : (
            <ul className="w-full space-y-2">
              {attachments.map((file: { name: string }, index: number) => (
                <li
                  key={index}
                  className="flex items-center justify-between px-3 py-2 rounded-md bg-white border text-sm"
                >
                  <div className="flex items-center gap-2 text-teal-700">
                    <FileText className="w-4 h-4" />
                    {file.name}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onRemoveFile(index)}
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {attachments.length > 0 && (
        <div className="mt-3 text-sm px-4 text-muted-foreground">
          Uploaded Files ({attachments.length}/10)
        </div>
      )}
    </>
  );
};

export default OverviewTab;