import React from "react";
import {
  LayoutDashboard,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import logoImage from "@/assets/logo.png";
import Small_Logo from "@/assets/Small_Logo.png";

interface DepartmentHeadSidebarProps {
  isCollapsed: boolean;
  activeSection: string;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    id: "dashboard",
    path: "/department-head/dashboard",
  },
  {
    icon: Users,
    label: "Technicians",
    id: "technicians",
    path: "/department-head/technicians",
  },
];

const DepartmentHeadSidebar: React.FC<DepartmentHeadSidebarProps> = ({
  isCollapsed,
  activeSection,
  onToggleCollapse,
  onLogout,
}) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col h-full",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Sidebar Toggle Button */}
      <div className="hidden lg:block">
        <button
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute top-[36.5px] right-0 translate-x-1/2 -translate-y-1/2 z-50 w-[28px] h-[28px] rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 border border-gray-200"
          style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.10)" }}
        >
          {isCollapsed ? (
            <ChevronRight size={16} className="text-primary" />
          ) : (
            <ChevronLeft size={16} className="text-primary" />
          )}
        </button>
      </div>

      {/* Header */}
      <div
        className={cn(
          "border-b border-gray-200 flex items-center justify-center"
        )}
        style={{
          height: 72,
          minHeight: 72,
          maxHeight: 72,
          padding: 0,
        }}
      >
        <div
          className={cn(
            "flex items-center gap-3 pt-[8px] pb-[8px]",
            isCollapsed ? "justify-center" : ""
          )}
        >
          <div
            className={cn(
              "flex items-center justify-center w-full",
              isCollapsed && "mx-auto"
            )}
          >
            {isCollapsed ? (
              <img src={Small_Logo} alt="Logo" className="h-[40px] w-[40px]" />
            ) : (
              <img
                src={logoImage}
                alt="Logo"
                className={cn(
                  isCollapsed
                    ? "h-[40px] w-[40px] mx-auto"
                    : "h-[60px] w-[155px] ml-[40px] mr-[40px]"
                )}
              />
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className={cn(
          "flex-1 space-y-2 transition-all duration-200",
          isCollapsed ? "p-1" : "p-4"
        )}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "w-full flex items-center transition-all duration-200 relative group",
                isCollapsed
                  ? "justify-center p-0 h-12 w-12 mx-auto rounded-full"
                  : "gap-3 px-3 py-3 rounded-lg text-sm font-medium hover:bg-gray-100",
                isActive &&
                  (isCollapsed
                    ? "bg-teal-500 text-white"
                    : "bg-teal-500 text-white hover:bg-teal-600")
              )}
              aria-label={item.label}
            >
              <Icon
                className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isActive ? "text-white" : "text-gray-600"
                )}
              />
              {!isCollapsed && (
                <span
                  className={cn(
                    "flex-1 text-left",
                    isActive ? "text-white" : "text-gray-700"
                  )}
                >
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer/Logout */}
      <div
        className={cn(
          "border-t border-gray-200 transition-all duration-200",
          isCollapsed ? "p-1" : "p-4"
        )}
      >
        <button
          onClick={onLogout}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200",
            isCollapsed ? "justify-center" : ""
          )}
        >
          <svg
            className="h-5 w-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
            />
          </svg>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default DepartmentHeadSidebar;
