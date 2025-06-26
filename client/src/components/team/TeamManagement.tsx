import React, { useState } from 'react';
import { Plus, User, Mail, Shield, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EditTeamMemberModal from './EditTeamMemberModal';
import AddTeamMemberModal from './AddTeamMemberModal';
import { useAppSelector } from '@/store/hooks';

interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  contactNumber?: string;
  profilePicture?: string;
  roleId?: string;
  roleName?: string;
  permissions: string[];
  status: 'active' | 'inactive';
  joinDate: string;
  lastLogin?: string;
  clinicName?: string;
}

const TeamManagement = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      fullName: 'Dr. Sarah Mitchell',
      email: 'sarah@clinic.com',
      roleName: 'admin_doctor',
      permissions: ['billing', 'tracking', 'all_patients', 'chat', 'pickup_requests', 'scan_booking'],
      status: 'active',
      joinDate: '2024-01-15',
      lastLogin: '2 hours ago',
      contactNumber: '',
      profilePicture: '',
      clinicName: 'Smile Dental Clinic',
      roleId: 'admin-role-id',
    }
  ]);

  const { user } = useAppSelector((state) => state.auth);

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

  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setIsEditModalOpen(true);
  };

  const handleUpdateMember = (id: string, memberData: Omit<TeamMember, 'id' | 'joinDate' | 'status' | 'lastLogin'> & { roleId?: string }) => {
    setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, ...memberData } : m));
    setIsEditModalOpen(false);
    setSelectedMember(null);
  };

  const handleAddMember = (memberData: any) => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      ...memberData,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: '',
      contactNumber: memberData.contactNumber || '',
      profilePicture: memberData.profilePicture || '',
      clinicName: memberData.clinicName || '',
      roleId: memberData.roleId || '',
      roleName: memberData.roleName || memberData.role || '',
      fullName: memberData.fullName || memberData.name || '',
      permissions: memberData.permissions || [],
    };
    setTeamMembers(prev => [...prev, newMember]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Team Management</h1>
          <p className="text-muted-foreground">Manage your team members and their permissions</p>
        </div>
        {user?.roleName === 'main_doctor' && (
          <Button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2" size={16} />
            Add Team Member
          </Button>
        )}
      </div>

      {/* Content */}
      <Card className="card clinical-shadow">
        <CardHeader className="card-header">
          <CardTitle className="card-title flex items-center gap-2">
            <User className="h-5 w-5" />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent className="card-content">
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-medium text-sm">
                      {member.fullName?.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{member.fullName}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {member.email}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`border text-xs ${getRoleBadgeColor(member.roleName || '')}`}>
                        {getRoleDisplayName(member.roleName || '')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {member.permissions.length} permissions
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {user?.roleName === 'main_doctor' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="btn-ghost"
                      onClick={() => handleEditMember(member)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {teamMembers.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="empty-state-title">No team members</h3>
                <p className="empty-state-description">
                  Add team members to collaborate on cases
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <EditTeamMemberModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        onUpdate={handleUpdateMember}
      />

      <AddTeamMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMember}
      />
    </div>
  );
};

export default TeamManagement;
