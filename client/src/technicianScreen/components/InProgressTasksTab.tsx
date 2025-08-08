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

interface InProgressTasksTabProps {
  tasks: TaskItem[];
  onComplete: (task: TaskItem) => void;
}

export default function InProgressTasksTab({
  tasks,
  onComplete,
}: InProgressTasksTabProps) {
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
            title: "Started At",
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
            render: (row) => (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => onComplete(row)}
                >
                  Complete
                </Button>
              </div>
            ),
            width: 200,
          },
        ]}
        data={tasks}
        initialPageSize={8}
      />
    </div>
  );
}
