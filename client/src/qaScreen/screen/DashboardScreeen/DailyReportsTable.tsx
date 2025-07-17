
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DailyReport } from "@/data/dailyReports";

type Props = {
  reports: DailyReport[];
};

export default function DailyReportsTable({ reports }: Props) {
  const getStatusBadge = (status: DailyReport['status']) => {
    const variants = {
      Draft: "secondary",
      Submitted: "default", 
      Reviewed: "outline"
    } as const;
    
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <Card>
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
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.id}</TableCell>
                <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                <TableCell>{report.casesReviewed}</TableCell>
                <TableCell className="text-green-600">{report.casesApproved}</TableCell>
                <TableCell className="text-red-600">{report.casesRejected}</TableCell>
                <TableCell className="text-orange-600">{report.rescansRequested}</TableCell>
                <TableCell className="text-blue-600">{report.casesModified}</TableCell>
                <TableCell>{getStatusBadge(report.status)}</TableCell>
                <TableCell>
                  {report.submittedAt ? new Date(report.submittedAt).toLocaleString() : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
