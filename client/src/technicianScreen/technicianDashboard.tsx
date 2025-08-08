import React, { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import TaskTable from "./components/TaskTable";
import { mockTasks } from "./mockTasks";
import { TaskItem } from "./types";

export default function TechnicianDashboard() {
  const [tasks, setTasks] = useState<TaskItem[]>(mockTasks);

  const allTasks = tasks;
  const assignedTasks = useMemo(
    () => tasks.filter((t) => t.status === "Assigned"),
    [tasks]
  );
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

  const handleAccept = (task: TaskItem) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? { ...t, status: "Accepted", acceptedAt: new Date().toISOString() }
          : t
      )
    );
  };
  const handleReject = (task: TaskItem) => {
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
  };
  const handleStart = (task: TaskItem) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: "In Progress" } : t))
    );
  };
  const handleComplete = (task: TaskItem) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: "Completed" } : t))
    );
  };
  const handleResign = (task: TaskItem) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? { ...t, status: "Assigned", acceptedAt: undefined }
          : t
      )
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Technician Dashboard</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="assigned">Assigned</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="inprogress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <TaskTable
                mode="all"
                tasks={allTasks}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            </TabsContent>
            <TabsContent value="assigned">
              <TaskTable
                mode="assigned"
                tasks={assignedTasks}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            </TabsContent>
            <TabsContent value="accepted">
              <TaskTable
                mode="accepted"
                tasks={acceptedTasks}
                onStart={handleStart}
                onResign={handleResign}
              />
            </TabsContent>
            <TabsContent value="inprogress">
              <TaskTable
                mode="inprogress"
                tasks={inProgressTasks}
                onComplete={handleComplete}
              />
            </TabsContent>
            <TabsContent value="completed">
              <TaskTable mode="completed" tasks={completedTasks} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
