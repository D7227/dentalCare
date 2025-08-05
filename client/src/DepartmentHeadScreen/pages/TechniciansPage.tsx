import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TechnicianTable from "../components/TechnicianTable";
import { departmentsData } from "../staticData";

const TechniciansPage = () => {
  const { toast } = useToast();
  const [selectedDepartment] = useState("crown-bridge");
  const [technicianSearch, setTechnicianSearch] = useState("");

  const departments = departmentsData;
  const currentDepartment = departments.find(
    (dept) => dept.id === selectedDepartment
  );

  // Filter technicians for search
  const filteredTechnicians =
    currentDepartment?.technicians?.filter(
      (tech) =>
        tech.name.toLowerCase().includes(technicianSearch.toLowerCase()) ||
        tech.specialization
          .toLowerCase()
          .includes(technicianSearch.toLowerCase())
    ) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">Available</Badge>;
      case "busy":
        return <Badge className="bg-yellow-100 text-yellow-800">Busy</Badge>;
      case "on_break":
        return <Badge className="bg-blue-100 text-blue-800">On Break</Badge>;
      case "offline":
        return <Badge className="bg-gray-100 text-gray-800">Offline</Badge>;
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "qa_pending":
        return (
          <Badge className="bg-purple-100 text-purple-800">QA Pending</Badge>
        );
      case "trial_ready":
        return (
          <Badge className="bg-indigo-100 text-indigo-800">Trial Ready</Badge>
        );
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "on_hold":
        return <Badge className="bg-red-100 text-red-800">On Hold</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleSelfAssign = (caseId: string, technicianId: string) => {
    toast({
      title: "Case Assigned",
      description: `Case assigned successfully`,
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between ">
        <h2 className="text-2xl font-bold mb-2">
          Technician ({currentDepartment?.technicians?.length || 0})
        </h2>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search technicians..."
            value={technicianSearch}
            onChange={(e) => setTechnicianSearch(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <TechnicianTable
        data={filteredTechnicians}
        inwardPendingCases={currentDepartment?.inwardPending || []}
        onAssign={handleSelfAssign}
        getStatusBadge={getStatusBadge}
      />
    </div>
  );
};

export default TechniciansPage;
