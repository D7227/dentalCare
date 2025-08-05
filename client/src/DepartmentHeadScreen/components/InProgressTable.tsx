import React from 'react';
import CommonTable from '@/components/common/CommonTable';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, MessageSquare, CheckCircle } from 'lucide-react';

interface InProgressCase {
  id: string;
  caseNumber: string;
  caseType: string;
  clinicName: string;
  patientName: string;
  doctorName: string;
  technicianName: string;
  priority: string;
  dueDate: string;
  technicianId: string;
  [key: string]: any;
}

interface InProgressTableProps {
  data: InProgressCase[];
  onPriorityChange: (caseNumber: string, newPriority: string) => void;
  onCompleteTask: (assignmentId: string, technicianId: string) => void;
  onViewDetails: (caseData: InProgressCase) => void;
  onChatOpen: (caseId: string, caseType: string) => void;
  getPriorityIcon: (priority: string) => React.ReactNode;
}

const InProgressTable: React.FC<InProgressTableProps> = ({
  data,
  onPriorityChange,
  onCompleteTask,
  onViewDetails,
  onChatOpen,
  getPriorityIcon,
}) => {
  const columns = [
    {
      key: 'caseDetails',
      title: 'Case Details',
      render: (row: InProgressCase) => (
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
      render: (row: InProgressCase) => (
        <div>
          <div className="font-medium">{row.patientName}</div>
          <div className="text-sm text-gray-500">{row.doctorName}</div>
        </div>
      ),
    },
    {
      key: 'technicianName',
      title: 'Technician',
      render: (row: InProgressCase) => (
        <div className="font-medium">{row.technicianName}</div>
      ),
    },
    {
      key: 'priority',
      title: 'Priority',
      render: (row: InProgressCase) => (
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
      key: 'dueDate',
      title: 'Due Date',
      render: (row: InProgressCase) => (
        <div className={row.dueDate < '2025-06-08' ? 'text-red-600 font-semibold' : ''}>
          {row.dueDate}
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (row: InProgressCase) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCompleteTask(row.id, row.technicianId)}
            title="Complete Task"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Complete
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
            onClick={() => onChatOpen(row.caseId, row.caseType)}
            title="Case Chat"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <CommonTable columns={columns} data={data} emptyText="No cases in progress" />
  );
};

export default InProgressTable; 