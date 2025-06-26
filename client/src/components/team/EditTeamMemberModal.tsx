import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import BaseModal from '@/components/shared/BaseModal';
import { Card, CardContent } from '@/components/ui/card';

interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  contactNumber?: string;
  profilePicture?: string;
  roleId?: string;
  roleName?: string;
  permissions: string[];
  status: string;
  joinDate: string;
  lastLogin?: string;
  clinicName?: string;
}

interface EditTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, member: Omit<TeamMember, 'id' | 'joinDate' | 'status' | 'lastLogin'> & { roleId?: string }) => void;
  member: TeamMember | null;
}

const EditTeamMemberModal = ({ isOpen, onClose, onUpdate, member }: EditTeamMemberModalProps) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [roleName, setRoleName] = useState<'admin_doctor' | 'assistant_doctor' | 'receptionist'>('receptionist');
  const [permissions, setPermissions] = useState<string[]>([]);

  const availablePermissions = [
    { id: 'billing', label: 'Billing & Payments' },
    { id: 'tracking', label: 'Order Tracking' },
    { id: 'all_patients', label: 'All Patients' },
    { id: 'assigned_patients', label: 'Only Assigned Patients' },
    { id: 'chat', label: 'Team Communication' },
    { id: 'pickup_requests', label: 'Pickup Requests' },
    { id: 'scan_booking', label: 'Scan Appointment Booking' }
  ];

  const rolePermissions = {
    'admin_doctor': ['billing', 'tracking', 'all_patients', 'chat', 'pickup_requests', 'scan_booking'],
    'assistant_doctor': ['tracking', 'assigned_patients', 'chat', 'pickup_requests', 'scan_booking'],
    'receptionist': ['assigned_patients', 'chat', 'pickup_requests', 'scan_booking']
  };

  const roleOptions = [
    { value: 'admin_doctor', label: 'Admin Doctor', desc: 'Full access to all features' },
    { value: 'assistant_doctor', label: 'Assistant Doctor', desc: 'Limited patient access' },
    { value: 'receptionist', label: 'Receptionist', desc: 'Basic operational access' }
  ];

  useEffect(() => {
    if (member) {
      setFullName(member.fullName || '');
      setEmail(member.email || '');
      setContactNumber(member.contactNumber || '');
      // Set the role based on roleName, with fallback to receptionist
      const memberRole = member.roleName as 'admin_doctor' | 'assistant_doctor' | 'receptionist';
      setRoleName(memberRole || 'receptionist');
      setPermissions(member.permissions || []);
      console.log('Setting member data in EditTeamMemberModal:', {
        fullName: member.fullName,
        roleName: member.roleName,
        roleId: member.roleId,
        permissions: member.permissions,
        selectedRole: memberRole || 'receptionist'
      });
    } else {
      console.log('No member data provided to EditTeamMemberModal');
    }
  }, [member]);

  const handleRoleChange = (newRole: 'admin_doctor' | 'assistant_doctor' | 'receptionist') => {
    setRoleName(newRole);
    setPermissions(rolePermissions[newRole]);
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setPermissions(prev => [...prev, permissionId]);
    } else {
      setPermissions(prev => prev.filter(p => p !== permissionId));
    }
  };

  const handleSubmit = () => {
    if (!fullName || !member) return;

    onUpdate(member.id, {
      fullName,
      email,
      contactNumber,
      roleName,
      permissions,
      clinicName: member.clinicName || 'Smile Dental Clinic'
    });

    onClose();
  };

  if (!member) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Team Member"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-member-fullName">Full Name</Label>
            <Input
              id="edit-member-fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-member-email">Email</Label>
            <Input
              id="edit-member-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address (optional)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-member-contactNumber">Contact Number</Label>
            <Input
              id="edit-member-contactNumber"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="Enter contact number"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium">Role</Label>
          <RadioGroup value={roleName} onValueChange={(value) => handleRoleChange(value as 'admin_doctor' | 'assistant_doctor' | 'receptionist')}>
            <div className="space-y-2">
              {roleOptions.map((roleOption) => (
                <Card 
                  key={roleOption.value}
                  className={`cursor-pointer transition-colors ${
                    roleName === roleOption.value 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:border-border/50'
                  }`}
                  onClick={() => handleRoleChange(roleOption.value as 'admin_doctor' | 'assistant_doctor' | 'receptionist')}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={roleOption.value} />
                      <div>
                        <p className="font-medium">{roleOption.label}</p>
                        <p className="text-sm text-muted-foreground">{roleOption.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium">Permissions</Label>
          <div className="grid grid-cols-1 gap-2">
            {availablePermissions.map((permission) => (
              <div key={permission.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`edit-${permission.id}`}
                  checked={permissions.includes(permission.id)}
                  onCheckedChange={(checked) => handlePermissionChange(permission.id, !!checked)}
                />
                <Label htmlFor={`edit-${permission.id}`} className="text-sm">
                  {permission.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="flex-1 bg-primary hover:bg-primary/90"
            disabled={!fullName}
          >
            Update Member
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default EditTeamMemberModal;
