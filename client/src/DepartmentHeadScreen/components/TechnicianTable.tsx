import React from 'react';
import CommonTable from '@/components/common/CommonTable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Technician {
  id: string;
  name: string;
  email: string;
  specialization: string;
  experience: string;
  status: string;
  currentCases: number;
  [key: string]: any;
}

interface InwardPendingCase {
  id: string;
  caseNumber: string;
}

interface TechnicianTableProps {
  data: Technician[];
  inwardPendingCases: InwardPendingCase[];
  onAssign: (caseId: string, technicianId: string) => void;
  getStatusBadge: (status: string) => React.ReactNode;
}

const TechnicianTable: React.FC<TechnicianTableProps> = ({
  data,
  inwardPendingCases,
  onAssign,
  getStatusBadge,
}) => {
  const columns = [
    {
      key: 'name',
      title: 'Name',
      render: (row: Technician) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      ),
    },
    {
      key: 'specialization',
      title: 'Specialization',
      render: (row: Technician) => row.specialization,
    },
    {
      key: 'experience',
      title: 'Experience',
      render: (row: Technician) => row.experience,
    },
    {
      key: 'status',
      title: 'Status',
      render: (row: Technician) => getStatusBadge(row.status),
    },
    {
      key: 'currentCases',
      title: 'Current Cases',
      render: (row: Technician) => (
        <div className="text-center">
          <span className="text-lg font-bold">{row.currentCases}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (row: Technician) => (
        <div className="flex items-center space-x-2">
          <Select
            onValueChange={(caseId) => onAssign(caseId, row.id)}
          >
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue placeholder="Assign case..." />
            </SelectTrigger>
            <SelectContent>
              {inwardPendingCases.map((inwardCase) => (
                <SelectItem key={inwardCase.id} value={inwardCase.id}>
                  {inwardCase.caseNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ),
    },
  ];

  return (
    <CommonTable columns={columns} data={data} emptyText="No technicians found" />
  );
};

export default TechnicianTable; 