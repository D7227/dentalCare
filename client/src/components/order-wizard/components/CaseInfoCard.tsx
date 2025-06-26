
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CaseInfoCardProps {
  formData: any;
  setFormData: (data: any) => void;
}

const CaseInfoCard = ({ formData, setFormData }: CaseInfoCardProps) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Case Information</CardTitle>
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
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select doctor" />
            </SelectTrigger>
            <SelectContent>
              {clinicDoctors.map(doctor => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  {doctor.name} ({doctor.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="consultingDoctor">Consulting Doctor</Label>
          <Input 
            id="consultingDoctor" 
            value={formData.consultingDoctor} 
            onChange={e => setFormData({
              ...formData,
              consultingDoctor: e.target.value
            })} 
            className="mt-1" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseInfoCard;
