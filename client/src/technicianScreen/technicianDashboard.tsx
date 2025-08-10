import React, { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  AllTasksTab,
  AcceptedTasksTab,
  InProgressTasksTab,
  CompletedTasksTab,
  TechnicianAssignedTasks,
} from "./components";
import { mockTasks } from "./mockTasks";
import { TaskItem } from "./types";

export default function TechnicianDashboard() {
  const [tasks, setTasks] = useState<TaskItem[]>(mockTasks);
  const [activeTab, setActiveTab] = useState("all");
  const [departmentId, setDepartmentId] = useState(
    "b9caa2f4-a8ee-461c-8d83-ed0ff1d58129"
  );
  const [technicianId, setTechnicianId] = useState("test-technician-123");
  const { toast } = useToast();

  const allTasks = tasks;
  const acceptedTasks = useMemo(
    () => tasks.filter((t) => t.status === "Accepted"),
    [tasks]
  );
  const inProgressTasks = useMemo(
    () => tasks.filter((t) => t.status === "In Progress"),
    [tasks]
  );
  const completedTasks = useMemo(
    () => tasks.filter((t) => t.status === "Completed"),
    [tasks]
  );

  // Quick action counts
  const urgentCount = useMemo(
    () =>
      tasks.filter((t) => t.priority === "urgent" && t.status !== "Completed")
        .length,
    [tasks]
  );

  const todayCount = useMemo(() => {
    const today = new Date().toDateString();
    return tasks.filter((t) => {
      const dueDate = new Date(t.dueDate).toDateString();
      return dueDate === today && t.status !== "Completed";
    }).length;
  }, [tasks]);

  const handleAccept = (task: TaskItem) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? { ...t, status: "Accepted", acceptedAt: new Date().toISOString() }
          : t
      )
    );
    toast({
      title: "Task Accepted",
      description: `Order ${task.id} has been accepted successfully.`,
    });
  };

  const handleReject = (task: TaskItem) => {
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    toast({
      title: "Task Rejected",
      description: `Order ${task.id} has been rejected.`,
      variant: "destructive",
    });
  };

  const handleStart = (task: TaskItem) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: "In Progress" } : t))
    );
    toast({
      title: "Task Started",
      description: `Order ${task.id} is now in progress.`,
    });
  };

  const handleComplete = (task: TaskItem) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: "Completed" } : t))
    );
    toast({
      title: "Task Completed",
      description: `Order ${task.id} has been completed successfully.`,
    });
  };

  const handleResign = (task: TaskItem) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? { ...t, status: "Assigned", acceptedAt: undefined }
          : t
      )
    );
    toast({
      title: "Task Resigned",
      description: `Order ${task.id} has been resigned.`,
      variant: "destructive",
    });
  };

  const handleRefresh = () => {
    // In a real app, this would fetch fresh data from the server
    toast({
      title: "Refreshing",
      description: "Tasks are being refreshed...",
    });
  };

  const handleFilterUrgent = () => {
    setActiveTab("all");
    toast({
      title: "Urgent Tasks",
      description: "Showing urgent tasks only.",
    });
  };

  const handleViewToday = () => {
    setActiveTab("all");
    toast({
      title: "Today's Tasks",
      description: "Showing today's due tasks.",
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Technician Dashboard</h1>
      </div>

      {/* Testing Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">API Testing Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="departmentId">
                Department ID (for API testing)
              </Label>
              <Input
                id="departmentId"
                type="text"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                placeholder="Enter department ID"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="technicianId">
                Technician ID (for API testing)
              </Label>
              <Input
                id="technicianId"
                type="text"
                value={technicianId}
                onChange={(e) => setTechnicianId(e.target.value)}
                placeholder="Enter technician ID"
                className="mt-1"
              />
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            <p>Department ID: {departmentId}</p>
            <p>Technician ID: {technicianId}</p>
            <p>API Endpoint: /api/technician/total/{departmentId}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Task Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="assigned">Assigned</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="inprogress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <AllTasksTab
                tasks={allTasks}
                onAccept={handleAccept}
                departmentId={departmentId}
                technicianId={technicianId}
              />
            </TabsContent>

            <TabsContent value="assigned" className="mt-6">
              <TechnicianAssignedTasks technicianId={technicianId} />
            </TabsContent>

            <TabsContent value="accepted" className="mt-6">
              <AcceptedTasksTab
                tasks={acceptedTasks}
                onStart={handleStart}
                onResign={handleResign}
              />
            </TabsContent>

            <TabsContent value="inprogress" className="mt-6">
              <InProgressTasksTab
                tasks={inProgressTasks}
                onComplete={handleComplete}
              />
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <CompletedTasksTab tasks={completedTasks} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
