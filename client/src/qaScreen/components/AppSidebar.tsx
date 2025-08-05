import React, { useState } from "react";
import {
  FileText,
  List,
  ClipboardList,
  Settings,
  User,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Menu as MenuIcon,
  X as CloseIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import logoImage from "@/assets/logo.png";
import Small_Logo from "@/assets/Small_Logo.png";
import LayoutConstants from "@/doctor/utils/staticValue";

interface AppSidebarProps {
  selectedPage: string;
  setSelectedPage: (page: string) => void;
}

const menuItems = [
  { id: "Dashboard", label: "Dashboard", icon: FileText },
  { id: "Production", label: "Production", icon: Settings },
  { id: "Daily Reports", label: "Daily Reports", icon: ClipboardList },
  { id: "Reports & Logs", label: "Reports & Logs", icon: List },
  { id: "Chat", label: "Chat", icon: MessageSquare },
];

export function AppSidebar({ selectedPage, setSelectedPage }: AppSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sidebar content
  const getSidebarContent = (forceExpanded = false) => (
    <div
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-300 ease-in-out shadow-sm",
        forceExpanded ? "w-64" : isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Collapse Toggle Button (desktop only) */}
      <div className="hidden lg:block relative">
        <button
          onClick={() => setIsCollapsed((c) => !c)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute top-[36.5px] right-0 translate-x-1/2 -translate-y-1/2 z-50 w-[28px] h-[28px] rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 border border-gray-200"
          style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.10)" }}
        >
          <span className="flex items-center justify-center">
            {isCollapsed ? (
              <ChevronRight
                size={16}
                className="text-primary transition-transform duration-300"
              />
            ) : (
              <ChevronLeft
                size={16}
                className="text-primary transition-transform duration-300"
              />
            )}
          </span>
        </button>
      </div>
      {/* Logo/App Name */}
      <div
        className={cn(
          "border-b border-gray-200 dark:border-gray-800 flex items-center justify-center"
        )}
        style={{
          height: LayoutConstants.NAVBAR_HEIGHT,
          minHeight: LayoutConstants.NAVBAR_HEIGHT,
          maxHeight: LayoutConstants.NAVBAR_HEIGHT,
          padding: 0,
        }}
      >
        <div
          className={cn(
            "flex items-center gap-3 pt-[8px] pb-[8px]",
            (forceExpanded ? false : isCollapsed) ? "justify-center" : ""
          )}
        >
          <div
            className={cn(
              "flex items-center justify-center w-full",
              (forceExpanded ? false : isCollapsed) && "mx-auto"
            )}
          >
            {(forceExpanded ? false : isCollapsed) ? (
              <img
                src={Small_Logo}
                alt="ADVANCE Dental Export"
                className="h-[40px] w-[40px]"
              />
            ) : (
              <img
                src={logoImage}
                alt="ADVANCE Dental Export"
                className={cn(
                  (forceExpanded ? false : isCollapsed)
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
          "flex-1 p-4 space-y-2 transition-all duration-200",
          (forceExpanded ? false : isCollapsed) ? "p-1" : "p-4"
        )}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = selectedPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setSelectedPage(item.id);
                setMobileOpen(false); // close sidebar on mobile
              }}
              className={cn(
                "w-full flex items-center transition-all duration-200 relative group",
                (forceExpanded ? false : isCollapsed)
                  ? "justify-center p-0 h-12 w-12 mx-auto rounded-full"
                  : "gap-3 px-3 py-3 rounded-lg text-sm font-medium hover:bg-gray-100 text-gray-700",
                isActive &&
                  ((forceExpanded ? false : isCollapsed)
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
              {!(forceExpanded ? false : isCollapsed) && (
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
      {/* User Profile Section */}
      <div
        className={cn(
          "border-t border-gray-200 bg-gray-50 flex items-center gap-3 transition-all duration-200",
          (forceExpanded ? false : isCollapsed) ? "p-1 justify-center" : "p-4"
        )}
      >
        <div className="bg-blue-100 rounded-full p-2">
          <User size={20} className="text-blue-500" />
        </div>
        {!(forceExpanded ? false : isCollapsed) && (
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">QA User</div>
            <div className="text-xs text-gray-500 truncate">
              Quality Analyst
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-[101] p-2"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
      >
        <MenuIcon size={22} />
      </button>
      <div>
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-[100]"
              onClick={() => setMobileOpen(false)}
              aria-label="Close sidebar backdrop"
            />
            <div className="fixed top-0 left-0 h-full w-64 bg-white z-[101] shadow-lg transition-transform duration-300">
              {getSidebarContent(true)}
            </div>
          </>
        )}
        <div className="hidden lg:block h-screen">{getSidebarContent()}</div>
      </div>
    </>
  );
}
