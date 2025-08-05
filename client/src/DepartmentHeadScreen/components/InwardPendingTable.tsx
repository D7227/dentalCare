import React from "react";
import CommonTable from "@/components/common/CommonTable";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGetDepartmentHeadInwardPendingQuery } from "@/store/slices/departmentHeadSlice/departmentHeadApi";

interface InwardPendingCase {
  id: string;
  caseNumber: string;
  caseType: string;
  clinicName: string;
  patientName: string;
  doctorName: string;
  priority: string;
  dueDate: string;
  [key: string]: any;
}

interface Technician {
  id: string;
  name: string;
}

interface InwardPendingTableProps {
  // data: InwardPendingCase[];
  // technicians: Technician[];
  onPriorityChange: (caseNumber: string, newPriority: string) => void;
  onAssign: (caseId: string, technicianId: string) => void;
  onViewDetails: (caseData: InwardPendingCase) => void;
  onChatOpen: (caseNumber: string, caseType: string) => void;
  getPriorityIcon: (priority: string) => React.ReactNode;
  selectedDepartmentId: any;
}

const technicians = [
  {
    id: "T001",
    name: "Riya Patel",
    email: "riya.patel@adelabs.com",
    department: "Crown & Bridge",
    specialization: "Ceramic Crowns",
    experience: "5 years",
    status: "busy",
    currentCases: 3,
    assignments: [
      {
        id: "A001",
        caseId: "ADE-2025-034",
        caseNumber: "ADE-2025-034",
        doctorName: "Dr. Pooja Verma",
        clinicName: "Smile Care Dental",
        patientName: "Rahul Sharma",
        caseType: "Crown",
        priority: "high",
        status: "in_progress",
        assignedDate: "2025-06-01",
        dueDate: "2025-06-06",
        estimatedCompletion: "2025-06-05",
        notes: "Patient prefers ceramic material",
        technicianId: "T001",
        technicianName: "Riya Patel",
        logs: [],
        digitalFiles: [],
        products: [],
        accessories: [],
      },
    ],
  },
  {
    id: "T002",
    name: "Anita Gupta",
    email: "anita.gupta@adelabs.com",
    department: "Crown & Bridge",
    specialization: "Zirconia Crowns",
    experience: "7 years",
    status: "available",
    currentCases: 1,
    assignments: [],
  },
];

const InwardPendingTable: React.FC<InwardPendingTableProps> = ({
  // data,
  // technicians,
  onPriorityChange,
  onAssign,
  onViewDetails,
  onChatOpen,
  getPriorityIcon,
  selectedDepartmentId,
}) => {
  const { toast } = useToast();

  const {
    data: InwardPendingData,
    isLoading,
    error,
  } = useGetDepartmentHeadInwardPendingQuery({
    departmentId: selectedDepartmentId || "",
    page: 1,
    limit: 10,
  });

  console.group("InwardPendingData");
  console.log("isLoading", isLoading);
  console.log("error", error);
  console.log("InwardPendingData", InwardPendingData);
  console.groupEnd();

  const columns = [
    {
      key: "caseDetails",
      title: "Case Details",
      render: (row: InwardPendingCase) => (
        <div>
          <div className="font-medium">{row.orderNumber}</div>
          <div className="text-sm text-gray-500">
            {row.prescriptionTypesId[0]}
          </div>
          <div className="text-xs text-gray-400">{row.clinicName}</div>
        </div>
      ),
    },
    {
      key: "patientDoctor",
      title: "Patient/Doctor",
      render: (row: InwardPendingCase) => (
        <div>
          <div className="font-medium">{row.patientName}</div>
          <div className="text-sm text-gray-500">{row.doctorName}</div>
        </div>
      ),
    },
    {
      key: "priority",
      title: "Priority",
      render: (row: InwardPendingCase) => (
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
      key: "dueDate",
      title: "Due Date",
      render: (row: InwardPendingCase) => (
        <div
          className={
            row.dueDate < "2025-06-08" ? "text-red-600 font-semibold" : ""
          }
        >
          {row.dueDate}
        </div>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (row: InwardPendingCase) => (
        <div className="flex items-center space-x-2">
          <Select
            onValueChange={(technicianId) => onAssign(row.id, technicianId)}
          >
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue placeholder="Assign to..." />
            </SelectTrigger>
            <SelectContent>
              {technicians.map((tech) => (
                <SelectItem key={tech.id} value={tech.id}>
                  {tech.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
    <CommonTable
      columns={columns}
      data={InwardPendingData?.data || []}
      emptyText="No inward pending cases"
    />
  );
};

export default InwardPendingTable;
