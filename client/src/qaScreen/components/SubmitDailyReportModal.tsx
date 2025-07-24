
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";
import { selectQaDailyReports } from "@/store/slices/qaslice/qaSlice";
import type { RootState } from "@/store/store";

// Remove 'cases' prop and related logic
// type Props = {
//   isOpen: boolean;
//   onClose: () => void;
//   cases: DentalCase[];
//   onSubmitReport: (additionalNotes: string) => void;
// };

// Change props to only isOpen, onClose, onSubmitReport
export default function SubmitDailyReportModal({ isOpen, onClose, onSubmitReport }: { isOpen: boolean; onClose: () => void; onSubmitReport: (additionalNotes: string) => void; }) {
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const { toast } = useToast();

  // Get daily reports from Redux
  // Use selector with correct RootState type
  const dailyReportsRaw = useAppSelector((state: RootState) => selectQaDailyReports(state));
  console.log(dailyReportsRaw, "dailyReportsRaw");
  const todaysReport = dailyReportsRaw[0] || {};
  const stats = {
    total: (todaysReport.approvedOrderIds?.length || 0) + (todaysReport.rejectedOrderIds?.length || 0) + (todaysReport.rescanOrderIds?.length || 0) + (todaysReport.modifiedOrderIds?.length || 0) + (todaysReport.pendingOrderIds?.length || 0),
    approved: todaysReport.approvedOrderIds?.length || 0,
    rejected: todaysReport.rejectedOrderIds?.length || 0,
    rescans: todaysReport.rescanOrderIds?.length || 0,
    modified: todaysReport.modifiedOrderIds?.length || 0,
  };

  console.log(todaysReport, "todaysReport");

  const handleReviewReport = () => {
    setIsReviewing(true);
  };

  const handleSubmit = () => {
    onSubmitReport(additionalNotes);
    toast({
      title: "Daily Report Submitted",
      description: "Your daily work report has been successfully submitted.",
    });
    setAdditionalNotes("");
    setIsReviewing(false);
    onClose();
  };

  const handleBack = () => {
    setIsReviewing(false);
  };

  if (!isReviewing) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Daily Work Report - {new Date().toLocaleDateString()}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Case Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-sm text-muted-foreground">Total Cases</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                    <div className="text-sm text-muted-foreground">Approved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                    <div className="text-sm text-muted-foreground">Rejected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{stats.rescans}</div>
                    <div className="text-sm text-muted-foreground">Rescans</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.modified}</div>
                    <div className="text-sm text-muted-foreground">Modified</div>
                  </div>
                  <div className="text-center">
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleReviewReport}>
                Review Daily Work Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review Daily Work Report - {new Date().toLocaleDateString()}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Generated Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xl font-bold">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Cases Reviewed</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">{stats.approved}</div>
                  <div className="text-sm text-muted-foreground">Approved</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-red-600">{stats.rejected}</div>
                  <div className="text-sm text-muted-foreground">Rejected</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-orange-600">{stats.rescans}</div>
                  <div className="text-sm text-muted-foreground">Rescans Requested</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{stats.modified}</div>
                  <div className="text-sm text-muted-foreground">Modified</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-600">{stats.pending}</div>
                  <div className="text-sm text-muted-foreground">Still Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="additional-notes">Additional Work Done (Optional)</Label>
            <Textarea
              id="additional-notes"
              placeholder="Add any additional work or activities you completed today that are not captured in the system..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Submit Daily Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
