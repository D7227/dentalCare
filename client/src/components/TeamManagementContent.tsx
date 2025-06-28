import React, { useState, useEffect, useRef, useContext } from 'react';
import { Plus, User, Mail, Phone, Edit, Trash2, Camera, ArrowLeft, UserX, Key, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAppSelector } from '@/store/hooks';
import { useSocket } from '@/contexts/SocketContext';

interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  contactNumber?: string;
  profilePicture?: string;
  roleId: string;
  roleName?: string;
  permissions: string[];
  status: string;
  joinDate: string;
  lastLogin?: string;
  clinicName?: string;
}

interface TeamManagementContentProps {
  onSectionChange?: (section: string) => void;
}

const TeamManagementContent = ({ onSectionChange }: TeamManagementContentProps) => {
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit'>('list');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    profilePicture: '',
    roleName: '',
    permissions: [] as string[],
    password: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'delete' | 'disable' | 'enable';
    member: TeamMember | null;
    title: string;
    description: string;
  }>({
    isOpen: false,
    type: 'delete',
    member: null,
    title: '',
    description: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user data from Redux to access clinic name
  const { user } = useAppSelector((state) => state.auth);

  const { socket } = useSocket();

  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ['/api/team-members', user?.clinicName],
    queryFn: async () => {
      // Use backend API with clinic name filter
      const url = user?.clinicName 
        ? `/api/team-members?clinicName=${encodeURIComponent(user.clinicName)}`
        : '/api/team-members';
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch team members');
      const teamMembers = await response.json();
      return teamMembers;
    },
    enabled: !!user?.clinicName // Only run query if user has clinic name
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/team-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create team member');
      return response.json();
    },
    onSuccess: (data: any) => {
      userCreate.mutate({
        mobileNumber: data.contactNumber,
        password: data.password,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/team-members'] });
      if (user?.clinicName) {
        queryClient.invalidateQueries({ queryKey: ['/api/team-members?clinicName=', user.clinicName] });
      }
      setCurrentView('list');
      resetForm();
      toast({ title: "Team member added successfully" });
    },
    onError: () => {
      toast({ title: "Failed to add team member", variant: "destructive" });
    }
  });

  const userCreate = useMutation({
    mutationFn: async (formData: any) => {
      const response = await fetch(`/api/create-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Login failed');
      return response.json();
    },
    onSuccess: () => {
    },
    onError: (error) => {
      console.error('Login error:', error);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/team-members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update team member');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team-members'] });
      if (user?.clinicName) {
        queryClient.invalidateQueries({ queryKey: ['/api/team-members?clinicName=', user.clinicName] });
      }
      setCurrentView('list');
      resetForm();
      toast({ title: "Team member updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update team member", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/team-members/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete team member');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team-members'] });
      if (user?.clinicName) {
        queryClient.invalidateQueries({ queryKey: ['/api/team-members?clinicName=', user.clinicName] });
      }
      toast({ title: "Team member removed successfully" });
    },
    onError: () => {
      toast({ title: "Failed to remove team member", variant: "destructive" });
    }
  });

  const availablePermissions = [
    { id: 'billing', label: 'Billing Management' },
    { id: 'tracking', label: 'Order Tracking' },
    { id: 'all_patients', label: 'All Patients Access' },
    { id: 'chat', label: 'Chat Access' },
    { id: 'pickup_requests', label: 'Pickup Requests' },
    { id: 'scan_booking', label: 'Scan Booking' }
  ];

  const roleOptions = [
    { value: 'admin_doctor', label: 'Admin Doctor', desc: 'Full access to all features' },
    { value: 'assistant_doctor', label: 'Assistant Doctor', desc: 'Limited patient access' },
    { value: 'receptionist', label: 'Receptionist', desc: 'Basic operational access' }
  ];

  const [contactNumberError, setContactNumberError] = useState('');

  const validateMobileNumber = (number: string) => {
    return /^\d{10}$/.test(number);
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      contactNumber: '',
      profilePicture: '',
      roleName: '',
      permissions: [],
      password: ''
    });
    setSelectedMember(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ title: "File too large", description: "Please select an image under 5MB", variant: "destructive" });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, profilePicture: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const showConfirmDialog = (type: 'delete' | 'disable' | 'enable', member: TeamMember) => {
    let title, description;
    
    switch (type) {
      case 'delete':
        title = 'Delete Team Member';
        description = `Are you sure you want to permanently delete ${member.fullName}? This action cannot be undone.`;
        break;
      case 'disable':
        title = 'Disable Team Member';
        description = `Are you sure you want to disable ${member.fullName}? They will not be able to access the system until re-enabled.`;
        break;
      case 'enable':
        title = 'Enable Team Member';
        description = `Are you sure you want to enable ${member.fullName}? They will regain access to the system.`;
        break;
    }

    setConfirmDialog({
      isOpen: true,
      type,
      member,
      title,
      description
    });
  };

  const handleConfirmAction = () => {
    if (!confirmDialog.member) return;

    switch (confirmDialog.type) {
      case 'delete':
        deleteMutation.mutate(confirmDialog.member.id);
        break;
      case 'disable':
        updateMutation.mutate({ 
          id: confirmDialog.member.id, 
          data: { status: 'inactive' } 
        });
        break;
      case 'enable':
        updateMutation.mutate({ 
          id: confirmDialog.member.id, 
          data: { status: 'active' } 
        });
        break;
    }

    setConfirmDialog({ ...confirmDialog, isOpen: false });
  };

  const handleEdit = (member: TeamMember) => {
    
    setSelectedMember(member);
    setFormData({
      fullName: member.fullName,
      email: member.email,
      contactNumber: member.contactNumber || '',
      profilePicture: member.profilePicture || '',
      roleName: member.roleName || '',
      permissions: member.permissions,
      password: '', // Don't populate existing password for security
    });
    
    setCurrentView('edit');
  };

  const handleSubmit = () => {
    // Validate mobile number on submit
    if (!validateMobileNumber(formData.contactNumber)) {
      setContactNumberError('Please enter a valid 10-digit mobile number');
      return;
    }
    const submitData: any = { ...formData };
    console.log(submitData, "hello all team");
    // Get clinic name from Redux with better fallback handling
    let clinicName = user?.clinicName;
    if (!clinicName || clinicName.trim() === '') {
      // If clinic name is missing, use the user's full name as clinic name
      clinicName = user?.fullName || 'Unknown Clinic';
    }
    
    if (currentView === 'edit' && !submitData.password) {
      const { password, ...dataWithoutPassword } = submitData;
      if (selectedMember) {
        updateMutation.mutate({ 
          id: selectedMember.id, 
          data: { ...dataWithoutPassword, clinicName }
        });
      }
    } else {
      if (currentView === 'edit' && selectedMember) {
        updateMutation.mutate({ 
          id: selectedMember.id, 
          data: { ...submitData, clinicName }
        });
      } else {
        createMutation.mutate({
          ...submitData,
          clinicName
        });
        
      }
    }
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(p => p !== permissionId)
    }));
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin_doctor':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'assistant_doctor':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'receptionist':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin_doctor':
        return 'Admin Doctor';
      case 'assistant_doctor':
        return 'Assistant Doctor';
      case 'receptionist':
        return 'Receptionist';
      default:
        return role;
    }
  };

  useEffect(() => {
    if (!socket) return;
    const handlePermissionsUpdated = () => {
      // Invalidate both query patterns to update sidebar and team management
      queryClient.invalidateQueries({ queryKey: ['/api/team-members'] });
      if (user?.clinicName) {
        queryClient.invalidateQueries({ queryKey: ['/api/team-members?clinicName=', user.clinicName] });
      }
    };
    socket.on('permissions-updated', handlePermissionsUpdated);
    return () => {
      socket.off('permissions-updated', handlePermissionsUpdated);
    };
  }, [socket, queryClient, user?.clinicName]);

  if (currentView === 'add' || currentView === 'edit') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCurrentView('list');
              resetForm();
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Team
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {currentView === 'edit' ? 'Edit Team Member' : 'Add Team Member'}
            </h1>
            <p className="text-muted-foreground">
              {currentView === 'edit' ? 'Update team member information' : 'Add a new team member to your clinic'}
            </p>
            {user?.clinicName && (
              <p className="text-sm text-blue-600 mt-1">
                Clinic: {user.clinicName}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Member Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="space-y-3">
                  <Label>Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={formData.profilePicture} />
                      <AvatarFallback className="text-lg">
                        {formData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() || <User className="h-8 w-8" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Input
                        placeholder="Profile picture URL"
                        value={formData.profilePicture}
                        onChange={(e) => setFormData(prev => ({ ...prev, profilePicture: e.target.value }))}
                      />
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Picture
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address (optional)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number *</Label>
                    <Input
                      id="contactNumber"
                      value={formData.contactNumber}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData(prev => ({ ...prev, contactNumber: value }));
                        if (contactNumberError && /^\d{10}$/.test(value)) {
                          setContactNumberError("");
                        }
                      }}
                      placeholder="Enter contact number"
                      required
                    />
                    {contactNumberError && (
                      <div className="text-red-600 text-xs">{contactNumberError}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">
                      {currentView === 'edit' ? 'New Password (leave blank to keep current)' : 'Password *'}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder={currentView === 'edit' ? 'Enter new password' : 'Enter password'}
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-3">
                  <Label>Role *</Label>
                  <Select value={formData.roleName} onValueChange={(value) => setFormData(prev => ({ ...prev, roleName: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((roleOption) => (
                        <SelectItem key={roleOption.value} value={roleOption.value}>
                          <div>
                            <div className="font-medium">{roleOption.label}</div>
                            <div className="text-sm text-muted-foreground">{roleOption.desc}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Permissions */}
                <div className="space-y-3">
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availablePermissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission.id}
                          checked={formData.permissions.includes(permission.id)}
                          onCheckedChange={(checked) => handlePermissionChange(permission.id, !!checked)}
                        />
                        <Label htmlFor={permission.id} className="text-sm font-normal">
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setCurrentView('list');
                      resetForm();
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    className="flex-1 bg-[#11AB93] hover:bg-[#11AB93]/90"
                    disabled={
                      !formData.fullName || 
                      !formData.roleName || 
                      !formData.contactNumber ||
                      (currentView === 'add' && !formData.password) ||
                      createMutation.isPending || 
                      updateMutation.isPending
                    }
                  >
                    {currentView === 'edit' ? 'Update Member' : 'Add Member'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={formData.profilePicture} />
                      <AvatarFallback>
                        {formData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{formData.fullName || 'Full Name'}</p>
                      <p className="text-sm text-muted-foreground">{formData.email || 'No email provided'}</p>
                    </div>
                  </div>

                  {formData.contactNumber && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4" />
                      <span>{formData.contactNumber}</span>
                    </div>
                  )}

                  {formData.roleName && (
                    <Badge className={getRoleBadgeColor(formData.roleName)}>
                      {getRoleDisplayName(formData.roleName)}
                    </Badge>
                  )}

                  {formData.permissions.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Permissions:</p>
                      <div className="flex flex-wrap gap-1">
                        {formData.permissions.map(permission => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {availablePermissions.find(p => p.id === permission)?.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Team Management</h1>
          <p className="text-muted-foreground">Manage your team members and their permissions</p>
        </div>
        {user?.roleName === 'main_doctor' && (
          <Button 
            className="bg-[#11AB93] hover:bg-[#11AB93]/90" 
            onClick={() => setCurrentView('add')}
          >
            <Plus className="mr-2" size={16} />
            Add Team Member
          </Button>
        )}
      </div>

      {/* Team Members List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Team Members ({teamMembers.length})
            {user?.clinicName && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                • {user.clinicName}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading team members...</div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No team members</h3>
              <p className="text-muted-foreground mb-4">
                Add team members to collaborate on cases
              </p>
              {user?.roleName === 'main_doctor' && (
                <Button onClick={() => setCurrentView('add')}>
                  <Plus className="mr-2" size={16} />
                  Add First Member
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {teamMembers.map((member: TeamMember) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={member.profilePicture} />
                      <AvatarFallback>
                        {member.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{member.fullName}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {member.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {member.email}
                          </div>
                        )}
                        {member.contactNumber && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {member.contactNumber}
                          </div>
                        )}
                        {member.clinicName && (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            {member.clinicName}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Badge className={getRoleBadgeColor(member.roleName || '')}>
                        {getRoleDisplayName(member.roleName || '')}
                      </Badge>
                      <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                        {member.status === 'active' ? 'Active' : 'Disabled'}
                      </Badge>
                    </div>
                    {user?.roleName === 'main_doctor' && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(member)}
                          title="Edit member"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => showConfirmDialog(
                            member.status === 'active' ? 'disable' : 'enable', 
                            member
                          )}
                          title={member.status === 'active' ? 'Disable member' : 'Enable member'}
                        >
                          <UserX className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => showConfirmDialog('delete', member)}
                          title="Delete member"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.isOpen} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, isOpen: open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmAction}
              className={confirmDialog.type === 'delete' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {confirmDialog.type === 'delete' ? 'Delete' : 
               confirmDialog.type === 'disable' ? 'Disable' : 'Enable'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeamManagementContent;