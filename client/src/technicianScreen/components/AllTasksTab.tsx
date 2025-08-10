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

interface AllTasksTabProps {
  tasks: TaskItem[];
  onAccept: (task: TaskItem) => void;
  departmentId?: string; // Optional prop for API testing
  technicianId?: string; // Optional prop for API testing
}

export default function AllTasksTab({
  tasks,
  onAccept,
  departmentId = "1",
  technicianId = "test-technician-id", // Default for testing
}: AllTasksTabProps) {
  const [apiTasks, setApiTasks] = useState<ApiTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptingTask, setAcceptingTask] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch data from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await TechnicianApiService.getTechnicianTasks(
          departmentId
        );
        setApiTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [departmentId]); // Re-fetch when departmentId changes

  // Handle task acceptance
  const handleAcceptTask = async (task: TaskItem) => {
    try {
      setAcceptingTask(task.id);
      
      // Call the API to accept the task
      await TechnicianApiService.acceptTask(task.id, technicianId);
      
      // Call the parent handler for UI updates
      onAccept(task);
      
      // Show success message
      toast({
        title: "Task Accepted",
        description: `Order ${task.orderNumber || task.id} has been accepted successfully.`,
      });
      
      // Refresh the task list
      const updatedData = await TechnicianApiService.getTechnicianTasks(departmentId);
      setApiTasks(updatedData);
      
    } catch (err) {
      console.error("Error accepting task:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to accept task",
        variant: "destructive",
      });
    } finally {
      setAcceptingTask(null);
    }
  };

  // Transform API data to match TaskItem interface
  const transformedTasks: TaskItem[] = apiTasks.map((apiTask, index) => ({
    id: apiTask.orderId,
    orderNumber: apiTask.orderNumber,
    caseType: `Case Type: ${apiTask.prescriptionTypesId}`, // Placeholder
    priority: "medium" as TaskPriority, // Default priority
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    status: "Assigned" as TaskStatus, // Default status
    tooth: apiTask.extractedTeethNumbers?.join(", ") || "N/A",
  }));

  // Use API data if available, otherwise fall back to props
  const displayTasks = apiTasks.length > 0 ? transformedTasks : tasks;

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading tasks...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <div className="text-center">
          <div className="text-red-500 mb-2">Error loading tasks</div>
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
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <div className="text-sm text-blue-800">
          <strong>API Status:</strong> {apiTasks.length > 0 
            ? `Loaded ${apiTasks.length} tasks from API` 
            : "Using mock data (no API response)"
          }
        </div>
        <div className="text-xs text-blue-600 mt-1">
          Department ID: {departmentId} | Technician ID: {technicianId}
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
              const isAccepting = acceptingTask === row.id;
              return (
                <div className="flex items-center gap-2">
                  <Button
                    key="accept"
                    size="sm"
                    variant="secondary"
                    onClick={() => handleAcceptTask(row)}
                    disabled={isAccepting}
                  >
                    {isAccepting ? "Accepting..." : "Accept"}
                  </Button>
                </div>
              );
            },
            width: 200,
          },
        ]}
        data={displayTasks}
        initialPageSize={8}
        isLoading={loading}
      />
    </div>
  );
}
