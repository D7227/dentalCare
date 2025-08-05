import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Settings,
  Building2,
  Mail,
  Phone,
  Globe,
  Database,
  Shield,
  Bell,
  Palette,
  Clock,
  MapPin,
  CreditCard,
  FileText,
  Truck,
  Users,
  Zap,
  Save,
  RefreshCw,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Server
} from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('company');

  // Company settings state
  const [companySettings, setCompanySettings] = useState({
    name: 'Advance Dental Lab',
    email: 'info@advancedental.com',
    phone: '+91 98765 43210',
    address: '123 Dental Street, Mumbai, Maharashtra 400001',
    website: 'www.advancedental.com',
    gst: 'GST123456789',
    logo: null,
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    businessHours: {
      start: '09:00',
      end: '18:00',
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    }
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    caseUpdates: true,
    paymentReminders: true,
    deliveryAlerts: true,
    systemMaintenance: true,
    weeklyReports: false
  });

  // Integration settings
  const [integrations, setIntegrations] = useState({
    iciciGateway: {
      enabled: true,
      merchantId: 'MERCHANT123',
      status: 'connected'
    },
    emailProvider: {
      enabled: true,
      provider: 'smtp',
      status: 'connected'
    },
    smsProvider: {
      enabled: false,
      provider: 'twilio',
      status: 'disconnected'
    },
    courierService: {
      enabled: true,
      provider: 'bluedart',
      status: 'connected'
    }
  });

  const handleSaveSettings = (category: string) => {
    console.log(`Saving ${category} settings...`);
    // In real app, this would save to backend
  };

  const handleBackupData = () => {
    console.log('Creating system backup...');
  };

  const handleRestoreData = () => {
    console.log('Restoring from backup...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Settings className="h-6 w-6" />
          <h2 className="text-2xl font-bold">System Settings</h2>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleBackupData}>
            <Download className="h-4 w-4 mr-2" />
            Backup Data
          </Button>
          <Button variant="outline" onClick={handleRestoreData}>
            <Upload className="h-4 w-4 mr-2" />
            Restore
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        {/* Company Settings */}
        <TabsContent value="company" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={companySettings.name}
                    onChange={(e) => setCompanySettings({ ...companySettings, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={companySettings.email}
                    onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={companySettings.phone}
                    onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={companySettings.address}
                    onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={companySettings.website}
                    onChange={(e) => setCompanySettings({ ...companySettings, website: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gst">GST Number</Label>
                  <Input
                    id="gst"
                    value={companySettings.gst}
                    onChange={(e) => setCompanySettings({ ...companySettings, gst: e.target.value })}
                  />
                </div>

                <Button onClick={() => handleSaveSettings('company')} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Company Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Regional Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={companySettings.timezone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={companySettings.currency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select value={companySettings.dateFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-base font-semibold">Business Hours</Label>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={companySettings.businessHours.start}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={companySettings.businessHours.end}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Working Days</Label>
                    <div className="flex flex-wrap gap-2">
                      {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                        <Badge
                          key={day}
                          variant={companySettings.businessHours.workingDays.includes(day) ? "default" : "outline"}
                          className="cursor-pointer"
                        >
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    checked={notifications.smsNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, smsNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Push Notifications</Label>
                    <p className="text-sm text-gray-600">Browser push notifications</p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-base font-semibold">Event Notifications</Label>

                  <div className="flex items-center justify-between">
                    <Label>Case Updates</Label>
                    <Switch
                      checked={notifications.caseUpdates}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, caseUpdates: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Payment Reminders</Label>
                    <Switch
                      checked={notifications.paymentReminders}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, paymentReminders: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Delivery Alerts</Label>
                    <Switch
                      checked={notifications.deliveryAlerts}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, deliveryAlerts: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>System Maintenance</Label>
                    <Switch
                      checked={notifications.systemMaintenance}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, systemMaintenance: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Weekly Reports</Label>
                    <Switch
                      checked={notifications.weeklyReports}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Email Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input id="smtpHost" placeholder="smtp.gmail.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input id="smtpPort" placeholder="587" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">Username</Label>
                  <Input id="smtpUsername" placeholder="noreply@advancedental.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">Password</Label>
                  <Input id="smtpPassword" type="password" placeholder="••••••••" />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="smtpSsl" />
                  <Label htmlFor="smtpSsl">Use SSL/TLS</Label>
                </div>

                <Button variant="outline" className="w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  Test Connection
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Gateway
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">ICICI Payment Gateway</Label>
                    <p className="text-sm text-gray-600">Process online payments</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={integrations.iciciGateway.status === 'connected' ? 'default' : 'destructive'}>
                      {integrations.iciciGateway.status}
                    </Badge>
                    <Switch checked={integrations.iciciGateway.enabled} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="merchantId">Merchant ID</Label>
                  <Input
                    id="merchantId"
                    value={integrations.iciciGateway.merchantId}
                    placeholder="Enter merchant ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="merchantKey">Merchant Key</Label>
                  <Input
                    id="merchantKey"
                    type="password"
                    placeholder="••••••••••••••••"
                  />
                </div>

                <Button variant="outline" className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Test Gateway
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Courier Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Blue Dart Courier</Label>
                    <p className="text-sm text-gray-600">Automated shipping & tracking</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={integrations.courierService.status === 'connected' ? 'default' : 'destructive'}>
                      {integrations.courierService.status}
                    </Badge>
                    <Switch checked={integrations.courierService.enabled} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courierApiKey">API Key</Label>
                  <Input
                    id="courierApiKey"
                    type="password"
                    placeholder="••••••••••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courierAccountId">Account ID</Label>
                  <Input
                    id="courierAccountId"
                    placeholder="Enter account ID"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  SMS Service
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">SMS Provider</Label>
                    <p className="text-sm text-gray-600">Send SMS notifications</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={integrations.smsProvider.status === 'connected' ? 'default' : 'destructive'}>
                      {integrations.smsProvider.status}
                    </Badge>
                    <Switch checked={integrations.smsProvider.enabled} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smsProvider">Provider</Label>
                  <Select value={integrations.smsProvider.provider}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select SMS provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="textlocal">TextLocal</SelectItem>
                      <SelectItem value="msg91">MSG91</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smsApiKey">API Key</Label>
                  <Input
                    id="smsApiKey"
                    type="password"
                    placeholder="••••••••••••••••"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Data Sync
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Auto Backup</Label>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Cloud Sync</Label>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Real-time Updates</Label>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Backup Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Policies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-600">Require 2FA for all users</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Password Complexity</Label>
                      <p className="text-sm text-gray-600">Enforce strong passwords</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Session Timeout</Label>
                      <p className="text-sm text-gray-600">Auto logout after inactivity</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Login Attempt Limit</Label>
                      <p className="text-sm text-gray-600">Lock account after failed attempts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input defaultValue="30" type="number" />
                </div>

                <div className="space-y-2">
                  <Label>Max Login Attempts</Label>
                  <Input defaultValue="5" type="number" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Security Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-medium text-green-800">System Security Status: Good</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">Last security scan: 2 hours ago</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">SSL Certificate</span>
                      <Badge variant="default">Valid</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Firewall Status</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Backup Encryption</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Run Security Scan
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="h-5 w-5 mr-2" />
                  System Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="font-medium">Application Version</Label>
                    <p className="text-gray-600">v2.1.4</p>
                  </div>
                  <div>
                    <Label className="font-medium">Database Version</Label>
                    <p className="text-gray-600">PostgreSQL 14.2</p>
                  </div>
                  <div>
                    <Label className="font-medium">Server Uptime</Label>
                    <p className="text-gray-600">15 days, 8 hours</p>
                  </div>
                  <div>
                    <Label className="font-medium">Last Update</Label>
                    <p className="text-gray-600">2024-01-10</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="font-medium">Performance Metrics</Label>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU Usage</span>
                      <span>45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage</span>
                      <span>68%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Storage Usage</span>
                      <span>34%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '34%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  System Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear System Cache
                  </Button>

                  <Button variant="outline" className="w-full justify-start">
                    <Database className="h-4 w-4 mr-2" />
                    Optimize Database
                  </Button>

                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate System Report
                  </Button>

                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export Logs
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Maintenance Mode</Label>
                  <div className="flex items-center space-x-2">
                    <Switch />
                    <span className="text-sm text-gray-600">Enable maintenance mode</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    This will show a maintenance page to all users except administrators
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Backup Settings */}
        <TabsContent value="backup" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="h-5 w-5 mr-2" />
                  Backup Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Automatic Backups</Label>
                    <Switch defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label>Backup Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Every Hour</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Backup Time</Label>
                    <Input type="time" defaultValue="02:00" />
                  </div>

                  <div className="space-y-2">
                    <Label>Retention Period (days)</Label>
                    <Input type="number" defaultValue="30" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="font-medium">Backup Components</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox defaultChecked />
                      <Label>Database</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox defaultChecked />
                      <Label>User Files</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox defaultChecked />
                      <Label>System Configuration</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox />
                      <Label>Application Logs</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Recent Backups
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Full System Backup</p>
                      <p className="text-sm text-gray-600">2024-01-15 02:00 AM</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">Complete</Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Database Backup</p>
                      <p className="text-sm text-gray-600">2024-01-14 02:00 AM</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">Complete</Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Full System Backup</p>
                      <p className="text-sm text-gray-600">2024-01-13 02:00 AM</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">Complete</Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button onClick={handleBackupData} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Create Backup Now
                  </Button>

                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Restore from Backup
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
