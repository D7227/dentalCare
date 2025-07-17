import React, { useState } from "react";
import { AppSidebar } from "../components/AppSidebar";
import { dentalCases as initialCases } from "../data/cases";
import { dailyReports as initialReports } from "../data/dailyReports";
import CaseTable from "../components/CaseTable";
import ReportsLogs from "./DashboardScreeen/ReportsLogs";
import DailyReportsTable from "./DashboardScreeen/DailyReportsTable";
import ProductionTable from "./DashboardScreeen/ProductionTable";
import SubmitDailyReportModal from "../components/SubmitDailyReportModal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText } from "lucide-react";
import type { DailyReport } from "../data/dailyReports";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import QaChatContent from "./ChatScreen/qaChatContent";

const QaDashboard = () => {
  const [cases, setCases] = useState(initialCases);
  const [dailyReports, setDailyReports] = useState(initialReports);
  const [isDailyReportModalOpen, setIsDailyReportModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState("Dashboard");

  const updateCase = (id: string, status: any, notes?: string) => {
    setCases((cases) =>
      cases.map((c) =>
        c.id === id
          ? {
            ...c,
            status,
            notes: notes || c.notes,
            log: [
              ...c.log,
              `${status} by Dr.Sagar on ${new Date().toLocaleString()}${notes ? ` — ${notes}` : ""
              }`,
            ],
          }
          : c
      )
    );
  };

  const handleSubmitDailyReport = (additionalNotes: string) => {
    const today = new Date().toISOString().split("T")[0];
    const todaysCases = cases.filter((c) => c.receivedAt === today);
    const newReport: DailyReport = {
      id: `DR-${String(dailyReports.length + 1).padStart(3, "0")}`,
      date: today,
      doctorName: "Dr. Sagar",
      casesReviewed: todaysCases.length,
      casesApproved: todaysCases.filter((c) => c.status === "Approved").length,
      casesRejected: todaysCases.filter((c) => c.status === "Rejected").length,
      rescansRequested: todaysCases.filter(
        (c) => c.status === "Rescan Requested"
      ).length,
      casesModified: todaysCases.filter((c) => c.status === "Modified").length,
      additionalNotes,
      status: "Submitted",
      submittedAt: new Date().toISOString(),
    };
    setDailyReports((prev) => [newReport, ...prev]);
  };

  const pendingCount = cases.filter((c) => c.status === "Pending").length;
  const todayCases = cases.filter(
    (c) => c.receivedAt === new Date().toISOString().split("T")[0]
  ).length;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar selectedPage={selectedPage} setSelectedPage={setSelectedPage} />

        {
          selectedPage === "Dashboard" && (
            <main className="flex-1 p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">
                  Dental ERP Dashboard – Dr. Sagar
                </h1>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => setIsDailyReportModalOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <FileText size={18} />
                    Submit Daily Report
                  </Button>
                  <SidebarTrigger />
                </div>
              </div>

              {/* Quick Stats */}
              {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cases.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Today's Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{todayCases}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{cases.length}</div>
              </CardContent>
            </Card>
          </div> */}

              <Tabs defaultValue="production" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  {/* <TabsTrigger value="cases">Case Management</TabsTrigger> */}
                  <TabsTrigger value="production">Production</TabsTrigger>
                  <TabsTrigger value="daily-reports">Daily Reports</TabsTrigger>
                  <TabsTrigger value="reports">Reports & Logs</TabsTrigger>
                </TabsList>

                {/* <TabsContent value="cases" className="mt-6">
              <CaseTable cases={cases} onUpdate={updateCase} />
            </TabsContent> */}

                <TabsContent value="production" className="mt-6">
                  <ProductionTable />
                </TabsContent>

                <TabsContent value="daily-reports" className="mt-6">
                  <DailyReportsTable reports={dailyReports} />
                </TabsContent>

                <TabsContent value="reports" className="mt-6">
                  <ReportsLogs cases={cases} />
                </TabsContent>
              </Tabs>

              <SubmitDailyReportModal
                isOpen={isDailyReportModalOpen}
                onClose={() => setIsDailyReportModalOpen(false)}
                cases={cases}
                onSubmitReport={handleSubmitDailyReport}
              />
            </main>
          )
        }
        {
          selectedPage === "Chat" &&(
            <QaChatContent />
          )
        }

      </div>
    </SidebarProvider>
  );
};

export default QaDashboard;
