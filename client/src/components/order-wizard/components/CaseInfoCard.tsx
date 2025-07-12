import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '@/store/hooks';

interface CaseInfoCardProps {
  formData: any;
  setFormData: (data: any) => void;
}

const CaseInfoCard = ({ formData, setFormData }: CaseInfoCardProps) => {
  const [errors, setErrors] = useState<{
    doctorMobile?: string;
    consultingDoctorMobile?: string;
  }>({});

  const { user } = useAppSelector((state) => state.auth);

  const clinicDoctors = [{
    id: 'dr1',
    name: 'Dr. James Wilson',
    role: 'Consulting Dr.'
  }, {
    id: 'dr2',
    name: 'Dr. Sarah Chen',
    role: 'Senior Dentist'
  }, {
    id: 'dr3',
    name: 'Dr. Michael Brown',
    role: 'Orthodontist'
  }, {
    id: 'dr4',
    name: 'Dr. Emily Davis',
    role: 'Prosthodontist'
  }, {
    id: 'dr5',
    name: 'Dr. Robert Taylor',
    role: 'Oral Surgeon'
  }];

  // Function to validate mobile number input
  const validateMobileNumber = (value: string): boolean => {
    // Only allow digits
    const numberOnly = /^\d*$/.test(value);
    return numberOnly;
  };

  // Function to handle mobile number changes with validation
  const handleMobileNumberChange = (field: string, value: string) => {
    if (value === '' || validateMobileNumber(value)) {
      setFormData({
        ...formData,
        [field]: value
      });

      // Clear error for this field
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    } else {
      // Set error message
      setErrors(prev => ({
        ...prev,
        [field]: 'Please enter only numbers'
      }));
    }
  };

  const clinicName = user?.clinicName;
  console.log(clinicName)
  const { data: teamMembers = [] } = useQuery({
    queryKey: ['/api/team-members?clinicName=', clinicName],
    queryFn: async () => {
      const response = await fetch(`/api/team-members?clinicName=${clinicName}`);
      if (!response.ok) throw new Error('Failed to fetch team members');
      return response.json();
    }
  });

  const availableTeamMembers = teamMembers.filter((member: any) => {
    const isCurrentUser = member.fullName === user?.fullName;
    const isReceptionist = member.roleName?.toLowerCase() === "receptionist";
    return !isCurrentUser && !isReceptionist;
  });

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-xl font-semibold">Clinic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="caseHandledBy">Case Handled By *</Label>
          <Select
            value={formData.caseHandledBy}
            onValueChange={value => setFormData({
              ...formData,
              caseHandledBy: value
            })}
          >
            <SelectTrigger className="mt-1"
              style={{
                borderRadius: '0.5rem'
              }}
            >
              <SelectValue placeholder="Select doctor" />
            </SelectTrigger>
            <SelectContent>
              {availableTeamMembers.map((member: { id: string; fullName: string; roleName: string }) => (
                <SelectItem key={member.id} value={member.fullName}>
                  {member.fullName} ({member.roleName})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="doctorMobile">Doctor Mobile Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <Input
              id="doctorMobile"
              style={{
                borderRadius: '0.5rem'
              }}
              value={formData.doctorMobile}
              onChange={e => handleMobileNumberChange('doctorMobile', e.target.value)}
              className="mt-1 pl-10"
              placeholder="Enter mobile number (numbers only)"
              error={!!errors.doctorMobile}
              errorMessage={errors.doctorMobile}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="consultingDoctor">Consulting Doctor</Label>
          <Input
            id="consultingDoctor"
            style={{
              borderRadius: '0.5rem'
            }}

            value={formData.consultingDoctor}
            onChange={e => setFormData({
              ...formData,
              consultingDoctor: e.target.value
            })}
            className="mt-1"
            placeholder="Enter Consulting Doctor Name"
          />
        </div>
        <div>
          <Label htmlFor="consultingDoctorMobile">Consulting Doctor Mobile Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <Input
              id="consultingDoctorMobile"
              style={{
                borderRadius: '0.5rem'
              }}
              value={formData.consultingDoctorMobile}
              onChange={e => handleMobileNumberChange('consultingDoctorMobile', e.target.value)}
              className="mt-1 pl-10"
              placeholder="Enter mobile number (numbers only)"
              error={!!errors.consultingDoctorMobile}
              errorMessage={errors.consultingDoctorMobile}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseInfoCard;