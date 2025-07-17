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
  useUpdateOrderMutation,
} from "@/store/slices/orderApi";
import SummaryOrder from "@/components/order-wizard/SummaryOrder";

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
  const [additionalNotes, setAdditionalNotes] = useState("");
  // const [reason, setReason] = useState("");
  const [orderId, setOrderId] = useState("");
  const [crateNumber, setCrateNumber] = useState("");
  const [rescanReason, setRescanReason] = useState("");
  const [rescanNotes, setRescanNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const {
    data: orderData,
    error: orderGetError,
    isLoading: orderIsLoding,
    refetch,
  } = useGetOrderByOrderIdQuery(sOrderId ?? selectedOrderId);

  const [formData, setFormData] = useState<any>(orderData);

  useEffect(() => {
    setSOrderId(selectedOrderId);
    refetch();
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

  const handleAction = async (action: CaseStatus) => {
    if (!formData) return;
    try {
      const updatedOrder = {
        ...formData,
        orderStatus: "approved", // or "active" if that's your convention
        orderId,
        additionalNote: additionalNotes,
        crateNo: crateNumber,
      };
      console.log("updatedOrder", updatedOrder);
      // await updateOrder({ id: formData.id, body: updatedOrder }).unwrap();
      setAdditionalNotes("");
      onClose();
    } catch (error) {
      console.error("Failed to approve order:", error);
    }
  };

  const handleReject = async () => {
    if (!formData) return;
    try {
      const updatedOrder = {
        ...formData,
        orderStatus: "rejected",
        orderId,
        additionalNote: additionalNotes,
        rejectionReason,
        crateNo: crateNumber,
      };
      console.log("updatedOrder", updatedOrder);
      // await updateOrder({ id: formData.id, body: updatedOrder }).unwrap();
      setRejectionReason("");
      setAdditionalNotes("");
      onClose();
    } catch (error) {
      console.error("Failed to reject order:", error);
    }
  };

  const handleRescanRequest = async () => {
    if (!formData) return;
    try {
      const combinedNotes = `Rescan Reason: ${rescanReason}\nNotes: ${rescanNotes}`;
      await updateOrder({ id: formData.id, body: formData });
      setRescanReason("");
      setRescanNotes("");
      onClose();
    } catch (error) {
      console.error("Failed to request rescan:", error);
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

          {/* Doctor's Notes */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-3">
              <FileText className="w-4 h-4 mr-2 text-blue-600" />
              <CardTitle className="text-lg">Doctor's Notes</CardTitle>
              <Button variant="ghost" size="sm" className="ml-auto">
                <Edit className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Additional Note</p>
                <Textarea
                  placeholder="Write any notes here..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

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
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please specify the reason for rejection..."
                    className="mt-1 min-h-[80px]"
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setRejectionReason("")}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleReject}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={!rejectionReason.trim() || isUpdating}
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
                      htmlFor="rescanNotes"
                      className="text-sm font-medium"
                    >
                      Additional Notes
                    </Label>
                    <Textarea
                      id="rescanNotes"
                      value={rescanNotes}
                      onChange={(e) => setRescanNotes(e.target.value)}
                      placeholder="Enter any additional notes..."
                      className="mt-1 min-h-[80px]"
                    />
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => {
                      setRescanReason("");
                      setRescanNotes("");
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
