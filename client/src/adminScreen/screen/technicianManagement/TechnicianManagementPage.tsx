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
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import CommonTable from "@/components/common/CommonTable";
import CommonModal from "@/components/common/CommonModal";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import IconButton from "@/components/common/IconButton";
import TechnicianProfileCard from "./TechnicianProfileCard";
import TechnicianForm from "./TechnicianForm";
import { useToast } from "@/hooks/use-toast";
import {
  useGetTechniciansQuery,
  useGetTechnicianByIdQuery,
  useCreateTechnicianMutation,
  useUpdateTechnicianMutation,
  useDeleteTechnicianMutation,
  useGetDepartmentsQuery,
  useGetTechnicianStatsQuery,
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<
    string | null
  >(null);
  const [technicianToDelete, setTechnicianToDelete] =
    useState<Technician | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  // API hooks with error handling
  const {
    data: techniciansResponse,
    isLoading: techniciansLoading,
    error: techniciansError,
    refetch: refetchTechnicians,
  } = useGetTechniciansQuery({ page: currentPage, limit: pageSize });

  const techniciansData = techniciansResponse?.technicians || [];

  const {
    data: departmentsData = [],
    isLoading: departmentsLoading,
    error: departmentsError,
    refetch: refetchDepartments,
  } = useGetDepartmentsQuery();

  const {
    data: statsData,
    error: statsError,
    refetch: refetchStats,
  } = useGetTechnicianStatsQuery();

  const {
    data: selectedTechnician,
    isLoading: selectedTechnicianLoading,
    error: selectedTechnicianError,
  } = useGetTechnicianByIdQuery(selectedTechnicianId!, {
    skip: !selectedTechnicianId,
  });
  const [createTechnician, { isLoading: isCreating }] =
    useCreateTechnicianMutation();
  const [updateTechnician, { isLoading: isUpdating }] =
    useUpdateTechnicianMutation();
  const [deleteTechnician, { isLoading: isDeleting }] =
    useDeleteTechnicianMutation();

  console.log("statsData -->", statsData);
  console.log("techniciansData -->", techniciansData);

  // Error handling functions
  const handleRetry = (retryFunction: () => void, errorType: string) => {
    try {
      retryFunction();
      toast({
        title: "Retrying...",
        description: `Attempting to reload ${errorType} data.`,
      });
    } catch (error) {
      toast({
        title: "Retry Failed",
        description: `Failed to retry loading ${errorType} data.`,
        variant: "destructive",
      });
    }
  };

  const getErrorMessage = (error: any, defaultMessage: string) => {
    if (error?.status === 404)
      return "Data not found. Please check your connection.";
    if (error?.status === 500) return "Server error. Please try again later.";
    if (error?.status === 403)
      return "Access denied. Please check your permissions.";
    if (error?.status === 401)
      return "Authentication required. Please log in again.";
    if (error?.status === 0)
      return "Network error. Please check your internet connection.";

    return error?.data?.error || error?.message || defaultMessage;
  };

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

  // For now, we'll use client-side filtering since server-side filtering requires backend changes
  // In a production app, you'd want to pass search/filter params to the API
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

  const handleViewTechnician = (technician: Technician) => {
    setSelectedTechnicianId(technician.id);
    setIsViewModalOpen(true);
  };

  const handleEditTechnician = (technician: Technician) => {
    setSelectedTechnicianId(technician.id);
    setIsEditModalOpen(true);
  };

  const handleDeleteTechnician = (technician: Technician) => {
    setTechnicianToDelete(technician);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!technicianToDelete) return;

    try {
      await deleteTechnician(technicianToDelete.id).unwrap();
      setIsDeleteModalOpen(false);
      setTechnicianToDelete(null);
      toast({
        title: "Technician deleted",
        description: "Technician has been successfully deleted.",
      });
    } catch (error: any) {
      const errorMessage =
        error?.data?.error ||
        error?.message ||
        "Failed to delete technician. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
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
    // {
    //   key: "role",
    //   title: "Role",
    //   render: (row: Technician) => (
    //     <div>
    //       <div className="font-medium">{row.roleName}</div>
    //     </div>
    //   ),
    // },
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
        <div className="flex items-center gap-1">
          <IconButton
            icon={Eye}
            tooltip="View Details"
            onClick={() => handleViewTechnician(row)}
            hoverColor="blue"
          />
          <IconButton
            icon={Edit}
            tooltip="Edit Technician"
            onClick={() => handleEditTechnician(row)}
            hoverColor="green"
          />
          <IconButton
            icon={Trash2}
            tooltip="Delete Technician"
            onClick={() => handleDeleteTechnician(row)}
            loading={isDeleting}
            hoverColor="red"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Global Error Banner */}
      {(techniciansError || departmentsError || statsError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Connection Issues Detected
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  Some data may not be loading properly. Please check your
                  connection and try refreshing the page.
                </p>
                <div className="mt-3 flex gap-2">
                  {techniciansError && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleRetry(refetchTechnicians, "technicians")
                      }
                      className="text-red-700 border-red-300 hover:bg-red-100"
                    >
                      Retry Technicians
                    </Button>
                  )}
                  {departmentsError && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleRetry(refetchDepartments, "departments")
                      }
                      className="text-red-700 border-red-300 hover:bg-red-100"
                    >
                      Retry Departments
                    </Button>
                  )}
                  {statsError && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRetry(refetchStats, "statistics")}
                      className="text-red-700 border-red-300 hover:bg-red-100"
                    >
                      Retry Statistics
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
        {statsError ? (
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Failed to Load Statistics
            </h3>
            <p className="text-gray-600 mb-4">
              {getErrorMessage(
                statsError,
                "Unable to load technician statistics"
              )}
            </p>
            <Button
              onClick={() => handleRetry(refetchStats, "statistics")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Retry
            </Button>
          </div>
        ) : (
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
                  {techniciansLoading
                    ? "..."
                    : statsData?.total || technicians.length}
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
                  {techniciansLoading ? "..." : statsData?.active || 0}
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
                  {departmentsLoading
                    ? "..."
                    : statsData?.byDepartment
                    ? Object.keys(statsData.byDepartment).length
                    : 0}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg per Dept
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {techniciansLoading || departmentsLoading
                    ? "..."
                    : statsData?.byDepartment
                    ? (
                        Object.values(statsData.byDepartment).reduce(
                          (sum, count) => sum + count,
                          0
                        ) / Object.keys(statsData.byDepartment).length
                      ).toFixed(1)
                    : "0"}
                </p>
              </div>
            </div>
          </div>
        )}
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
          disabled={!!departmentsError}
        >
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue
              placeholder={
                departmentsError
                  ? "Error loading departments"
                  : "All Departments"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departmentsError ? (
              <SelectItem value="error" disabled>
                Failed to load departments
              </SelectItem>
            ) : (
              departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))
            )}
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
      ) : techniciansError ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Failed to Load Technicians
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {getErrorMessage(
                techniciansError,
                "Unable to load technician data. Please check your connection and try again."
              )}
            </p>
            <div className="flex justify-center gap-3">
              <Button
                onClick={() => handleRetry(refetchTechnicians, "technicians")}
                className="flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Retry
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentPage(1);
                  setPageSize(10);
                  refetchTechnicians();
                }}
              >
                Reset & Retry
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <CommonTable
          data={filteredTechnicians}
          columns={tableColumns}
          isLoading={techniciansLoading}
          pagination={{
            currentPage,
            totalPages: techniciansResponse?.pagination?.totalPages || 1,
            totalItems: techniciansResponse?.pagination?.total || 0,
            pageSize,
            onPageChange: setCurrentPage,
            onPageSizeChange: setPageSize,
          }}
        />
      )}

      {/* Add Technician Modal */}
      <CommonModal
        open={isAddModalOpen}
        onOpenChange={(open) => {
          setIsAddModalOpen(open);
        }}
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
            } catch (error: any) {
              const errorMessage =
                error?.data?.error ||
                error?.message ||
                "Failed to add technician. Please try again.";
              toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
              });
            }
          }}
          onCancel={() => {
            setIsAddModalOpen(false);
          }}
          departments={departments}
          isLoading={isCreating}
        />
      </CommonModal>

      {/* Edit Technician Modal */}
      <CommonModal
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) {
            setSelectedTechnicianId(null);
          }
        }}
        title="Edit Technician"
      >
        {selectedTechnicianLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">
              Loading technician details...
            </span>
          </div>
        ) : selectedTechnicianError ? (
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Failed to Load Technician Details
            </h3>
            <p className="text-gray-600 mb-4">
              {getErrorMessage(
                selectedTechnicianError,
                "Unable to load technician details"
              )}
            </p>
            <Button
              onClick={() => {
                setSelectedTechnicianId(selectedTechnicianId);
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Retry
            </Button>
          </div>
        ) : selectedTechnician ? (
          <TechnicianForm
            technician={selectedTechnician}
            onSubmit={async (data) => {
              try {
                await updateTechnician({
                  id: selectedTechnician.id,
                  ...data,
                } as UpdateTechnicianRequest).unwrap();
                setIsEditModalOpen(false);
                setSelectedTechnicianId(null);
                toast({
                  title: "Technician updated",
                  description: "Technician has been successfully updated.",
                });
                console.log(
                  "selectedTechnician.id",
                  typeof selectedTechnician.id
                );
              } catch (error: any) {
                const errorMessage =
                  error?.data?.error ||
                  error?.message ||
                  "Failed to update technician. Please try again.";
                toast({
                  title: "Error",
                  description: errorMessage,
                  variant: "destructive",
                });
              }
            }}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedTechnicianId(null);
            }}
            departments={departments}
            isLoading={isUpdating}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            Technician not found
          </div>
        )}
      </CommonModal>

      {/* View Technician Details Modal */}
      <CommonModal
        open={isViewModalOpen}
        onOpenChange={(open) => {
          setIsViewModalOpen(open);
          if (!open) {
            setSelectedTechnicianId(null);
            setShowPassword(false);
          }
        }}
        title="Technician Details"
      >
        {selectedTechnicianLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">
              Loading technician details...
            </span>
          </div>
        ) : selectedTechnicianError ? (
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Failed to Load Technician Details
            </h3>
            <p className="text-gray-600 mb-4">
              {getErrorMessage(
                selectedTechnicianError,
                "Unable to load technician details"
              )}
            </p>
            <Button
              onClick={() => {
                setSelectedTechnicianId(selectedTechnicianId);
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Retry
            </Button>
          </div>
        ) : selectedTechnician ? (
          <div className="space-y-6">
            {/* Profile Section */}
            <TechnicianProfileCard
              firstName={selectedTechnician.firstName}
              lastName={selectedTechnician.lastName}
              email={selectedTechnician.email}
              mobileNumber={selectedTechnician.mobileNumber}
              employeeId={selectedTechnician.employeeId}
              departmentName={selectedTechnician.departmentName}
              status={selectedTechnician.status}
              profilePic={selectedTechnician.profilePic}
              size="lg"
              showDetails={false}
            />

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email
                </label>
                <p className="text-gray-900">{selectedTechnician.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Mobile Number
                </label>
                <p className="text-gray-900">
                  {selectedTechnician.mobileNumber}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Employee ID
                </label>
                <p className="text-gray-900">{selectedTechnician.employeeId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Department
                </label>
                <p className="text-gray-900">
                  {selectedTechnician.departmentName || "Not assigned"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Password
                </label>
                <div className="flex items-center gap-2">
                  <p className="text-gray-900 font-mono">
                    {showPassword
                      ? selectedTechnician?.password || "••••••••"
                      : "••••••••"}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="h-8 px-2"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEditTechnician(selectedTechnician);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Technician
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleDeleteTechnician(selectedTechnician);
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Technician
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Technician not found
          </div>
        )}
      </CommonModal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={(open) => {
          setIsDeleteModalOpen(open);
          if (!open) {
            setTechnicianToDelete(null);
          }
        }}
        title="Delete Technician"
        description="Are you sure you want to delete this technician?"
        confirmText="Delete Technician"
        icon={Trash2}
        iconColor="red"
        onConfirm={confirmDelete}
        loading={isDeleting}
        variant="destructive"
      >
        {technicianToDelete && (
          <>
            <div className="bg-gray-50 rounded-lg p-4">
              <TechnicianProfileCard
                firstName={technicianToDelete.firstName}
                lastName={technicianToDelete.lastName}
                email={technicianToDelete.email}
                mobileNumber={technicianToDelete.mobileNumber}
                employeeId={technicianToDelete.employeeId}
                departmentName={technicianToDelete.departmentName}
                status={technicianToDelete.status}
                profilePic={technicianToDelete.profilePic}
                size="sm"
                showDetails={false}
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center mt-0.5">
                  <span className="text-yellow-600 text-xs font-bold">!</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-800">Warning</p>
                  <p className="text-sm text-yellow-700">
                    This action cannot be undone. All data associated with this
                    technician will be permanently deleted.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </ConfirmationModal>
    </div>
  );
};

export default TechnicianManagementPage;
