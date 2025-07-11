import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Router, Route, useLocation } from "wouter";
import { useState, useEffect, useRef, useCallback } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SocketProvider, useSocket } from "@/contexts/SocketContext";
import { useAppSelector, useAppDispatch, hasPermission } from "@/store/hooks";
import { useAuthPersistence } from "@/hooks/useAuthPersistence";
import DashboardContent from "./components/DashboardContent";
// import OrdersHistory from './components/orders/OrdersHistory';
import ScanBookingContent from "./components/ScanBookingContent";
import PickupRequestsContent from "./components/pickup/PickupRequestsContent";
import BillingContent from "./components/billing/BillingContent";
import ChatContent from "./components/chat/ChatContent";
import TeamManagementContent from "./components/TeamManagementContent";
import ProfileContent from "./components/profile/ProfileContent";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import PlaceOrder from "./pages/PlaceOrder";
import OrderDetails from "./pages/OrderDetails";
import ResubmitOrder from "./pages/ResubmitOrder";
import NotFound from "./pages/NotFound";
import Login from "./pages/authentication/login";
import { setUser } from "@/store/slices/authSlice";
import { useToast } from "@/components/ui/use-toast";
import Register from "./pages/authentication/register";
import OrderTable from "./components/orders/OrderTable";



const DashboardLayout = () => {
  const [location, setLocation] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthPersistence();
  const { onUnreadCountUpdate, offUnreadCountUpdate, getSocket } = useSocket();

  // Debug Redux state
  const authState = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const { toast } = useToast();

  // Fetch chats for unread count
  const { data: chats = [] } = useQuery({
    queryKey: ['/api/chats', user?.fullName],
    queryFn: async () => {
      const url = user?.fullName
        ? `/api/chats?userId=${encodeURIComponent(user.fullName)}`
        : '/api/chats';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch chats');
      return response.json();
    },
    enabled: !!user?.fullName
  });

  // Calculate unread group count (filtered for user permissions)
  const userFullName = user?.fullName || '';
  let permissionFilteredChats = chats;

  // Check if user has chat permission
  const hasChatPermission = hasPermission(user, 'chat');
  const userRole = user?.roleName || '';

  // Apply participant-based filtering for all users
  if (!hasChatPermission) {
    permissionFilteredChats = chats.filter((chat: any) => {
      const isParticipant = chat.participants.some((participant: string) => {
        return participant.trim().toLowerCase() === userFullName.trim().toLowerCase();
      });
      return isParticipant;
    });
  } else {
    // For users with chat permission, apply role-based filtering similar to ChatContent
    if (userRole === 'admin_doctor' || userRole === 'assistant_doctor' || userRole === 'receptionist') {
      permissionFilteredChats = chats.filter((chat: any) => {
        const isParticipant = chat.participants.some((participant: string) => {
          return participant.trim().toLowerCase() === userFullName.trim().toLowerCase();
        });
        return isParticipant;
      });
    } else {
      // For main_doctor and other roles with chat permission, show all chats
      permissionFilteredChats = chats;
    }
  }

  const unreadMessagesCount = permissionFilteredChats.filter((chat: any) => chat.unreadCount && chat.unreadCount > 0).length;

  const prevPermissionsRef = useRef<string[]>(user?.permissions || []);

  useEffect(() => {
  }, [authState, user, isAuthenticated]);

  useEffect(() => {
    const handleUnreadCountUpdate = () => {
      if (user?.fullName) {
        queryClient.invalidateQueries({ queryKey: ["/api/chats", user.fullName] });
      }
    };
    onUnreadCountUpdate(handleUnreadCountUpdate);
    return () => {
      offUnreadCountUpdate(handleUnreadCountUpdate);
    };
  }, [onUnreadCountUpdate, offUnreadCountUpdate, queryClient, user?.fullName]);

  const handlePermissionsUpdated = useCallback(async () => {
    try {
      const headers = user?.contactNumber ? { 'x-mobile-number': user.contactNumber } : undefined;
      const response = await fetch('/api/me', headers ? { headers } : undefined);
      if (response && response.ok) {
        const updatedUser = await response.json();
        dispatch(setUser(updatedUser));
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast({ title: "Your permissions have been updated. Please check your access." });
      }
    } catch (err) {
    }
  }, [dispatch, user?.contactNumber, toast]);

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
  }, [user?.fullName, isAuthenticated, getSocket]);

  // Map sections to required permissions
  const sectionPermissionMap: Record<string, string> = {
    billing: 'billing',
    appointments: 'scan_booking',
    pickup: 'pickup_requests',
    messages: 'chat',
    orders: 'tracking',
    // Add more if needed
  };

  useEffect(() => {
    // If the current section requires a permission the user no longer has, redirect to dashboard
    const requiredPermission = sectionPermissionMap[activeSection];
    if (requiredPermission && user && !user.permissions.includes(requiredPermission)) {
      setActiveSection('dashboard');
      toast({
        title: 'Access Revoked',
        description: 'Your access to this section was revoked by the admin.',
        variant: 'destructive',
      });
    }
  }, [user?.permissions, activeSection, toast]);

  useEffect(() => {
    const prevPermissions = prevPermissionsRef.current;
    const currentPermissions = user?.permissions || [];

    // Only show toasts if this is not the first mount (i.e., prevPermissions is not empty)
    if (prevPermissions.length > 0) {
      // Find revoked permissions
      const revoked = prevPermissions.filter(p => !currentPermissions.includes(p));
      // Find granted permissions
      const granted = currentPermissions.filter(p => !prevPermissions.includes(p));

      if (revoked.length > 0) {
        revoked.forEach(permission => {
          toast({
            title: 'Access Revoked',
            description: `Your access to "${permission}" was revoked by the admin.`,
            variant: 'destructive',
          });
        });
      }
      if (granted.length > 0) {
        granted.forEach(permission => {
          toast({
            title: 'Access Granted',
            description: `You have been granted access to "${permission}" by the admin.`,
            variant: 'default',
          });
        });
      }
    }

    prevPermissionsRef.current = currentPermissions;
  }, [user?.permissions, toast]);

  const handleNewCase = () => {
    setLocation('/place-order');
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

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);

  useEffect(() => {
    // Scroll the main content area to top when section changes
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
          permissions={user?.permissions || []}
          onToggleCollapse={handleToggleSidebar}
        />
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-w-0 ${isCollapsed ? 'lg:ml-16' : 'lg:ml-64'} transition-all duration-300`}>
        <Header
          onMobileMenuToggle={handleMobileMenuToggle}
          doctorName="Dr. Sarah Mitchell"
          clinicName="Smile Dental Clinic"
          onSectionChange={handleSectionChange}
          title={sectionTitleMap[activeSection] || 'Dashboard'}
        />
        <main className="flex-1 p-6 bg-white">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SocketProvider>
          <Router>
            <Route path="/" component={DashboardLayout} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/place-order" component={PlaceOrder} />
            <Route path="/order/:orderId" component={OrderDetails} />
            <Route path="/resubmit-order/:orderId" component={ResubmitOrder} />
            <Route component={NotFound} />
          </Router>
        </SocketProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;