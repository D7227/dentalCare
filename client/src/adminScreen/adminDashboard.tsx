import React, { useEffect, useState, } from 'react';
import { useAppSelector } from '@/store/hooks';
import AdminHeader from './component/adminHeader';
import AreaManagerDashboard from './screen/areaManager/AreaManagerDashboard';
import DepartmentViewPage from './screen/departmentView/DepartmentViewPage';
import DailyReportsPage from './screen/dailyReport/DailyReportsPage';
import TaskAssignmentPage from './screen/taskAssignment/TaskAssignmentPage';
import UserManagementPage from './screen/userManagement/UserManagementPage';
import ClinicManagementPage from './screen/clinicManagment/ClinicManagementPage';
import CaseManagementPage from './screen/caseManagement/CaseManagementPage';
import OrderManagementPage from './screen/orderManagement/OrderManagementPage';
import InventoryPage from './screen/inventory/InventoryPage';
import AccessoryManagementPage from './screen/accessoryManagement/AccessoryManagementPage';
import BillingManagementPage from './screen/billingManagement/BillingManagementPage';
import ScanAppointmentPage from './screen/scanAppointment/ScanAppointmentPage';
import CommunicationPage from './screen/communication/CommunicationPage';
import DeliveryLogisticsPage from './screen/deliveryLogistics/DeliveryLogisticsPage';
import ReportsPage from './screen/report/ReportsPage';
import PaymentsPage from './screen/payment/PaymentsPage';
import MastersPage from './screen/master/MastersPage';
import PermissionsPage from './screen/permission/PermissionsPage';
import SettingsPage from './screen/setting/SettingsPage';
import AdminSideBar from './adminSideBar';
import AdminMainDashboard from './screen/adminDashboard/AdminDashboard';

const AdminDashboard = () => {
    // const navigate = useNavigate();
    // const { toast } = useToast();
    const user = useAppSelector((state) => state.userData.userData);

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const permissions = user?.permissions ?? [];

    const handleToggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };
    const handleSectionChange = (section: string) => {
        setActiveSection(section);
        setIsMobileMenuOpen(false);
    };
    const renderMainContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return <AdminMainDashboard />;
            case 'area_manager':
                return <AreaManagerDashboard />;
            case 'department':
                return <DepartmentViewPage />;
            case 'daily_reports':
                return <DailyReportsPage />;
            case 'task_assignment':
                return <TaskAssignmentPage />;
            case 'user_management':
                return <UserManagementPage />;
            case 'clinic_management':
                return <ClinicManagementPage />;
            case 'case_management':
                return <CaseManagementPage />;
            case 'order_management':
                return <OrderManagementPage />;
            case 'inventory':
                return <InventoryPage />;
            case 'accessory_management':
                return <AccessoryManagementPage />;
            case 'billing_management':
                return <BillingManagementPage />;
            case 'scan_appointments':
                return <ScanAppointmentPage />;
            case 'communication':
                return <CommunicationPage />;
            case 'delivery_logistics':
                return <DeliveryLogisticsPage />;
            case 'reports':
                return <ReportsPage />;
            case 'payments':
                return <PaymentsPage />;
            case 'masters':
                return <MastersPage />;
            case 'permissions':
                return <PermissionsPage />;
            case 'settings':
                return <SettingsPage />;
            default:
                return <AdminDashboard />;
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeSection]);
    const sectionTitleMap: Record<string, string> = {
        'dashboard': 'Dashboard',
        'area_manager': 'Area Manager',
        'department': 'Department View',
        'daily_reports': 'Daily Reports',
        'user_management': 'User Management',
        'clinic_management': 'Clinic Management',
        'doctor_management': 'Doctor Management',
        'case_management': 'Case Management',
        'my-team': 'Team Management',
        'inventory': 'Inventory',
        'accessory_management': 'Accessory Management',
        'billing_management': 'Billing Management',
        'scan_appointments': 'Scan Appointment',
        'communication': 'Communication',
        'delivery_logistics': 'Delivery & Logistics Management',
        'reports': 'Reports & Analytics',
        'payments': 'Payments Management',
        'masters': 'Masters Management',
        'permissions': 'Permissions & Role Management',
        'settings': 'System Settings'
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
            <div className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out`}>
                <AdminSideBar
                    isCollapsed={isCollapsed}
                    activeSection={activeSection}
                    onSectionChange={handleSectionChange}
                    onToggleCollapse={handleToggleSidebar}
                />
            </div>
            {/* Main Content */}
            <div className={`flex-1 flex flex-col min-w-0 ${isCollapsed ? 'lg:ml-16' : 'lg:ml-64'} transition-all duration-300`}>
                <AdminHeader
                    title={sectionTitleMap[activeSection] || 'dashboard'}
                />
                <main className="flex-1 p-6 bg-white">
                    {renderMainContent()}
                </main>
            </div>
        </div>
    );
}

export default AdminDashboard;