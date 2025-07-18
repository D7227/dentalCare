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
import type { DailyReport } from "@/data/dailyReports";

type Props = {
  reports: any[];
};

export default function DailyReportsTable({ reports }: Props) {
  const getStatusBadge = (status: DailyReport["status"]) => {
    const variants = {
      Draft: "secondary",
      Submitted: "default",
      Reviewed: "outline",
    } as const;

    return <Badge variant={variants[status]}>{status}</Badge>;
  };

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
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>
                    {new Date(report.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{report.casesReviewed}</TableCell>
                  <TableCell className="text-green-600">
                    {report.casesApproved}
                  </TableCell>
                  <TableCell className="text-red-600">
                    {report.casesRejected}
                  </TableCell>
                  <TableCell className="text-orange-600">
                    {report.rescansRequested}
                  </TableCell>
                  <TableCell className="text-blue-600">
                    {report.casesModified}
                  </TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>
                    {report.submittedAt
                      ? new Date(report.submittedAt).toLocaleString()
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Daily Reports Section */}
      {/* <div className="space-y-4">
        <h2 className="text-xl font-semibold">Daily Reports</h2>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
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
                  <TableRow>
                    <TableCell className="font-medium">DR-001</TableCell>
                    <TableCell>2025-06-28</TableCell>
                    <TableCell>12</TableCell>
                    <TableCell className="text-blue-600">8</TableCell>
                    <TableCell className="text-red-600">1</TableCell>
                    <TableCell className="text-orange-600">1</TableCell>
                    <TableCell className="text-blue-600">1</TableCell>
                    <TableCell>
                      <Badge
                        className="bg-green-100 text-green-800"
                        variant="outline"
                      >
                        Submitted
                      </Badge>
                    </TableCell>
                    <TableCell>6-28-2024, 6:30:00 PM</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">DR-002</TableCell>
                    <TableCell>2025-06-27</TableCell>
                    <TableCell>15</TableCell>
                    <TableCell className="text-blue-600">10</TableCell>
                    <TableCell className="text-red-600">3</TableCell>
                    <TableCell className="text-orange-600">2</TableCell>
                    <TableCell className="text-blue-600">0</TableCell>
                    <TableCell>
                      <Badge
                        className="bg-gray-100 text-gray-800"
                        variant="outline"
                      >
                        Reviewed
                      </Badge>
                    </TableCell>
                    <TableCell>6-28-2024, 6:30:00 PM</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </>
  );
}
