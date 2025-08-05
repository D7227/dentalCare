
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CreditCard, Banknote } from 'lucide-react';

interface CollectionTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CollectionTaskModal = ({ isOpen, onClose }: CollectionTaskModalProps) => {
  const [formData, setFormData] = useState({
    clinic: '',
    doctor: '',
    paymentType: 'cash',
    amount: '',
    invoiceNumber: '',
    fieldAgent: '',
    dueDate: '',
    priority: 'medium',
    notes: ''
  });

  const clinics = [
    { id: '1', name: 'Smile Dental Clinic', doctor: 'Dr. Pooja Verma', pending: 15000 },
    { id: '2', name: 'Perfect Smile', doctor: 'Dr. Rajesh Patel', pending: 8500 },
    { id: '3', name: 'Care Dental', doctor: 'Dr. Sneha Kumar', pending: 12300 }
  ];

  const fieldAgents = [
    { id: '1', name: 'Rajesh Kumar', area: 'Central Bangalore' },
    { id: '2', name: 'Priya Sharma', area: 'South Bangalore' },
    { id: '3', name: 'Amit Singh', area: 'North Bangalore' }
  ];

  const handleSubmit = () => {
    console.log('Creating collection task:', formData);
    // Here you would typically send the data to your backend
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Create Collection Task
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Clinic *</Label>
            <Select value={formData.clinic} onValueChange={(value) => {
              const clinic = clinics.find(c => c.id === value);
              setFormData({
                ...formData,
                clinic: value,
                doctor: clinic?.doctor || '',
                amount: clinic?.pending?.toString() || ''
              });
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select clinic" />
              </SelectTrigger>
              <SelectContent>
                {clinics.map(clinic => (
                  <SelectItem key={clinic.id} value={clinic.id}>
                    {clinic.name} - ₹{clinic.pending.toLocaleString()} pending
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Doctor</Label>
            <Input value={formData.doctor} readOnly className="bg-gray-50" />
          </div>

          <div>
            <Label>Payment Type *</Label>
            <Select value={formData.paymentType} onValueChange={(value) => setFormData({ ...formData, paymentType: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">
                  <div className="flex items-center gap-2">
                    <Banknote className="h-4 w-4" />
                    Cash
                  </div>
                </SelectItem>
                <SelectItem value="cheque">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Cheque
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Amount *</Label>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="₹ Amount to collect"
            />
          </div>

          <div>
            <Label>Invoice Number</Label>
            <Input
              value={formData.invoiceNumber}
              onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
              placeholder="INV-XXXX"
            />
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
            <Label>Due Date *</Label>
            <Input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
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
          <Label>Notes</Label>
          <Textarea
            placeholder="Any special instructions for collection..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={2}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Collection Task</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionTaskModal;
