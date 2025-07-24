
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  Package,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Activity,
  PlusCircle,
  Eye
} from 'lucide-react';
import StatCard from '../../component/StatCard';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Active Users',
      value: '145',
      change: 12,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Total Cases',
      value: '2,847',
      change: 8,
      icon: Package,
      color: 'green'
    },
    {
      title: 'Revenue',
      value: '₹12.4L',
      change: 15,
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Pending Tasks',
      value: '23',
      change: -5,
      icon: Clock,
      color: 'yellow'
    }
  ];

  const recentCases = [
    {
      id: 'ADE-2025-001',
      patient: 'John Doe',
      clinic: 'Smile Dental',
      type: 'Crown & Bridge',
      status: 'in_progress',
      priority: 'high',
      dueDate: '2024-01-15'
    },
    {
      id: 'ADE-2025-002',
      patient: 'Jane Smith',
      clinic: 'Care Dentistry',
      type: 'Orthodontics',
      status: 'qa_pending',
      priority: 'medium',
      dueDate: '2024-01-18'
    },
    {
      id: 'ADE-2025-003',
      patient: 'Mike Johnson',
      clinic: 'Perfect Smile',
      type: 'Implants',
      status: 'completed',
      priority: 'low',
      dueDate: '2024-01-20'
    }
  ];

  const getStatusBadge = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    const variants = {
      'in_progress': 'default' as const,
      'qa_pending': 'secondary' as const,
      'completed': 'default' as const,
      'urgent': 'destructive' as const
    };
    return variants[status as keyof typeof variants] || 'secondary';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'high': 'text-red-600',
      'medium': 'text-yellow-600',
      'low': 'text-green-600'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col"
              onClick={() => handleNavigate('/admin/users')}
            >
              <Users className="h-6 w-6 mb-2" />
              <span className="text-sm">Add User</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col"
              onClick={() => handleNavigate('/admin/orders')}
            >
              <Package className="h-6 w-6 mb-2" />
              <span className="text-sm">New Case</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col"
              onClick={() => handleNavigate('/admin/inventory')}
            >
              <AlertTriangle className="h-6 w-6 mb-2" />
              <span className="text-sm">View Alerts</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col"
              onClick={() => handleNavigate('/admin/reports')}
            >
              <TrendingUp className="h-6 w-6 mb-2" />
              <span className="text-sm">Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Cases */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Cases</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleNavigate('/admin/orders')}
            >
              <Eye className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCases.map((case_) => (
              <div key={case_.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{case_.id}</span>
                    <Badge variant={getStatusBadge(case_.status)}>
                      {case_.status.replace('_', ' ')}
                    </Badge>
                    <span className={`text-sm font-medium ${getPriorityColor(case_.priority)}`}>
                      {case_.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {case_.patient} • {case_.clinic} • {case_.type}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    Due: {case_.dueDate}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigate('/admin/orders')}
                >
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium">Low inventory alert</p>
                <p className="text-xs text-gray-600">Zirconia blocks running low in store</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavigate('/admin/inventory')}
              >
                Resolve
              </Button>
            </div>
            <div className="flex items-center p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium">Overdue cases</p>
                <p className="text-xs text-gray-600">5 cases are past their due date</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavigate('/admin/orders')}
              >
                Review
              </Button>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium">System backup completed</p>
                <p className="text-xs text-gray-600">Daily backup completed successfully</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
