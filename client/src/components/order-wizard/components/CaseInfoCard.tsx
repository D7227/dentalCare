import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Phone, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/store/hooks";
import { useGetTeamMembersByClinicQuery } from "@/store/slices/teamMemberApi";
import CommonModal from "@/components/common/CommonModal";

interface CaseInfoCardProps {
  formData: any;
  setFormData: (data: any) => void;
  render?: boolean;
  editing?: boolean;
}

interface Clinic {
  id: string;
  clinicName: string;
  firstname: string;
  lastname: string;
}

const CaseInfoCard = ({
  formData,
  setFormData,
  render = false,
  editing = false,
}: CaseInfoCardProps) => {
  const [errors, setErrors] = useState<{
    doctorMobile?: string;
    consultingDoctorMobile?: string;
  }>({});
  const [clinicSearchTerm, setClinicSearchTerm] = useState("");
  const [isClinicDropdownOpen, setIsClinicDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(formData);
  const endPort = window.location.pathname;

  const UserData = useAppSelector((state) => state.userData);
  const user = UserData.userData;

  // Function to validate mobile number input
  const validateMobileNumber = (value: string): boolean => {
    // Only allow digits
    const numberOnly = /^\d*$/.test(value);
    return numberOnly;
  };

  // --- Handlers for editData (modal) ---
  const handleEditChange = (field: string, value: any) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }));
  };
  const handleEditMobileNumberChange = (field: string, value: string) => {
    if (value === "" || validateMobileNumber(value)) {
      setEditData((prev: any) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: "Please enter only numbers" }));
    }
  };

  // --- Handlers for formData (default mode) ---
  const handleFormChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };
  const handleFormMobileNumberChange = (field: string, value: string) => {
    if (value === "" || validateMobileNumber(value)) {
      setFormData((prev: any) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: "Please enter only numbers" }));
    }
  };

  // --- Data fetching ---
  const {
    data: teamMembers = [],
    error,
    isLoading,
  } = useGetTeamMembersByClinicQuery(user?.clinicId ?? "", {
    skip: !user?.clinicId,
  });
  const {
    data: clinics = [],
    isLoading: clinicsLoading,
    error: clinicsError,
  } = useQuery({
    queryKey: ["/api/clinics"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/clinics", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error("Failed to fetch clinics");
      return response.json();
    },
  });

  const availableTeamMembers = Array.isArray(teamMembers)
    ? teamMembers.filter((member: any) => {
        const isCurrentUser = member.fullName === user?.fullName;
        const isReceptionist =
          member.roleName?.toLowerCase() === "receptionist";
        return !isCurrentUser && !isReceptionist;
      })
    : [];

  // --- Clinic select logic ---
  const handleClinicSelect = (clinic: Clinic, isEdit = false) => {
    if (isEdit) {
      setEditData((prev: any) => ({ ...prev, clinicId: clinic.id }));
      setClinicSearchTerm(clinic.clinicName);
    } else {
      setFormData((prev: any) => ({ ...prev, clinicId: clinic.id }));
      setClinicSearchTerm(clinic.clinicName);
    }
    setIsClinicDropdownOpen(false);
  };

  // --- Render helpers ---
  const renderInputs = (
    data: any,
    onChange: any,
    onMobileChange: any,
    isEdit = false
  ) => (
    <div className="space-y-4">
      {endPort === "/qa-dashboard/place-order" && (
        <div className="relative">
          <Label className="text-sm font-medium mb-2 block">
            Clinic Name *
          </Label>
          <div className="relative">
            <Input
              placeholder={
                clinicsLoading
                  ? "Loading clinics..."
                  : "Search and select clinic"
              }
              value={clinicSearchTerm}
              onChange={(e) => setClinicSearchTerm(e.target.value)}
              onFocus={() => setIsClinicDropdownOpen(true)}
              className="pl-8"
              disabled={clinicsLoading}
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {isClinicDropdownOpen && (
            <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto shadow-lg">
              <CardContent className="p-0">
                {clinicsLoading ? (
                  <div className="p-3 text-sm text-gray-500 text-center">
                    Loading clinics...
                  </div>
                ) : clinicsError ? (
                  <div className="p-3 text-sm text-red-500 text-center">
                    Failed to load clinics
                  </div>
                ) : clinics.length > 0 ? (
                  clinics.map((clinic: Clinic) => (
                    <div
                      key={clinic.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handleClinicSelect(clinic, isEdit)}
                    >
                      <div className="font-medium text-sm text-gray-900">
                        {clinic.clinicName}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {clinic.firstname} {clinic.lastname}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-sm text-gray-500 text-center">
                    {clinicSearchTerm
                      ? "No clinics found"
                      : "No clinics available"}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
      <div className="space-y-1">
        <Label htmlFor="caseHandleBy">Case Handled By *</Label>
        <Select
          value={data.caseHandledById || ""}
          onValueChange={(value) => {
            const selectedMember = availableTeamMembers?.find(
              (member: any) => member.id === value
            );
            onChange("caseHandledById", selectedMember?.id || "");
            onChange("caseHandleBy", selectedMember?.fullName || "");
            onChange(
              "doctorMobile",
              selectedMember?.contactNumber || data.doctorMobile
            );
          }}
          disabled={isLoading || !!error}
        >
          <SelectTrigger className="mt-1" style={{ borderRadius: "0.5rem" }}>
            <SelectValue
              placeholder={
                isLoading
                  ? "Loading..."
                  : error
                  ? "Failed to load team members"
                  : "Select team member"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <div className="p-2 text-sm text-gray-500">
                Loading team members...
              </div>
            ) : error ? (
              <div className="p-2 text-sm text-red-500">
                Failed to load team members
              </div>
            ) : availableTeamMembers.length === 0 ? (
              <div className="p-2 text-sm text-gray-500">
                No team members available
              </div>
            ) : (
              availableTeamMembers.map((member: any) => (
                <SelectItem key={member.id} value={member.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{member.fullName}</span>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label htmlFor="doctorMobile">Doctor Mobile Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
          <Input
            id="doctorMobile"
            style={{ borderRadius: "0.5rem" }}
            value={data.doctorMobile}
            onChange={(e) => onMobileChange("doctorMobile", e.target.value)}
            className="mt-1 pl-10"
            placeholder="Enter mobile number (numbers only)"
            error={!!errors.doctorMobile}
            errorMessage={errors.doctorMobile}
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="consultingDoctor">Consulting Doctor</Label>
        <Input
          id="consultingDoctor"
          style={{ borderRadius: "0.5rem" }}
          value={data.consultingDoctor}
          onChange={(e) => onChange("consultingDoctor", e.target.value)}
          className="mt-1"
          placeholder="Enter Consulting Doctor Name"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="consultingDoctorMobile">
          Consulting Doctor Mobile Number
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
          <Input
            id="consultingDoctorMobile"
            style={{ borderRadius: "0.5rem" }}
            value={data.consultingDoctorMobile}
            onChange={(e) =>
              onMobileChange("consultingDoctorMobile", e.target.value)
            }
            className="mt-1 pl-10"
            placeholder="Enter mobile number (numbers only)"
            error={!!errors.doctorMobile}
            errorMessage={errors.consultingDoctorMobile}
          />
        </div>
      </div>
    </div>
  );

  const renderSummary = (data: any) => (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Clinic Name</Label>
        <div className="text-sm font-medium">{data.clinicName || "-"}</div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Case Handled By</Label>
        <div className="text-sm font-medium">{data.caseHandleBy || "-"}</div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Doctor Mobile</Label>
        <div className="text-sm font-medium">{data.doctorMobile || "-"}</div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">
          Consulting Doctor
        </Label>
        <div className="text-sm font-medium">
          {data.consultingDoctor || "-"}
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">
          Consulting Doctor Mobile
        </Label>
        <div className="text-sm font-medium">
          {data.consultingDoctorMobile || "-"}
        </div>
      </div>
    </div>
  );

  // --- Main render ---
  return (
    <>
      <Card>
        <CardHeader className="py-3 flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            Clinic Information
          </CardTitle>
          {editing && (
            <button
              onClick={() => {
                setEditData(formData);
                setIsModalOpen(true);
              }}
              className="ml-2 px-3 py-1 rounded bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200"
            >
              Edit
            </button>
          )}
        </CardHeader>
        <CardContent>
          {render || editing
            ? renderSummary(formData)
            : renderInputs(
                formData,
                handleFormChange,
                handleFormMobileNumberChange,
                false
              )}
        </CardContent>
      </Card>
      <CommonModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Update Clinic Information"
      >
        <div className="space-y-4 p-2">
          {renderInputs(
            editData,
            handleEditChange,
            handleEditMobileNumberChange,
            true
          )}
        </div>
        <div className="flex justify-end pt-4 gap-2">
          <button
            className="px-4 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            onClick={() => {
              setEditData(formData);
              setIsModalOpen(false);
            }}
          >
            Cancel
          </button>
          <button
            className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => {
              setFormData(editData);
              setIsModalOpen(false);
            }}
          >
            Save Changes
          </button>
        </div>
      </CommonModal>
    </>
  );
};

export default CaseInfoCard;
