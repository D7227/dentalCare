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

interface AssignedTasksTabProps {
  tasks: TaskItem[];
  onAccept: (task: TaskItem) => void;
  onReject: (task: TaskItem) => void;
}

export default function AssignedTasksTab({
  tasks,
  onAccept,
  onReject,
}: AssignedTasksTabProps) {
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
                  variant="secondary"
                  onClick={() => onAccept(row)}
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onReject(row)}
                >
                  Reject
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
