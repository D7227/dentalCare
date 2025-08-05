import React from "react";
import { Badge } from "@/components/ui/badge";

interface TechnicianProfileCardProps {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  employeeId: string;
  departmentName?: string;
  roleName?: string;
  status?: "active" | "inactive";
  profilePic?: string;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
  className?: string;
}

const TechnicianProfileCard: React.FC<TechnicianProfileCardProps> = ({
  firstName,
  lastName,
  email,
  mobileNumber,
  employeeId,
  departmentName,
  roleName,
  status,
  profilePic,
  size = "md",
  showDetails = true,
  className,
}) => {
  const sizeClasses = {
    sm: {
      avatar: "w-8 h-8",
      text: "text-sm",
      name: "text-sm",
      details: "text-xs",
    },
    md: {
      avatar: "w-12 h-12",
      text: "text-base",
      name: "text-base",
      details: "text-sm",
    },
    lg: {
      avatar: "w-16 h-16",
      text: "text-lg",
      name: "text-xl",
      details: "text-base",
    },
  };

  const { avatar, text, name, details } = sizeClasses[size];

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Avatar */}
      <div
        className={`${avatar} rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0`}
      >
        {profilePic ? (
          <img
            src={profilePic}
            alt={`${firstName} ${lastName}`}
            className={`${avatar} rounded-full object-cover`}
          />
        ) : (
          <span className={`${text} font-medium text-gray-600`}>
            {firstName.charAt(0)}
            {lastName.charAt(0)}
          </span>
        )}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className={`${name} font-semibold text-gray-900 truncate`}>
            {firstName} {lastName}
          </h3>
          {status && (
            <Badge variant={status === "active" ? "default" : "secondary"}>
              {status}
            </Badge>
          )}
        </div>

        {showDetails && (
          <div className="space-y-1">
            <p className={`${details} text-gray-600`}>{employeeId}</p>
            <p className={`${details} text-gray-600`}>{email}</p>
            <p className={`${details} text-gray-600`}>{mobileNumber}</p>
            {departmentName && (
              <p className={`${details} text-gray-600`}>
                Department: {departmentName}
              </p>
            )}
            {roleName && (
              <p className={`${details} text-gray-600`}>Role: {roleName}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicianProfileCard;
