
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  color?: string;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color = 'blue',
  description
}) => {
  const getChangeColor = (change?: number) => {
    if (!change) return '';
    return change > 0 ? 'text-green-600' : 'text-red-600';
  };

  const getIconBg = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      red: 'bg-red-100 text-red-600',
      purple: 'bg-purple-100 text-purple-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${getIconBg(color)}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
        {change !== undefined && (
          <div className="flex items-center mt-2">
            <Badge
              variant={change > 0 ? "default" : "destructive"}
              className="text-xs"
            >
              {change > 0 ? '+' : ''}{change}%
            </Badge>
            <span className="text-xs text-gray-600 ml-2">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
