
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, MapPin, Phone, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface AgentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: {
    id: string;
    name: string;
    phone: string;
    area: string;
    status: string;
    currentTasks: number;
    completedToday: number;
    efficiency: number;
  };
}

const AgentReportModal = ({ isOpen, onClose, agent }: AgentReportModalProps) => {
  const todaysTasks = [
    { id: '1', type: 'delivery', clinic: 'Smile Dental', time: '10:00 AM', status: 'completed' },
    { id: '2', type: 'pickup', clinic: 'Care Dental', time: '2:00 PM', status: 'completed' },
    { id: '3', type: 'collection', clinic: 'Perfect Smile', time: '4:00 PM', status: 'in_progress' },
    { id: '4', type: 'delivery', clinic: 'New Dental', time: '5:30 PM', status: 'pending' }
  ];

  const weeklyStats = [
    { day: 'Monday', completed: 6, assigned: 7, efficiency: 86 },
    { day: 'Tuesday', completed: 5, assigned: 5, efficiency: 100 },
    { day: 'Wednesday', completed: 4, assigned: 6, efficiency: 67 },
    { day: 'Thursday', completed: 7, assigned: 8, efficiency: 88 },
    { day: 'Friday', completed: 3, assigned: 4, efficiency: 75 }
  ];

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {agent.name} - Performance Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Agent Information */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Agent Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{agent.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{agent.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{agent.area}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Status:</span>
                  <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                    {agent.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Today's Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <div className="text-2xl font-bold">{agent.completedToday}</div>
                  <div className="text-sm text-gray-600">Completed Today</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-2xl font-bold">{agent.currentTasks}</div>
                  <div className="text-sm text-gray-600">Current Tasks</div>
                </div>
                <div className="p-3 border rounded-lg col-span-2">
                  <div className="text-2xl font-bold text-green-600">{agent.efficiency}%</div>
                  <div className="text-sm text-gray-600">Overall Efficiency</div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Today's Tasks */}
          <div>
            <h3 className="text-lg font-medium mb-4">Today's Task Details</h3>
            <div className="space-y-2">
              {todaysTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getTaskIcon(task.status)}
                    <div>
                      <span className="font-medium capitalize">{task.type}</span>
                      <span className="text-gray-500 ml-2">- {task.clinic}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{task.time}</span>
                    <Badge variant={task.status === 'completed' ? 'default' : task.status === 'in_progress' ? 'secondary' : 'outline'}>
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Weekly Performance */}
          <div>
            <h3 className="text-lg font-medium mb-4">Weekly Performance Trend</h3>
            <div className="space-y-2">
              {weeklyStats.map(day => (
                <div key={day.day} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">{day.day}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="font-medium">{day.completed}/{day.assigned}</div>
                      <div className="text-xs text-gray-500">Tasks</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-medium ${day.efficiency >= 80 ? 'text-green-600' : day.efficiency >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {day.efficiency}%
                      </div>
                      <div className="text-xs text-gray-500">Efficiency</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Call Agent
            </Button>
            <Button variant="outline">
              <MapPin className="h-4 w-4 mr-2" />
              Track Location
            </Button>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Assign New Task
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgentReportModal;
