
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';

interface UserWorkHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    role: string;
    department: string;
  } | null;
}

interface WorkActivity {
  id: string;
  type: 'sign_in' | 'task_accepted' | 'task_completed' | 'sign_out';
  time: string;
  taskId?: string;
  taskTitle?: string;
  status: 'completed' | 'in_progress' | 'pending';
}

const UserWorkHistoryModal: React.FC<UserWorkHistoryModalProps> = ({ isOpen, onClose, user }) => {
  const [workHistory] = useState<WorkActivity[]>([
    {
      id: '1',
      type: 'sign_in',
      time: '09:00 AM',
      status: 'completed'
    },
    {
      id: '2',
      type: 'task_accepted',
      time: '09:15 AM',
      taskId: 'T001',
      taskTitle: 'Crown & Bridge Case Processing',
      status: 'in_progress'
    },
    {
      id: '3',
      type: 'task_completed',
      time: '11:30 AM',
      taskId: 'T001',
      taskTitle: 'Crown & Bridge Case Processing',
      status: 'completed'
    },
    {
      id: '4',
      type: 'task_accepted',
      time: '01:45 PM',
      taskId: 'T005',
      taskTitle: 'Quality Check - Orthodontic',
      status: 'in_progress'
    }
  ]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sign_in':
        return <Clock className="h-4 w-4 text-green-600" />;
      case 'task_accepted':
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case 'task_completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'sign_out':
        return <Clock className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'sign_in':
        return 'Signed In';
      case 'task_accepted':
        return 'Task Accepted';
      case 'task_completed':
        return 'Task Completed';
      case 'sign_out':
        return 'Signed Out';
      default:
        return type;
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Work History - {user.name} (Today)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <div className="font-medium">{user.name}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Role</label>
                  <Badge variant="outline">{user.role}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Department</label>
                  <div className="font-medium">{user.department}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Task Details</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workHistory.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.time}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getActivityIcon(activity.type)}
                          <span>{getActivityLabel(activity.type)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {activity.taskId ? (
                          <div>
                            <div className="font-medium">{activity.taskTitle}</div>
                            <div className="text-sm text-gray-500">ID: {activity.taskId}</div>
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={activity.status === 'completed' ? 'default' : 'secondary'}
                          className={
                            activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                              activity.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                          }
                        >
                          {activity.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserWorkHistoryModal;
