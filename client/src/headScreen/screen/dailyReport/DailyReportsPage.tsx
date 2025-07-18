import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Calendar, Users, TrendingUp, Download, Eye } from 'lucide-react';
import UserWorkHistoryModal from '@/headScreen/component/UserWorkHistoryModal';

interface UserReport {
  id: string;
  name: string;
  role: string;
  department: string;
  tasksCompleted: number;
  tasksInProgress: number;
  hoursWorked: number;
  productivity: number;
  lastActivity: string;
}

const DailyReportsPage = () => {
  const [selectedDate, setSelectedDate] = useState('2025-06-04');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string; role: string; department: string } | null>(null);
  const [isWorkHistoryOpen, setIsWorkHistoryOpen] = useState(false);

  const [userReports] = useState<UserReport[]>([
    {
      id: 'U001',
      name: 'Riya Patel',
      role: 'technician',
      department: 'Crown & Bridge',
      tasksCompleted: 3,
      tasksInProgress: 2,
      hoursWorked: 7.5,
      productivity: 85,
      lastActivity: '04:30 PM'
    },
    {
      id: 'U002',
      name: 'Sahil Mehta',
      role: 'field_agent',
      department: 'South Zone',
      tasksCompleted: 5,
      tasksInProgress: 1,
      hoursWorked: 8,
      productivity: 92,
      lastActivity: '05:15 PM'
    },
    {
      id: 'U003',
      name: 'Karan Singh',
      role: 'qa_user',
      department: 'Quality Control',
      tasksCompleted: 4,
      tasksInProgress: 3,
      hoursWorked: 6.5,
      productivity: 78,
      lastActivity: '03:45 PM'
    },
    {
      id: 'U004',
      name: 'Anita Gupta',
      role: 'technician',
      department: 'Implants',
      tasksCompleted: 2,
      tasksInProgress: 4,
      hoursWorked: 8,
      productivity: 70,
      lastActivity: '05:00 PM'
    },
    {
      id: 'U005',
      name: 'Rajesh Kumar',
      role: 'dispatch_team',
      department: 'Logistics',
      tasksCompleted: 6,
      tasksInProgress: 0,
      hoursWorked: 7,
      productivity: 95,
      lastActivity: '04:00 PM'
    }
  ]);

  const filteredReports = userReports.filter(report => {
    const matchesDepartment = selectedDepartment === 'all' || report.department === selectedDepartment;
    const matchesRole = selectedRole === 'all' || report.role === selectedRole;
    return matchesDepartment && matchesRole;
  });

  const totalStats = {
    totalUsers: filteredReports.length,
    totalTasksCompleted: filteredReports.reduce((sum, report) => sum + report.tasksCompleted, 0),
    totalHoursWorked: filteredReports.reduce((sum, report) => sum + report.hoursWorked, 0),
    avgProductivity: Math.round(filteredReports.reduce((sum, report) => sum + report.productivity, 0) / filteredReports.length)
  };

  const getProductivityColor = (productivity: number) => {
    if (productivity >= 90) return 'bg-green-100 text-green-800';
    if (productivity >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const departments = [...new Set(userReports.map(report => report.department))];
  const roles = [...new Set(userReports.map(report => report.role))];

  const handleViewWorkHistory = (report: UserReport) => {
    setSelectedUser({
      id: report.id,
      name: report.name,
      role: report.role,
      department: report.department
    });
    setIsWorkHistoryOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Daily Reports</h2>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Department</label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Role</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>
                      {role.replace('_', ' ').toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{totalStats.totalUsers}</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{totalStats.totalTasksCompleted}</div>
                <div className="text-sm text-gray-600">Tasks Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{totalStats.totalHoursWorked}</div>
                <div className="text-sm text-gray-600">Hours Worked</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{totalStats.avgProductivity}%</div>
                <div className="text-sm text-gray-600">Avg Productivity</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Performance Report - {new Date(selectedDate).toLocaleDateString()}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role & Department</TableHead>
                <TableHead>Tasks Completed</TableHead>
                <TableHead>Tasks In Progress</TableHead>
                <TableHead>Hours Worked</TableHead>
                <TableHead>Productivity</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{report.role.replace('_', ' ').toUpperCase()}</div>
                      <div className="text-sm text-gray-600">{report.department}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {report.tasksCompleted}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {report.tasksInProgress}
                    </Badge>
                  </TableCell>
                  <TableCell>{report.hoursWorked}h</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProductivityColor(report.productivity)}`}>
                      {report.productivity}%
                    </span>
                  </TableCell>
                  <TableCell>{report.lastActivity}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewWorkHistory(report)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Work History Modal */}
      <UserWorkHistoryModal
        isOpen={isWorkHistoryOpen}
        onClose={() => setIsWorkHistoryOpen(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default DailyReportsPage;
