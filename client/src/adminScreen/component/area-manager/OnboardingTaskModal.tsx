
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus, MapPin, Phone, Mail } from 'lucide-react';

interface OnboardingTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingTaskModal = ({ isOpen, onClose }: OnboardingTaskModalProps) => {
  const [formData, setFormData] = useState({
    clinicName: '',
    doctorName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    area: '',
    fieldAgent: '',
    scheduledDate: '',
    priority: 'medium',
    notes: ''
  });

  const fieldAgents = [
    { id: '1', name: 'Rajesh Kumar', area: 'Central Bangalore' },
    { id: '2', name: 'Priya Sharma', area: 'South Bangalore' },
    { id: '3', name: 'Amit Singh', area: 'North Bangalore' }
  ];

  const handleSubmit = () => {
    console.log('Creating onboarding task:', formData);
    // Here you would typically send the data to your backend
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Create Clinic Onboarding Task
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Clinic Name *</Label>
            <Input
              value={formData.clinicName}
              onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
              placeholder="Enter clinic name"
            />
          </div>

          <div>
            <Label>Doctor Name *</Label>
            <Input
              value={formData.doctorName}
              onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
              placeholder="Dr. Name"
            />
          </div>

          <div>
            <Label>Contact Person</Label>
            <Input
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              placeholder="Contact person name"
            />
          </div>

          <div>
            <Label>Phone Number *</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 XXXXX XXXXX"
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="clinic@example.com"
            />
          </div>

          <div>
            <Label>Area</Label>
            <Select value={formData.area} onValueChange={(value) => setFormData({ ...formData, area: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="central">Central Bangalore</SelectItem>
                <SelectItem value="south">South Bangalore</SelectItem>
                <SelectItem value="north">North Bangalore</SelectItem>
                <SelectItem value="east">East Bangalore</SelectItem>
                <SelectItem value="west">West Bangalore</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Assign to Field Agent *</Label>
            <Select value={formData.fieldAgent} onValueChange={(value) => setFormData({ ...formData, fieldAgent: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select field agent" />
              </SelectTrigger>
              <SelectContent>
                {fieldAgents.map(agent => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name} - {agent.area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Scheduled Visit Date</Label>
            <Input
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
            />
          </div>

          <div>
            <Label>Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Address *</Label>
          <Textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Full clinic address"
            rows={2}
          />
        </div>

        <div>
          <Label>Additional Notes</Label>
          <Textarea
            placeholder="Any special instructions or notes about the clinic..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={2}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Onboarding Task</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingTaskModal;
