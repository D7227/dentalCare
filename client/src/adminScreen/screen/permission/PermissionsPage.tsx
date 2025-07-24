
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Users,
  Key,
  UserCheck,
  Settings,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

const PermissionsPage = () => {
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);

  // Mock data for roles and permissions
  const roles = [
    {
      id: 1,
      name: 'Super Administrator',
      description: 'Complete system access with all permissions',
      userCount: 2,
      permissions: ['full_access'],
      isSystem: true,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01'
    },
    {
      id: 2,
      name: 'Lab Administrator',
      description: 'Lab operations and user management',
      userCount: 5,
      permissions: [
        'manage_users', 'manage_cases', 'manage_orders', 'view_reports',
        'manage_inventory', 'manage_clinics', 'manage_doctors'
      ],
      isSystem: false,
      createdAt: '2023-02-15',
      updatedAt: '2024-01-10'
    },
    {
      id: 3,
      name: 'Senior Technician',
      description: 'Advanced technician with team lead capabilities',
      userCount: 8,
      permissions: [
        'view_cases', 'update_cases', 'assign_tasks', 'view_materials',
        'request_materials', 'view_team_performance'
      ],
      isSystem: false,
      createdAt: '2023-03-20',
      updatedAt: '2023-12-05'
    },
    {
      id: 4,
      name: 'Technician',
      description: 'Standard technician with case management access',
      userCount: 25,
      permissions: [
        'view_cases', 'update_cases', 'view_materials', 'request_materials'
      ],
      isSystem: false,
      createdAt: '2023-01-15',
      updatedAt: '2023-11-20'
    },
    {
      id: 5,
      name: 'Doctor/Client',
      description: 'External doctors and clinic staff',
      userCount: 156,
      permissions: [
        'submit_cases', 'view_own_cases', 'update_profile', 'view_invoices'
      ],
      isSystem: false,
      createdAt: '2023-01-01',
      updatedAt: '2023-10-15'
    },
    {
      id: 6,
      name: 'Field Agent',
      description: 'Delivery and collection agent',
      userCount: 12,
      permissions: [
        'view_deliveries', 'update_delivery_status', 'collect_payments',
        'upload_delivery_proof', 'view_collection_reports'
      ],
      isSystem: false,
      createdAt: '2023-04-10',
      updatedAt: '2023-12-01'
    }
  ];

  const permissionCategories = [
    {
      name: 'User Management',
      permissions: [
        { key: 'manage_users', label: 'Manage Users', description: 'Create, edit, delete users' },
        { key: 'view_users', label: 'View Users', description: 'View user profiles and information' },
        { key: 'assign_roles', label: 'Assign Roles', description: 'Assign roles to users' },
        { key: 'manage_permissions', label: 'Manage Permissions', description: 'Create and modify role permissions' }
      ]
    },
    {
      name: 'Case Management',
      permissions: [
        { key: 'submit_cases', label: 'Submit Cases', description: 'Submit new cases' },
        { key: 'view_cases', label: 'View Cases', description: 'View case details' },
        { key: 'update_cases', label: 'Update Cases', description: 'Modify case information' },
        { key: 'delete_cases', label: 'Delete Cases', description: 'Remove cases from system' },
        { key: 'assign_cases', label: 'Assign Cases', description: 'Assign cases to technicians' },
        { key: 'approve_cases', label: 'Approve Cases', description: 'Approve completed cases' }
      ]
    },
    {
      name: 'Order & Billing',
      permissions: [
        { key: 'manage_orders', label: 'Manage Orders', description: 'Create and manage orders' },
        { key: 'view_invoices', label: 'View Invoices', description: 'Access billing information' },
        { key: 'process_payments', label: 'Process Payments', description: 'Handle payment processing' },
        { key: 'manage_billing', label: 'Manage Billing', description: 'Configure billing settings' }
      ]
    },
    {
      name: 'Inventory & Materials',
      permissions: [
        { key: 'manage_inventory', label: 'Manage Inventory', description: 'Add, update inventory items' },
        { key: 'view_materials', label: 'View Materials', description: 'View available materials' },
        { key: 'request_materials', label: 'Request Materials', description: 'Submit material requests' },
        { key: 'approve_requests', label: 'Approve Requests', description: 'Approve material requests' }
      ]
    },
    {
      name: 'Reports & Analytics',
      permissions: [
        { key: 'view_reports', label: 'View Reports', description: 'Access system reports' },
        { key: 'generate_reports', label: 'Generate Reports', description: 'Create custom reports' },
        { key: 'export_data', label: 'Export Data', description: 'Export system data' },
        { key: 'view_analytics', label: 'View Analytics', description: 'Access analytics dashboard' }
      ]
    },
    {
      name: 'System Configuration',
      permissions: [
        { key: 'manage_settings', label: 'Manage Settings', description: 'Configure system settings' },
        { key: 'manage_clinics', label: 'Manage Clinics', description: 'Add and manage clinic information' },
        { key: 'manage_doctors', label: 'Manage Doctors', description: 'Manage doctor profiles' },
        { key: 'system_maintenance', label: 'System Maintenance', description: 'Perform system maintenance tasks' }
      ]
    }
  ];

  const auditLogs = [
    {
      id: 1,
      action: 'Role Created',
      details: 'New role "QA Specialist" created with quality control permissions',
      user: 'Pooja Sharma',
      timestamp: '2024-01-15 10:30 AM',
      type: 'create'
    },
    {
      id: 2,
      action: 'Permission Modified',
      details: 'Added "export_data" permission to Technician role',
      user: 'Pooja Sharma',
      timestamp: '2024-01-15 09:15 AM',
      type: 'update'
    },
    {
      id: 3,
      action: 'User Role Assigned',
      details: 'Assigned "Senior Technician" role to Riya Patel',
      user: 'Admin System',
      timestamp: '2024-01-14 04:45 PM',
      type: 'assign'
    },
    {
      id: 4,
      action: 'Permission Removed',
      details: 'Removed "delete_cases" permission from Doctor role',
      user: 'Pooja Sharma',
      timestamp: '2024-01-14 02:20 PM',
      type: 'remove'
    }
  ];

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'create': return <Plus className="h-4 w-4 text-green-600" />;
      case 'update': return <Edit className="h-4 w-4 text-blue-600" />;
      case 'assign': return <UserCheck className="h-4 w-4 text-purple-600" />;
      case 'remove': return <Trash2 className="h-4 w-4 text-red-600" />;
      default: return <Settings className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleCreateRole = (roleData: any) => {
    console.log('Creating role:', roleData);
    setIsCreateRoleOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Permissions & Role Management</h2>
        </div>

        <Dialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roleName">Role Name</Label>
                  <Input id="roleName" placeholder="Enter role name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roleDescription">Description</Label>
                  <Input id="roleDescription" placeholder="Role description" />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-semibold">Permissions</Label>
                {permissionCategories.map(category => (
                  <Card key={category.name}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {category.permissions.map(permission => (
                          <div key={permission.key} className="flex items-start space-x-2">
                            <Checkbox id={permission.key} />
                            <div className="space-y-1">
                              <Label htmlFor={permission.key} className="text-sm font-medium">
                                {permission.label}
                              </Label>
                              <p className="text-xs text-gray-600">{permission.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateRoleOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleCreateRole({})}>
                Create Role
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="roles" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions Matrix</TabsTrigger>
          <TabsTrigger value="assignments">User Assignments</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {roles.map(role => (
              <Card key={role.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{role.name}</h3>
                      {role.isSystem && (
                        <Badge variant="secondary" className="text-xs">System Role</Badge>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{role.description}</p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {role.userCount} users
                    </span>
                    <span className="flex items-center">
                      <Key className="h-4 w-4 mr-1" />
                      {role.permissions.length} permissions
                    </span>
                  </div>

                  <div className="text-xs text-gray-500">
                    <p>Created: {role.createdAt}</p>
                    <p>Updated: {role.updatedAt}</p>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    {!role.isSystem && (
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Permissions Matrix Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Permissions Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Permission</th>
                      {roles.slice(1, 5).map(role => (
                        <th key={role.id} className="text-center p-2 font-medium text-xs">
                          {role.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {permissionCategories.map(category => (
                      <React.Fragment key={category.name}>
                        <tr className="bg-gray-50">
                          <td colSpan={6} className="p-2 font-semibold text-sm">
                            {category.name}
                          </td>
                        </tr>
                        {category.permissions.map(permission => (
                          <tr key={permission.key} className="border-b hover:bg-gray-50">
                            <td className="p-2">
                              <div>
                                <div className="font-medium text-sm">{permission.label}</div>
                                <div className="text-xs text-gray-600">{permission.description}</div>
                              </div>
                            </td>
                            {roles.slice(1, 5).map(role => (
                              <td key={`${role.id}-${permission.key}`} className="text-center p-2">
                                {role.permissions.includes(permission.key) ? (
                                  <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Assignments Tab */}
        <TabsContent value="assignments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Assignments Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.map(role => (
                  <div key={role.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{role.name}</h3>
                      <Badge variant="outline">{role.userCount}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      <UserCheck className="h-4 w-4 mr-2" />
                      Manage Assignments
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Permission Changes Audit Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map(log => (
                  <div key={log.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                    {getActionIcon(log.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{log.action}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {log.timestamp}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                      <p className="text-xs text-gray-500 mt-1">By: {log.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PermissionsPage;
