import React from 'react';
import CommonTable from '@/components/common/CommonTable';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, MessageSquare, ArrowRight } from 'lucide-react';

interface WaitingInwardCase {
  id: string;
  caseNumber: string;
  caseType: string;
  clinicName: string;
  patientName: string;
  doctorName: string;
  priority: string;
  expectedDate: string;
  [key: string]: any;
}

interface WaitingInwardTableProps {
  data: WaitingInwardCase[];
  onPriorityChange: (caseNumber: string, newPriority: string) => void;
  onMakeInward: (waitingCaseId: string) => void;
  onViewDetails: (caseData: WaitingInwardCase) => void;
  onChatOpen: (caseNumber: string, caseType: string) => void;
  getPriorityIcon: (priority: string) => React.ReactNode;
}

const WaitingInwardTable: React.FC<WaitingInwardTableProps> = ({
  data,
  onPriorityChange,
  onMakeInward,
  onViewDetails,
  onChatOpen,
  getPriorityIcon,
}) => {
  const columns = [
    {
      key: 'caseDetails',
      title: 'Case Details',
      render: (row: WaitingInwardCase) => (
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
      render: (row: WaitingInwardCase) => (
        <div>
          <div className="font-medium">{row.patientName}</div>
          <div className="text-sm text-gray-500">{row.doctorName}</div>
        </div>
      ),
    },
    {
      key: 'priority',
      title: 'Priority',
      render: (row: WaitingInwardCase) => (
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
      key: 'expectedDate',
      title: 'Expected Date',
      render: (row: WaitingInwardCase) => (
        <div className={row.expectedDate < '2025-06-08' ? 'text-red-600 font-semibold' : ''}>
          {row.expectedDate}
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (row: WaitingInwardCase) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMakeInward(row.id)}
            title="Make Inward"
          >
            <ArrowRight className="h-4 w-4 mr-1" />
            Make Inward
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
    <CommonTable columns={columns} data={data} emptyText="No cases waiting to be inward" />
  );
};

export default WaitingInwardTable; 