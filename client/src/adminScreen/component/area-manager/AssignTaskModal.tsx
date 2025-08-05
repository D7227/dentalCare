
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Truck, Package } from 'lucide-react';

interface AssignTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskType: 'pickup' | 'delivery';
}

const AssignTaskModal = ({ isOpen, onClose, taskType }: AssignTaskModalProps) => {
  const [formData, setFormData] = useState({
    orderId: '',
    clinic: '',
    doctor: '',
    address: '',
    fieldAgent: '',
    priority: 'medium',
    scheduledDate: '',
    scheduledTime: '',
    specialInstructions: '',
    paymentAmount: ''
  });

  const fieldAgents = [
    { id: '1', name: 'Rajesh Kumar', area: 'Central Bangalore' },
    { id: '2', name: 'Priya Sharma', area: 'South Bangalore' },
    { id: '3', name: 'Amit Singh', area: 'North Bangalore' }
  ];

  const clinics = [
    { id: '1', name: 'Smile Dental Clinic', doctor: 'Dr. Pooja Verma', address: 'MG Road, Bangalore' },
    { id: '2', name: 'Perfect Smile', doctor: 'Dr. Rajesh Patel', address: 'Brigade Road, Bangalore' },
    { id: '3', name: 'Care Dental', doctor: 'Dr. Sneha Kumar', address: 'Whitefield, Bangalore' }
  ];

  const handleSubmit = () => {
    console.log('Assigning task:', { ...formData, type: taskType });
    // Here you would typically send the data to your backend
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {taskType === 'pickup' ? <Package className="h-5 w-5" /> : <Truck className="h-5 w-5" />}
            Assign {taskType === 'pickup' ? 'Pickup' : 'Delivery'} Task
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Order ID</Label>
            <Select value={formData.orderId} onValueChange={(value) => setFormData({ ...formData, orderId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADE-2025-001">ADE-2025-001</SelectItem>
                <SelectItem value="ADE-2025-002">ADE-2025-002</SelectItem>
                <SelectItem value="ADE-2025-003">ADE-2025-003</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Clinic</Label>
            <Select value={formData.clinic} onValueChange={(value) => {
              const clinic = clinics.find(c => c.id === value);
              setFormData({
                ...formData,
                clinic: value,
                doctor: clinic?.doctor || '',
                address: clinic?.address || ''
              });
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select clinic" />
              </SelectTrigger>
              <SelectContent>
                {clinics.map(clinic => (
                  <SelectItem key={clinic.id} value={clinic.id}>{clinic.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Doctor</Label>
            <Input value={formData.doctor} readOnly className="bg-gray-50" />
          </div>

          <div>
            <Label>Field Agent</Label>
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

          <div>
            <Label>Scheduled Date</Label>
            <Input
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
            />
          </div>

          <div>
            <Label>Scheduled Time</Label>
            <Input
              type="time"
              value={formData.scheduledTime}
              onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
            />
          </div>

          {taskType === 'delivery' && (
            <div>
              <Label>Payment Amount (if COD)</Label>
              <Input
                type="number"
                placeholder="₹ Amount"
                value={formData.paymentAmount}
                onChange={(e) => setFormData({ ...formData, paymentAmount: e.target.value })}
              />
            </div>
          )}
        </div>

        <div>
          <Label>Address</Label>
          <Textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            rows={2}
          />
        </div>

        <div>
          <Label>Special Instructions</Label>
          <Textarea
            placeholder="Any special instructions for the field agent..."
            value={formData.specialInstructions}
            onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
            rows={2}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Assign Task</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTaskModal;
