
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../components/ui/sidebar";
import { FileText, List, ClipboardList, Settings, User , MessageSquare  } from "lucide-react";
import React from "react";

interface AppSidebarProps {
  selectedPage: string;
  setSelectedPage: (page: string) => void;
}

const menuItems = [
  { title: "Dashboard", icon: FileText },
  { title: "Production",  icon: Settings },
  { title: "Daily Reports",  icon: ClipboardList },
  { title: "Reports & Logs",  icon: List },
  { title: "Chat",  icon: MessageSquare  },
];

export function AppSidebar({ selectedPage, setSelectedPage }: AppSidebarProps) {
  return (
    <aside className="h-screen w-64 bg-white border-r shadow-sm flex flex-col justify-between">
      {/* Logo/App Name */}
      <div className="px-6 py-5 border-b flex items-center gap-2">
        <img src="/assets/Logo_1749495880284.png" alt="Logo" className="h-8 w-8" />
        <span className="font-bold text-lg tracking-wide">DentalCare QA</span>
      </div>
      {/* Navigation */}
      <nav className="flex-1 px-2 py-4">
        <SidebarMenu>
          {menuItems.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <button
                  className={`flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group ${
                    selectedPage === item.title ? "bg-blue-50 text-blue-600" : ""
                  }`}
                  onClick={() => setSelectedPage(item.title)}
                >
                  <item.icon size={20} className="text-gray-400 group-hover:text-blue-500" />
                  <span className="font-medium">{item.title}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </nav>
      {/* Footer/Profile */}
      <div className="px-6 py-4 border-t flex items-center gap-3 bg-gray-50">
        <div className="bg-blue-100 rounded-full p-2">
          <User size={20} className="text-blue-500" />
        </div>
        <div>
          <div className="font-semibold text-sm">QA User</div>
          <div className="text-xs text-gray-500">Quality Analyst</div>
        </div>
      </div>
    </aside>
  );
}
