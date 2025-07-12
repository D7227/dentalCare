
import React from "react";
import type { DentalCase } from "@/data/cases";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

type Props = {
  cases: DentalCase[];
};

export default function ReportsLogs({ cases }: Props) {
  const total = cases.length;
  const approved = cases.filter(c => c.status === "Approved").length;
  const rejected = cases.filter(c => c.status === "Rejected").length;
  const rescans = cases.filter(c => c.status === "Rescan Requested").length;
  const modified = cases.filter(c => c.status === "Modified").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
      <Card>
        <CardHeader><CardTitle>Total Cases</CardTitle></CardHeader>
        <CardContent><span className="text-3xl font-bold">{total}</span></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Approved</CardTitle></CardHeader>
        <CardContent><span className="text-3xl font-bold text-green-600">{approved}</span></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Rejected</CardTitle></CardHeader>
        <CardContent><span className="text-3xl font-bold text-red-600">{rejected}</span></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Rescans Requested</CardTitle></CardHeader>
        <CardContent><span className="text-3xl font-bold text-orange-600">{rescans}</span></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Modified</CardTitle></CardHeader>
        <CardContent><span className="text-3xl font-bold text-blue-600">{modified}</span></CardContent>
      </Card>
      <div className="col-span-1 md:col-span-4 mt-4">
        <Card>
          <CardHeader><CardTitle>Case Logs</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {cases.map(c => (
                c.log.map((entry, i) =>
                  <li key={c.id + i} className="text-xs mb-1">
                    <span className="font-mono text-slate-600">{c.id}</span>: {entry}
                  </li>
                )
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
