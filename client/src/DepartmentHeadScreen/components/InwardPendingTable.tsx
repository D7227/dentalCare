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
  firstName: string;
  lastName: string;
  departmentId: string;
}

interface InwardPendingTableProps {
  onActions: (row: any, value: any, type: string) => void;
  onViewDetails: (caseData: InwardPendingCase) => void;
  onChatOpen: (caseNumber: string, caseType: string) => void;
  getPriorityIcon: (priority: string) => React.ReactNode;
  selectedDepartmentId: any;
  technicians: Technician[];
}

const InwardPendingTable: React.FC<InwardPendingTableProps> = ({
  onActions,
  onViewDetails,
  onChatOpen,
  getPriorityIcon,
  selectedDepartmentId,
  technicians,
}) => {
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
            onValueChange={(value) => onActions(row, value, "priority")}
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
            onValueChange={(technicianId) =>
              onActions(row, technicianId, "assignTechnician")
            }
            disabled={technicians.length === 0}
          >
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue
                placeholder={
                  technicians.length === 0 ? "No technicians" : "Assign to..."
                }
              />
            </SelectTrigger>
            <SelectContent>
              {technicians.map((tech) => (
                <SelectItem key={tech.id} value={tech.id}>
                  {tech.firstName} {tech.lastName}
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
