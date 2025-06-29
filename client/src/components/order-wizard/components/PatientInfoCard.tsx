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
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Prevent leading zeros (e.g., "00", "01", "02", etc.)
    if (value.length > 1 && value.startsWith('0')) {
      return;
    }
    
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      const numValue = parseInt(value) || 0;
      
      // Limit age between 1 and 150 (minimum age is 1)
      if (numValue >= 1 && numValue <= 99) {
        setFormData({
          ...formData,
          age: value
        });
      }
    }
  };

  return (
    <Card className='bg-mainBrackground'>
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
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={handleAgeChange}
              onKeyDown={(e) => {
                // Prevent non-numeric keys except backspace, delete, arrow keys, etc.
                if (!/[\d\b\Delete\ArrowLeft\ArrowRight\Tab]/.test(e.key) && !e.ctrlKey && !e.metaKey) {
                  e.preventDefault();
                }
              }}
              min="1"
              max="150"
              placeholder="Enter age"
              className="mt-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
