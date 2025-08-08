import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Calendar,
  Filter,
  RefreshCw
} from "lucide-react";

interface QuickActionsProps {
  onRefresh: () => void;
  onFilterUrgent: () => void;
  onViewToday: () => void;
  urgentCount: number;
  todayCount: number;
}

export default function QuickActions({ 
  onRefresh, 
  onFilterUrgent, 
  onViewToday, 
  urgentCount, 
  todayCount 
}: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="h-auto p-4 flex flex-col items-center gap-2"
            onClick={onRefresh}
          >
            <RefreshCw className="h-5 w-5" />
            <span className="text-sm">Refresh Tasks</span>
          </Button>

          <Button 
            variant="outline" 
            className="h-auto p-4 flex flex-col items-center gap-2"
            onClick={onFilterUrgent}
          >
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="text-sm">Urgent Tasks</span>
            {urgentCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {urgentCount}
              </Badge>
            )}
          </Button>

          <Button 
            variant="outline" 
            className="h-auto p-4 flex flex-col items-center gap-2"
            onClick={onViewToday}
          >
            <Calendar className="h-5 w-5 text-blue-500" />
            <span className="text-sm">Today's Tasks</span>
            {todayCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {todayCount}
              </Badge>
            )}
          </Button>

          <Button 
            variant="outline" 
            className="h-auto p-4 flex flex-col items-center gap-2"
          >
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm">Advanced Filter</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 