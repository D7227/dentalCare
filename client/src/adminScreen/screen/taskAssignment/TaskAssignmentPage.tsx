import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  ClipboardList,
  Users,
  Filter,
  Search,
  UserPlus,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpDown,
  MoreHorizontal,
  History,
  Eye,
  Plus
} from 'lucide-react';
import UserWorkHistoryModal from '@/adminScreen/component/UserWorkHistoryModal';

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'case' | 'order' | 'ticket' | 'quality_check' | 'delivery';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
  assignee: string | null;
  assigneeName: string | null;
  department: string;
  dueDate: string;
  createdDate: string;
  caseId?: string;
  clientName?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  active: boolean;
}

const TaskAssignmentPage = () => {
  const { toast } = useToast();

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'T001',
      title: 'Crown & Bridge Case Processing',
      description: 'Process crown and bridge case for patient John Doe',
      type: 'case',
      priority: 'high',
      status: 'pending',
      assignee: null,
      assigneeName: null,
      department: 'Crown & Bridge',
      dueDate: '2025-06-10',
      createdDate: '2025-06-04',
      caseId: 'ADE-2025-001',
      clientName: 'Smile Dental'
    },
    {
      id: 'T002',
      title: 'Quality Check - Orthodontic Appliance',
      description: 'Final quality check for orthodontic appliance',
      type: 'quality_check',
      priority: 'medium',
      status: 'in_progress',
      assignee: 'U003',
      assigneeName: 'Karan Singh',
      department: 'Quality Control',
      dueDate: '2025-06-08',
      createdDate: '2025-06-03'
    },
    {
      id: 'T003',
      title: 'Delivery Coordination',
      description: 'Coordinate delivery for completed cases',
      type: 'delivery',
      priority: 'medium',
      status: 'pending',
      assignee: null,
      assigneeName: null,
      department: 'Logistics',
      dueDate: '2025-06-07',
      createdDate: '2025-06-04'
    }
  ]);

  const [users] = useState<User[]>([
    { id: 'U001', name: 'Riya Patel', email: 'riya.patel@advancedental.com', department: 'Crown & Bridge', role: 'technician', active: true },
    { id: 'U002', name: 'Sahil Mehta', email: 'sahil.mehta@advancedental.com', department: 'South Zone', role: 'field_agent', active: true },
    { id: 'U003', name: 'Karan Singh', email: 'karan.singh@advancedental.com', department: 'Quality Control', role: 'qa_user', active: true },
    { id: 'U004', name: 'Anita Gupta', email: 'anita.gupta@advancedental.com', department: 'Implants', role: 'technician', active: true },
    { id: 'U005', name: 'Rajesh Kumar', email: 'rajesh.kumar@advancedental.com', department: 'Logistics', role: 'dispatch_team', active: true },
    { id: 'U006', name: 'Admin User', email: 'admin@advancedental.com', department: 'Administration', role: 'admin', active: true },
    { id: 'U007', name: 'Manager User', email: 'manager@advancedental.com', department: 'Operations', role: 'area_manager', active: true }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isBulkAssignDialogOpen, setIsBulkAssignDialogOpen] = useState(false);
  const [assigningTask, setAssigningTask] = useState<Task | null>(null);
  const [selectedUser, setSelectedUser] = useState('all');
  const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false);
  const [isWorkHistoryModalOpen, setIsWorkHistoryModalOpen] = useState(false);
  const [selectedUserForHistory, setSelectedUserForHistory] = useState<any>(null);

  const [createTaskForm, setCreateTaskForm] = useState({
    title: '',
    description: '',
    type: 'case' as 'case' | 'order' | 'ticket' | 'quality_check' | 'delivery',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    department: '',
    assigneeId: '',
    dueDate: '',
    caseId: ''
  });

  const [assignmentForm, setAssignmentForm] = useState({
    assigneeId: '',
    deadline: '',
    priority: '',
    notes: ''
  });

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.caseId && task.caseId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment = departmentFilter === 'all' || task.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesType = typeFilter === 'all' || task.type === typeFilter;

    return matchesSearch && matchesDepartment && matchesStatus && matchesPriority && matchesType;
  });

  const filteredTasksByUser = selectedUser === 'all' ? filteredTasks : filteredTasks.filter(task => task.assignee === selectedUser);

  const departments = [...new Set(tasks.map(task => task.department))];

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-orange-100 text-orange-800',
      'urgent': 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'on_hold':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleAssignTask = (task: Task) => {
    setAssigningTask(task);
    setAssignmentForm({
      assigneeId: task.assignee || '',
      deadline: task.dueDate,
      priority: task.priority,
      notes: ''
    });
    setIsAssignDialogOpen(true);
  };

  const handleBulkAssign = () => {
    if (selectedTasks.length === 0) {
      toast({
        title: "Error",
        description: "Please select tasks to assign",
        variant: "destructive"
      });
      return;
    }
    setIsBulkAssignDialogOpen(true);
  };

  const handleSaveAssignment = () => {
    if (!assignmentForm.assigneeId) {
      toast({
        title: "Error",
        description: "Please select an assignee",
        variant: "destructive"
      });
      return;
    }

    const assignee = users.find(u => u.id === assignmentForm.assigneeId);

    setTasks(tasks.map(task =>
      task.id === assigningTask?.id
        ? {
          ...task,
          assignee: assignmentForm.assigneeId,
          assigneeName: assignee?.name || null,
          dueDate: assignmentForm.deadline,
          priority: assignmentForm.priority as any,
          status: 'in_progress' as any
        }
        : task
    ));

    toast({
      title: "Success",
      description: `Task assigned to ${assignee?.name}`,
    });

    setIsAssignDialogOpen(false);
    setAssigningTask(null);
  };

  const handleBulkAssignSave = () => {
    if (!assignmentForm.assigneeId) {
      toast({
        title: "Error",
        description: "Please select an assignee",
        variant: "destructive"
      });
      return;
    }

    const assignee = users.find(u => u.id === assignmentForm.assigneeId);

    setTasks(tasks.map(task =>
      selectedTasks.includes(task.id)
        ? {
          ...task,
          assignee: assignmentForm.assigneeId,
          assigneeName: assignee?.name || null,
          dueDate: assignmentForm.deadline || task.dueDate,
          priority: assignmentForm.priority ? assignmentForm.priority as any : task.priority,
          status: 'in_progress' as any
        }
        : task
    ));

    toast({
      title: "Success",
      description: `${selectedTasks.length} tasks assigned to ${assignee?.name}`,
    });

    setIsBulkAssignDialogOpen(false);
    setSelectedTasks([]);
  };

  const handleSelectTask = (taskId: string) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === filteredTasksByUser.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasksByUser.map(task => task.id));
    }
  };

  const handleCreateTask = () => {
    if (!createTaskForm.title || !createTaskForm.assigneeId) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive"
      });
      return;
    }

    const assignee = users.find(u => u.id === createTaskForm.assigneeId);
    const newTask: Task = {
      id: `T${String(tasks.length + 1).padStart(3, '0')}`,
      title: createTaskForm.title,
      description: createTaskForm.description,
      type: createTaskForm.type,
      priority: createTaskForm.priority,
      status: 'pending',
      assignee: createTaskForm.assigneeId,
      assigneeName: assignee?.name || null,
      department: createTaskForm.department || assignee?.department || '',
      dueDate: createTaskForm.dueDate,
      createdDate: new Date().toISOString().split('T')[0],
      caseId: createTaskForm.caseId || undefined
    };

    setTasks([...tasks, newTask]);

    toast({
      title: "Success",
      description: `Task created and assigned to ${assignee?.name}`,
    });

    setIsCreateTaskDialogOpen(false);
    setCreateTaskForm({
      title: '',
      description: '',
      type: 'case',
      priority: 'medium',
      department: '',
      assigneeId: '',
      dueDate: '',
      caseId: ''
    });
  };

  const handleViewUserHistory = (user: User) => {
    setSelectedUserForHistory(user);
    setIsWorkHistoryModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <ClipboardList className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Task Assignment</h2>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={() => setIsCreateTaskDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
          <Button
            variant="outline"
            onClick={handleBulkAssign}
            disabled={selectedTasks.length === 0}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Bulk Assign ({selectedTasks.length})
          </Button>
        </div>
      </div>

      {/* User Tasks View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            View Tasks by User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select user to view their tasks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.filter(u => u.active).map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} - {user.department} ({user.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedUser !== 'all' && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const user = users.find(u => u.id === selectedUser);
                    if (user) handleViewUserHistory(user);
                  }}
                >
                  <History className="h-4 w-4 mr-2" />
                  View Work History
                </Button>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Eye className="h-4 w-4" />
                  <span>
                    Showing {filteredTasksByUser.length} tasks for{' '}
                    {users.find(u => u.id === selectedUser)?.name}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="case">Case</SelectItem>
                <SelectItem value="order">Order</SelectItem>
                <SelectItem value="ticket">Ticket</SelectItem>
                <SelectItem value="quality_check">Quality Check</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setDepartmentFilter('all');
                setStatusFilter('all');
                setPriorityFilter('all');
                setTypeFilter('all');
              }}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedUser === 'all'
              ? `All Tasks (${filteredTasks.length})`
              : `Tasks for ${users.find(u => u.id === selectedUser)?.name} (${filteredTasksByUser.length})`
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={selectedTasks.length === filteredTasksByUser.length && filteredTasksByUser.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasksByUser.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedTasks.includes(task.id)}
                      onCheckedChange={() => handleSelectTask(task.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-gray-600">{task.description}</div>
                      {task.caseId && (
                        <div className="text-xs text-blue-600">ID: {task.caseId}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {task.type.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(task.status)}
                      <span className="capitalize">{task.status.replace('_', ' ')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {task.assigneeName ? (
                      <div className="text-sm">
                        <div className="font-medium">{task.assigneeName}</div>
                        <div className="text-gray-500">
                          {users.find(u => u.id === task.assignee)?.role}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>{task.department}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAssignTask(task)}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const user = users.find(u => u.id === task.assignee);
                          if (user) handleViewUserHistory(user);
                        }}
                      >
                        <History className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Task Dialog */}
      <Dialog open={isCreateTaskDialogOpen} onOpenChange={setIsCreateTaskDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task-title">Task Title *</Label>
                <Input
                  id="task-title"
                  value={createTaskForm.title}
                  onChange={(e) => setCreateTaskForm({ ...createTaskForm, title: e.target.value })}
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <Label htmlFor="task-type">Task Type</Label>
                <Select value={createTaskForm.type} onValueChange={(value: any) => setCreateTaskForm({ ...createTaskForm, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="case">Case</SelectItem>
                    <SelectItem value="order">Order</SelectItem>
                    <SelectItem value="ticket">Ticket</SelectItem>
                    <SelectItem value="quality_check">Quality Check</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                value={createTaskForm.description}
                onChange={(e) => setCreateTaskForm({ ...createTaskForm, description: e.target.value })}
                placeholder="Enter task description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task-priority">Priority</Label>
                <Select value={createTaskForm.priority} onValueChange={(value: any) => setCreateTaskForm({ ...createTaskForm, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="task-due-date">Due Date</Label>
                <Input
                  id="task-due-date"
                  type="date"
                  value={createTaskForm.dueDate}
                  onChange={(e) => setCreateTaskForm({ ...createTaskForm, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task-assignee">Assign to *</Label>
                <Select value={createTaskForm.assigneeId} onValueChange={(value) => setCreateTaskForm({ ...createTaskForm, assigneeId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.filter(u => u.active).map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        <div>
                          <div>{user.name}</div>
                          <div className="text-xs text-gray-500">{user.department} - {user.role}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="task-case-id">Case ID (optional)</Label>
                <Input
                  id="task-case-id"
                  value={createTaskForm.caseId}
                  onChange={(e) => setCreateTaskForm({ ...createTaskForm, caseId: e.target.value })}
                  placeholder="e.g., ADE-2025-001"
                />
              </div>
            </div>

            <Button onClick={handleCreateTask} className="w-full">
              Create Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Single Assignment Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {assigningTask && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">{assigningTask.title}</div>
                <div className="text-sm text-gray-600">{assigningTask.description}</div>
              </div>
            )}

            <div>
              <Label htmlFor="assignee">Assign to</Label>
              <Select value={assignmentForm.assigneeId} onValueChange={(value) => setAssignmentForm({ ...assignmentForm, assigneeId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {users.filter(u => u.active).map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      <div>
                        <div>{user.name}</div>
                        <div className="text-xs text-gray-500">{user.department} - {user.role}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={assignmentForm.deadline}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, deadline: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={assignmentForm.priority} onValueChange={(value) => setAssignmentForm({ ...assignmentForm, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={assignmentForm.notes}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, notes: e.target.value })}
                placeholder="Add any notes for the assignee..."
              />
            </div>

            <Button onClick={handleSaveAssignment} className="w-full">
              Assign Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Assignment Dialog */}
      <Dialog open={isBulkAssignDialogOpen} onOpenChange={setIsBulkAssignDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk Assign Tasks ({selectedTasks.length})</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bulk-assignee">Assign to</Label>
              <Select value={assignmentForm.assigneeId} onValueChange={(value) => setAssignmentForm({ ...assignmentForm, assigneeId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {users.filter(u => u.active).map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      <div>
                        <div>{user.name}</div>
                        <div className="text-xs text-gray-500">{user.department} - {user.role}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="bulk-deadline">Deadline (optional)</Label>
              <Input
                id="bulk-deadline"
                type="date"
                value={assignmentForm.deadline}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, deadline: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="bulk-priority">Priority (optional)</Label>
              <Select value={assignmentForm.priority} onValueChange={(value) => setAssignmentForm({ ...assignmentForm, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Keep existing priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Keep existing</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="bulk-notes">Notes</Label>
              <Textarea
                id="bulk-notes"
                value={assignmentForm.notes}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, notes: e.target.value })}
                placeholder="Add any notes for all selected tasks..."
              />
            </div>

            <Button onClick={handleBulkAssignSave} className="w-full">
              Assign {selectedTasks.length} Tasks
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* User Work History Modal */}
      <UserWorkHistoryModal
        isOpen={isWorkHistoryModalOpen}
        onClose={() => setIsWorkHistoryModalOpen(false)}
        user={selectedUserForHistory}
      />
    </div>
  );
};

export default TaskAssignmentPage;
