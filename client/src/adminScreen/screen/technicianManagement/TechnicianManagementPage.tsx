import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Users,
  Building2,
  Filter,
  TrendingUp,
} from "lucide-react";
import CommonTable from "@/components/common/CommonTable";
import CommonModal from "@/components/common/CommonModal";
import TechnicianForm from "./TechnicianForm";
import { useToast } from "@/hooks/use-toast";
import {
  useGetTechniciansQuery,
  useCreateTechnicianMutation,
  //   useUpdateTechnicianMutation,
  useDeleteTechnicianMutation,
  useGetDepartmentsQuery,
  //   useGetTechnicianStatsQuery,
  type Technician,
  type Department,
  type CreateTechnicianRequest,
  type UpdateTechnicianRequest,
} from "@/store/slices/technicianApi";

const TechnicianManagementPage = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] =
    useState<Technician | null>(null);
  const { toast } = useToast();

  // API hooks
  const { data: techniciansData = [], isLoading: techniciansLoading } =
    useGetTechniciansQuery();
  const { data: departmentsData = [], isLoading: departmentsLoading } =
    useGetDepartmentsQuery();
  //   const { data: statsData } = useGetTechnicianStatsQuery();
  const [createTechnician] = useCreateTechnicianMutation();
  //   const [updateTechnician] = useUpdateTechnicianMutation();
  const [deleteTechnician] = useDeleteTechnicianMutation();

  // Update local state when API data changes
  useEffect(() => {
    if (techniciansData) {
      setTechnicians(techniciansData);
    }
  }, [techniciansData]);

  useEffect(() => {
    if (departmentsData) {
      setDepartments(departmentsData);
    }
  }, [departmentsData]);

  const filteredTechnicians = technicians.filter((technician) => {
    const matchesSearch =
      technician.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      technician.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      technician.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      technician.employeeId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "all" ||
      technician.departmentId === selectedDepartment;
    const matchesStatus =
      selectedStatus === "all" || technician.status === selectedStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleAddTechnician = () => {
    setIsAddModalOpen(true);
  };

  const handleEditTechnician = (technician: Technician) => {
    setSelectedTechnician(technician);
    setIsEditModalOpen(true);
  };

  const handleDeleteTechnician = async (technicianId: string) => {
    try {
      await deleteTechnician(technicianId).unwrap();
      toast({
        title: "Technician deleted",
        description: "Technician has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete technician. Please try again.",
        variant: "destructive",
      });
    }
  };

  const tableColumns = [
    {
      key: "name",
      title: "Name",
      render: (row: Technician) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            {row.profilePic ? (
              <img
                src={row.profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <span className="text-sm font-medium">
                {row.firstName.charAt(0)}
                {row.lastName.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <div className="font-medium">
              {row.firstName} {row.lastName}
            </div>
            <div className="text-sm text-gray-500">{row.employeeId}</div>
          </div>
        </div>
      ),
    },
    {
      key: "department",
      title: "Department",
      render: (row: Technician) => (
        <div>
          <div className="font-medium">{row.departmentName}</div>
        </div>
      ),
    },
    {
      key: "contact",
      title: "Contact",
      render: (row: Technician) => (
        <div>
          <div className="font-medium">{row.email}</div>
          <div className="text-sm text-gray-500">{row.mobileNumber}</div>
        </div>
      ),
    },
    {
      key: "role",
      title: "Role",
      render: (row: Technician) => (
        <div>
          <div className="font-medium">{row.roleName}</div>
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (row: Technician) => (
        <Badge variant={row.status === "active" ? "default" : "secondary"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (row: Technician) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditTechnician(row)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteTechnician(row.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Technician Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage technicians across all departments
          </p>
        </div>
        <Button
          onClick={handleAddTechnician}
          className="flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          Add Technician
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Technicians
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {/* {techniciansLoading
                  ? "..."
                  : statsData?.total || technicians.length} */}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {/* {techniciansLoading
                  ? "..."
                  : statsData?.active ||
                    technicians.filter((t) => t.status === "active").length} */}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Building2 className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900">
                {departmentsLoading ? "..." : departments.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg per Dept</p>
              <p className="text-2xl font-bold text-gray-900">
                {techniciansLoading || departmentsLoading
                  ? "..."
                  : departments.length > 0
                  ? (technicians.length / departments.length).toFixed(1)
                  : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search technicians by name, email, or employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select
          value={selectedDepartment}
          onValueChange={setSelectedDepartment}
        >
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Technicians Table */}
      <h2 className="text-lg font-semibold text-gray-900">
        Technicians ({filteredTechnicians.length})
      </h2>

      {techniciansLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-3 text-gray-600">Loading technicians...</p>
          </div>
        </div>
      ) : (
        <CommonTable data={filteredTechnicians} columns={tableColumns} />
      )}

      {/* Add Technician Modal */}
      <CommonModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        title="Add New Technician"
      >
        <TechnicianForm
          onSubmit={async (data) => {
            try {
              await createTechnician(data as CreateTechnicianRequest).unwrap();
              setIsAddModalOpen(false);
              toast({
                title: "Technician added",
                description: "New technician has been successfully added.",
              });
            } catch (error) {
              toast({
                title: "Error",
                description: "Failed to add technician. Please try again.",
                variant: "destructive",
              });
            }
          }}
          departments={departments}
        />
      </CommonModal>

      {/* Edit Technician Modal */}
      <CommonModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Edit Technician"
      >
        {selectedTechnician && (
          <TechnicianForm
            technician={selectedTechnician}
            onSubmit={async (data) => {
              try {
                // await updateTechnician({
                //   id: selectedTechnician.id,
                //   ...data,
                // } as UpdateTechnicianRequest).unwrap();
                setIsEditModalOpen(false);
                toast({
                  title: "Technician updated",
                  description: "Technician has been successfully updated.",
                });
              } catch (error) {
                toast({
                  title: "Error",
                  description: "Failed to update technician. Please try again.",
                  variant: "destructive",
                });
              }
            }}
            departments={departments}
          />
        )}
      </CommonModal>
    </div>
  );
};

export default TechnicianManagementPage;
