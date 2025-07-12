
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, FileText, Stethoscope, Upload, Edit, Download, X } from "lucide-react";
import type { DentalCase, CaseStatus } from "../data/cases";
import OrderSummary from "@/components/order-wizard/OrderSummary";

type Props = {
  open: boolean;
  onClose: () => void;
  dentalCase: DentalCase | null;
  onUpdate: (id: string, status: CaseStatus, notes?: string) => void;
};

// API function to update order status
const updateOrderAPI = async (orderId: string, dentalCase: any) => {

  try {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dentalCase),
    });

    if (!response.ok) {
      throw new Error(`Failed to update order: ${response.statusText}`);
    }

    const updatedOrder = await response.json();
    return updatedOrder;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

export default function OrderReviewModal({
  open,
  onClose,
  dentalCase,
  onUpdate
}: Props) {
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [reason, setReason] = useState("");
  const [orderId, setOrderId] = useState("");
  const [crateNumber, setCrateNumber] = useState("");
  const [rescanReason, setRescanReason] = useState("");
  const [rescanNotes, setRescanNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  React.useEffect(() => {
    if (dentalCase && !orderId) {
      setOrderId(`ORD-25-21022`);
    }
  }, [dentalCase, orderId]);

  if (!dentalCase) return null;

  console.log(dentalCase, " dental case")

  const handleFileDownload = (fileName: string) => {
    const link = document.createElement('a');
    link.href = '#';
    link.download = fileName;
    link.click();
    console.log(`Downloading file: ${fileName}`);
  };

  const handleAction = async (action: CaseStatus) => {
    if (!dentalCase) return;

    setIsUpdating(true);
    try {
      // Call the API to update the order
      dentalCase.orderStatus = "active";
      dentalCase.orderId = orderId;
      dentalCase.additionalNote = additionalNotes;
      dentalCase.crateNo = crateNumber;
      await updateOrderAPI(dentalCase.id, dentalCase);

      // Call the parent's onUpdate function
      onUpdate(dentalCase.id, action, additionalNotes);
      setAdditionalNotes("");
      onClose();
    } catch (error) {
      console.error('Failed to update order:', error);
      // You might want to show an error toast here
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!dentalCase) return;

    setIsUpdating(true);
    try {
      const combinedNotes = `Rejection Reason: ${rejectionReason}\nAdditional Notes: ${additionalNotes}`;

      // Call the API to update the order
      dentalCase.orderStatus = "rejected";
      dentalCase.orderId = orderId;
      dentalCase.additionalNote = additionalNotes;
      dentalCase.rejectionReason = rejectionReason;
      dentalCase.crateNo = crateNumber;
      await updateOrderAPI(dentalCase.id, dentalCase,);

      // Call the parent's onUpdate function
      onUpdate(dentalCase.id, "Rejected", combinedNotes);
      setRejectionReason("");
      setAdditionalNotes("");
      onClose();
    } catch (error) {
      console.error('Failed to reject order:', error);
      // You might want to show an error toast here
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRescanRequest = async () => {
    if (!dentalCase) return;

    setIsUpdating(true);
    try {
      const combinedNotes = `Rescan Reason: ${rescanReason}\nNotes: ${rescanNotes}`;

      // Call the API to update the order
      // dentalCase.orderStatus = "Rescan Requested";
      await updateOrderAPI(dentalCase.id, dentalCase);

      // Call the parent's onUpdate function
      // onUpdate(dentalCase.id, "Rescan Requested", combinedNotes);
      setRescanReason("");
      setRescanNotes("");
      onClose();
    } catch (error) {
      console.error('Failed to request rescan:', error);
      // You might want to show an error toast here
    } finally {
      setIsUpdating(false);
    }
  };

  const renderToothSelection = () => {
    const individualTeeth = dentalCase.selectedTeeth || [];
    const toothGroups = dentalCase.toothGroups || [];

    return (
      <div className="space-y-4">
        {/* Individual Teeth */}
        {individualTeeth.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-blue-700">Individual Teeth</h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {individualTeeth.map((tooth, index) => (
                <div key={index} className="flex items-center bg-white border border-blue-300 rounded px-2 py-1">
                  <span className="text-sm font-medium">{tooth.toothNumber} (A)</span>
                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-2 text-gray-400 hover:text-gray-600">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tooth Groups */}
        {toothGroups.map((group, groupIndex) => (
          <div key={groupIndex} className={`border rounded-lg p-4 ${group.groupType === "bridge"
              ? "bg-orange-50 border-orange-200"
              : "bg-green-50 border-green-200"
            }`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-medium ${group.groupType === "bridge" ? "text-orange-700" : "text-green-700"
                }`}>
                🔗 {group.groupType === "bridge" ? "Bridge Group" : "Joint Group"}
              </h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.teethDetails.flatMap((detail, detailIndex) =>
                detail.map((tooth: any, toothIndex: number) => (
                  <div key={`${detailIndex}-${toothIndex}`} className={`flex items-center bg-white border rounded px-2 py-1 ${tooth.type === "pontic"
                      ? "border-purple-300"
                      : "border-blue-300"
                    }`}>
                    <span className="text-sm font-medium">
                      {tooth.teethNumber || tooth.toothNumber} ({tooth.type === "pontic" ? "P" : "A"})
                    </span>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-2 text-gray-400 hover:text-gray-600">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

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
              <p className="text-lg font-medium">{dentalCase.refId}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={`px-3 py-1 text-sm ${dentalCase.orderMethod === "digital"
                  ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                  : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                }`}>
                {dentalCase.orderMethod}
              </Badge>
              <Badge className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 text-sm">
                New Order
              </Badge>
            </div>
          </div> */}
           <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="orderId" className="text-sm font-medium">Order ID</Label>
              <Input id="orderId" value={orderId} onChange={e => setOrderId(e.target.value)} className="mt-1 bg-gray-100" />
            </div>
            <div>
              <Label htmlFor="crateNumber" className="text-sm font-medium">Crate No.</Label>
              <Input id="crateNumber" value={crateNumber} onChange={e => setCrateNumber(e.target.value)} placeholder="Write any notes here..." className="mt-1" />
            </div>
          </div>

          <OrderSummary formData={dentalCase} orderCategory={"new"} userType="Qa"/>

          {/* <div className="grid md:grid-cols-2 gap-6"> */}
          {/* Left Column */}
          {/* <div className="space-y-6"> */}
          {/* Dental Chart Section */}
          {/* <Card className="border-2 border-dashed border-blue-300">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-muted-foreground">Prescription Type : </span>
                      <Badge variant="secondary">{dentalCase.prescriptionType}</Badge>
                    </div>
                    <Button variant="link" className="text-blue-600 p-0">
                      Change
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="text-center mb-2 text-sm text-muted-foreground">Upper Jaw (Maxilla)</div>
                      <div className="flex space-x-1 mb-4">
                        {Array.from({ length: 16 }, (_, i) => {
                          const toothNum = i + 11;
                          const isSelected = dentalCase.selectedTeeth?.some(t => t.toothNumber === toothNum) ||
                                           dentalCase.toothGroups?.some(g => 
                                             g.teethDetails.some(detail => 
                                               detail.some(tooth => (tooth.teethNumber || tooth.toothNumber) === toothNum)
                                             )
                                           );
                          return (
                            <div key={i} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${
                              isSelected ? 'bg-green-500 border-green-600 text-white' : 'border-gray-300'
                            }`}>
                              {toothNum > 18 ? toothNum - 8 : toothNum}
                            </div>
                          );
                        })}
                      </div>
                      <div className="text-center mb-2 text-sm text-muted-foreground">Lower Jaw (Mandible)</div>
                      <div className="flex space-x-1">
                        {Array.from({ length: 16 }, (_, i) => {
                          const toothNum = 31 + i;
                          const isSelected = dentalCase.selectedTeeth?.some(t => t.toothNumber === toothNum) ||
                                           dentalCase.toothGroups?.some(g => 
                                             g.teethDetails.some(detail => 
                                               detail.some(tooth => (tooth.teethNumber || tooth.toothNumber) === toothNum)
                                             )
                                           );
                          return (
                            <div key={i} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${
                              isSelected ? 'bg-blue-500 border-blue-600 text-white' : 'border-gray-300'
                            }`}>
                              {toothNum > 38 ? toothNum - 8 : toothNum}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tooth Selection Section */}
          {/* {renderToothSelection()}
            </div> */}

          {/* Right Column */}
          {/* <div className="space-y-6"> */}
          {/* Restoration & Treatment Details */}
          {/* <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-3">
                  <Stethoscope className="w-4 h-4 mr-2 text-green-600" />
                  <CardTitle className="text-lg">Restoration & Treatment Details</CardTitle>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    <Edit className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Type of Restoration</p>
                      <Badge className="bg-green-100 text-green-800">{dentalCase.subcategoryType}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Products:</p>
                      {dentalCase.restorationProducts?.map((product, index) => (
                        <p key={index} className="text-sm">{product.product} X {product.quantity}</p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Occlusal Staining</p>
                      <p className="text-sm">{dentalCase.occlusalStaining}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div> */}

          {/* Second Row */}
          {/* <div className="grid md:grid-cols-2 gap-6"> */}
          {/* Case Details */}
          {/* <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-3">
                <User className="w-4 h-4 mr-2 text-blue-600" />
                <CardTitle className="text-lg">Case Details</CardTitle>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Edit className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Patient Name:</p>
                    <p className="text-sm">{dentalCase.firstName} {dentalCase.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Consulting Doctor:</p>
                    <p className="text-sm">{dentalCase.consultingDoctor}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Age:</p>
                    <p className="text-sm">{dentalCase.age || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Case Handled By:</p>
                    <p className="text-sm">{dentalCase.caseHandledBy}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Gender:</p>
                    <p className="text-sm">{dentalCase.sex}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Received Date</p>
                    <p className="text-sm">{dentalCase.receivedAt}</p>
                  </div>
                </div>
              </CardContent>
            </Card> */}

          {/* File Upload Summary */}
          {/* <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-3">
                <Upload className="w-4 h-4 mr-2 text-orange-600" />
                <CardTitle className="text-lg">File Upload Summary</CardTitle>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Edit className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">2 files uploaded</p>
                
                {dentalCase.fileCategories?.map((category, index) => (
                  <div key={index} className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">{category.type}</h4>
                    {category.files.map((file, fileIndex) => (
                      <div key={fileIndex} className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer transition-colors mb-1" onClick={() => handleFileDownload(file)}>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{file}</span>
                          <Download className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {file.includes('.stl') ? '2.00 Mb' : '1.05 Mb'}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div> */}

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
                <Textarea placeholder="Write any notes here..." value={additionalNotes} onChange={e => setAdditionalNotes(e.target.value)} className="min-h-[80px]" />
              </div>
            </CardContent>
          </Card>

          {/* Review Notice */}
          {/* <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-3">
              <span className="text-white text-xs">✓</span>
            </div>
            <p className="text-sm text-green-800">
              Please review all details carefully before submitting your repeat request to the lab.
            </p>
          </div> */}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 pt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Approve"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Order Approval</AlertDialogTitle>
                  <AlertDialogDescription>
                    Please confirm the following details before approving this order:
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
                  <AlertDialogAction onClick={() => handleAction("Approved")} disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Yes, Approve Order"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="px-8" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Reject"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Order Rejection</AlertDialogTitle>
                  <AlertDialogDescription>
                    Please provide a reason for rejecting this order and confirm the details below:
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Reference Number:</span>
                        <span>{dentalCase.refId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Crate Number:</span>
                        <span>{crateNumber || "Not specified"}</span>
                      </div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                  <Label htmlFor="rejectionReason" className="text-sm font-medium">Reason for Rejection</Label>
                  <Textarea
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please specify the reason for rejection..."
                    className="mt-1 min-h-[80px]"
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setRejectionReason("")}>Cancel</AlertDialogCancel>
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
                <Button variant="outline" className="px-8" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Request Rescan"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Request Rescan Confirmation</AlertDialogTitle>
                  <AlertDialogDescription>
                    Please provide the reason and any additional notes for requesting a rescan of this order.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="rescanReason" className="text-sm font-medium">Reason for Rescan</Label>
                    <Input
                      id="rescanReason"
                      value={rescanReason}
                      onChange={(e) => setRescanReason(e.target.value)}
                      placeholder="Enter reason for rescan..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rescanNotes" className="text-sm font-medium">Additional Notes</Label>
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
                  <AlertDialogCancel onClick={() => {
                    setRescanReason("");
                    setRescanNotes("");
                  }}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRescanRequest} disabled={!rescanReason.trim() || isUpdating}>
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
