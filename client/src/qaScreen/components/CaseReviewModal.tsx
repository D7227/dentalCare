
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { DentalCase, CaseStatus } from "../data/cases";

type Props = {
  open: boolean;
  onClose: () => void;
  dentalCase: DentalCase | null;
  onUpdate: (id: string, status: CaseStatus, notes?: string) => void;
};

export default function CaseReviewModal({ open, onClose, dentalCase, onUpdate }: Props) {
  const [actionNotes, setActionNotes] = useState("");

  if (!dentalCase) return null;

  const onAction = (action: CaseStatus) => {
    onUpdate(dentalCase.id, action, actionNotes);
    setActionNotes("");
    onClose();
  };

  const getConfirmationMessage = (action: CaseStatus) => {
    switch (action) {
      case "Approved":
        return "Are you sure you want to approve this case? This will move it to the next stage of processing.";
      case "Modified":
        return "Are you sure you want to mark this case as modified? This indicates the case has been adjusted as needed.";
      case "Rejected":
        return "Are you sure you want to reject this case? This will require the case to be resubmitted.";
      case "Rescan Requested":
        return "Are you sure you want to request a rescan? This will ask for new scans/impressions to be provided.";
      default:
        return "Are you sure you want to proceed with this action?";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dentalCase.refNumber} - {dentalCase.patient}</DialogTitle>
          <DialogDescription>
            Doctor: <span className="font-semibold">{dentalCase.doctorName}</span><br />
            Received: {dentalCase.receivedAt}<br />
            Order Method: <span className="font-semibold">{dentalCase.orderMethod}</span><br />
            Prescription: <span className="font-semibold">{dentalCase.prescriptionType}</span><br />
            Status: <span className="font-semibold">{dentalCase.status}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <div>Attachments:</div>
          <div className="flex gap-2">
            {dentalCase.attachments.map((a, i) => (
              <div key={i} className="border rounded p-2">
                <img src={"/" + a} alt={a} className="max-w-[60px] max-h-[60px]" />
                <div className="text-xs mt-1">{a}</div>
              </div>
            ))}
          </div>
          <textarea
            value={actionNotes}
            onChange={e => setActionNotes(e.target.value)}
            placeholder="Add notes/feedback if needed..."
            className="mt-2 w-full border rounded p-2 text-sm"
            rows={3}
          />
        </div>
        <DialogFooter className="gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="default">Approve</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Approval</AlertDialogTitle>
                <AlertDialogDescription>
                  {getConfirmationMessage("Approved")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onAction("Approved")}>
                  Yes, Approve
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary">Mark as Modified</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Modification</AlertDialogTitle>
                <AlertDialogDescription>
                  {getConfirmationMessage("Modified")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onAction("Modified")}>
                  Yes, Mark as Modified
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Reject</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Rejection</AlertDialogTitle>
                <AlertDialogDescription>
                  {getConfirmationMessage("Rejected")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onAction("Rejected")}>
                  Yes, Reject
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Request Rescan</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Rescan Request</AlertDialogTitle>
                <AlertDialogDescription>
                  {getConfirmationMessage("Rescan Requested")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onAction("Rescan Requested")}>
                  Yes, Request Rescan
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
