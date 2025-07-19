import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Edit, X } from "lucide-react";
import type { CaseStatus } from "../data/cases";
import {
  useGetOrderByOrderIdQuery,
  useUpdateQaOrderStatusMutation,
} from "@/store/slices/orderApi";
import SummaryOrder from "@/components/order-wizard/SummaryOrder";
import { useToast } from "../components/ui/use-toast";

type Props = {
  open: boolean;
  onClose: () => void;
  selectedOrderId: string;
};

// API function to update order status
// const updateOrderAPI = async (orderId: string, formData: any) => {
//   try {
//     const response = await fetch(`/api/orders/${orderId}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(formData),
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to update order: ${response.statusText}`);
//     }

//     const updatedOrder = await response.json();
//     return updatedOrder;
//   } catch (error) {
//     console.error("Error updating order:", error);
//     throw error;
//   }
// };

export default function OrderReviewModal({
  open,
  onClose,
  selectedOrderId,
}: Props) {
  console.log("selectedOrderId", selectedOrderId);
  const [sOrderId, setSOrderId] = useState<string>(selectedOrderId);
  const [additionalNote, setAdditionalNote] = useState("");
  // const [reason, setReason] = useState("");
  const [orderId, setOrderId] = useState("");
  const [crateNumber, setCrateNumber] = useState("");
  const [rescanReason, setRescanReason] = useState("");
  const { toast } = useToast();
  const [updateOrder, { isLoading: isUpdating }] =
    useUpdateQaOrderStatusMutation();

  // Only call the API if sOrderId is present
  const shouldFetchOrder = Boolean(sOrderId);
  const {
    data: orderData,
    error: orderGetError,
    isLoading: orderIsLoding,
    refetch,
  } = useGetOrderByOrderIdQuery(sOrderId, { skip: !shouldFetchOrder });

  const [formData, setFormData] = useState<any>(orderData);

  useEffect(() => {
    setSOrderId(selectedOrderId);
    if (shouldFetchOrder) {
      refetch();
    }
  }, [selectedOrderId]);

  useEffect(() => {
    setFormData(orderData);
  }, [orderData]);

  console.log("formData ----- orderreview", formData);
  React.useEffect(() => {
    if (formData && !sOrderId) {
      setOrderId(`ORD-25-21022`);
    }
  }, [formData, sOrderId]);

  if (!formData) return null;

  console.log(formData, " dental case");

  // const handleFileDownload = (fileName: string) => {
  //   const link = document.createElement("a");
  //   link.href = "#";
  //   link.download = fileName;
  //   link.click();
  //   console.log(`Downloading file: ${fileName}`);
  // };

  // Approve handler
  const handleAction = async (action: CaseStatus) => {
    if (!formData) return;
    if (!orderId || !orderId.trim()) {
      toast({
        title: "Order ID Required",
        description: "Please enter a valid Order ID before approving.",
        variant: "destructive",
      });
      return;
    }
    if (!crateNumber || !crateNumber.trim()) {
      toast({
        title: "crateNumber ID Required",
        description: "Please enter a valid Crate Number before approving.",
        variant: "destructive",
      });
      return;
    }
    try {
      const result = await updateOrder({
        orderId: formData?.id,
        orderData: {
          ...formData,
          orderId: orderId,
          orderStatus: "active",
          crateNo: crateNumber,
          userName: "qa",
          additionalNote: additionalNote,
        },
      }).unwrap();
      console.log('result-approveeee', result)
      console.log('payload', {
        ...formData,
        orderId: orderId,
        orderStatus: "active",
        crateNo: crateNumber,
        userName: "qa",
        additionalNote: additionalNote,
      },)
      toast({
        title: "Order Approved",
        description: `Order #${orderId} has been approved successfully!`,
      });
      setAdditionalNote("");
      onClose();
    } catch (error: any) {
      let errorMsg = "Failed to approve order.";
      if (error?.status === 409 && error?.data?.error) {
        errorMsg = error.data.error;
      }
      toast({
        title: "Approval Error",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  // Reject handler
  const handleReject = async () => {
    if (!formData) return;
    if (!additionalNote.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      });
      return;
    }
    try {
      const result = await updateOrder({
        orderId: formData?.id,
        orderData: {
          ...formData,
          orderStatus: "rejected",
          userName: "qa",
          additionalNote: additionalNote,
        },
      }).unwrap();
      toast({
        title: "Order Rejected",
        description: `Order has been rejected.`,
      });
      setAdditionalNote("");
      onClose();
    } catch (error: any) {
      let errorMsg = "Failed to reject order.";
      if (error?.status === 409 && error?.data?.error) {
        errorMsg = error.data.error;
      }
      toast({
        title: "Rejection Error",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  // Rescan handler
  const handleRescanRequest = async () => {
    if (!formData) return;
    if (!rescanReason.trim()) {
      toast({
        title: "Rescan Reason Required",
        description: "Please provide a reason for rescan.",
        variant: "destructive",
      });
      return;
    }
    try {
      const result = await updateOrder({
        orderId: formData?.id,
        orderData: {
          ...formData,
          orderStatus: "rescan",
          userName: "qa",
          additionalNote: additionalNote,
          extraAdditionalNote: rescanReason,
        },
      }).unwrap();
      toast({
        title: "Rescan Requested",
        description: `Rescan requested for this order.`,
      });
      setRescanReason("");
      setAdditionalNote("");
      onClose();
    } catch (error: any) {
      let errorMsg = "Failed to request rescan.";
      if (error?.status === 409 && error?.data?.error) {
        errorMsg = error.data.error;
      }
      toast({
        title: "Rescan Error",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  // const renderToothSelection = () => {
  //   const individualTeeth = formData.selectedTeeth || [];
  //   const toothGroups = formData.toothGroups || [];

  //   return (
  //     <div className="space-y-4">
  //       {/* Individual Teeth */}
  //       {individualTeeth.length > 0 && (
  //         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
  //           <div className="flex items-center justify-between mb-3">
  //             <h3 className="text-sm font-medium text-blue-700">
  //               Individual Teeth
  //             </h3>
  //             <Button
  //               variant="ghost"
  //               size="sm"
  //               className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
  //             >
  //               <X className="h-4 w-4" />
  //             </Button>
  //           </div>
  //           <div className="flex flex-wrap gap-2">
  //             {individualTeeth.map((tooth, index) => (
  //               <div
  //                 key={index}
  //                 className="flex items-center bg-white border border-blue-300 rounded px-2 py-1"
  //               >
  //                 <span className="text-sm font-medium">
  //                   {tooth.toothNumber} (A)
  //                 </span>
  //                 <Button
  //                   variant="ghost"
  //                   size="sm"
  //                   className="h-4 w-4 p-0 ml-2 text-gray-400 hover:text-gray-600"
  //                 >
  //                   <X className="h-3 w-3" />
  //                 </Button>
  //               </div>
  //             ))}
  //           </div>
  //         </div>
  //       )}

  //       {/* Tooth Groups */}
  //       {toothGroups.map((group, groupIndex) => (
  //         <div
  //           key={groupIndex}
  //           className={`border rounded-lg p-4 ${
  //             group.groupType === "bridge"
  //               ? "bg-orange-50 border-orange-200"
  //               : "bg-green-50 border-green-200"
  //           }`}
  //         >
  //           <div className="flex items-center justify-between mb-3">
  //             <h3
  //               className={`text-sm font-medium ${
  //                 group.groupType === "bridge"
  //                   ? "text-orange-700"
  //                   : "text-green-700"
  //               }`}
  //             >
  //               🔗{" "}
  //               {group.groupType === "bridge" ? "Bridge Group" : "Joint Group"}
  //             </h3>
  //             <Button
  //               variant="ghost"
  //               size="sm"
  //               className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
  //             >
  //               <X className="h-4 w-4" />
  //             </Button>
  //           </div>
  //           <div className="flex flex-wrap gap-2">
  //             {group.teethDetails.flatMap((detail, detailIndex) =>
  //               detail.map((tooth: any, toothIndex: number) => (
  //                 <div
  //                   key={`${detailIndex}-${toothIndex}`}
  //                   className={`flex items-center bg-white border rounded px-2 py-1 ${
  //                     tooth.type === "pontic"
  //                       ? "border-purple-300"
  //                       : "border-blue-300"
  //                   }`}
  //                 >
  //                   <span className="text-sm font-medium">
  //                     {tooth.teethNumber || tooth.toothNumber} (
  //                     {tooth.type === "pontic" ? "P" : "A"})
  //                   </span>
  //                   <Button
  //                     variant="ghost"
  //                     size="sm"
  //                     className="h-4 w-4 p-0 ml-2 text-gray-400 hover:text-gray-600"
  //                   >
  //                     <X className="h-3 w-3" />
  //                   </Button>
  //                 </div>
  //               ))
  //             )}
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-slate-100 -m-6 p-6 mb-6">
          <DialogTitle className="text-2xl">Review Order</DialogTitle>
          <p className="text-muted-foreground">Confirm and submit</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with Review and Submit Order */}
          {/* <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold mb-2">Review and Submit Order</h2>
              <p className="text-lg font-medium">{formData.refId}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={`px-3 py-1 text-sm ${formData.orderMethod === "digital"
                  ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                  : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                }`}>
                {formData.orderMethod}
              </Badge>
              <Badge className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 text-sm">
                New Order
              </Badge>
            </div>
          </div> */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="orderId" className="text-sm font-medium">
                Order ID
              </Label>
              <Input
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="mt-1 bg-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="crateNumber" className="text-sm font-medium">
                Crate No.
              </Label>
              <Input
                id="crateNumber"
                value={crateNumber}
                onChange={(e) => setCrateNumber(e.target.value)}
                placeholder="Write any notes here..."
                className="mt-1"
              />
            </div>
          </div>

          {/* <OrderSummary
            formData={formData}
            orderCategory={"new"}
            userType="Qa"
          /> */}

          <SummaryOrder
            formData={formData}
            setFormData={setFormData}
            readMode={true}
            editMode={true}
            download={true}
          />

          {/* Order Notes Card */}
          {Array.isArray(formData.notes) && formData.notes.length > 0 && (
            <Card className="mt-2">
              <CardHeader className="flex flex-row items-center space-y-0 pb-3">
                <FileText className="w-4 h-4 mr-2 text-blue-600" />
                <CardTitle className="text-lg">Order Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.notes.map((note: any, idx: number) => (
                  <div key={idx} className="border-b pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0">
                    {note.additionalNote && (
                      <div className="mb-1">
                        <span className="font-semibold">Note:</span> {note.additionalNote}
                      </div>
                    )}
                    {note.extraAdditionalNote && (
                      <div className="mb-1">
                        <span className="font-semibold">Extra Note:</span> {note.extraAdditionalNote}
                      </div>
                    )}
                    {/* If you want to show the original doctor note as well */}
                    {note.note && (
                      <div className="mb-1">
                        <span className="font-semibold">Doctor Note:</span> {note.note}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>By: {note.addedBy || "Unknown"}</span>
                      <span>•</span>
                      <span>{note.createdAt ? new Date(note.createdAt).toLocaleString() : ""}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {/* <Card className="mt-2">
            <CardHeader className="flex flex-row items-center space-y-0 pb-3">
              <FileText className="w-4 h-4 mr-2 text-blue-600" />
              <CardTitle className="text-lg">
                doctor Note
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Write any notes here..."
                value={formData.notes}
                className="min-h-[80px]"
              />
            </CardContent>
          </Card> */}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 pt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Approve"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Order Approval</AlertDialogTitle>
                  <AlertDialogDescription>
                    Please confirm the following details before approving this
                    order:
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Order ID:</span>
                        <span>{orderId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Crate Number:</span>
                        <span>{crateNumber || "Not specified"}</span>
                      </div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                {/* Additional Note input for Approve */}
                <div className="py-4">
                  <Label
                    htmlFor="approveAdditionalNote"
                    className="text-sm font-medium"
                  >
                    Additional Note
                  </Label>
                  <Textarea
                    id="approveAdditionalNote"
                    value={additionalNote}
                    onChange={(e) => setAdditionalNote(e.target.value)}
                    placeholder="Enter any additional notes..."
                    className="mt-1 min-h-[80px]"
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleAction("Approved")}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Yes, Approve Order"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="px-8"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Reject"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Order Rejection</AlertDialogTitle>
                  <AlertDialogDescription>
                    Please provide a reason for rejecting this order and confirm
                    the details below:
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Reference Number:</span>
                        <span>{formData.refId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Crate Number:</span>
                        <span>{crateNumber || "Not specified"}</span>
                      </div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                  <Label
                    htmlFor="rejectionReason"
                    className="text-sm font-medium"
                  >
                    Reason for Rejection
                  </Label>
                  <Textarea
                    id="rejectionReason"
                    value={additionalNote}
                    onChange={(e) => setAdditionalNote(e.target.value)}
                    placeholder="Please specify the reason for rejection..."
                    className="mt-1 min-h-[80px]"
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => {
                      setAdditionalNote("");
                    }}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleReject}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={!additionalNote.trim() || isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Yes, Reject Order"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="px-8"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Request Rescan"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Request Rescan Confirmation
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Please provide the reason and any additional notes for
                    requesting a rescan of this order.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label
                      htmlFor="rescanReason"
                      className="text-sm font-medium"
                    >
                      Reason for Rescan
                    </Label>
                    <Input
                      id="rescanReason"
                      value={rescanReason}
                      onChange={(e) => setRescanReason(e.target.value)}
                      placeholder="Enter reason for rescan..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="rescanAdditionalNote"
                      className="text-sm font-medium"
                    >
                      Additional Notes
                    </Label>
                    <Textarea
                      id="rescanAdditionalNote"
                      value={additionalNote}
                      onChange={(e) => setAdditionalNote(e.target.value)}
                      placeholder="Enter any additional notes..."
                      className="mt-1 min-h-[80px]"
                    />
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => {
                      setRescanReason("");
                      setAdditionalNote("");
                    }}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRescanRequest}
                    disabled={!rescanReason.trim() || isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Yes, Request Rescan"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
