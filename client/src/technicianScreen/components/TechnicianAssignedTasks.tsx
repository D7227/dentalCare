import React, { useEffect, useState } from "react";
import CommonTable from "@/components/common/CommonTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskItem, TaskPriority, TaskStatus } from "../types";
import { TechnicianApiService, ApiTask } from "../api/technicianApi";
import { useToast } from "@/hooks/use-toast";

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

interface TechnicianAssignedTasksProps {
  technicianId: string;
}

export default function TechnicianAssignedTasks({ technicianId }: TechnicianAssignedTasksProps) {
  const [assignedTasks, setAssignedTasks] = useState<ApiTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingTask, setProcessingTask] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch assigned tasks
  useEffect(() => {
    const fetchAssignedTasks = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await TechnicianApiService.getTechnicianAssignedTasks(technicianId);
        setAssignedTasks(data);
      } catch (err) {
        console.error("Error fetching assigned tasks:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch assigned tasks");
      } finally {
        setLoading(false);
      }
    };

    if (technicianId) {
      fetchAssignedTasks();
    }
  }, [technicianId]);

  // Handle task actions
  const handleStartTask = async (task: TaskItem) => {
    try {
      setProcessingTask(task.id);
      await TechnicianApiService.startTask(task.id, technicianId);
      
      toast({
        title: "Task Started",
        description: `Order ${task.orderNumber || task.id} is now in progress.`,
      });
      
      // Refresh the task list
      const updatedData = await TechnicianApiService.getTechnicianAssignedTasks(technicianId);
      setAssignedTasks(updatedData);
      
    } catch (err) {
      console.error("Error starting task:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to start task",
        variant: "destructive",
      });
    } finally {
      setProcessingTask(null);
    }
  };

  const handleCompleteTask = async (task: TaskItem) => {
    try {
      setProcessingTask(task.id);
      await TechnicianApiService.completeTask(task.id, technicianId);
      
      toast({
        title: "Task Completed",
        description: `Order ${task.orderNumber || task.id} has been completed successfully.`,
      });
      
      // Refresh the task list
      const updatedData = await TechnicianApiService.getTechnicianAssignedTasks(technicianId);
      setAssignedTasks(updatedData);
      
    } catch (err) {
      console.error("Error completing task:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to complete task",
        variant: "destructive",
      });
    } finally {
      setProcessingTask(null);
    }
  };

  const handleResignTask = async (task: TaskItem) => {
    try {
      setProcessingTask(task.id);
      await TechnicianApiService.resignTask(task.id, technicianId);
      
      toast({
        title: "Task Resigned",
        description: `Order ${task.orderNumber || task.id} has been resigned.`,
        variant: "destructive",
      });
      
      // Refresh the task list
      const updatedData = await TechnicianApiService.getTechnicianAssignedTasks(technicianId);
      setAssignedTasks(updatedData);
      
    } catch (err) {
      console.error("Error resigning task:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to resign task",
        variant: "destructive",
      });
    } finally {
      setProcessingTask(null);
    }
  };

  // Transform API data to match TaskItem interface
  const transformedTasks: TaskItem[] = assignedTasks.map((apiTask, index) => ({
    id: apiTask.orderId,
    orderNumber: apiTask.orderNumber,
    caseType: `Case Type: ${apiTask.prescriptionTypesId}`,
    priority: "medium" as TaskPriority,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: apiTask.status === "assigned_pending" ? "Accepted" as TaskStatus : "In Progress" as TaskStatus,
    tooth: apiTask.extractedTeethNumbers?.join(", ") || "N/A",
  }));

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading assigned tasks...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <div className="text-center">
          <div className="text-red-500 mb-2">Error loading assigned tasks</div>
          <div className="text-sm text-gray-600">{error}</div>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 p-4 bg-green-50 rounded-lg">
        <div className="text-sm text-green-800">
          <strong>Assigned Tasks:</strong> {assignedTasks.length} tasks assigned to technician
        </div>
        <div className="text-xs text-green-600 mt-1">
          Technician ID: {technicianId}
        </div>
      </div>

      <CommonTable<TaskItem>
        columns={[
          {
            key: "id",
            title: "Order ID",
            render: (row) => (
              <div className="text-sm text-gray-700">
                <span className="font-medium">{row.orderNumber}</span>
              </div>
            ),
          },
          {
            key: "caseDetails",
            title: "Case Details",
            render: (row) => (
              <div className="text-sm text-gray-700">
                <span className="font-medium">{row.caseType}</span>
                {row.tooth && (
                  <span className="ml-2 text-gray-500">Tooth {row.tooth}</span>
                )}
              </div>
            ),
          },
          {
            key: "status",
            title: "Status",
            render: (row) => (
              <Badge variant={row.status === "Accepted" ? "secondary" : "warning"}>
                {row.status}
              </Badge>
            ),
            width: 120,
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
            render: (row) => {
              const isProcessing = processingTask === row.id;
              
              if (row.status === "Accepted") {
                return (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleStartTask(row)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Starting..." : "Start"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleResignTask(row)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Resigning..." : "Resign"}
                    </Button>
                  </div>
                );
              } else if (row.status === "In Progress") {
                return (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleCompleteTask(row)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Completing..." : "Complete"}
                    </Button>
                  </div>
                );
              }
              
              return null;
            },
            width: 200,
          },
        ]}
        data={transformedTasks}
        initialPageSize={8}
        isLoading={loading}
      />
    </div>
  );
} 