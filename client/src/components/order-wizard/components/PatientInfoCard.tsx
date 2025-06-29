
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PatientInfoCardProps {
  formData: any;
  setFormData: (data: any) => void;
}

const PatientInfoCard = ({ formData, setFormData }: PatientInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Patient Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={e => setFormData({
                ...formData,
                firstName: e.target.value
              })}
              className="mt-1"
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 20%, #0B80431A 100%)'
              }}

            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={e => setFormData({
                ...formData,
                lastName: e.target.value
              })}
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 20%, #0B80431A 100%)'
              }}

              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              value={formData.age}
              onChange={e => setFormData({
                ...formData,
                age: e.target.value
              })}
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 20%, #0B80431A 100%)'
              }}

              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="sex">Sex</Label>
            <Select
              value={formData.sex}
              onValueChange={value => setFormData({
                ...formData,
                sex: value
              })}
            >
              <SelectTrigger
                className="mt-1"
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 20%, #0B80431A 100%)',
                  border: '1px solid rgba(11, 128, 67, 0.2)', // 20% opacity
                  borderRadius: '0.5rem' // optional for rounded look
                }}
              >
                <SelectValue placeholder="Select sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientInfoCard;
