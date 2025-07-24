import { Input } from '@/components/ui/input';
import LayoutConstants from '@/doctor/utils/staticValue';
import { Bell, Search } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';


interface HeaderProps {
    title?: string;
}

const AdminHeader = ({ title }: HeaderProps) => {

    return (
        <header className="bg-background border-b border-border px-8 lg:px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm "
            style={{
                height: LayoutConstants.NAVBAR_HEIGHT,
                minHeight: LayoutConstants.NAVBAR_HEIGHT,
                maxHeight: LayoutConstants.NAVBAR_HEIGHT,
                padding: 0,
            }}
        >
            <div className="flex items-center gap-2 lg:gap-4 ml-8">
                {/* Mobile Menu Button - Only visible on mobile */}
                {/* Title (if provided) */}
                {title && (
                    <h2 className="text-xl font-semibold ">{title}</h2>
                )}
            </div>
            <div className="flex items-center space-x-4 mr-8">
                {/* Search */}
                <div className="hidden md:flex relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search..."
                        className="pl-10 w-64"
                    />
                </div>

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs flex items-center justify-center"
                    >
                        3
                    </Badge>
                </Button>

                {/* User Info and Logout */}
                {/* {user && (
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <User className="h-4 w-4" />
                            <span className="hidden md:inline">{user.email}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="text-gray-600 hover:text-red-600"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden md:inline ml-1">Logout</span>
                        </Button>
                    </div>
                )} */}
            </div>
        </header>
    );
};

export default AdminHeader;