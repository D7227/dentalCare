import React from 'react';
import CommonTable from '@/components/common/CommonTable';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, MessageSquare, Package } from 'lucide-react';

interface OutwardPendingCase {
  id: string;
  caseNumber: string;
  caseType: string;
  clinicName: string;
  patientName: string;
  doctorName: string;
  technicianName: string;
  priority: string;
  completedDate: string;
  [key: string]: any;
}

interface OutwardPendingTableProps {
  data: OutwardPendingCase[];
  onPriorityChange: (caseNumber: string, newPriority: string) => void;
  onMakeOutward: (outwardCaseId: string) => void;
  onViewDetails: (caseData: OutwardPendingCase) => void;
  onChatOpen: (caseNumber: string, caseType: string) => void;
  getPriorityIcon: (priority: string) => React.ReactNode;
}

const OutwardPendingTable: React.FC<OutwardPendingTableProps> = ({
  data,
  onPriorityChange,
  onMakeOutward,
  onViewDetails,
  onChatOpen,
  getPriorityIcon,
}) => {
  const columns = [
    {
      key: 'caseDetails',
      title: 'Case Details',
      render: (row: OutwardPendingCase) => (
        <div>
          <div className="font-medium">{row.caseNumber}</div>
          <div className="text-sm text-gray-500">{row.caseType}</div>
          <div className="text-xs text-gray-400">{row.clinicName}</div>
        </div>
      ),
    },
    {
      key: 'patientDoctor',
      title: 'Patient/Doctor',
      render: (row: OutwardPendingCase) => (
        <div>
          <div className="font-medium">{row.patientName}</div>
          <div className="text-sm text-gray-500">{row.doctorName}</div>
        </div>
      ),
    },
    {
      key: 'technicianName',
      title: 'Technician',
      render: (row: OutwardPendingCase) => (
        <div className="font-medium">{row.technicianName}</div>
      ),
    },
    {
      key: 'priority',
      title: 'Priority',
      render: (row: OutwardPendingCase) => (
        <div className="flex items-center space-x-2">
          {getPriorityIcon(row.priority)}
          <Select
            value={row.priority}
            onValueChange={(value) => onPriorityChange(row.caseNumber, value)}
          >
            <SelectTrigger className="w-[100px] h-8">
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
      ),
    },
    {
      key: 'completedDate',
      title: 'Completed Date',
      render: (row: OutwardPendingCase) => row.completedDate,
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (row: OutwardPendingCase) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMakeOutward(row.id)}
            title="Process Outward"
          >
            <Package className="h-4 w-4 mr-1" />
            Make Outward
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(row)}
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChatOpen(row.caseNumber, row.caseType)}
            title="Case Chat"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <CommonTable columns={columns} data={data} emptyText="No outward pending cases" />
  );
};

export default OutwardPendingTable; 