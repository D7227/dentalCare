import React, { useState } from 'react';
import { User, Mail, Shield } from 'lucide-react';
import BaseModal from '@/components/shared/BaseModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (memberData: any) => void;
}

const AddTeamMemberModal = ({ isOpen, onClose, onAdd }: AddTeamMemberModalProps) => {
  const [memberData, setMemberData] = useState({
    name: '',
    email: '',
    role: '',
    permissions: [] as string[]
  });

  const availablePermissions = [
    { id: 'billing', label: 'Billing Management' },
    { id: 'tracking', label: 'Order Tracking' },
    { id: 'all_patients', label: 'All Patients Access' },
    { id: 'chat', label: 'Chat Access' },
    { id: 'pickup_requests', label: 'Pickup Requests' },
    { id: 'scan_booking', label: 'Scan Booking' }
  ];

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setMemberData(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(p => p !== permissionId)
    }));
  };

  const handleSubmit = () => {
    onAdd({
      ...memberData,
      clinicName: 'Smile Dental Clinic'
    });
    onClose();
    setMemberData({ name: '', email: '', role: '', permissions: [] });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Team Member"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={memberData.name}
            onChange={(e) => setMemberData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={memberData.email}
            onChange={(e) => setMemberData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter email address (optional)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={memberData.role} onValueChange={(value) => setMemberData(prev => ({ ...prev, role: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin_doctor">Admin Doctor</SelectItem>
              <SelectItem value="assistant_doctor">Assistant Doctor</SelectItem>
              <SelectItem value="receptionist">Receptionist</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Permissions</Label>
          <div className="space-y-2">
            {availablePermissions.map((permission) => (
              <div key={permission.id} className="flex items-center space-x-2">
                <Checkbox
                  id={permission.id}
                  checked={memberData.permissions.includes(permission.id)}
                  onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                />
                <Label htmlFor={permission.id} className="text-sm font-normal">
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
            className="flex-1 bg-[#11AB93] hover:bg-[#11AB93]/90"
            disabled={!memberData.name || !memberData.role}
          >
            Add Member
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default AddTeamMemberModal;
