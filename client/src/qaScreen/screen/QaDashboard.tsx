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
import ProductionScreen from "./ProductionScreen/productionScreen";

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
                `${status} by Dr.Sagar on ${new Date().toLocaleString()}${
                  notes ? ` — ${notes}` : ""
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
      <div className="min-h-screen flex w-full overflow-hidden">
        <AppSidebar
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />
        <div className="flex-1 ml-0 h-screen overflow-auto">
          {/* Sticky Dashboard Header (responsive, mobile-friendly) */}
          <header className="sticky top-0 z-20 bg-white border-b shadow-sm flex flex-row items-center justify-between px-3 sm:px-6 py-2 sm:py-4 min-h-[56px]">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {/* Hamburger is absolutely positioned, so add left padding on mobile */}
              <span className="block lg:hidden w-8" />
              <h2 className="text-xl font-bold tracking-wide truncate">
                DentalCare QA Dashboard
              </h2>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-blue-100 rounded-full p-1 sm:p-2">
                <svg
                  width="20"
                  height="20"
                  className="sm:w-6 sm:h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" fill="#3B82F6" />
                  <text
                    x="12"
                    y="16"
                    textAnchor="middle"
                    fontSize="10"
                    fill="#fff"
                  >
                    QA
                  </text>
                </svg>
              </div>
              {/* <div className="text-xs sm:text-sm font-semibold text-gray-700">QA User</div> */}
            </div>
          </header>
          {/* Add top padding to main content on mobile to avoid header overlap */}
          <div className="pt-2 sm:pt-0">
            {selectedPage === "Dashboard" && (
              <main className="p-6 min-h-screen">
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
                    {/* <SidebarTrigger /> */}
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

                <ProductionTable />

                {/* <Tabs defaultValue="production" className="w-full">
              <TabsList className="grid w-full grid-cols-3"> */}
                {/* <TabsTrigger value="cases">Case Management</TabsTrigger> */}
                {/* <TabsTrigger value="production">Production</TabsTrigger>
                <TabsTrigger value="daily-reports">Daily Reports</TabsTrigger>
                <TabsTrigger value="reports">Reports & Logs</TabsTrigger>
              </TabsList> */}

                {/* <TabsContent value="cases" className="mt-6">
              <CaseTable cases={cases} onUpdate={updateCase} />
            </TabsContent> */}

                {/* <TabsContent value="production" className="mt-6">
                <ProductionTable />
              </TabsContent> */}

                {/* <TabsContent value="daily-reports" className="mt-6">
                <DailyReportsTable reports={dailyReports} />
              </TabsContent> */}

                {/* <TabsContent value="reports" className="mt-6">
                <ReportsLogs cases={cases} />
              </TabsContent> */}
                {/* </Tabs> */}

                <SubmitDailyReportModal
                  isOpen={isDailyReportModalOpen}
                  onClose={() => setIsDailyReportModalOpen(false)}
                  cases={cases}
                  onSubmitReport={handleSubmitDailyReport}
                />
              </main>
            )}
            {selectedPage === "Production" && <ProductionScreen />}
            {selectedPage === "Daily Reports" && (
              <DailyReportsTable reports={dailyReports} />
            )}
            {selectedPage === "Reports & Logs" && <ReportsLogs cases={cases} />}
            {selectedPage === "Chat" && <QaChatContent />}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default QaDashboard;
