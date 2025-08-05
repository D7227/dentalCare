import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
  Users,
  Clock,
  AlertCircle,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Minus,
  ArrowRight,
  ArrowLeft,
  Search,
  LogOut,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import WaitingInwardTable from "./components/WaitingInwardTable";
import InwardPendingTable from "./components/InwardPendingTable";
import AssignedPendingTable from "./components/AssignedPendingTable";
import InProgressTable from "./components/InProgressTable";
import OutwardPendingTable from "./components/OutwardPendingTable";
import TechnicianTable from "./components/TechnicianTable";
import { departmentsData } from "./staticData";
import CaseDetailsDialog from "./components/CaseDetailsDialog";
import CommonTabs from "@/components/common/CommonTabs";
import FigmaStatCard from "@/components/ui/FigmaStatCard";
import {
  bigCard1,
  bigCard2,
  bigCard3,
  card1,
  card2,
  card3,
  icon_1,
  icon_2,
  icon_3,
  icon_4,
  icon_5,
  icon_6,
} from "@/assets/svg";
import NotificationIconExample from "@/styles/NotificationIconExample";
import CommonSearchBar from "@/components/common/CommonSearchBar";
import {
  clearDepartmentHead,
  selectDepartmentHeadUser,
} from "@/store/slices/departmentHeadSlice/departmentHeadSlice";
import { useGetDepartmentHeadProfileQuery } from "@/store/slices/departmentHeadSlice/departmentHeadApi";
import { skipToken } from "@reduxjs/toolkit/query";

const DepartmentHeadDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

  // const handleMakeInward = (waitingCaseId: string) => {
  //   setDepartments((prev) =>
  //     prev.map((dept) => {
  //       if (dept.id === selectedDepartment) {
  //         const waitingCase = dept.waitingInward?.find(
  //           (c) => c.id === waitingCaseId
  //         );

  //         if (waitingCase) {
  //           const inwardCase: InwardCase = {
  //             id: `IN${Date.now()}`,
  //             caseNumber: waitingCase.caseNumber,
  //             doctorName: waitingCase.doctorName,
  //             clinicName: waitingCase.clinicName,
  //             patientName: waitingCase.patientName,
  //             caseType: waitingCase.caseType,
  //             priority: waitingCase.priority,
  //             receivedDate: new Date().toISOString().split("T")[0],
  //             dueDate: waitingCase.expectedDate,
  //             notes: waitingCase.notes,
  //             logs: [
  //               ...waitingCase.logs,
  //               {
  //                 id: `L${Date.now()}`,
  //                 timestamp: new Date().toISOString(),
  //                 action: "Made Inward",
  //                 user: "Admin",
  //                 details: "Case processed for assignment",
  //               },
  //             ],
  //             digitalFiles: waitingCase.digitalFiles,
  //             products: waitingCase.products,
  //             accessories: waitingCase.accessories,
  //           };

  //           return {
  //             ...dept,
  //             waitingInward:
  //               dept.waitingInward?.filter((c) => c.id !== waitingCaseId) || [],
  //             inwardPending: [...dept.inwardPending, inwardCase],
  //           };
  //         }
  //       }
  //       return dept;
  //     })
  //   );

  //   toast({
  //     title: "Case Made Inward",
  //     description: `Case has been moved to inward pending`,
  //   });
  // };

  const handleChatOpen = (caseId: string, caseType: string) => {
    setSelectedCaseForChat({ caseId, caseType });
    setIsChatModalOpen(true);
  };

  const handleChatClose = () => {
    setIsChatModalOpen(false);
    setSelectedCaseForChat(null);
  };

  const handleLogout = () => {
    dispatch(clearDepartmentHead());
    // Force clear localStorage as well
    localStorage.removeItem("department-head-token");
    // Use replace to prevent going back
    navigate("/department-head/login", { replace: true });
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the department head portal.",
    });
  };

  const stats: any = [
    {
      title: "Waiting Inward",
      value: currentDepartment?.waitingInward?.length || 0,
      data: 0,
      key: "waiting-inward",
      iconSrc: icon_1,
      backgroundSrc: card1,
      bigBackgroundSrc: bigCard1,
    },
    {
      title: "Inward Pending",
      value: currentDepartment?.inwardPending?.length || 0,
      data: 0,
      key: "arriving",
      iconSrc: icon_2,
      backgroundSrc: card2,
      bigBackgroundSrc: bigCard2,
    },
    {
      title: "Assigned (Pending)",
      value: allAssignments?.filter((a) => a.status === "pending").length,
      data: 0,
      key: "assigned-pending",
      iconSrc: icon_3,
      backgroundSrc: card3,
      bigBackgroundSrc: bigCard3,
    },
    {
      title: "In Progress",
      value: allAssignments?.filter((a) => a.status === "in_progress").length,
      data: 0,
      key: "in-progress",
      iconSrc: icon_4,
      backgroundSrc: card1,
      bigBackgroundSrc: bigCard1,
    },
    {
      title: "Outward Pending",
      value: currentDepartment?.outwardPending?.length || 0,
      data: 0,
      key: "outward-pending",
      iconSrc: icon_5,
      backgroundSrc: card2,
      bigBackgroundSrc: bigCard2,
    },
    {
      title: "Total Technicians",
      value: currentDepartment?.technicians?.length || 0,
      data: 0,
      key: "technicians",
      iconSrc: icon_6,
      backgroundSrc: card3,
      bigBackgroundSrc: bigCard3,
    },
  ];

  const [departments1, setDepartments1] = useState<Department[]>([]);
  const [selectedDepartment1, setSelectedDepartment1] =
    useState<Department | null>(null);

  const departmentHeadUser = useSelector(selectDepartmentHeadUser);
  const { data: departmentHeadProfile } = useGetDepartmentHeadProfileQuery(
    departmentHeadUser?.id ? { id: departmentHeadUser.id } : skipToken
  );
  console.log("departmentHeadUser", departmentHeadUser);
  console.log("departmentHeadProfile", departmentHeadProfile);

  // Update departments and selected department when API data is available
  React.useEffect(() => {
    if (departmentHeadProfile?.data?.departments) {
      setDepartments1(departmentHeadProfile.data.departments);

      // Set active department as selected if not already set
      if (
        departmentHeadProfile.data.activeDepartmentId &&
        !selectedDepartment1
      ) {
        const activeDept = departmentHeadProfile.data.departments.find(
          (dept: any) =>
            dept.id === departmentHeadProfile.data.activeDepartmentId
        );
        if (activeDept) {
          setSelectedDepartment1(activeDept);
        }
      }
    }
  }, [departmentHeadProfile, selectedDepartment1]);

  useEffect(() => {
    console.log("selectedDepartment1", selectedDepartment1);
    console.log("departments1", departments1);
  }, [selectedDepartment1, departments1]);

  // Handler for department selection
  const handleDepartmentChange = (departmentId: string) => {
    const selectedDept = departments1.find(
      (dept: any) => dept.id === departmentId
    );
    if (selectedDept) {
      setSelectedDepartment1(selectedDept);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white h-[73px]">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Department View</h2>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CommonSearchBar
              value={caseSearch}
              onChange={(e) => setCaseSearch(e.target.value)}
              placeholder="Search case (e.g., ADE-2025-034)..."
              className="w-64"
              onKeyPress={(e) => e.key === "Enter" && handleCaseSearch()}
            />
            <Button onClick={handleCaseSearch} variant="outline" size="sm">
              Search Case
            </Button>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Department Overview */}
      {selectedDepartment1 && (
        <div className="px-6 py-4 bg-custonLightGray-100 !m-0 h-[calc(100vh-73px)]">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold">
                  {selectedDepartment1?.name}
                </span>
                {/* <p className="text-sm text-gray-600">
                  {currentDepartment.description}
                </p> */}
              </div>
              <div>
                <Select
                  value={selectedDepartment1?.id || ""}
                  onValueChange={handleDepartmentChange}
                >
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments1.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap mt-6">
              {stats.map((stat: any, index: any) => (
                <FigmaStatCard
                  key={index}
                  title={stat?.title}
                  value={stat?.value}
                  iconSrc={stat?.iconSrc}
                  backgroundSrc={stat?.backgroundSrc}
                  bigBackgroundSrc={stat?.bigBackgroundSrc}
                  subtext={stat?.subtext}
                  onClick={() => console.log("clicked")}
                  showIcon={false}
                />
              ))}
            </div>
          </div>

          {/* Tabbed Interface for Better Organization */}
          <CommonTabs
            tabs={[
              { label: "Waiting Inward", value: "waiting-inward" },
              { label: "Inward Pending", value: "inward-pending" },
              { label: "Assigned (Pending)", value: "assigned-pending" },
              { label: "In Progress", value: "in-progress" },
              { label: "Outward Pending", value: "outward-pending" },
              { label: "Technicians", value: "technicians" },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            children={{
              "waiting-inward": (
                <>
                  <div className="flex items-center gap-2 mb-2 mt-2">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <span className="font-semibold text-lg">
                      Waiting to be Inward (
                      {currentDepartment?.waitingInward?.length || 0})
                    </span>
                  </div>
                  <WaitingInwardTable
                    // data={waitingInwardData?.data || []}
                    onPriorityChange={(caseNumber, newPriority) =>
                      handlePriorityChange(
                        caseNumber,
                        newPriority,
                        "waiting-inward"
                      )
                    }
                    // onMakeInward={handleMakeInward}
                    onViewDetails={handleViewCaseDetails}
                    onChatOpen={handleChatOpen}
                    getPriorityIcon={getPriorityIcon}
                    selectedDepartmentId={selectedDepartment1?.id}
                  />
                </>
              ),
              "inward-pending": (
                <>
                  <div className="flex items-center gap-2 mb-2 mt-2">
                    <ArrowRight className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-lg">
                      Inward Pending Cases (
                      {currentDepartment?.inwardPending.length})
                    </span>
                  </div>
                  <InwardPendingTable
                    // data={currentDepartment?.inwardPending}
                    selectedDepartmentId={selectedDepartment1?.id}
                    // technicians={currentDepartment?.technicians}
                    onPriorityChange={(caseNumber, newPriority) =>
                      handlePriorityChange(
                        caseNumber,
                        newPriority,
                        "inward-pending"
                      )
                    }
                    onAssign={handleAdminAssign}
                    onViewDetails={handleViewCaseDetails}
                    onChatOpen={handleChatOpen}
                    getPriorityIcon={getPriorityIcon}
                  />
                </>
              ),
              "assigned-pending": (
                <>
                  <div className="flex items-center gap-2 mb-2 mt-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <span className="font-semibold text-lg">
                      Assigned (Pending) Cases (
                      {
                        allAssignments.filter((a) => a.status === "pending")
                          .length
                      }
                      )
                    </span>
                  </div>
                  <AssignedPendingTable
                    data={allAssignments.filter((a) => a.status === "pending")}
                    onPriorityChange={(caseNumber, newPriority) =>
                      handlePriorityChange(caseNumber, newPriority, "assigned")
                    }
                    onStartWork={handleStartWork}
                    onViewDetails={handleViewCaseDetails}
                    onChatOpen={handleChatOpen}
                    getPriorityIcon={getPriorityIcon}
                  />
                </>
              ),
              "in-progress": (
                <>
                  <div className="flex items-center gap-2 mb-2 mt-2">
                    <AlertCircle className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold text-lg">
                      In Progress Cases (
                      {
                        allAssignments.filter((a) => a.status === "in_progress")
                          .length
                      }
                      )
                    </span>
                  </div>
                  <InProgressTable
                    data={allAssignments.filter(
                      (a) => a.status === "in_progress"
                    )}
                    onPriorityChange={(caseNumber, newPriority) =>
                      handlePriorityChange(caseNumber, newPriority, "assigned")
                    }
                    onCompleteTask={handleCompleteTask}
                    onViewDetails={handleViewCaseDetails}
                    onChatOpen={handleChatOpen}
                    getPriorityIcon={getPriorityIcon}
                  />
                </>
              ),
              "outward-pending": (
                <>
                  <div className="flex items-center gap-2 mb-2 mt-2">
                    <ArrowLeft className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-lg">
                      Outward Pending Cases (
                      {currentDepartment.outwardPending.length})
                    </span>
                  </div>
                  <OutwardPendingTable
                    data={currentDepartment.outwardPending}
                    onPriorityChange={(caseNumber, newPriority) =>
                      handlePriorityChange(
                        caseNumber,
                        newPriority,
                        "outward-pending"
                      )
                    }
                    onMakeOutward={handleMakeOutward}
                    onViewDetails={handleViewCaseDetails}
                    onChatOpen={handleChatOpen}
                    getPriorityIcon={getPriorityIcon}
                  />
                </>
              ),
              technicians: (
                <>
                  <div className="flex items-center justify-between mb-2 mt-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      <span className="font-semibold text-lg">
                        Technicians ({currentDepartment.technicians.length})
                      </span>
                    </div>
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
                    inwardPendingCases={currentDepartment.inwardPending}
                    onAssign={handleSelfAssign}
                    getStatusBadge={getStatusBadge}
                  />
                </>
              ),
            }}
          />
        </div>
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
