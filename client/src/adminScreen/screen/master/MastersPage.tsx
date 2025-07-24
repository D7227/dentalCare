
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Shield,
  Users,
  Hospital,
  UserCheck,
  Tag,
  Briefcase,
  Package,
  ShoppingCart,
  Wrench,
  CreditCard,
  MapPin,
  Calendar,
  Bell,
  Key,
  Monitor,
  FileText,
  ClipboardList,
  Database
} from 'lucide-react';

const MastersPage = () => {
  const navigate = useNavigate();

  const masterTables = [
    { id: 'departments', name: 'Departments', icon: Building2, description: 'Manage organizational departments' },
    { id: 'roles', name: 'Roles', icon: Shield, description: 'User roles and permissions' },
    { id: 'employees', name: 'Employees/Users', icon: Users, description: 'Employee master data' },
    { id: 'clinics', name: 'Clinics', icon: Hospital, description: 'Clinic information and details' },
    { id: 'doctors', name: 'Doctors', icon: UserCheck, description: 'Doctor profiles and specializations' },
    { id: 'clinic-types', name: 'Clinic Types', icon: Tag, description: 'Types of clinics' },
    { id: 'designations', name: 'Designations', icon: Briefcase, description: 'Job designations and titles' },
    { id: 'case-types', name: 'Case Types', icon: ClipboardList, description: 'Types of dental cases' },
    { id: 'order-statuses', name: 'Order Statuses', icon: Package, description: 'Order workflow statuses' },
    { id: 'accessories', name: 'Accessories', icon: Wrench, description: 'Dental accessories and tools' },
    { id: 'materials', name: 'Materials/Inventory', icon: Database, description: 'Inventory materials management' },
    { id: 'suppliers', name: 'Suppliers/Vendors', icon: ShoppingCart, description: 'Supplier and vendor details' },
    { id: 'payment-terms', name: 'Payment Terms', icon: CreditCard, description: 'Payment methods and terms' },
    { id: 'regions', name: 'Regions/Areas', icon: MapPin, description: 'Geographic regions management' },
    { id: 'holidays', name: 'Holidays/Working Days', icon: Calendar, description: 'Holiday and working day calendar' },
    { id: 'notifications', name: 'Notification Templates', icon: Bell, description: 'Notification templates' },
    { id: 'apis', name: 'APIs/Integration Keys', icon: Key, description: 'API keys and integrations' },
    { id: 'devices', name: 'Device Masters', icon: Monitor, description: 'Device and equipment management' },
    { id: 'documents', name: 'Document Types', icon: FileText, description: 'Document type definitions' }
  ];

  const handleMasterClick = (masterId: string) => {
    navigate(`/admin/masters/${masterId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Masters Management</h1>
          <p className="text-gray-600">Manage all master data tables and configurations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {masterTables.map((master) => (
          <Card key={master.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <master.icon className="h-8 w-8 text-blue-600" />
                <div>
                  <CardTitle className="text-sm font-medium">{master.name}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600 mb-3">{master.description}</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleMasterClick(master.id)}
              >
                Manage
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MastersPage;
