
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Clock } from 'lucide-react';

interface SetAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SetAvailabilityModal = ({ isOpen, onClose }: SetAvailabilityModalProps) => {
  const [availability, setAvailability] = useState({
    monday: { enabled: true, startTime: '09:00', endTime: '17:00' },
    tuesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
    wednesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
    thursday: { enabled: true, startTime: '09:00', endTime: '17:00' },
    friday: { enabled: true, startTime: '09:00', endTime: '17:00' },
    saturday: { enabled: true, startTime: '09:00', endTime: '13:00' },
    sunday: { enabled: false, startTime: '09:00', endTime: '17:00' }
  });

  const [specialDates, setSpecialDates] = useState([
    { date: '', available: false, note: '' }
  ]);

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  const handleDayChange = (day: string, field: string, value: any) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSubmit = () => {
    console.log('Setting availability:', { availability, specialDates });
    // Here you would typically send the data to your backend
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Set Scan Appointment Availability
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Weekly Schedule</h3>
            <div className="space-y-3">
              {days.map(day => (
                <div key={day.key} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="flex items-center space-x-2 w-20">
                    <Checkbox
                      checked={availability[day.key as keyof typeof availability].enabled}
                      onCheckedChange={(checked) => handleDayChange(day.key, 'enabled', checked)}
                    />
                    <Label className="text-sm font-medium">{day.label}</Label>
                  </div>

                  {availability[day.key as keyof typeof availability].enabled && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <Input
                        type="time"
                        value={availability[day.key as keyof typeof availability].startTime}
                        onChange={(e) => handleDayChange(day.key, 'startTime', e.target.value)}
                        className="w-24"
                      />
                      <span className="text-gray-500">to</span>
                      <Input
                        type="time"
                        value={availability[day.key as keyof typeof availability].endTime}
                        onChange={(e) => handleDayChange(day.key, 'endTime', e.target.value)}
                        className="w-24"
                      />
                    </div>
                  )}

                  {!availability[day.key as keyof typeof availability].enabled && (
                    <span className="text-gray-500 text-sm">Not Available</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Special Dates (Holidays/Exceptions)</h3>
            <div className="space-y-2">
              {specialDates.map((special, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <Input
                    type="date"
                    value={special.date}
                    onChange={(e) => {
                      const newSpecialDates = [...specialDates];
                      newSpecialDates[index].date = e.target.value;
                      setSpecialDates(newSpecialDates);
                    }}
                    className="w-40"
                  />
                  <Checkbox
                    checked={special.available}
                    onCheckedChange={(checked) => {
                      const newSpecialDates = [...specialDates];
                      newSpecialDates[index].available = !!checked;
                      setSpecialDates(newSpecialDates);
                    }}
                  />
                  <Label>Available</Label>
                  <Input
                    placeholder="Note (optional)"
                    value={special.note}
                    onChange={(e) => {
                      const newSpecialDates = [...specialDates];
                      newSpecialDates[index].note = e.target.value;
                      setSpecialDates(newSpecialDates);
                    }}
                    className="flex-1"
                  />
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSpecialDates([...specialDates, { date: '', available: false, note: '' }])}
              >
                Add Special Date
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Availability</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SetAvailabilityModal;
