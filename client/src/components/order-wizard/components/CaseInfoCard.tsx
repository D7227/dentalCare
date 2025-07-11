import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone } from 'lucide-react';

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
              // background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 20%, #0B80431A 100%)',
              // border: '1px solid #CCDAD8',
              borderRadius: '0.5rem'
            }}
            >
              <SelectValue placeholder="Select doctor" />
            </SelectTrigger>
            <SelectContent>
              {clinicDoctors.map(doctor => (
                <SelectItem key={doctor.id} value={doctor.name}>
                  {doctor.name} ({doctor.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="doctorMobile">Doctor Mobile Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              id="doctorMobile" 
              style={{
                // background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 20%, #0B80431A 100%)',
                // border: '1px solid #CCDAD8',
                borderRadius: '0.5rem'
              }}
              value={formData.doctorMobile} 
              onChange={e => setFormData({
                ...formData,
                doctorMobile: e.target.value
              })} 
              className="mt-1 pl-10" 
              placeholder="Enter mobile number"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="consultingDoctor">Consulting Doctor</Label>
          <Input 
            id="consultingDoctor" 
            style={{
              // background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 20%, #0B80431A 100%)',
              // border: '1px solid #CCDAD8',
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
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              id="consultingDoctorMobile" 
              style={{
                // background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 20%, #0B80431A 100%)',
                // border: '1px solid #CCDAD8',
                borderRadius: '0.5rem'
              }}
              value={formData.consultingDoctorMobile} 
              onChange={e => setFormData({
                ...formData,
                consultingDoctorMobile: e.target.value
              })} 
              className="mt-1 pl-10" 
              placeholder="Enter mobile number"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseInfoCard;