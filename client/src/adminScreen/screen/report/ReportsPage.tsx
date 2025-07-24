
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, TrendingUp, Users, Package, DollarSign } from 'lucide-react';

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState('last_30_days');

  // Mock data for charts
  const performanceData = [
    { name: 'Riya Patel', completed: 45, pending: 8, rework: 2 },
    { name: 'Anita Gupta', completed: 38, pending: 12, rework: 3 },
    { name: 'Karan Singh', completed: 42, pending: 6, rework: 1 },
    { name: 'Dr. Pooja', completed: 35, pending: 10, rework: 4 },
    { name: 'Vikram P.', completed: 28, pending: 15, rework: 5 }
  ];

  const monthlyRevenueData = [
    { month: 'Jan', revenue: 125000, cases: 89 },
    { month: 'Feb', revenue: 142000, cases: 95 },
    { month: 'Mar', revenue: 138000, cases: 102 },
    { month: 'Apr', revenue: 156000, cases: 108 },
    { month: 'May', revenue: 178000, cases: 115 },
    { month: 'Jun', revenue: 165000, cases: 98 }
  ];

  const clinicVolumeData = [
    { name: 'Smile Care Dental', cases: 45, value: 180000 },
    { name: 'Perfect Smile', cases: 38, value: 152000 },
    { name: 'Care Plus Dental', cases: 32, value: 128000 },
    { name: 'Bright Smile', cases: 28, value: 112000 },
    { name: 'Modern Dentistry', cases: 25, value: 98000 }
  ];

  const casesStatusData = [
    { name: 'Completed', value: 65, color: '#10B981' },
    { name: 'In Progress', value: 20, color: '#3B82F6' },
    { name: 'QA Pending', value: 10, color: '#F59E0B' },
    { name: 'Rework', value: 5, color: '#EF4444' }
  ];

  const departmentData = [
    { department: 'Crown & Bridge', cases: 125, revenue: 450000 },
    { department: 'Orthodontics', cases: 89, revenue: 312000 },
    { department: 'Implants', cases: 67, revenue: 289000 },
    { department: 'Prosthodontics', cases: 45, revenue: 178000 }
  ];

  const chartConfig = {
    completed: {
      label: "Completed",
      color: "#10B981",
    },
    pending: {
      label: "Pending",
      color: "#F59E0B",
    },
    rework: {
      label: "Rework",
      color: "#EF4444",
    },
    revenue: {
      label: "Revenue",
      color: "#3B82F6",
    },
    cases: {
      label: "Cases",
      color: "#8B5CF6",
    },
  };

  const downloadReport = (type: string) => {
    console.log(`Downloading ${type} report...`);
    // In real app, this would generate and download the report
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Reports & Analytics</h2>
        </div>

        <div className="flex space-x-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_7_days">Last 7 Days</SelectItem>
              <SelectItem value="last_30_days">Last 30 Days</SelectItem>
              <SelectItem value="last_3_months">Last 3 Months</SelectItem>
              <SelectItem value="last_6_months">Last 6 Months</SelectItem>
              <SelectItem value="last_year">Last Year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => downloadReport('comprehensive')}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Technician Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Technician Task Completion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="completed" stackId="a" fill="var(--color-completed)" />
                      <Bar dataKey="pending" stackId="a" fill="var(--color-pending)" />
                      <Bar dataKey="rework" stackId="a" fill="var(--color-rework)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Cases Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Cases Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={casesStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {casesStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar yAxisId="left" dataKey="cases" fill="var(--color-cases)" />
                    <Bar yAxisId="right" dataKey="revenue" fill="var(--color-revenue)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Monthly Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="var(--color-revenue)"
                        strokeWidth={3}
                        dot={{ fill: "var(--color-revenue)", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Top Clinics by Revenue */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Top 5 Clinics by Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={clinicVolumeData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis
                        dataKey="name"
                        type="category"
                        tick={{ fontSize: 12 }}
                        width={120}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="cases" fill="var(--color-cases)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">₹12.4L</div>
                  <div className="text-sm text-blue-600">Total Revenue</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">₹8.7L</div>
                  <div className="text-sm text-green-600">Collected</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">₹3.7L</div>
                  <div className="text-sm text-yellow-600">Pending</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">326</div>
                  <div className="text-sm text-purple-600">Total Cases</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Cases Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Cases Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="cases"
                        stroke="var(--color-cases)"
                        strokeWidth={3}
                        dot={{ fill: "var(--color-cases)", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Clinic Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Clinic Engagement Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clinicVolumeData.map((clinic, index) => (
                    <div key={clinic.name} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{clinic.name}</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(clinic.cases / 50) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="ml-4 text-sm font-medium">{clinic.cases} cases</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Download Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Report Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  onClick={() => downloadReport('performance')}
                  className="h-20 flex flex-col"
                >
                  <FileText className="h-6 w-6 mb-2" />
                  <span>Performance Report</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => downloadReport('financial')}
                  className="h-20 flex flex-col"
                >
                  <DollarSign className="h-6 w-6 mb-2" />
                  <span>Financial Report</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => downloadReport('engagement')}
                  className="h-20 flex flex-col"
                >
                  <TrendingUp className="h-6 w-6 mb-2" />
                  <span>Engagement Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
