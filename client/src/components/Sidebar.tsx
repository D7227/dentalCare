import React, { useState } from 'react';
import { LayoutDashboard, FileText, Calendar, Truck, Receipt, MessageSquare, User, Users, Plus, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import logoImage from '@/assets/logo.png';
import { useClinicMembers } from '@/hooks/useClinicMembers';
import LoadingSpinner from './shared/LoadingSpinner';
import { useAppSelector } from '@/store/hooks';
import LayoutConstants from '@/utils/staticValue';

export interface SidebarProps {
  isCollapsed: boolean;
  activeSection: string;
  onSectionChange: (section: string) => void;
  unreadMessagesCount?: number;
  permissions?: string[];
}

const Sidebar = ({
  isCollapsed,
  activeSection,
  onSectionChange,
  unreadMessagesCount = 0,
  permissions = []
}: SidebarProps) => {
  const [clinicMembersOpen, setClinicMembersOpen] = useState(true);

  // Get current user from Redux
  const currentUser = useAppSelector(state => state.auth.user);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: FileText
    },
    {
      id: 'appointments',
      label: 'Scan Booking',
      icon: Calendar
    },
    {
      id: 'pickup',
      label: 'Pickup Requests',
      icon: Truck,
      badge: 2
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: Receipt,
      badge: 3
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined
    },
    {
      id: 'my-team',
      label: 'My Team',
      icon: Users
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User
    }
  ];

  // Fetch clinic members dynamically using Redux user
  const { members: clinicMembers, isLoading: isMembersLoading, error: membersError } = useClinicMembers(currentUser?.clinicName);

  const handleAddMember = () => {
    onSectionChange('my-team');
  };

  const handleLogout = () => {
    // Handle logout logic here
  };

  // Only show menu items if user has permission, except for always-allowed items
  const alwaysAllowed = ['dashboard', 'profile', 'my-team'];
  const permissionMap: Record<string, string> = {
    billing: 'billing',
    tracking: 'orders',
    scan_booking: 'appointments',
    pickup_requests: 'pickup',
    chat: 'messages',
    all_patients: '', // handled elsewhere if needed
  };
  const filteredMenuItems = menuItems.filter(item => {
    if (alwaysAllowed.includes(item.id)) return true;
    // Find the permission key for this menu item
    const permKey = Object.keys(permissionMap).find(key => permissionMap[key] === item.id);
    return permKey ? permissions.includes(permKey) : true;
  });

  return (
    <div className={cn(
      "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out",
      "flex flex-col h-full",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className={`p-0 border-b border-gray-200 dark:border-gray-800 !max-h-[${LayoutConstants.NAVBAR_HEIGHT}px]`} >
        <div className="flex items-center gap-3 pt-[8px] pb-[8px]">
          <div className="flex items-center justify-center">
            <img
              src={logoImage}
              alt="ADVANCE Dental Export"
              className="h-[60px] w-[155px] ml-[40px] mr-[40px]"
            />
          </div>
        </div>
      </div>
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredMenuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return <button key={item.id} onClick={() => onSectionChange(item.id)} className={cn("w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative group", "hover:bg-gray-100 dark:hover:bg-gray-800", isActive && "bg-teal-500 text-white hover:bg-teal-600")} aria-label={item.label}>
            <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-white" : "text-gray-600 dark:text-gray-400")} />
            {!isCollapsed && <>
              <span className={cn("flex-1 text-left", isActive ? "text-white" : "text-gray-700 dark:text-gray-300")}>
                {item.label}
              </span>
              {item.badge && <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center font-medium">
                {item.badge}
              </span>}
            </>}
            {isCollapsed && item.badge && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {item.badge}
            </span>}
          </button>;
        })}
      </nav>
      {/* Clinic Members Section - Collapsible */}
      {!isCollapsed && (
        <div className="p-4 pb-1 border-t border-gray-200 dark:border-gray-800">
          <Collapsible open={clinicMembersOpen} onOpenChange={setClinicMembersOpen}>
            <div className="flex items-center justify-between mb-3">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 p-0 h-auto hover:bg-transparent font-semibold text-gray-700 dark:text-gray-300"
                >
                  <h3 className="text-sm">Clinic Members</h3>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      clinicMembersOpen ? "rotate-180" : ""
                    )}
                  />
                </Button>
              </CollapsibleTrigger>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddMember}
                className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <CollapsibleContent >
              <div className="space-y-2 max-h-[25vh] overflow-y-auto">
                {isMembersLoading ? (
                  <LoadingSpinner />
                ) : membersError ? (
                  <div className="text-red-500 text-sm">Failed to load members</div>
                ) : clinicMembers.length === 0 ? (
                  <div className="text-gray-500 text-sm">No members found</div>
                ) : (
                  clinicMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.profilePicture} alt={member.fullName} />
                        <AvatarFallback className="text-xs bg-blue-500 text-white font-medium">
                          {member.fullName
                            ? member.fullName.split(" ").map((n) => n[0]).join("").toUpperCase()
                            : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 leading-[1.1]">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate leading-[1.1] m-0">
                          {member.fullName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate leading-[1.1] m-0">
                          {member.roleName || member.status || ""}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src="/lovable-uploads/9b05cdc2-aef7-4847-8a52-e496bc12b897.png" alt="Dr. Sarah Mitchell" />
            <AvatarFallback className="bg-blue-500 text-white font-medium">
              SM
            </AvatarFallback>
          </Avatar>

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                Dr. Sarah Mitchell
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                Smile Dental Clinic
              </p>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className={cn(
              "h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full flex-shrink-0",
              isCollapsed && "h-10 w-10"
            )}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
