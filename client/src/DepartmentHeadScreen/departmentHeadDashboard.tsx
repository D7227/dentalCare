import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  MessageSquare,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Minus,
  ArrowRight,
  ArrowLeft,
  UserPlus,
  Package,
  Search,
  Eye,
  Download,
  Plus,
  FileText,
  Package2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import WaitingInwardTable from './components/WaitingInwardTable';
import InwardPendingTable from './components/InwardPendingTable';
import AssignedPendingTable from './components/AssignedPendingTable';
import InProgressTable from './components/InProgressTable';
import OutwardPendingTable from './components/OutwardPendingTable';
import TechnicianTable from './components/TechnicianTable';
import { departmentsData } from './staticData';
import CaseDetailsDialog from './components/CaseDetailsDialog';

const DepartmentHeadDashboard = () => {
  const { toast } = useToast();
  const [selectedDepartment, setSelectedDepartment] = useState("crown-bridge");
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedCaseForChat, setSelectedCaseForChat] = useState<{
    caseId: string;
    caseType: string;
  } | null>(null);
  const [technicianSearch, setTechnicianSearch] = useState("");
  const [activeTab, setActiveTab] = useState("waiting-inward");
  const [caseSearch, setCaseSearch] = useState("");
  const [selectedCaseDetails, setSelectedCaseDetails] = useState<any>(null);
  const [isCaseDetailsOpen, setIsCaseDetailsOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductQuantity, setNewProductQuantity] = useState(1);
  const [newProductCost, setNewProductCost] = useState(0);
  const [newAccessoryName, setNewAccessoryName] = useState("");
  const [newAccessoryQuantity, setNewAccessoryQuantity] = useState(1);
  const [newAccessoryProvider, setNewAccessoryProvider] = useState<
    "lab" | "doctor"
  >("lab");
  const [newAccessoryNotes, setNewAccessoryNotes] = useState("");

  const [departments, setDepartments] = useState<Department[]>(departmentsData);

  const currentDepartment = departments.find(
    (dept) => dept.id === selectedDepartment
  );

  // Get all assignments across all technicians
  const allAssignments =
    currentDepartment?.technicians?.flatMap((tech) =>
      tech.assignments.map((assignment) => ({
        ...assignment,
        technicianId: tech.id,
        technicianName: tech.name,
      }))
    ) || [];

  // Filter technicians for search
  const filteredTechnicians =
    currentDepartment?.technicians?.filter(
      (tech) =>
        tech.name.toLowerCase().includes(technicianSearch.toLowerCase()) ||
        tech.specialization
          .toLowerCase()
          .includes(technicianSearch.toLowerCase())
    ) || [];

  // Search for a case across all stages
  const searchCaseInAllStages = (searchTerm: string) => {
    if (!searchTerm.trim() || !currentDepartment) return null;

    const lowerSearchTerm = searchTerm.toLowerCase();

    // Search in waiting inward
    const waitingCase = currentDepartment.waitingInward?.find((c) =>
      c.caseNumber.toLowerCase().includes(lowerSearchTerm)
    );
    if (waitingCase) {
      return {
        stage: "waiting-inward",
        case: waitingCase,
        tab: "waiting-inward",
      };
    }

    // Search in inward pending
    const inwardCase = currentDepartment.inwardPending.find((c) =>
      c.caseNumber.toLowerCase().includes(lowerSearchTerm)
    );
    if (inwardCase) {
      return {
        stage: "inward-pending",
        case: inwardCase,
        tab: "inward-pending",
      };
    }

    // Search in assigned (pending)
    const assignedPendingCase = allAssignments.find(
      (a) =>
        a.caseNumber.toLowerCase().includes(lowerSearchTerm) &&
        a.status === "pending"
    );
    if (assignedPendingCase) {
      return {
        stage: "assigned-pending",
        case: assignedPendingCase,
        tab: "assigned-pending",
      };
    }

    // Search in progress
    const inProgressCase = allAssignments.find(
      (a) =>
        a.caseNumber.toLowerCase().includes(lowerSearchTerm) &&
        a.status === "in_progress"
    );
    if (inProgressCase) {
      return { stage: "in-progress", case: inProgressCase, tab: "in-progress" };
    }

    // Search in outward pending
    const outwardCase = currentDepartment.outwardPending.find((c) =>
      c.caseNumber.toLowerCase().includes(lowerSearchTerm)
    );
    if (outwardCase) {
      return {
        stage: "outward-pending",
        case: outwardCase,
        tab: "outward-pending",
      };
    }

    return null;
  };

  const handleCaseSearch = () => {
    const result = searchCaseInAllStages(caseSearch);
    if (result) {
      setActiveTab(result.tab);
      toast({
        title: "Case Found",
        description: `Case ${
          result.case.caseNumber
        } found in ${result.stage.replace("-", " ")} stage`,
      });
    } else {
      toast({
        title: "Case Not Found",
        description: `No case found with identifier: ${caseSearch}`,
        variant: "destructive",
      });
    }
  };

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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "high":
        return <ChevronUp className="h-4 w-4 text-orange-600" />;
      case "medium":
        return <Minus className="h-4 w-4 text-yellow-600" />;
      case "low":
        return <ChevronDown className="h-4 w-4 text-green-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const handlePriorityChange = (
    caseNumber: string,
    newPriority: string,
    stage: string
  ) => {
    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.id === selectedDepartment) {
          let updated = { ...dept };

          if (stage === "waiting-inward") {
            updated.waitingInward =
              dept.waitingInward?.map((c) =>
                c.caseNumber === caseNumber
                  ? { ...c, priority: newPriority as any }
                  : c
              ) || [];
          } else if (stage === "inward-pending") {
            updated.inwardPending = dept.inwardPending.map((c) =>
              c.caseNumber === caseNumber
                ? { ...c, priority: newPriority as any }
                : c
            );
          } else if (stage === "outward-pending") {
            updated.outwardPending = dept.outwardPending.map((c) =>
              c.caseNumber === caseNumber
                ? { ...c, priority: newPriority as any }
                : c
            );
          } else {
            updated.technicians = dept.technicians.map((tech) => ({
              ...tech,
              assignments: tech.assignments.map((a) =>
                a.caseNumber === caseNumber
                  ? { ...a, priority: newPriority as any }
                  : a
              ),
            }));
          }

          return updated;
        }
        return dept;
      })
    );

    toast({
      title: "Priority Updated",
      description: `Case ${caseNumber} priority changed to ${newPriority}`,
    });
  };

  const handleViewCaseDetails = (caseData: any) => {
    setSelectedCaseDetails(caseData);
    setIsCaseDetailsOpen(true);
  };

  const handleDownloadFile = (file: DigitalFile) => {
    toast({
      title: "Download Started",
      description: `Downloading ${file.name}`,
    });
    // In real implementation, this would trigger actual file download
  };

  const handleAddProduct = () => {
    if (!newProductName.trim() || !selectedCaseDetails) return;

    const newProduct: Product = {
      id: `P${Date.now()}`,
      name: newProductName,
      quantity: newProductQuantity,
      cost: newProductCost,
      addedBy: "Admin",
      addedAt: new Date().toISOString().split("T")[0],
    };

    setSelectedCaseDetails({
      ...selectedCaseDetails,
      products: [...selectedCaseDetails.products, newProduct],
    });

    setNewProductName("");
    setNewProductQuantity(1);
    setNewProductCost(0);

    toast({
      title: "Product Added",
      description: `${newProduct.name} added to case`,
    });
  };

  const handleAddAccessory = () => {
    if (!newAccessoryName.trim() || !selectedCaseDetails) return;

    const newAccessory: Accessory = {
      id: `A${Date.now()}`,
      name: newAccessoryName,
      quantity: newAccessoryQuantity,
      providedBy: newAccessoryProvider,
      notes: newAccessoryNotes,
    };

    setSelectedCaseDetails({
      ...selectedCaseDetails,
      accessories: [...selectedCaseDetails.accessories, newAccessory],
    });

    setNewAccessoryName("");
    setNewAccessoryQuantity(1);
    setNewAccessoryProvider("lab");
    setNewAccessoryNotes("");

    toast({
      title: "Accessory Added",
      description: `${newAccessory.name} added to case`,
    });
  };

  const handleSelfAssign = (caseId: string, technicianId: string) => {
    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.id === selectedDepartment) {
          const inwardCase = dept.inwardPending.find((c) => c.id === caseId);
          const technician = dept.technicians.find(
            (t) => t.id === technicianId
          );

          if (inwardCase && technician) {
            const newAssignment: CaseAssignment = {
              id: `A${Date.now()}`,
              caseId: inwardCase.caseNumber,
              caseNumber: inwardCase.caseNumber,
              doctorName: inwardCase.doctorName,
              clinicName: inwardCase.clinicName,
              patientName: inwardCase.patientName,
              caseType: inwardCase.caseType,
              priority: inwardCase.priority,
              status: "pending",
              assignedDate: new Date().toISOString().split("T")[0],
              dueDate: inwardCase.dueDate,
              estimatedCompletion: inwardCase.dueDate,
              notes: inwardCase.notes,
              technicianId,
              technicianName: technician.name,
              logs: [
                ...inwardCase.logs,
                {
                  id: `L${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  action: "Assigned",
                  user: "Admin",
                  details: `Assigned to ${technician.name}`,
                },
              ],
              digitalFiles: inwardCase.digitalFiles,
              products: inwardCase.products,
              accessories: inwardCase.accessories,
            };

            return {
              ...dept,
              inwardPending: dept.inwardPending.filter((c) => c.id !== caseId),
              technicians: dept.technicians.map((t) =>
                t.id === technicianId
                  ? {
                      ...t,
                      assignments: [...t.assignments, newAssignment],
                      currentCases: t.currentCases + 1,
                    }
                  : t
              ),
            };
          }
        }
        return dept;
      })
    );

    toast({
      title: "Case Assigned",
      description: `Case assigned successfully`,
    });
  };

  const handleAdminAssign = (caseId: string, technicianId: string) => {
    handleSelfAssign(caseId, technicianId);
  };

  const handleStartWork = (assignmentId: string) => {
    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.id === selectedDepartment) {
          return {
            ...dept,
            technicians: dept.technicians.map((t) => ({
              ...t,
              assignments: t.assignments.map((a) =>
                a.id === assignmentId
                  ? {
                      ...a,
                      status: "in_progress" as const,
                      logs: [
                        ...a.logs,
                        {
                          id: `L${Date.now()}`,
                          timestamp: new Date().toISOString(),
                          action: "Work Started",
                          user: a.technicianName || "Technician",
                          details: "Started working on case",
                        },
                      ],
                    }
                  : a
              ),
            })),
          };
        }
        return dept;
      })
    );

    toast({
      title: "Work Started",
      description: "Case status updated to In Progress",
    });
  };

  const handleCompleteTask = (assignmentId: string, technicianId: string) => {
    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.id === selectedDepartment) {
          const technician = dept.technicians.find(
            (t) => t.id === technicianId
          );
          const assignment = technician?.assignments.find(
            (a) => a.id === assignmentId
          );

          if (assignment && technician) {
            const outwardCase: OutwardCase = {
              id: `OUT${Date.now()}`,
              caseNumber: assignment.caseNumber,
              doctorName: assignment.doctorName,
              clinicName: assignment.clinicName,
              patientName: assignment.patientName,
              caseType: assignment.caseType,
              priority: assignment.priority,
              completedDate: new Date().toISOString().split("T")[0],
              technicianName: assignment.technicianName || technician.name,
              readyForOutward: true,
              logs: [
                ...assignment.logs,
                {
                  id: `L${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  action: "Work Completed",
                  user: technician.name,
                  details: "Case work completed",
                },
              ],
              digitalFiles: assignment.digitalFiles,
              products: assignment.products,
              accessories: assignment.accessories,
            };

            return {
              ...dept,
              outwardPending: [...dept.outwardPending, outwardCase],
              technicians: dept.technicians.map((t) =>
                t.id === technicianId
                  ? {
                      ...t,
                      assignments: t.assignments.filter(
                        (a) => a.id !== assignmentId
                      ),
                      currentCases: Math.max(0, t.currentCases - 1),
                    }
                  : t
              ),
            };
          }
        }
        return dept;
      })
    );

    toast({
      title: "Task Completed",
      description: `Task completed and moved to outward pending`,
    });
  };

  const handleMakeOutward = (outwardCaseId: string) => {
    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.id === selectedDepartment) {
          return {
            ...dept,
            outwardPending: dept.outwardPending.filter(
              (c) => c.id !== outwardCaseId
            ),
          };
        }
        return dept;
      })
    );

    toast({
      title: "Case Processed",
      description: `Case has been sent outward`,
    });
  };

  const handleMakeInward = (waitingCaseId: string) => {
    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.id === selectedDepartment) {
          const waitingCase = dept.waitingInward?.find(
            (c) => c.id === waitingCaseId
          );

          if (waitingCase) {
            const inwardCase: InwardCase = {
              id: `IN${Date.now()}`,
              caseNumber: waitingCase.caseNumber,
              doctorName: waitingCase.doctorName,
              clinicName: waitingCase.clinicName,
              patientName: waitingCase.patientName,
              caseType: waitingCase.caseType,
              priority: waitingCase.priority,
              receivedDate: new Date().toISOString().split("T")[0],
              dueDate: waitingCase.expectedDate,
              notes: waitingCase.notes,
              logs: [
                ...waitingCase.logs,
                {
                  id: `L${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  action: "Made Inward",
                  user: "Admin",
                  details: "Case processed for assignment",
                },
              ],
              digitalFiles: waitingCase.digitalFiles,
              products: waitingCase.products,
              accessories: waitingCase.accessories,
            };

            return {
              ...dept,
              waitingInward:
                dept.waitingInward?.filter((c) => c.id !== waitingCaseId) || [],
              inwardPending: [...dept.inwardPending, inwardCase],
            };
          }
        }
        return dept;
      })
    );

    toast({
      title: "Case Made Inward",
      description: `Case has been moved to inward pending`,
    });
  };

  const handleChatOpen = (caseId: string, caseType: string) => {
    setSelectedCaseForChat({ caseId, caseType });
    setIsChatModalOpen(true);
  };

  const handleChatClose = () => {
    setIsChatModalOpen(false);
    setSelectedCaseForChat(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Department View</h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Case Search */}
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search case (e.g., ADE-2025-034)..."
              value={caseSearch}
              onChange={(e) => setCaseSearch(e.target.value)}
              className="w-64"
              onKeyPress={(e) => e.key === "Enter" && handleCaseSearch()}
            />
            <Button onClick={handleCaseSearch} variant="outline" size="sm">
              Search Case
            </Button>
          </div>

          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Department Overview */}
      {currentDepartment && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{currentDepartment.name}</CardTitle>
              <p className="text-sm text-gray-600">
                {currentDepartment.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {currentDepartment.waitingInward?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Waiting Inward</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentDepartment.inwardPending?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Inward Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {
                      allAssignments.filter((a) => a.status === "pending")
                        .length
                    }
                  </div>
                  <div className="text-sm text-gray-600">
                    Assigned (Pending)
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {
                      allAssignments.filter((a) => a.status === "in_progress")
                        .length
                    }
                  </div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {currentDepartment.outwardPending?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Outward Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {currentDepartment.technicians?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Technicians</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabbed Interface for Better Organization */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="waiting-inward">Waiting Inward</TabsTrigger>
              <TabsTrigger value="inward-pending">Inward Pending</TabsTrigger>
              <TabsTrigger value="assigned-pending">
                Assigned (Pending)
              </TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="outward-pending">Outward Pending</TabsTrigger>
              <TabsTrigger value="technicians">Technicians</TabsTrigger>
            </TabsList>

            {/* Waiting to be Inward Cases */}
            <TabsContent value="waiting-inward">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-600" />
                    Waiting to be Inward (
                    {currentDepartment.waitingInward?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <WaitingInwardTable
                    data={currentDepartment.waitingInward || []}
                    onPriorityChange={(caseNumber, newPriority) =>
                      handlePriorityChange(caseNumber, newPriority, 'waiting-inward')
                    }
                    onMakeInward={handleMakeInward}
                    onViewDetails={handleViewCaseDetails}
                    onChatOpen={handleChatOpen}
                    getPriorityIcon={getPriorityIcon}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Inward Pending Cases */}
            <TabsContent value="inward-pending">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRight className="h-5 w-5 text-blue-600" />
                    Inward Pending Cases (
                    {currentDepartment.inwardPending.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <InwardPendingTable
                    data={currentDepartment.inwardPending}
                    technicians={currentDepartment.technicians}
                    onPriorityChange={(caseNumber, newPriority) =>
                      handlePriorityChange(caseNumber, newPriority, 'inward-pending')
                    }
                    onAssign={handleAdminAssign}
                    onViewDetails={handleViewCaseDetails}
                    onChatOpen={handleChatOpen}
                    getPriorityIcon={getPriorityIcon}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Assigned Pending Cases */}
            <TabsContent value="assigned-pending">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    Assigned (Pending) Cases (
                    {
                      allAssignments.filter((a) => a.status === "pending")
                        .length
                    }
                    )
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AssignedPendingTable
                    data={allAssignments.filter((a) => a.status === 'pending')}
                    onPriorityChange={(caseNumber, newPriority) =>
                      handlePriorityChange(caseNumber, newPriority, 'assigned')
                    }
                    onStartWork={handleStartWork}
                    onViewDetails={handleViewCaseDetails}
                    onChatOpen={handleChatOpen}
                    getPriorityIcon={getPriorityIcon}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* In Progress Cases */}
            <TabsContent value="in-progress">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-purple-600" />
                    In Progress Cases (
                    {
                      allAssignments.filter((a) => a.status === "in_progress")
                        .length
                    }
                    )
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <InProgressTable
                    data={allAssignments.filter((a) => a.status === 'in_progress')}
                    onPriorityChange={(caseNumber, newPriority) =>
                      handlePriorityChange(caseNumber, newPriority, 'assigned')
                    }
                    onCompleteTask={handleCompleteTask}
                    onViewDetails={handleViewCaseDetails}
                    onChatOpen={handleChatOpen}
                    getPriorityIcon={getPriorityIcon}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Outward Pending Cases */}
            <TabsContent value="outward-pending">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowLeft className="h-5 w-5 text-green-600" />
                    Outward Pending Cases (
                    {currentDepartment.outwardPending.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <OutwardPendingTable
                    data={currentDepartment.outwardPending}
                    onPriorityChange={(caseNumber, newPriority) =>
                      handlePriorityChange(caseNumber, newPriority, 'outward-pending')
                    }
                    onMakeOutward={handleMakeOutward}
                    onViewDetails={handleViewCaseDetails}
                    onChatOpen={handleChatOpen}
                    getPriorityIcon={getPriorityIcon}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Technicians Tab */}
            <TabsContent value="technicians">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Technicians ({currentDepartment.technicians.length})
                    </CardTitle>
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
                </CardHeader>
                <CardContent>
                  <TechnicianTable
                    data={filteredTechnicians}
                    inwardPendingCases={currentDepartment.inwardPending}
                    onAssign={handleSelfAssign}
                    getStatusBadge={getStatusBadge}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Case Details Modal */}
      <CaseDetailsDialog
        open={isCaseDetailsOpen}
        onOpenChange={setIsCaseDetailsOpen}
        selectedCaseDetails={selectedCaseDetails}
        newProductName={newProductName}
        setNewProductName={setNewProductName}
        newProductQuantity={newProductQuantity}
        setNewProductQuantity={setNewProductQuantity}
        newProductCost={newProductCost}
        setNewProductCost={setNewProductCost}
        newAccessoryName={newAccessoryName}
        setNewAccessoryName={setNewAccessoryName}
        newAccessoryQuantity={newAccessoryQuantity}
        setNewAccessoryQuantity={setNewAccessoryQuantity}
        newAccessoryProvider={newAccessoryProvider}
        setNewAccessoryProvider={setNewAccessoryProvider}
        newAccessoryNotes={newAccessoryNotes}
        setNewAccessoryNotes={setNewAccessoryNotes}
        handleDownloadFile={handleDownloadFile}
        handleAddProduct={handleAddProduct}
        handleAddAccessory={handleAddAccessory}
        handleChatOpen={handleChatOpen}
        setIsCaseDetailsOpen={setIsCaseDetailsOpen}
      />

      {/* Case Chat Modal */}
      {/* {selectedCaseForChat && (
            <CaseChatModal
              isOpen={isChatModalOpen}
              onClose={handleChatClose}
              caseId={selectedCaseForChat.caseId}
              caseType={selectedCaseForChat.caseType}
            />
          )} */}
    </div>
  );
};

export default DepartmentHeadDashboard;
