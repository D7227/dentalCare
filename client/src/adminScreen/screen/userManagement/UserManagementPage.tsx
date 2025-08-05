
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Upload,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  Activity,
  UserCheck,
  UserX,
  Key,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building2
} from 'lucide-react';

const UserManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Mock data for users
  const users = [
    {
      id: 1,
      name: 'Riya Patel',
      email: 'riya.patel@advancedental.com',
      phone: '+91 98765 43210',
      role: 'technician',
      department: 'Crown & Bridge',
      status: 'active',
      lastLogin: '2024-01-15 10:30 AM',
      createdAt: '2023-06-15',
      location: 'Mumbai Lab',
      tasksCompleted: 145,
      permissions: ['view_cases', 'update_cases', 'view_materials']
    },
    {
      id: 2,
      name: 'Dr. Anita Gupta',
      email: 'anita.gupta@smiledental.com',
      phone: '+91 97654 32109',
      role: 'doctor',
      department: 'Orthodontics',
      status: 'active',
      lastLogin: '2024-01-15 09:15 AM',
      createdAt: '2023-03-20',
      location: 'Smile Care Dental',
      casesSubmitted: 89,
      permissions: ['submit_cases', 'view_reports', 'update_profile']
    },
    {
      id: 3,
      name: 'Karan Singh',
      email: 'karan.singh@advancedental.com',
      phone: '+91 96543 21087',
      role: 'field_agent',
      department: 'Logistics',
      status: 'active',
      lastLogin: '2024-01-15 11:45 AM',
      createdAt: '2023-08-10',
      location: 'Delhi Region',
      deliveriesCompleted: 234,
      permissions: ['view_deliveries', 'update_delivery_status', 'collect_payments']
    },
    {
      id: 4,
      name: 'Pooja Sharma',
      email: 'pooja.sharma@advancedental.com',
      phone: '+91 95432 10986',
      role: 'admin',
      department: 'Administration',
      status: 'active',
      lastLogin: '2024-01-15 08:30 AM',
      createdAt: '2022-12-05',
      location: 'Head Office',
      permissions: ['full_access']
    },
    {
      id: 5,
      name: 'Vikram Patel',
      email: 'vikram.patel@advancedental.com',
      phone: '+91 94321 09876',
      role: 'scanning_agent',
      department: 'Scanning',
      status: 'inactive',
      lastLogin: '2024-01-10 04:20 PM',
      createdAt: '2023-09-25',
      location: 'Pune Center',
      scansCompleted: 67,
      permissions: ['view_appointments', 'update_scan_status', 'upload_scans']
    }
  ];

  const roles = [
    { value: 'admin', label: 'Administrator' },
    { value: 'technician', label: 'Technician' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'field_agent', label: 'Field Agent' },
    { value: 'scanning_agent', label: 'Scanning Agent' },
    { value: 'area_manager', label: 'Area Manager' },
    { value: 'store_manager', label: 'Store Manager' }
  ];

  const departments = [
    'Administration', 'Crown & Bridge', 'Orthodontics', 'Implants',
    'Prosthodontics', 'Logistics', 'Scanning', 'Quality Assurance'
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    const matchesDepartment = selectedDepartment === 'all' || user.department === selectedDepartment;

    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      technician: 'bg-blue-100 text-blue-800',
      doctor: 'bg-green-100 text-green-800',
      field_agent: 'bg-orange-100 text-orange-800',
      scanning_agent: 'bg-purple-100 text-purple-800',
      area_manager: 'bg-indigo-100 text-indigo-800',
      store_manager: 'bg-pink-100 text-pink-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const handleBulkImport = () => {
    console.log('Bulk import users...');
  };

  const handleExportUsers = () => {
    console.log('Export users...');
  };

  const handleAddUser = (userData: any) => {
    console.log('Adding user:', userData);
    setIsAddUserOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6" />
          <h2 className="text-2xl font-bold">User Management</h2>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleBulkImport}>
            <Upload className="h-4 w-4 mr-2" />
            Import Users
          </Button>
          <Button variant="outline" onClick={handleExportUsers}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="Enter phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="Enter location" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Additional notes..." />
                </div>
                <div className="col-span-2 flex items-center space-x-2">
                  <Switch id="active" />
                  <Label htmlFor="active">Active User</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleAddUser({})}>
                  Add User
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {roles.map(role => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUsers.map(user => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getRoleColor(user.role)}>
                      {user.role.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                      {user.department}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      {user.location}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      {user.phone}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      Last login: {user.lastLogin}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Shield className="h-4 w-4 mr-1" />
                      Permissions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Roles & Permissions Tab */}
        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roles.map(role => (
                  <div key={role.value} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{role.label}</h3>
                      <p className="text-sm text-gray-600">
                        {role.value === 'admin' && 'Full system access'}
                        {role.value === 'technician' && 'Case management and production'}
                        {role.value === 'doctor' && 'Case submission and tracking'}
                        {role.value === 'field_agent' && 'Delivery and collection'}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 border-l-4 border-green-500 bg-green-50">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">User Login</p>
                    <p className="text-sm text-gray-600">Riya Patel logged in from Mumbai Lab</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border-l-4 border-blue-500 bg-blue-50">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">New User Added</p>
                    <p className="text-sm text-gray-600">Amit Kumar added as Technician</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border-l-4 border-yellow-500 bg-yellow-50">
                  <Key className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium">Permission Changed</p>
                    <p className="text-sm text-gray-600">Role permissions updated for Field Agent</p>
                    <p className="text-xs text-gray-500">3 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border-l-4 border-red-500 bg-red-50">
                  <UserX className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium">User Deactivated</p>
                    <p className="text-sm text-gray-600">Inactive user account suspended</p>
                    <p className="text-xs text-gray-500">5 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Password Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Minimum Length (8 characters)</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Require Uppercase</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Require Numbers</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Require Special Characters</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Password Expiry (90 days)</Label>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Auto Logout (30 min)</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Single Session Only</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Two Factor Authentication</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <Label>IP Restriction</Label>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagementPage;
