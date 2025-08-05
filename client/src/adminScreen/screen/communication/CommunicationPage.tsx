
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Send, Users, Bell, Search, Plus, Eye } from 'lucide-react';

interface ChatMessage {
  id: string;
  orderId: string;
  sender: string;
  senderRole: string;
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

interface Notification {
  id: string;
  type: 'order_update' | 'payment_due' | 'scan_scheduled' | 'delivery_complete';
  title: string;
  message: string;
  recipients: string[];
  status: 'draft' | 'sent' | 'failed';
  timestamp: string;
  channel: 'email' | 'sms' | 'whatsapp' | 'push';
}

const CommunicationPage = () => {
  const [activeTab, setActiveTab] = useState('chats');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewNotificationOpen, setIsNewNotificationOpen] = useState(false);

  const [chatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      orderId: 'ADE-2025-034',
      sender: 'Dr. Pooja Verma',
      senderRole: 'Doctor',
      message: 'When will the crown be ready for trial?',
      timestamp: '2025-06-04 10:30',
      status: 'read'
    },
    {
      id: '2',
      orderId: 'ADE-2025-034',
      sender: 'Riya Patel',
      senderRole: 'Technician',
      message: 'Trial will be ready by tomorrow evening',
      timestamp: '2025-06-04 11:15',
      status: 'delivered'
    },
    {
      id: '3',
      orderId: 'ADE-2025-035',
      sender: 'Dr. Amit Kumar',
      senderRole: 'Doctor',
      message: 'Please ensure proper bite registration',
      timestamp: '2025-06-04 09:45',
      status: 'read'
    }
  ]);

  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order_update',
      title: 'Order Status Update',
      message: 'Your order ADE-2025-034 is ready for trial',
      recipients: ['Dr. Pooja Verma', 'Clinic Assistant'],
      status: 'sent',
      timestamp: '2025-06-04 12:00',
      channel: 'whatsapp'
    },
    {
      id: '2',
      type: 'payment_due',
      title: 'Payment Reminder',
      message: 'Payment of ₹15,000 is due for invoice INV-2025-123',
      recipients: ['Dr. Rajesh Patel'],
      status: 'sent',
      timestamp: '2025-06-04 11:30',
      channel: 'email'
    },
    {
      id: '3',
      type: 'scan_scheduled',
      title: 'Scan Appointment Confirmed',
      message: 'Scan appointment scheduled for June 6, 2025 at 2:00 PM',
      recipients: ['Dr. Sunita Shah'],
      status: 'draft',
      timestamp: '2025-06-04 13:00',
      channel: 'sms'
    }
  ]);

  const [newNotification, setNewNotification] = useState({
    type: 'order_update',
    title: '',
    message: '',
    recipients: '',
    channel: 'email'
  });

  const filteredChats = chatMessages.filter(chat =>
    chat.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.sender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNotifications = notifications.filter(notification =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'sent': 'bg-green-100 text-green-800',
      'delivered': 'bg-blue-100 text-blue-800',
      'read': 'bg-gray-100 text-gray-800',
      'draft': 'bg-yellow-100 text-yellow-800',
      'failed': 'bg-red-100 text-red-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getChannelBadge = (channel: string) => {
    const channelMap: { [key: string]: string } = {
      'email': 'bg-blue-100 text-blue-800',
      'sms': 'bg-green-100 text-green-800',
      'whatsapp': 'bg-emerald-100 text-emerald-800',
      'push': 'bg-purple-100 text-purple-800'
    };
    return channelMap[channel] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <MessageSquare className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Communication Management</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chats">Order Chats</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Order Chats Tab */}
        <TabsContent value="chats" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Order-based Communications</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search chats..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredChats.map((chat) => (
                    <TableRow key={chat.id}>
                      <TableCell className="font-medium">{chat.orderId}</TableCell>
                      <TableCell>{chat.sender}</TableCell>
                      <TableCell>{chat.senderRole}</TableCell>
                      <TableCell className="max-w-xs truncate">{chat.message}</TableCell>
                      <TableCell>{chat.timestamp}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(chat.status)}`}>
                          {chat.status.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Notification Management</CardTitle>
                <div className="flex space-x-4">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search notifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Dialog open={isNewNotificationOpen} onOpenChange={setIsNewNotificationOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Send Notification
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send New Notification</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="type">Type</Label>
                          <Select value={newNotification.type} onValueChange={(value) => setNewNotification({ ...newNotification, type: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="order_update">Order Update</SelectItem>
                              <SelectItem value="payment_due">Payment Due</SelectItem>
                              <SelectItem value="scan_scheduled">Scan Scheduled</SelectItem>
                              <SelectItem value="delivery_complete">Delivery Complete</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="channel">Channel</Label>
                          <Select value={newNotification.channel} onValueChange={(value) => setNewNotification({ ...newNotification, channel: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="sms">SMS</SelectItem>
                              <SelectItem value="whatsapp">WhatsApp</SelectItem>
                              <SelectItem value="push">Push Notification</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={newNotification.title}
                            onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                            placeholder="Enter notification title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            value={newNotification.message}
                            onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                            placeholder="Enter notification message"
                          />
                        </div>
                        <div>
                          <Label htmlFor="recipients">Recipients (comma-separated)</Label>
                          <Input
                            id="recipients"
                            value={newNotification.recipients}
                            onChange={(e) => setNewNotification({ ...newNotification, recipients: e.target.value })}
                            placeholder="Enter recipient emails or names"
                          />
                        </div>
                        <Button onClick={() => setIsNewNotificationOpen(false)} className="w-full">
                          <Send className="h-4 w-4 mr-2" />
                          Send Notification
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
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell>{notification.type.replace('_', ' ').toUpperCase()}</TableCell>
                      <TableCell className="font-medium">{notification.title}</TableCell>
                      <TableCell className="max-w-xs truncate">{notification.message}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getChannelBadge(notification.channel)}`}>
                          {notification.channel.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>{notification.recipients.join(', ')}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(notification.status)}`}>
                          {notification.status.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>{notification.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Template Management</h3>
                <p className="text-gray-600 mb-4">
                  Manage notification templates for different communication scenarios
                </p>
                <Button onClick={() => window.location.href = '/admin/masters/notification-templates'}>
                  <Plus className="h-4 w-4 mr-2" />
                  Manage Templates
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunicationPage;
