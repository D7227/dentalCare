import React, { useEffect, useState, useRef, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useToast } from '@/hooks/use-toast';
import { useSocket } from '@/contexts/SocketContext';
import { useNavigate } from 'react-router-dom';
import DashboardContent from './DashboardContent';
import OrderTable from './OrderTable';
import ScanBookingContent from './ScanBookingContent';
import PickupRequestsContent from './PickupRequestsContent';
import BillingContent from './BillingContent';
import ChatContent from './ChatContent';
import TeamManagementContent from './TeamManagementContent';
import ProfileContent from './ProfileContent';
import { useAppSelector } from '@/store/hooks';

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const user = useAppSelector((state) => state.userData.userData);

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { onUnreadCountUpdate, offUnreadCountUpdate, getSocket } = useSocket();

    // Fetch chats for unread count
    const [chats, setChats] = useState<any[]>([]);
    useEffect(() => {
        const fetchChats = async () => {
            if (!user?.fullName) return;
            const url = `/api/chats?userId=${encodeURIComponent(user.fullName)}`;
            const response = await fetch(url);
            if (response.ok) {
                setChats(await response.json());
            }
        };
        fetchChats();
    }, [user?.firstname]);

    // Calculate unread group count (filtered for user permissions)
    const userFirstName = user?.firstname || '';
    const userLastName = user?.lastname || '';
    const userFullName = `${userFirstName} ${userLastName}`.trim();
    let permissionFilteredChats = chats;
    const permissions = user?.permissions ?? [];
    const hasChatPermission = permissions.includes('chat');
    const userRole = user?.roleName ?? '';

    if (!hasChatPermission) {
        permissionFilteredChats = chats.filter((chat: any) => {
            const isParticipant = chat.participants.some((participant: string) => {
                return participant.trim().toLowerCase() === userFullName.trim().toLowerCase();
            });
            return isParticipant;
        });
    } else {
        if (['admin_doctor', 'assistant_doctor', 'receptionist'].includes(userRole)) {
            permissionFilteredChats = chats.filter((chat: any) => {
                const isParticipant = chat.participants.some((participant: string) => {
                    return participant.trim().toLowerCase() === userFullName.trim().toLowerCase();
                });
                return isParticipant;
            });
        } else {
            permissionFilteredChats = chats;
        }
    }

    const unreadMessagesCount = permissionFilteredChats.filter((chat: any) => chat.unreadCount && chat.unreadCount > 0).length;
    const prevPermissionsRef = useRef<string[]>(permissions);

    useEffect(() => {
        const handleUnreadCountUpdate = () => {
            if (user?.fullName) {
                // Re-fetch chats
                const url = `/api/chats?userId=${encodeURIComponent(user.fullName)}`;
                fetch(url).then(res => {
                    if (res.ok) {
                        res.json().then(setChats);
                    }
                });
            }
        };
        onUnreadCountUpdate(handleUnreadCountUpdate);
        return () => {
            offUnreadCountUpdate(handleUnreadCountUpdate);
        };
    }, [onUnreadCountUpdate, offUnreadCountUpdate, user?.fullName]);

    const handlePermissionsUpdated = useCallback(async () => {
        try {
            const headers = user?.contactNumber ? { 'x-mobile-number': user.contactNumber } : undefined;
            const response = await fetch('/api/me', headers ? { headers } : undefined);
            if (response && response.ok) {
                const updatedUser = await response.json();
                localStorage.setItem('user', JSON.stringify(updatedUser));
                toast({ title: "Your permissions have been updated. Please check your access." });
            }
        } catch (err) { }
    }, [user?.contactNumber, toast]);

    useEffect(() => {
        const socket = typeof getSocket === 'function' ? getSocket() : null;
        if (!socket) {
            return;
        }
        socket.on('permissions-updated', handlePermissionsUpdated);
        return () => {
            socket.off('permissions-updated', handlePermissionsUpdated);
        };
    }, [getSocket, handlePermissionsUpdated]);

    useEffect(() => {
        // Register user with socket for real-time events
        const socket = getSocket && getSocket();
        if (socket && user?.fullName) {
            socket.emit('register-user', user.fullName);
        }
    }, [user?.fullName, getSocket]);

    // Map sections to required permissions
    const sectionPermissionMap: Record<string, string> = {
        billing: 'billing',
        appointments: 'scan_booking',
        pickup: 'pickup_requests',
        messages: 'chat',
        orders: 'tracking',
    };

    useEffect(() => {
        // If the current section requires a permission the user no longer has, redirect to dashboard
        const requiredPermission = sectionPermissionMap[activeSection];
        if (requiredPermission && user && !permissions.includes(requiredPermission)) {
            setActiveSection('dashboard');
            toast({
                title: 'Access Revoked',
                description: 'Your access to this section was revoked by the admin.',
                variant: 'destructive',
            });
        }
    }, [permissions, activeSection, toast]);

    useEffect(() => {
        const prevPermissions = prevPermissionsRef.current;
        const currentPermissions = permissions;
        if (prevPermissions.length > 0) {
            const revoked = prevPermissions.filter((p: string) => !currentPermissions.includes(p));
            const granted = currentPermissions.filter((p: string) => !prevPermissions.includes(p));
            if (revoked.length > 0) {
                revoked.forEach((permission: string) => {
                    toast({
                        title: 'Access Revoked',
                        description: `Your access to "${permission}" was revoked by the admin.`,
                        variant: 'destructive',
                    });
                });
            }
            if (granted.length > 0) {
                granted.forEach((permission: string) => {
                    toast({
                        title: 'Access Granted',
                        description: `You have been granted access to "${permission}" by the admin.`,
                        variant: 'default',
                    });
                });
            }
        }
        prevPermissionsRef.current = currentPermissions;
    }, [permissions, toast]);

    const handleNewCase = () => {
        navigate('/place-order');
    };
    const handleToggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };
    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    const handleSectionChange = (section: string) => {
        setActiveSection(section);
        setIsMobileMenuOpen(false);
    };
    const renderMainContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return <DashboardContent onNewCase={handleNewCase} onSectionChange={handleSectionChange} />;
            case 'orders':
                return <OrderTable />;
            case 'appointments':
                return <ScanBookingContent />;
            case 'pickup':
                return <PickupRequestsContent />;
            case 'billing':
                return <BillingContent />;
            case 'messages':
                return <ChatContent />;
            case 'my-team':
                return <TeamManagementContent onSectionChange={handleSectionChange} />;
            case 'profile':
                return <ProfileContent />;
            default:
                return <DashboardContent onNewCase={handleNewCase} onSectionChange={handleSectionChange} />;
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeSection]);
    const sectionTitleMap: Record<string, string> = {
        orders: 'All orders',
        appointments: 'Scan Booking',
        pickup: 'Pickup Requests',
        billing: 'Billing & Payments',
        messages: 'Messages',
        'my-team': 'Team Management',
        profile: 'Profile',
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
                <Sidebar
                    isCollapsed={isCollapsed}
                    activeSection={activeSection}
                    onSectionChange={handleSectionChange}
                    unreadMessagesCount={unreadMessagesCount}
                    permissions={permissions}
                    onToggleCollapse={handleToggleSidebar}
                />
            </div>
            {/* Main Content */}
            <div className={`flex-1 flex flex-col min-w-0 ${isCollapsed ? 'lg:ml-16' : 'lg:ml-64'} transition-all duration-300`}>
                <Header
                    onMobileMenuToggle={handleMobileMenuToggle}
                    doctorName={user?.fullName || "Doctor"}
                    clinicName={user?.clinicName || "Clinic"}
                    onSectionChange={handleSectionChange}
                    title={sectionTitleMap[activeSection] || 'Dashboard'}
                />
                <main className="flex-1 p-6 bg-white">
                    {renderMainContent()}
                </main>
            </div>
        </div>
    );
}

export default DoctorDashboard;