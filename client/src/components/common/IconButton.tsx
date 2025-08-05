import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconButtonProps {
  icon: LucideIcon;
  tooltip: string;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  hoverColor?: "blue" | "green" | "red" | "yellow" | "purple" | "gray";
}

const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  tooltip,
  onClick,
  variant = "ghost",
  size = "sm",
  disabled = false,
  loading = false,
  className,
  hoverColor = "gray",
}) => {
  const hoverClasses = {
    blue: "hover:bg-blue-50 hover:text-blue-600",
    green: "hover:bg-green-50 hover:text-green-600",
    red: "hover:bg-red-50 hover:text-red-600",
    yellow: "hover:bg-yellow-50 hover:text-yellow-600",
    purple: "hover:bg-purple-50 hover:text-purple-600",
    gray: "hover:bg-gray-50 hover:text-gray-600",
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={onClick}
            disabled={disabled || loading}
            className={cn(
              "h-8 w-8 p-0",
              hoverClasses[hoverColor],
              className
            )}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : (
              <Icon className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default IconButton; 