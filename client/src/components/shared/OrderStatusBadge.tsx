import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  status: string;
}

const statusConfig = {
  pending: {
    label: "Pending",
    variant: "secondary" as const,
    className: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700"
  },
  in_progress: {
    label: "In Progress",
    variant: "default" as const,
    className: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700"
  },
  trial_ready: {
    label: "Trial Ready",
    variant: "default" as const,
    className: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700"
  },
  completed: {
    label: "Completed",
    variant: "default" as const,
    className: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700"
  },
  delivered: {
    label: "Delivered",
    variant: "default" as const,
    className: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900 dark:text-emerald-200 dark:border-emerald-700"
  },
  rejected: {
    label: "Rejected",
    variant: "destructive" as const,
    className: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700"
  }
};

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  
  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} font-medium text-xs px-2 py-1`}
    >
      {config.label}
    </Badge>
  );
};