import React, { useState } from 'react';
import { LayoutDashboard, FileText, Calendar, Truck, Receipt, MessageSquare, User, Users, Plus, LogOut, ChevronDown, ChevronRight, ChevronLeft, Edit, MapPin, Building2, ClipboardList, Building, Package, Wrench, Package2, CreditCard, BarChart3, Database, Shield, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import logoImage from '@/assets/logo.png';
import Small_Logo from '@/assets/Small_Logo.png';
import { useClinicMembers } from '@/hooks/useClinicMembers';
import LayoutConstants from '@/doctor/utils/staticValue';
import { useLocation } from 'wouter';
import { useLogoutMutation } from '@/store/slices/doctorAuthApi';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAppSelector } from '@/store/hooks';

export interface SidebarProps {
    isCollapsed: boolean;
    activeSection: string;
    onSectionChange: (section: string) => void;
    onToggleCollapse: () => void;
}

const HeadSideBar = ({
    isCollapsed,
    activeSection,
    onSectionChange,
    onToggleCollapse
}: SidebarProps) => {

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
            //   badge: 2
        },
        {
            id: 'billing',
            label: 'Billing',
            icon: Receipt,
            //   badge: 3
        },
        {
            id: 'messages',
            label: 'Messages',
            icon: MessageSquare,
            //   badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined
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

    const adminMenuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
        { icon: MapPin, label: 'Area Manager', id: 'area_manager' },
        { icon: Building2, label: 'Department View', id: 'department' },
        { icon: FileText, label: 'Daily Reports', id: 'daily_reports' },
        { icon: ClipboardList, label: 'Task Assignment', id: 'task_assignment' },
        { icon: Users, label: 'User Management', id: 'user_management' },
        { icon: Building, label: 'Clinic Management', id: 'clinic_management' },
        { icon: Users, label: 'Doctor Management', id: 'doctor_management' },
        { icon: FileText, label: 'Case Management', id: 'case_management' },
        { icon: Package, label: 'Order Management', id: 'order_management' },
        { icon: Package2, label: 'Inventory', id: 'inventory' },
        { icon: Wrench, label: 'Accessory Management', id: 'accessory_management' },
        { icon: CreditCard, label: 'Billing Management', id: 'billing_management' },
        { icon: Calendar, label: 'Scan Appointments', id: 'scan_appointments' },
        { icon: MessageSquare, label: 'Communication', id: 'communication' },
        { icon: Truck, label: 'Delivery & Logistics', id: 'delivery_logistics' },
        { icon: BarChart3, label: 'Reports', id: 'reports' },
        { icon: CreditCard, label: 'Payments', id: 'payments' },
        { icon: Database, label: 'Masters', id: 'masters' },
        { icon: Shield, label: 'Permissions', id: 'permissions' },
        { icon: Settings, label: 'Settings', id: 'settings' },
    ];



    // Only show menu items if user has permission, except for always-allowed items


    return (
        <div className={cn(
            "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out",
            "flex flex-col h-full",
            isCollapsed ? "w-16" : "w-64"
        )}>
            {/* Sidebar Toggle Button - floating, only on desktop */}
            <div className="hidden lg:block">
                <button
                    onClick={onToggleCollapse}
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    className={`absolute top-[36.5px] right-0 translate-x-1/2 -translate-y-1/2 z-50 w-[28px] h-[28px] rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 border border-gray-200`}
                    style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}
                >
                    <span className="flex items-center justify-center">
                        {isCollapsed ? (
                            <ChevronRight size={16} className="text-primary transition-transform duration-300" />
                        ) : (
                            <ChevronLeft size={16} className="text-primary transition-transform duration-300" />
                        )}
                    </span>
                </button>
            </div>
            {/* Header */}
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
                <div className={cn(
                    "flex items-center gap-3 pt-[8px] pb-[8px]",
                    isCollapsed ? "justify-center" : ""
                )}>
                    <div className={cn("flex items-center justify-center w-full", isCollapsed && "mx-auto")}>
                        {isCollapsed ?
                            <img
                                src={Small_Logo}
                                alt="ADVANCE Dental Export"
                                className="h-[40px] w-[40px]"
                            />
                            :
                            <img
                                src={logoImage}
                                alt="ADVANCE Dental Export"
                                className={cn(
                                    isCollapsed ? "h-[40px] w-[40px] mx-auto" : "h-[60px] w-[155px] ml-[40px] mr-[40px]"
                                )}
                            />
                        }
                    </div>
                </div>
            </div>
            {/* Navigation */}
            <nav className={cn("flex-1 space-y-2 transition-all duration-200", isCollapsed ? "p-1" : "p-4")}>
                {/* Dashboard menu item (always first) */}
                {adminMenuItems.map(item => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return <button key={item.id} onClick={() => onSectionChange(item.id)} className={cn(
                        "w-full flex items-center transition-all duration-200 relative group",
                        isCollapsed ? "justify-center p-0 h-12 w-12 mx-auto rounded-full" : "gap-3 px-3 py-3 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800",
                        isActive && (isCollapsed ? "bg-teal-500 text-white" : "bg-teal-500 text-white hover:bg-teal-600")
                    )} aria-label={item.label}>
                        <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-white" : "text-gray-600 dark:text-gray-400")} />
                        {!isCollapsed && <>
                            <span className={cn("flex-1 text-left", isActive ? "text-white" : "text-gray-700 dark:text-gray-300")}>{item.label}</span>
                            {/* {item.badge && <span className="ml-auto bg-secondary text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center font-medium">{item.badge}</span>} */}
                        </>}
                        {/* {isCollapsed && item.badge && <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">{item.badge}</span>} */}
                    </button>;
                })}
            </nav>

            {/* User Profile Section */}
            {/* <div className={cn(
        "border-t border-gray-200 dark:border-gray-800 transition-all duration-200",
        isCollapsed ? "p-1" : "p-4"
      )}>
        <div className={cn(
          "flex items-center gap-3 rounded-lg bg-gray-50 dark:bg-gray-800",
          isCollapsed ? "justify-center p-2" : "p-3"
        )}>
          <Avatar className={cn("flex-shrink-0", isCollapsed ? "h-8 w-8" : "h-10 w-10")}>
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
            // onClick={handleLogout}
            className={cn(
              "h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full flex-shrink-0",
              isCollapsed && "h-8 w-8"
            )}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div> */}
        </div>
    );
};

export default HeadSideBar;
