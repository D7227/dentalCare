export type TaskStatus = "Assigned" | "Accepted" | "In Progress" | "Completed";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface TaskItem {
  id: string;
  orderNumber: string;
  caseType: string;
  priority: TaskPriority;
  dueDate: string; // ISO or human-readable for mock
  status: TaskStatus;
  tooth?: string;
  notes?: string;
  acceptedAt?: string; // ISO timestamp when task was accepted
}
