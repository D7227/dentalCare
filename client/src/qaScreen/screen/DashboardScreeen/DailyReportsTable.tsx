import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllDailyReportsQuery } from "@/store/slices/qaslice/qaApi";
import { useAppSelector } from "@/store/hooks";
import { skipToken } from "@reduxjs/toolkit/query";

export default function DailyReportsTable() {
  // Get qaId from user context/store
  const userData = useAppSelector((state) => state.userData?.userData);
  const qaId = userData?.id;

  // Fetch daily reports for this QA
  const { data, isLoading, error } = useGetAllDailyReportsQuery(
    qaId ? { qaId } : skipToken
  );

  // The API returns { data: reports, total: ... }
  const reports = data?.data || [];

  const getStatusBadge = (status: string) => {
    const variants = {
      Draft: "secondary",
      Submitted: "default",
      Reviewed: "outline",
    } as const;
    const variant = variants[status as keyof typeof variants] || "secondary";
    return <Badge variant={variant}>{status}</Badge>;
  };

  // Helper to calculate derived fields from API data
  const mapReport = (report: any) => {
    // Fallbacks for missing fields
    const approved = Array.isArray(report.approvedOrderIds) ? report.approvedOrderIds.length : report.casesApproved || 0;
    const rejected = Array.isArray(report.rejectedOrderIds) ? report.rejectedOrderIds.length : report.casesRejected || 0;
    const rescans = Array.isArray(report.rescanOrderIds) ? report.rescanOrderIds.length : report.rescansRequested || 0;
    const modified = Array.isArray(report.modifiedOrderIds) ? report.modifiedOrderIds.length : report.casesModified || 0;
    // If you want to calculate reviewed/modified, you can add logic here
    // For now, fallback to 0 or use report.casesModified if present
    const reviewed = typeof report.casesReviewed === 'number' ? report.casesReviewed : approved + rejected + rescans + modified;
    return {
      id: report.id,
      date: report.reportDate || report.date,
      casesReviewed: reviewed,
      casesApproved: approved,
      casesRejected: rejected,
      rescansRequested: rescans,
      casesModified: modified,
      status: report.status || "Submitted",
      submittedAt: report.submittedAt || report.createdAt,
    };
  };

  if (isLoading) return <div>Loading daily reports...</div>;
  if (error) return <div>Error loading daily reports.</div>;

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Daily Reports History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Cases Reviewed</TableHead>
                <TableHead>Approved</TableHead>
                <TableHead>Rejected</TableHead>
                <TableHead>Rescans</TableHead>
                <TableHead>Modified</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report: any) => {
                const mapped = mapReport(report);
                return (
                  <TableRow key={mapped.id}>
                    <TableCell className="font-medium">{mapped.id}</TableCell>
                    <TableCell>
                      {mapped.date ? new Date(mapped.date).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell>{mapped.casesReviewed}</TableCell>
                    <TableCell className="text-green-600">
                      {mapped.casesApproved}
                    </TableCell>
                    <TableCell className="text-red-600">
                      {mapped.casesRejected}
                    </TableCell>
                    <TableCell className="text-orange-600">
                      {mapped.rescansRequested}
                    </TableCell>
                    <TableCell className="text-blue-600">
                      {mapped.casesModified}
                    </TableCell>
                    <TableCell>{getStatusBadge(mapped.status)}</TableCell>
                    <TableCell>
                      {mapped.submittedAt
                        ? new Date(mapped.submittedAt).toLocaleString()
                        : "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
