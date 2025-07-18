import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  MapPin,
  Users,
  Calendar,
  FileText,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  UserPlus,
  CreditCard,
  Building,
  Search,
  TrendingDown,
  Activity,
  Camera,
  Banknote
} from 'lucide-react';
import AssignTaskModal from '@/headScreen/component/area-manager/AssignTaskModal';
import OnboardingTaskModal from '@/headScreen/component/area-manager/OnboardingTaskModal';
import SetAvailabilityModal from '@/headScreen/component/area-manager/SetAvailabilityModal';
import ScheduleScanModal from '@/headScreen/component/area-manager/ScheduleScanModal';
import CollectionTaskModal from '@/headScreen/component/area-manager/CollectionTaskModal';
import ClinicDetailsModal from '@/headScreen/component/area-manager/ClinicDetailsModal';
import AgentReportModal from '@/headScreen/component/area-manager/AgentReportModal';
const AreaManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isAssignTaskOpen, setIsAssignTaskOpen] = useState(false);
  const [taskType, setTaskType] = useState<'pickup' | 'delivery'>('pickup');
  const [isOnboardingTaskOpen, setIsOnboardingTaskOpen] = useState(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [isScheduleScanOpen, setIsScheduleScanOpen] = useState(false);
  const [isCollectionTaskOpen, setIsCollectionTaskOpen] = useState(false);
  const [isClinicDetailsOpen, setIsClinicDetailsOpen] = useState(false);
  const [isAgentReportOpen, setIsAgentReportOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<any>(null);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);

  const fieldAgents = [
    { id: 1, name: 'John Doe', status: 'active', tasksToday: 5, completedToday: 3, location: 'MG Road Area', phone: '+91 98765 43210', area: 'Central Bangalore', currentTasks: 2, efficiency: 95 },
    { id: 2, name: 'Jane Smith', status: 'active', tasksToday: 4, completedToday: 4, location: 'Brigade Road Area', phone: '+91 87654 32109', area: 'South Bangalore', currentTasks: 1, efficiency: 88 },
    { id: 3, name: 'Mike Johnson', status: 'offline', tasksToday: 3, completedToday: 1, location: 'Whitefield Area', phone: '+91 76543 21098', area: 'East Bangalore', currentTasks: 3, efficiency: 75 }
  ];

  const clinics = [
    {
      id: '1',
      name: 'Smile Dental',
      location: 'MG Road',
      status: 'active',
      lastOrder: '2 days ago',
      engagement: 'high',
      monthlyOrders: 15,
      pendingAmount: 2500,
      doctor: 'Dr. Sharma',
      phone: '+91 98765 43210',
      email: 'contact@smiledental.com'
    },
    {
      id: '2',
      name: 'Care Dental',
      location: 'Brigade Road',
      status: 'declining',
      lastOrder: '1 week ago',
      engagement: 'low',
      monthlyOrders: 3,
      pendingAmount: 5000,
      doctor: 'Dr. Patel',
      phone: '+91 87654 32109',
      email: 'info@caredental.com'
    },
    {
      id: '3',
      name: 'Perfect Smile',
      location: 'Whitefield',
      status: 'active',
      lastOrder: 'Today',
      engagement: 'high',
      monthlyOrders: 12,
      pendingAmount: 1200,
      doctor: 'Dr. Kumar',
      phone: '+91 76543 21098',
      email: 'hello@perfectsmile.com'
    }
  ];

  const scanAppointments = [
    {
      id: 1,
      clinic: 'Smile Dental',
      doctor: 'Dr. Sharma',
      patient: 'John Doe',
      date: '2024-01-15',
      time: '10:00 AM',
      status: 'pending',
      type: 'new_request'
    },
    {
      id: 2,
      clinic: 'Care Dental',
      doctor: 'Dr. Patel',
      patient: 'Jane Smith',
      date: '2024-01-16',
      time: '2:00 PM',
      status: 'approved',
      type: 'scheduled'
    },
    {
      id: 3,
      clinic: 'Perfect Smile',
      doctor: 'Dr. Kumar',
      patient: 'Mike Johnson',
      date: '2024-01-14',
      time: '11:00 AM',
      status: 'reschedule_request',
      type: 'reschedule'
    }
  ];

  const cashCollectionTasks = [
    {
      id: 1,
      clinic: 'Smile Dental',
      amount: 15000,
      type: 'cash',
      assignedTo: 'John Doe',
      dueDate: '2024-01-15',
      status: 'pending'
    },
    {
      id: 2,
      clinic: 'Care Dental',
      amount: 8500,
      type: 'cheque',
      assignedTo: 'Jane Smith',
      dueDate: '2024-01-14',
      status: 'collected'
    }
  ];

  const onboardingTasks = [
    {
      id: 1,
      clinicName: 'New Dental Clinic',
      location: 'Koramangala',
      assignedTo: 'Mike Johnson',
      status: 'visiting_card_collected',
      contactPerson: 'Dr. Reddy'
    },
    {
      id: 2,
      clinicName: 'Fresh Smile Dental',
      location: 'HSR Layout',
      assignedTo: 'John Doe',
      status: 'initial_visit_pending',
      contactPerson: 'Dr. Rao'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: any } = {
      'active': 'default',
      'pending': 'secondary',
      'approved': 'default',
      'declining': 'destructive',
      'reschedule_request': 'secondary',
      'collected': 'default',
      'visiting_card_collected': 'default',
      'initial_visit_pending': 'secondary'
    };
    return variants[status] || 'secondary';
  };

  const handleAssignTask = (type: 'pickup' | 'delivery') => {
    setTaskType(type);
    setIsAssignTaskOpen(true);
  };

  const handleViewClinicDetails = (clinic: any) => {
    setSelectedClinic(clinic);
    setIsClinicDetailsOpen(true);
  };

  const handleViewAgentReport = (agent: any) => {
    setSelectedAgent(agent);
    setIsAgentReportOpen(true);
  };

  const handleApproveReschedule = (appointmentId: number) => {
    console.log('Approving reschedule for appointment:', appointmentId);
    // Here you would update the appointment status
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Field Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clinics</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">3 pending onboarding</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scan Requests</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">5 pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Collections</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹45,230</div>
            <p className="text-xs text-muted-foreground">Across 12 clinics</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="tasks">Task Assignment</TabsTrigger>
          <TabsTrigger value="onboarding">Clinic Onboarding</TabsTrigger>
          <TabsTrigger value="scans">Scan Appointments</TabsTrigger>
          <TabsTrigger value="collections">Cash Collection</TabsTrigger>
          <TabsTrigger value="clinics">Clinic Management</TabsTrigger>
          <TabsTrigger value="agents">Field Agents</TabsTrigger>
          <TabsTrigger value="reports">Activity Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Task Assignment</CardTitle>
              <CardDescription>Assign tasks to field agents for clinic visits and deliveries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button className="w-full md:w-auto" onClick={() => handleAssignTask('pickup')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Assign Pickup Task
                  </Button>
                  <Button variant="outline" className="w-full md:w-auto" onClick={() => handleAssignTask('delivery')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Assign Delivery Task
                  </Button>
                </div>

                <div className="space-y-2">
                  {[1, 2, 3].map((task) => (
                    <div key={task} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Pickup - Smile Dental</p>
                        <p className="text-sm text-gray-600">Assigned to: John Doe</p>
                        <p className="text-xs text-gray-500">Due: Today 5:00 PM</p>
                      </div>
                      <Badge variant="outline">In Progress</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clinic Onboarding</CardTitle>
              <CardDescription>Onboard new clinics and manage visiting card collection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={() => setIsOnboardingTaskOpen(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Onboarding Task
                </Button>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Clinic Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {onboardingTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{task.clinicName}</p>
                            <p className="text-sm text-gray-600">{task.contactPerson}</p>
                          </div>
                        </TableCell>
                        <TableCell>{task.location}</TableCell>
                        <TableCell>{task.assignedTo}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadge(task.status)}>
                            {task.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <Camera className="w-3 h-3 mr-1" />
                            View Card
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scan Appointments</CardTitle>
              <CardDescription>Manage scan appointments and availability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button onClick={() => setIsAvailabilityOpen(true)}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Set Availability
                  </Button>
                  <Button variant="outline" onClick={() => setIsScheduleScanOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Scan
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Clinic & Doctor</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scanAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{appointment.clinic}</p>
                            <p className="text-sm text-gray-600">{appointment.doctor}</p>
                          </div>
                        </TableCell>
                        <TableCell>{appointment.patient}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{appointment.date}</p>
                            <p className="text-sm text-gray-600">{appointment.time}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadge(appointment.status)}>
                            {appointment.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {appointment.status === 'pending' && (
                              <>
                                <Button size="sm" variant="outline">
                                  <CheckCircle className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <AlertCircle className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                            {appointment.status === 'reschedule_request' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApproveReschedule(appointment.id)}
                              >
                                Approve Reschedule
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cash & Cheque Collection</CardTitle>
              <CardDescription>Manage collection tasks and assign to field agents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={() => setIsCollectionTaskOpen(true)}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Create Collection Task
                </Button>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Clinic</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cashCollectionTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>{task.clinic}</TableCell>
                        <TableCell>₹{task.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {task.type === 'cash' ? <Banknote className="w-3 h-3 mr-1" /> : <CreditCard className="w-3 h-3 mr-1" />}
                            {task.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{task.assignedTo}</TableCell>
                        <TableCell>{task.dueDate}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadge(task.status)}>
                            {task.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clinics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clinic Relationship Management</CardTitle>
              <CardDescription>Monitor clinic engagement and manage relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search clinics..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <TrendingDown className="w-4 h-4 mr-2" />
                    Declining Clinics
                  </Button>
                </div>

                <div className="space-y-2">
                  {clinics.map((clinic) => (
                    <div key={clinic.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{clinic.name}</p>
                          <Badge variant={clinic.engagement === 'high' ? 'default' : 'destructive'}>
                            {clinic.engagement} engagement
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{clinic.location}</p>
                        <div className="flex gap-4 text-xs text-gray-500 mt-1">
                          <span>Last order: {clinic.lastOrder}</span>
                          <span>Monthly orders: {clinic.monthlyOrders}</span>
                          <span>Pending: ₹{clinic.pendingAmount}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleViewClinicDetails(clinic)}>
                          <Activity className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                        {clinic.engagement === 'low' && (
                          <Button size="sm">
                            Follow Up
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Field Agent Performance</CardTitle>
              <CardDescription>Monitor field agent activities and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {fieldAgents.map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-sm text-gray-600">Area: {agent.location}</p>
                      <p className="text-sm text-gray-600">
                        {agent.completedToday}/{agent.tasksToday} tasks completed today
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                        {agent.status}
                      </Badge>
                      <Button size="sm" variant="outline" onClick={() => handleViewAgentReport(agent)}>
                        View Report
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Reports</CardTitle>
              <CardDescription>View detailed reports per field agent and clinic</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Field Agent Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {fieldAgents.map((agent) => (
                        <div key={agent.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                          <span>{agent.name}</span>
                          <Button size="sm" variant="outline" onClick={() => handleViewAgentReport(agent)}>
                            <FileText className="w-3 h-3 mr-1" />
                            View Report
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Clinic Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {clinics.map((clinic) => (
                        <div key={clinic.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                          <span>{clinic.name}</span>
                          <Button size="sm" variant="outline" onClick={() => handleViewClinicDetails(clinic)}>
                            <FileText className="w-3 h-3 mr-1" />
                            View Report
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AssignTaskModal
        isOpen={isAssignTaskOpen}
        onClose={() => setIsAssignTaskOpen(false)}
        taskType={taskType}
      />

      <OnboardingTaskModal
        isOpen={isOnboardingTaskOpen}
        onClose={() => setIsOnboardingTaskOpen(false)}
      />

      <SetAvailabilityModal
        isOpen={isAvailabilityOpen}
        onClose={() => setIsAvailabilityOpen(false)}
      />

      <ScheduleScanModal
        isOpen={isScheduleScanOpen}
        onClose={() => setIsScheduleScanOpen(false)}
      />

      <CollectionTaskModal
        isOpen={isCollectionTaskOpen}
        onClose={() => setIsCollectionTaskOpen(false)}
      />

      {selectedClinic && (
        <ClinicDetailsModal
          isOpen={isClinicDetailsOpen}
          onClose={() => setIsClinicDetailsOpen(false)}
          clinic={selectedClinic}
        />
      )}

      {selectedAgent && (
        <AgentReportModal
          isOpen={isAgentReportOpen}
          onClose={() => setIsAgentReportOpen(false)}
          agent={selectedAgent}
        />
      )}
    </div>
  );
};

export default AreaManagerDashboard;
