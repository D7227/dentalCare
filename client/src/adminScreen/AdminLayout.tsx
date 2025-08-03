import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import AdminHeader from "./adminHeader";
import AdminSideBar from "./adminSideBar";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Extract active section from URL
  const getActiveSectionFromPath = (pathname: string) => {
    const path = pathname.split("/").pop();
    if (!path || path === "admin") return "dashboard";

    // Map URL paths to section IDs
    const pathToSectionMap: Record<string, string> = {
      dashboard: "dashboard",
      "area-manager": "area_manager",
      department: "department",
      "technician-management": "technician_management",
      "daily-reports": "daily_reports",
      "task-assignment": "task_assignment",
      "user-management": "user_management",
      "clinic-management": "clinic_management",
      "doctor-management": "doctor_management",
      "case-management": "case_management",
      "order-management": "order_management",
      inventory: "inventory",
      "accessory-management": "accessory_management",
      "billing-management": "billing_management",
      "scan-appointments": "scan_appointments",
      communication: "communication",
      "delivery-logistics": "delivery_logistics",
      reports: "reports",
      payments: "payments",
      masters: "masters",
      permissions: "permissions",
      settings: "settings",
    };

    return pathToSectionMap[path] || "dashboard";
  };

  const activeSection = getActiveSectionFromPath(location.pathname);

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    // Redirect to dashboard if on /admin without subpath
    if (location.pathname === "/admin") {
      navigate("/admin/dashboard");
    }
    window.scrollTo(0, 0);
  }, [location.pathname, navigate]);

  const sectionTitleMap: Record<string, string> = {
    dashboard: "Dashboard",
    area_manager: "Area Manager",
    department: "Department View",
    technician_management: "Technician Management",
    daily_reports: "Daily Reports",
    user_management: "User Management",
    clinic_management: "Clinic Management",
    doctor_management: "Doctor Management",
    case_management: "Case Management",
    "my-team": "Team Management",
    inventory: "Inventory",
    accessory_management: "Accessory Management",
    billing_management: "Billing Management",
    scan_appointments: "Scan Appointment",
    communication: "Communication",
    delivery_logistics: "Delivery & Logistics Management",
    reports: "Reports & Analytics",
    payments: "Payments Management",
    masters: "Masters Management",
    permissions: "Permissions & Role Management",
    settings: "System Settings",
  };

  return (
    <div className="min-h-screen flex w-full bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out`}
      >
        <AdminSideBar
          isCollapsed={isCollapsed}
          activeSection={activeSection}
          onToggleCollapse={handleToggleSidebar}
        />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-w-0 ${
          isCollapsed ? "lg:ml-16" : "lg:ml-64"
        } transition-all duration-300`}
      >
        <AdminHeader
          title={sectionTitleMap[activeSection] || "Dashboard"}
          onMobileMenuToggle={handleMobileMenuToggle}
        />
        <main className="flex-1 p-6 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
