import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import AdminLayout from "@/adminScreen/AdminLayout";
import AdminMainDashboard from "@/adminScreen/screen/adminDashboard/AdminDashboard";
import AreaManagerDashboard from "@/adminScreen/screen/areaManager/AreaManagerDashboard";
import DepartmentViewPage from "@/adminScreen/screen/departmentView/DepartmentViewPage";
import DailyReportsPage from "@/adminScreen/screen/dailyReport/DailyReportsPage";
import TaskAssignmentPage from "@/adminScreen/screen/taskAssignment/TaskAssignmentPage";
import UserManagementPage from "@/adminScreen/screen/userManagement/UserManagementPage";
import ClinicManagementPage from "@/adminScreen/screen/clinicManagment/ClinicManagementPage";
import CaseManagementPage from "@/adminScreen/screen/caseManagement/CaseManagementPage";
import OrderManagementPage from "@/adminScreen/screen/orderManagement/OrderManagementPage";
import TechnicianManagementPage from "@/adminScreen/screen/taskAssignment/TaskAssignmentPage";
import InventoryPage from "@/adminScreen/screen/inventory/InventoryPage";
import AccessoryManagementPage from "@/adminScreen/screen/accessoryManagement/AccessoryManagementPage";
import BillingManagementPage from "@/adminScreen/screen/billingManagement/BillingManagementPage";
import ScanAppointmentPage from "@/adminScreen/screen/scanAppointment/ScanAppointmentPage";
import CommunicationPage from "@/adminScreen/screen/communication/CommunicationPage";
import DeliveryLogisticsPage from "@/adminScreen/screen/deliveryLogistics/DeliveryLogisticsPage";
import ReportsPage from "@/adminScreen/screen/report/ReportsPage";
import PaymentsPage from "@/adminScreen/screen/payment/PaymentsPage";
import MastersPage from "@/adminScreen/screen/master/MastersPage";
import PermissionsPage from "@/adminScreen/screen/permission/PermissionsPage";
import SettingsPage from "@/adminScreen/screen/setting/SettingsPage";

export const adminRoutes = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminMainDashboard /> },
      { path: "dashboard", element: <AdminMainDashboard /> },
      { path: "area-manager", element: <AreaManagerDashboard /> },
      { path: "department", element: <DepartmentViewPage /> },
      {
        path: "technician-management",
        element: <TechnicianManagementPage />,
      },
      { path: "daily-reports", element: <DailyReportsPage /> },
      { path: "task-assignment", element: <TaskAssignmentPage /> },
      { path: "user-management", element: <UserManagementPage /> },
      { path: "clinic-management", element: <ClinicManagementPage /> },
      { path: "doctor-management", element: <CaseManagementPage /> },
      { path: "case-management", element: <CaseManagementPage /> },
      { path: "order-management", element: <OrderManagementPage /> },
      { path: "inventory", element: <InventoryPage /> },
      {
        path: "accessory-management",
        element: <AccessoryManagementPage />,
      },
      { path: "billing-management", element: <BillingManagementPage /> },
      { path: "scan-appointments", element: <ScanAppointmentPage /> },
      { path: "communication", element: <CommunicationPage /> },
      { path: "delivery-logistics", element: <DeliveryLogisticsPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "payments", element: <PaymentsPage /> },
      { path: "masters", element: <MastersPage /> },
      { path: "permissions", element: <PermissionsPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
];
