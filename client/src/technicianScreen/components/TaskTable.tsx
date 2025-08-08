import React from "react";
import CommonTable from "@/components/common/CommonTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskItem, TaskPriority, TaskStatus } from "../types";

const statusToVariant: Record<TaskStatus, "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "error"> = {
  Assigned: "outline",
  Accepted: "secondary",
  "In Progress": "warning",
  Completed: "success",
};

const priorityToVariant: Record<TaskPriority, "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "error"> = {
  low: "secondary",
  medium: "default",
  high: "warning",
  urgent: "destructive",
};

type TableMode = "all" | "assigned" | "accepted" | "inprogress" | "completed";

interface TaskTableProps {
  tasks: TaskItem[];
  mode: TableMode;
  onAccept?: (task: TaskItem) => void;
  onReject?: (task: TaskItem) => void;
  onStart?: (task: TaskItem) => void;
  onComplete?: (task: TaskItem) => void;
  onResign?: (task: TaskItem) => void;
}

export default function TaskTable({ tasks, mode, onAccept, onReject, onStart, onComplete, onResign }: TaskTableProps) {
  const canResign = (task: TaskItem) => {
    if (task.status !== "Accepted" || !task.acceptedAt) return false;
    const acceptedTime = new Date(task.acceptedAt).getTime();
    const currentTime = new Date().getTime();
    const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
    return (currentTime - acceptedTime) <= thirtyMinutes;
  };

  return (
    <div className="w-full">
      <CommonTable<TaskItem>
        columns={[
          { key: "id", title: "Order ID", width: 110 },
          {
            key: "patientDoctor",
            title: "Patient / Doctor",
            render: (row) => (
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">{row.patientName}</span>
                {row.clinician && (
                  <span className="text-xs text-gray-500">Dr. {row.clinician}</span>
                )}
              </div>
            ),
          },
          {
            key: "caseDetails",
            title: "Case Details",
            render: (row) => (
              <div className="text-sm text-gray-700">
                <span className="font-medium">{row.caseType}</span>
                {row.tooth && <span className="ml-2 text-gray-500">Tooth {row.tooth}</span>}
                {row.notes && <div className="text-xs text-gray-500">{row.notes}</div>}
              </div>
            ),
          },
          {
            key: "priority",
            title: "Priority",
            render: (row) => (
              <Badge variant={priorityToVariant[row.priority]}>{row.priority.charAt(0).toUpperCase() + row.priority.slice(1)}</Badge>
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
            render: (row) => {
              const actions = [] as React.ReactNode[];
              if (mode === "all" || mode === "assigned") {
                const canDecide = row.status === "Assigned";
                actions.push(
                  <Button key="accept" size="sm" variant="secondary" disabled={!canDecide} onClick={() => canDecide && onAccept?.(row)}>
                    Accept
                  </Button>
                );
                actions.push(
                  <Button key="reject" size="sm" variant="outline" disabled={!canDecide} onClick={() => canDecide && onReject?.(row)}>
                    Reject
                  </Button>
                );
              }
              if (mode === "accepted") {
                const canResignTask = canResign(row);
                actions.push(
                  <Button key="start" size="sm" variant="default" onClick={() => onStart?.(row)}>
                    Start
                  </Button>
                );
                actions.push(
                  <Button 
                    key="resign" 
                    size="sm" 
                    variant="destructive" 
                    disabled={!canResignTask}
                    onClick={() => canResignTask && onResign?.(row)}
                  >
                    Resign
                  </Button>
                );
              }
              if (mode === "inprogress") {
                actions.push(
                  <Button key="complete" size="sm" variant="default" onClick={() => onComplete?.(row)}>
                    Complete
                  </Button>
                );
              }
              if (actions.length === 0) {
                return (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Badge variant={statusToVariant[row.status]}>{row.status}</Badge>
                  </div>
                );
              }
              return <div className="flex items-center gap-2">{actions}</div>;
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

