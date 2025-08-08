import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskItem } from "../types";

interface DashboardStatsProps {
  tasks: TaskItem[];
}

export default function DashboardStats({ tasks }: DashboardStatsProps) {
  const stats = {
    total: tasks.length,
    assigned: tasks.filter(t => t.status === "Assigned").length,
    accepted: tasks.filter(t => t.status === "Accepted").length,
    inProgress: tasks.filter(t => t.status === "In Progress").length,
    completed: tasks.filter(t => t.status === "Completed").length,
  };

  const getPriorityCount = (priority: string) => {
    return tasks.filter(t => t.priority === priority).length;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          <Badge variant="outline">{stats.total}</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            All assigned tasks
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            {stats.assigned + stats.accepted}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {stats.assigned + stats.accepted}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.assigned} assigned, {stats.accepted} accepted
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {stats.inProgress}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {stats.inProgress}
          </div>
          <p className="text-xs text-muted-foreground">
            Currently working on
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {stats.completed}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats.completed}
          </div>
          <p className="text-xs text-muted-foreground">
            Successfully completed
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 