import React from "react";
import CommonTable from "@/components/common/CommonTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskItem, TaskPriority } from "../types";

const priorityToVariant: Record<
  TaskPriority,
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "warning"
  | "error"
> = {
  low: "secondary",
  medium: "default",
  high: "warning",
  urgent: "destructive",
};

interface AcceptedTasksTabProps {
  tasks: TaskItem[];
  onStart: (task: TaskItem) => void;
  onResign: (task: TaskItem) => void;
}

export default function AcceptedTasksTab({
  tasks,
  onStart,
  onResign,
}: AcceptedTasksTabProps) {
  const canResign = (task: TaskItem) => {
    if (!task.acceptedAt) return false;
    const acceptedTime = new Date(task.acceptedAt).getTime();
    const currentTime = new Date().getTime();
    const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
    return currentTime - acceptedTime <= thirtyMinutes;
  };

  return (
    <div className="w-full">
      <CommonTable<TaskItem>
        columns={[
          { key: "id", title: "Order ID", width: 110 },
          {
            key: "caseDetails",
            title: "Case Details",
            render: (row) => (
              <div className="text-sm text-gray-700">
                <span className="font-medium">{row.caseType}</span>
                {row.tooth && (
                  <span className="ml-2 text-gray-500">Tooth {row.tooth}</span>
                )}
                {row.notes && (
                  <div className="text-xs text-gray-500">{row.notes}</div>
                )}
              </div>
            ),
          },
          {
            key: "priority",
            title: "Priority",
            render: (row) => (
              <Badge variant={priorityToVariant[row.priority]}>
                {row.priority.charAt(0).toUpperCase() + row.priority.slice(1)}
              </Badge>
            ),
            width: 110,
          },
          {
            key: "acceptedAt",
            title: "Accepted At",
            render: (row) =>
              row.acceptedAt ? new Date(row.acceptedAt).toLocaleString() : "-",
            width: 150,
          },
          {
            key: "dueDate",
            title: "Due Date",
            render: (row) => new Date(row.dueDate).toLocaleDateString(),
            width: 120,
          },
          {
            key: "actions",
            title: "Actions",
            render: (row) => {
              const canResignTask = canResign(row);
              return (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => onStart(row)}
                  >
                    Start
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={!canResignTask}
                    onClick={() => canResignTask && onResign(row)}
                  >
                    Resign
                  </Button>
                </div>
              );
            },
            width: 200,
          },
        ]}
        data={tasks}
        initialPageSize={8}
      />
    </div>
  );
}
