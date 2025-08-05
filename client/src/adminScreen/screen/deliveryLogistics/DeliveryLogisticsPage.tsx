
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Truck, MapPin, Package, Users, Plus, Eye, Search, Navigation } from 'lucide-react';

interface DeliveryTask {
  id: string;
  orderId: string;
  type: 'pickup' | 'delivery';
  clinic: string;
  doctor: string;
  address: string;
  city: string;
  assignedAgent: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high';
  scheduledDate: string;
  completedDate?: string;
  paymentAmount?: number;
  proofUploaded: boolean;
}

interface CourierPartner {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  services: string[];
  coverage: string[];
  status: 'active' | 'inactive';
  rating: number;
  activeShipments: number;
}

interface FieldAgent {
  id: string;
  name: string;
  phone: string;
  area: string;
  status: 'available' | 'busy' | 'offline';
  currentTasks: number;
  completedToday: number;
  location: string;
  efficiency: number;
}

interface Shipment {
  id: string;
  trackingNumber: string;
  orderId: string;
  courier: string;
  destination: string;
  status: 'dispatched' | 'in_transit' | 'delivered' | 'returned';
  dispatchDate: string;
  estimatedDelivery: string;
  actualDelivery?: string;
}

const DeliveryLogisticsPage = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAssignTaskOpen, setIsAssignTaskOpen] = useState(false);

  const [deliveryTasks] = useState<DeliveryTask[]>([
    {
      id: '1',
      orderId: 'ADE-2025-034',
      type: 'delivery',
      clinic: 'Smile Care Dental',
      doctor: 'Dr. Pooja Verma',
      address: 'MG Road, Bangalore',
      city: 'Bangalore',
      assignedAgent: 'Rajesh Kumar',
      status: 'in_progress',
      priority: 'high',
      scheduledDate: '2025-06-04',
      paymentAmount: 15000,
      proofUploaded: false
    },
    {
      id: '2',
      orderId: 'ADE-2025-035',
      type: 'pickup',
      clinic: 'Perfect Smile',
      doctor: 'Dr. Rajesh Patel',
      address: 'Brigade Road, Bangalore',
      city: 'Bangalore',
      assignedAgent: 'Priya Sharma',
      status: 'completed',
      priority: 'medium',
      scheduledDate: '2025-06-03',
      completedDate: '2025-06-03',
      proofUploaded: true
    }
  ]);

  const [courierPartners] = useState<CourierPartner[]>([
    {
      id: '1',
      name: 'FastTrack Courier',
      contactPerson: 'Amit Singh',
      phone: '+91 98765 43210',
      email: 'amit@fasttrack.com',
      services: ['Same Day', 'Next Day', 'Express'],
      coverage: ['Bangalore', 'Mumbai', 'Delhi'],
      status: 'active',
      rating: 4.5,
      activeShipments: 15
    },
    {
      id: '2',
      name: 'QuickDeliver',
      contactPerson: 'Sneha Patel',
      phone: '+91 87654 32109',
      email: 'sneha@quickdeliver.com',
      services: ['Standard', 'Express'],
      coverage: ['Bangalore', 'Pune', 'Chennai'],
      status: 'active',
      rating: 4.2,
      activeShipments: 8
    }
  ]);

  const [fieldAgents] = useState<FieldAgent[]>([
    {
      id: '1',
      name: 'Rajesh Kumar',
      phone: '+91 9876543210',
      area: 'Central Bangalore',
      status: 'busy',
      currentTasks: 3,
      completedToday: 5,
      location: 'MG Road',
      efficiency: 95
    },
    {
      id: '2',
      name: 'Priya Sharma',
      phone: '+91 8765432109',
      area: 'South Bangalore',
      status: 'available',
      currentTasks: 1,
      completedToday: 4,
      location: 'Koramangala',
      efficiency: 88
    }
  ]);

  const [shipments] = useState<Shipment[]>([
    {
      id: '1',
      trackingNumber: 'TRK123456789',
      orderId: 'ADE-2025-036',
      courier: 'FastTrack Courier',
      destination: 'Mumbai',
      status: 'in_transit',
      dispatchDate: '2025-06-03',
      estimatedDelivery: '2025-06-05'
    },
    {
      id: '2',
      trackingNumber: 'TRK987654321',
      orderId: 'ADE-2025-037',
      courier: 'QuickDeliver',
      destination: 'Chennai',
      status: 'delivered',
      dispatchDate: '2025-06-02',
      estimatedDelivery: '2025-06-04',
      actualDelivery: '2025-06-04'
    }
  ]);

  const filteredTasks = deliveryTasks.filter(task => {
    const matchesSearch = task.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.clinic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'assigned': 'bg-blue-100 text-blue-800',
      'in_progress': 'bg-purple-100 text-purple-800',
      'completed': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800',
      'dispatched': 'bg-blue-100 text-blue-800',
      'in_transit': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'returned': 'bg-orange-100 text-orange-800',
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800',
      'available': 'bg-green-100 text-green-800',
      'busy': 'bg-yellow-100 text-yellow-800',
      'offline': 'bg-red-100 text-red-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'high': 'text-red-600 font-semibold',
      'medium': 'text-yellow-600 font-medium',
      'low': 'text-green-600 font-normal'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Truck className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Delivery & Logistics Management</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">12 deliveries, 6 pickups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Out of 12 total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Via courier partners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tasks">Delivery Tasks</TabsTrigger>
          <TabsTrigger value="agents">Field Agents</TabsTrigger>
          <TabsTrigger value="couriers">Courier Partners</TabsTrigger>
          <TabsTrigger value="shipments">Shipment Tracking</TabsTrigger>
        </TabsList>

        {/* Delivery Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Delivery Tasks</CardTitle>
                <div className="flex space-x-4">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search tasks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog open={isAssignTaskOpen} onOpenChange={setIsAssignTaskOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Assign Task
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Assign Delivery Task</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Order ID</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select order" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ADE-2025-038">ADE-2025-038</SelectItem>
                              <SelectItem value="ADE-2025-039">ADE-2025-039</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Task Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pickup">Pickup</SelectItem>
                              <SelectItem value="delivery">Delivery</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Field Agent</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select agent" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="rajesh">Rajesh Kumar</SelectItem>
                              <SelectItem value="priya">Priya Sharma</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Priority</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={() => setIsAssignTaskOpen(false)} className="w-full">
                          Assign Task
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Clinic & Doctor</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.orderId}</TableCell>
                      <TableCell>
                        <Badge variant={task.type === 'delivery' ? 'default' : 'secondary'}>
                          {task.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{task.clinic}</div>
                        <div className="text-sm text-gray-600">{task.doctor}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{task.address}</div>
                        <div className="text-xs text-gray-500">{task.city}</div>
                      </TableCell>
                      <TableCell>{task.assignedAgent}</TableCell>
                      <TableCell>
                        <span className={getPriorityColor(task.priority)}>
                          {task.priority.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(task.status)}`}>
                          {task.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>{task.scheduledDate}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MapPin className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Field Agents Tab */}
        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Field Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Current Tasks</TableHead>
                    <TableHead>Completed Today</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Efficiency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fieldAgents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell>{agent.phone}</TableCell>
                      <TableCell>{agent.area}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(agent.status)}`}>
                          {agent.status.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>{agent.currentTasks}</TableCell>
                      <TableCell>{agent.completedToday}</TableCell>
                      <TableCell>{agent.location}</TableCell>
                      <TableCell>
                        <span className={agent.efficiency >= 90 ? 'text-green-600' : agent.efficiency >= 80 ? 'text-yellow-600' : 'text-red-600'}>
                          {agent.efficiency}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Courier Partners Tab */}
        <TabsContent value="couriers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Courier Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partner</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Coverage</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Active Shipments</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courierPartners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell>
                        <div className="font-medium">{partner.name}</div>
                        <div className="text-sm text-gray-600">{partner.email}</div>
                      </TableCell>
                      <TableCell>
                        <div>{partner.contactPerson}</div>
                        <div className="text-sm text-gray-600">{partner.phone}</div>
                      </TableCell>
                      <TableCell>{partner.services.join(', ')}</TableCell>
                      <TableCell>{partner.coverage.join(', ')}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1">{partner.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>{partner.activeShipments}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(partner.status)}`}>
                          {partner.status.toUpperCase()}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipment Tracking Tab */}
        <TabsContent value="shipments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shipment Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking Number</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Courier</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dispatch Date</TableHead>
                    <TableHead>Expected Delivery</TableHead>
                    <TableHead>Actual Delivery</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments.map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell className="font-medium">{shipment.trackingNumber}</TableCell>
                      <TableCell>{shipment.orderId}</TableCell>
                      <TableCell>{shipment.courier}</TableCell>
                      <TableCell>{shipment.destination}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(shipment.status)}`}>
                          {shipment.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>{shipment.dispatchDate}</TableCell>
                      <TableCell>{shipment.estimatedDelivery}</TableCell>
                      <TableCell>{shipment.actualDelivery || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeliveryLogisticsPage;
