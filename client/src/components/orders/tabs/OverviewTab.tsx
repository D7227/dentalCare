import { teethGroup1, teethGroup2 } from "@/assets/svg";
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
          {/* <div className="col-span-2">
            <p className="text-xs text-muted-foreground mb-1">Location:</p>
            <p className="text-sm font-medium leading-tight">
              {data?.doctor?.location || "-"}
            </p>
          </div> */}
        </CardContent>
      </Card>

      <Card className="rounded-lg border border-customGreen-200 shadow-sm !mt-[12px] p-4">
        <div className="flex items-center justify-evenly">
          <img src={teethGroup2} alt="teethGroup2" />
          <img src={teethGroup1} alt="teethGroup1" />
        </div>
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
        <CardContent className="flex flex-col gap-4 px-4 pb-4 pt-2">
          {/* Merge and group by prescriptionType, like in OrderSummary */}
          {(() => {
            // 1. Normalize selectedTeeth into group-like objects
            const selectedTeethGroups = (data?.order?.selectedTeeth || []).length > 0
              ? Object.values(
                  (data?.order?.selectedTeeth || []).reduce((acc: any, tooth: any) => {
                    const type = tooth.prescriptionType || data?.order?.prescriptionType || "unknown";
                    if (!acc[type]) acc[type] = { prescriptionType: type, groupType: "individual", teethDetails: [[]] };
                    acc[type].teethDetails[0].push(tooth);
                    return acc;
                  }, {})
                )
              : [];
            // 2. Combine with toothGroups
            const allGroups = [
              ...(data?.order?.toothGroups || []),
              ...selectedTeethGroups
            ];
            // 3. Filter for configured groups
            const configuredGroups = allGroups.filter((group: any) => {
              const allTeeth = group.teethDetails?.flat() || [];
              return allTeeth.length > 0 && allTeeth.every((t: any) => {
                const hasSelectedProducts = t.selectedProducts && t.selectedProducts.length > 0;
                const hasProductName = t.productName && t.productName.length > 0;
                return hasSelectedProducts || hasProductName;
              });
            });
            // 4. Group by prescriptionType
            const groupedByType = configuredGroups.reduce((acc: any, group: any) => {
              const type = group.prescriptionType || data?.order?.prescriptionType || "unknown";
              if (!acc[type]) acc[type] = [];
              acc[type].push(group);
              return acc;
            }, {});
            // 5. Render a card for each prescriptionType
            return Object.entries(groupedByType).map(([type, groups]) => {
              const groupsArray = groups as any[];
              return (
                <Card key={type} className="border border-green-200 bg-gray-50 mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium capitalize">
                          {type}
                        </span>
                      </div>
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    {/* Teeth Information */}
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Teeth:</p>
                        <div className="text-gray-600">
                          {["bridge", "joint", "individual"].map((groupType) => {
                            const groupsOfType = groupsArray.filter((g: any) => g.groupType === groupType);
                            if (groupsOfType.length === 0) return null;
                            const teethNumbers = groupsOfType
                              .flatMap((g: any) => g.teethDetails?.flat() || [])
                              .map((t: any) => t.toothNumber ?? t.teethNumber)
                              .filter((n: any) => n !== undefined && n !== null && n !== "")
                              .join(", ");
                            return teethNumbers ? (
                              <div key={groupType} className="flex items-center gap-2 mb-1">
                                <div className={`w-2 h-2 rounded-full ${groupType === 'individual' ? 'bg-[#1D4ED8]' : groupType === 'joint' ? 'bg-[#0B8043]' : 'bg-[#EA580C]'}`}></div>
                                <span className="font-semibold capitalize text-xs">{groupType}:</span>
                                <span className="text-xs">{teethNumbers}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                      {/* Products Information */}
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Products:</p>
                        <div className="text-gray-600 space-y-1">
                          {(() => {
                            const toothProductList: { tooth: number; products: string[] }[] = [];
                            groupsArray.forEach((group: any) => {
                              group.teethDetails?.flat().forEach((tooth: any) => {
                                let productNames: string[] = [];
                                if (tooth.selectedProducts && Array.isArray(tooth.selectedProducts) && tooth.selectedProducts.length > 0) {
                                  productNames = tooth.selectedProducts.map((p: any) => p.name);
                                } else if (tooth.productName && Array.isArray(tooth.productName)) {
                                  productNames = [...tooth.productName];
                                } else if (tooth.productDetails && tooth.productDetails.productName && tooth.productDetails.productName.length > 0) {
                                  productNames = [...tooth.productDetails.productName];
                                }
                                if (productNames.length > 0) {
                                  toothProductList.push({
                                    tooth: tooth.teethNumber || tooth.toothNumber,
                                    products: productNames,
                                  });
                                }
                              });
                            });
                            toothProductList.sort((a, b) => a.tooth - b.tooth);
                            return toothProductList.map((item, i) => (
                              <div key={i} className="text-xs">
                                <span className="font-semibold">Tooth {item.tooth}:</span> {item.products.join(", ")}
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>
                    {/* Shade and Treatment Details */}
                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Shade:</p>
                        <p className="text-gray-600">
                          {(() => {
                            const shadeDetails = groupsArray.find((g: any) => g.shadeDetails)?.shadeDetails;
                            return shadeDetails || "Not specified";
                          })()}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Occlusal Staining:</p>
                        <p className="text-gray-600 capitalize">
                          {(() => {
                            const occlusalStaining = groupsArray.find((g: any) => g.occlusalStaining)?.occlusalStaining;
                            return occlusalStaining || "Not specified";
                          })()}
                        </p>
                      </div>
                    </div>
                    {/* Shade Guide */}
                    {(() => {
                      const shadeGuide = groupsArray.find((g: any) => g.shadeGuide && g.shadeGuide.type && g.shadeGuide.shades && g.shadeGuide.shades.length > 0)?.shadeGuide;
                      if (shadeGuide) {
                        return (
                          <div className="mt-3">
                            <p className="font-medium text-gray-900 mb-1">Shade Guide:</p>
                            <div className="text-gray-600 capitalize">
                              <span className="font-semibold">
                                {shadeGuide.type === "anterior" ? "Anterior" : "Posterior"}:
                              </span>
                              <div className="mt-1">
                                {shadeGuide.shades.map((shade: string, idx: number) => (
                                  <div key={idx} className="text-xs">{shade}</div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                    {/* Trial Requirements */}
                    {(() => {
                      const trialRequirements = groupsArray.find((g: any) => g.trialRequirements)?.trialRequirements;
                      if (trialRequirements) {
                        return (
                          <div className="mt-3">
                            <p className="font-medium text-gray-900 mb-1">Trial Requirements:</p>
                            <p className="text-gray-600 capitalize text-sm">
                              {trialRequirements}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    })()}
                    {/* Shade Notes */}
                    {(() => {
                      const shadeNotes = groupsArray.find((g: any) => g.shadeNotes)?.shadeNotes;
                      if (shadeNotes) {
                        return (
                          <div className="mt-3">
                            <p className="font-medium text-gray-900 mb-1">Shade Notes:</p>
                            <p className="text-gray-600 text-sm italic">
                              {shadeNotes}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    })()}
                    {/* Pontic Design */}
                    {(() => {
                      const ponticDesign = groupsArray.find((g: any) => g.ponticDesign)?.ponticDesign;
                      if (ponticDesign) {
                        return (
                          <div className="mt-3">
                            <p className="font-medium text-gray-900 mb-1">Pontic Design:</p>
                            <div className="text-gray-600 text-sm">
                              {ponticDesign}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </CardContent>
                </Card>
              );
            });
          })()}
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
          {data?.message && data?.message.length > 0 ? data?.message.map((item: string, idx: number) => (
            <p key={idx}>{item}</p>
          )) : "No additional notes provided."}
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
              {attachments.map((file: any, index: number) => (
                <li
                  key={index}
                  className="flex items-center justify-between px-3 py-2 rounded-md bg-white border text-sm"
                >
                  <div className="flex items-center gap-2 text-teal-700">
                    <FileText className="w-4 h-4" />
                    {file.name.url ? (
                      <a href={file.name.url} target="_blank" rel="noopener noreferrer">
                        {file.name.fileName || file.name}
                      </a>
                    ) : (
                      file.name.fileName || file.name
                    )}
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