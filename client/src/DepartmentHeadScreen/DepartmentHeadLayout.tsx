import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import DepartmentHeadSidebar from "./components/DepartmentHeadSidebar";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import {
  clearDepartmentHead,
  selectDepartmentHeadUser,
  setSelectedDepartments,
} from "@/store/slices/departmentHeadSlice/departmentHeadSlice";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetDepartmentHeadProfileQuery } from "@/store/slices/departmentHeadSlice/departmentHeadApi";
import { skipToken } from "@reduxjs/toolkit/query";

const DepartmentHeadLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  const departmentHeadUser = useSelector(selectDepartmentHeadUser);
  const { data: departmentHeadProfile } = useGetDepartmentHeadProfileQuery(
    departmentHeadUser?.id ? { id: departmentHeadUser.id } : skipToken
  );

  React.useEffect(() => {
    if (departmentHeadProfile?.data?.departments) {
      setDepartments(departmentHeadProfile.data.departments);

      // Set active department as selected if not already set
      if (
        departmentHeadProfile.data.activeDepartmentId &&
        !selectedDepartment
      ) {
        const activeDept = departmentHeadProfile.data.departments.find(
          (dept: any) =>
            dept.id === departmentHeadProfile.data.activeDepartmentId
        );
        if (activeDept) {
          setSelectedDepartment(activeDept);
        }
      }
    }
  }, [departmentHeadProfile, selectedDepartment]);

  // Handler for department selection
  const handleDepartmentChange = (departmentId: string) => {
    const selectedDept = departments.find(
      (dept: any) => dept.id === departmentId
    );
    if (selectedDept) {
      dispatch(setSelectedDepartments(selectedDept));
      setSelectedDepartment(selectedDept);
    }
  };

  // Extract active section from URL
  const getActiveSectionFromPath = (pathname: string) => {
    const path = pathname.split("/").pop();
    if (!path || path === "department-head") return "dashboard";

    // Map URL paths to section IDs
    const pathToSectionMap: Record<string, string> = {
      dashboard: "dashboard",
      technicians: "technicians",
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

  const handleLogout = () => {
    dispatch(clearDepartmentHead());
    localStorage.removeItem("department-head-token");
    navigate("/department-head/login", { replace: true });
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the department head portal.",
    });
  };

  useEffect(() => {
    // Redirect to dashboard if on /department-head without subpath
    if (location.pathname === "/department-head") {
      navigate("/department-head/dashboard");
    }
    window.scrollTo(0, 0);
  }, [location.pathname, navigate]);

  const sectionTitleMap: Record<string, string> = {
    dashboard: "Dashboard",
    technicians: "Technician Management",
  };

  return (
    <div className="min-h-screen flex w-full bg-gray-50">
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
        <DepartmentHeadSidebar
          isCollapsed={isCollapsed}
          activeSection={activeSection}
          onToggleCollapse={handleToggleSidebar}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-w-0 ${
          isCollapsed ? "lg:ml-16" : "lg:ml-64"
        } transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white h-[73px] border-b border-gray-200">
          {/* <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold">
              {sectionTitleMap[activeSection] || "Dashboard"}
            </h2>
          </div> */}

          <div>
            <span className="text-2xl font-bold">
              {selectedDepartment?.name} Dashboard
            </span>
          </div>
          <div>
            <Select
              value={selectedDepartment?.id || ""}
              onValueChange={handleDepartmentChange}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DepartmentHeadLayout;
