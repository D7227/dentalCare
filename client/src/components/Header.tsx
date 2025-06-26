
import React, { useState } from 'react';
import { Menu, Bell, MessageCircle, Search, RefreshCw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onToggleSidebar: () => void;
  doctorName: string;
  clinicName: string;
  onSectionChange?: (section: string) => void;
  onMobileMenuToggle?: () => void;
}

const Header = ({ onToggleSidebar, doctorName, clinicName, onSectionChange, onMobileMenuToggle }: HeaderProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications] = useState([
    {
      id: 1,
      type: 'rejection',
      orderId: '#DL-2024-006',
      patient: 'Alice Cooper',
      reason: 'Missing bite registration',
      rejectedBy: 'Lab Tech Maria',
      timestamp: '10 minutes ago',
      isRead: false,
    },
    {
      id: 2,
      type: 'rejection',
      orderId: '#DL-2024-007',
      patient: 'Robert Lee',
      reason: 'Incomplete scan upload',
      rejectedBy: 'Lab Tech John',
      timestamp: '2 hours ago',
      isRead: false,
    },
    {
      id: 3,
      type: 'general',
      message: 'Order #DL-2024-005 trial sent',
      timestamp: '1 day ago',
      isRead: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log('Searching for:', searchTerm);
    }
  };

  const handleChatClick = () => {
    if (onSectionChange) {
      onSectionChange('messages');
    }
  };

  return (
    <header className="bg-background border-b border-border px-4 lg:px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Mobile Menu Button - Only visible on mobile */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onMobileMenuToggle}
          className="lg:hidden btn-ghost hover-lift focus-ring"
        >
          <Menu size={20} />
        </Button>

        {/* Desktop Sidebar Toggle - Only visible on desktop */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggleSidebar}
          className="hidden lg:flex btn-ghost hover-lift focus-ring"
        >
          <Menu size={20} />
        </Button>
        
        {/* Search Bar - Responsive */}
        {/* <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input 
            placeholder="Search cases, patients..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-48 sm:w-60 lg:w-80 input-field h-9 rounded-md"
          />
        </form> */}
      </div>
      
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Theme Toggle - Hidden on small screens */}
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>
        
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative btn-ghost hover-lift focus-ring">
              <Bell size={20} />
              {unreadCount > 0 && (
      <Badge className="badge-error absolute -top-1.5 -right-1.5 text-[10px] w-4 h-4 p-0 flex items-center justify-center rounded-full">
        {unreadCount}
      </Badge>

              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
            <div className="px-3 py-2 border-b border-border">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  You have {unreadCount} unread notifications
                </p>
              )}
            </div>
            
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex-col items-start p-4 cursor-pointer hover:bg-accent/50">
                {notification.type === 'rejection' ? (
                  <div className="w-full">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="badge-error text-xs">
                            Rejected
                          </Badge>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-destructive rounded-full"></div>
                          )}
                        </div>
                        <p className="font-medium text-sm text-foreground">
                          Order {notification.orderId} was rejected
                        </p>
                        <p className="text-xs text-muted-foreground mb-1">
                          Patient: {notification.patient}
                        </p>
                        <p className="text-xs text-destructive">
                          Reason: {notification.reason}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Rejected by {notification.rejectedBy} • {notification.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-xs btn-primary">
                        <RefreshCw size={12} className="mr-1" />
                        Resubmit
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-xs btn-outline">
                        <Eye size={12} className="mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-foreground">
                        {notification.message}
                      </p>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.timestamp}
                    </p>
                  </div>
                )}
              </DropdownMenuItem>
            ))}
            
            {notifications.length === 0 && (
              <div className="px-4 py-8 text-center text-muted-foreground">
                <Bell size={24} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications</p>
              </div>
            )}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary hover:text-primary cursor-pointer">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Chat Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="btn-ghost hover:bg-muted hover:text-foreground transition"
          onClick={handleChatClick}
        >
          <MessageCircle size={20} />
        </Button>
        
        {/* User Profile - Responsive */}
        <div className="flex items-center gap-3">
          {/* Larger, well-padded avatar */}
          <Avatar className="w-10 h-10 ring-1 ring-border">
            <AvatarImage
              src="/lovable-uploads/9b05cdc2-aef7-4847-8a52-e496bc12b897.png"
              alt="Dr. Sarah Mitchell"
            />
            <AvatarFallback className="bg-primary text-white text-sm">
              SM
            </AvatarFallback>
          </Avatar>

          {/* Name + Clinic stacked */}
          {/* <div className="flex flex-col justify-center leading-[1.1]">
            <p className="text-base font-semibold text-[#231f20] m-0">
              Dr. Sarah Mitchell
            </p>
            <p className="text-sm text-[#636363] m-0">
              Smile Dental Clinic
            </p>
          </div> */}
        </div>

      </div>
    </header>
  );
};

export default Header;