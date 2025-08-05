import React from "react";
import { Button } from "@/components/ui/button";
import CommonModal from "./CommonModal";
import { LucideIcon } from "lucide-react";

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  icon?: LucideIcon;
  iconColor?: "red" | "yellow" | "blue" | "green";
  onConfirm: () => void;
  onCancel?: () => void;
  loading?: boolean;
  variant?: "destructive" | "warning" | "info";
  children?: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  cancelText = "Cancel",
  icon: Icon,
  iconColor = "red",
  onConfirm,
  onCancel,
  loading = false,
  variant = "destructive",
  children,
}) => {
  const iconColors = {
    red: "bg-red-100 text-red-600",
    yellow: "bg-yellow-100 text-yellow-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
  };

  const variantStyles = {
    destructive: {
      confirmVariant: "destructive" as const,
      iconColor: "red" as const,
    },
    warning: {
      confirmVariant: "default" as const,
      iconColor: "yellow" as const,
    },
    info: {
      confirmVariant: "default" as const,
      iconColor: "blue" as const,
    },
  };

  const { confirmVariant, iconColor: defaultIconColor } = variantStyles[variant];
  const finalIconColor = iconColor || defaultIconColor;

  return (
    <CommonModal open={open} onOpenChange={onOpenChange} title={title}>
      <div className="space-y-4">
        {/* Header with Icon */}
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`w-12 h-12 rounded-full ${iconColors[finalIconColor]} flex items-center justify-center`}>
              <Icon className="w-6 h-6" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        </div>

        {/* Custom Content */}
        {children}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              onCancel?.();
              onOpenChange(false);
            }}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Loading...
              </div>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </CommonModal>
  );
};

export default ConfirmationModal; 