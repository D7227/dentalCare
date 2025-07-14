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
import { useGetTeamMembersQuery } from "@/store/slices/termMember";

interface CaseInfoCardProps {
  formData: any;
  setFormData: (data: any) => void;
}

interface Clinic {
  id: string;
  clinicName: string;
  firstname: string;
  lastname: string;
}

const CaseInfoCard = ({ formData, setFormData }: CaseInfoCardProps) => {
  const [errors, setErrors] = useState<{
    doctorMobile?: string;
    consultingDoctorMobile?: string;
  }>({});
  const [clinicSearchTerm, setClinicSearchTerm] = useState("");
  const [isClinicDropdownOpen, setIsClinicDropdownOpen] = useState(false);
  const endPort = window.location.pathname;

  const { user } = useAppSelector((state) => state.auth);

  console.log("user", user);

  const clinicDoctors = [
    {
      id: "dr1",
      name: "Dr. James Wilson",
      role: "Consulting Dr.",
    },
    {
      id: "dr2",
      name: "Dr. Sarah Chen",
      role: "Senior Dentist",
    },
    {
      id: "dr3",
      name: "Dr. Michael Brown",
      role: "Orthodontist",
    },
    {
      id: "dr4",
      name: "Dr. Emily Davis",
      role: "Prosthodontist",
    },
    {
      id: "dr5",
      name: "Dr. Robert Taylor",
      role: "Oral Surgeon",
    },
  ];

  // Function to validate mobile number input
  const validateMobileNumber = (value: string): boolean => {
    // Only allow digits
    const numberOnly = /^\d*$/.test(value);
    return numberOnly;
  };

  // Function to handle mobile number changes with validation
  const handleMobileNumberChange = (field: string, value: string) => {
    if (value === "" || validateMobileNumber(value)) {
      setFormData({
        ...formData,
        [field]: value,
      });

      // Clear error for this field
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    } else {
      // Set error message
      setErrors((prev) => ({
        ...prev,
        [field]: "Please enter only numbers",
      }));
    }
  };

  const clinicName = user?.clinicName;
  console.log(clinicName);
  // Fetch team members using RTK Query
  const clinicId = user?.clinicId;
  const teamQuery = clinicId
    ? useGetTeamMembersQuery(clinicId)
    : { data: [], isLoading: false, error: null };

  console.log("teamQuery", teamQuery);
  const teamMembers = teamQuery.data || [];
  const teamLoading = teamQuery.isLoading;
  const teamError = teamQuery.error;

  // Filter out current user and receptionists
  const availableTeamMembers = (teamMembers || []).filter((member: any) => {
    const isCurrentUser = member.fullName === user?.fullName;
    const isReceptionist = member.roleName?.toLowerCase() === "receptionist";
    return !isCurrentUser && !isReceptionist;
  });

  // Fetch all clinics for the search dropdown
  const {
    data: clinics = [],
    isLoading: clinicsLoading,
    error: clinicsError,
  } = useQuery({
    queryKey: ["/api/clinics"],
    queryFn: async () => {
      const response = await fetch("/api/clinics");
      if (!response.ok) throw new Error("Failed to fetch clinics");
      return response.json();
    },
  });

  const handleClinicSelect = (clinic: Clinic) => {
    setFormData({
      ...formData,
      clinicId: clinic.id,
    });
    setClinicSearchTerm(clinic.clinicName);
    setIsClinicDropdownOpen(false);
  };

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-xl font-semibold">
          Clinic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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

            {/* Dropdown */}
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
                        onClick={() => handleClinicSelect(clinic)}
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
        <div>
          <Label htmlFor="caseHandledBy">Case Handled By *</Label>
          <Select
            value={formData.caseHandledBy}
            onValueChange={(value) => {
              // Find the selected team member to get their mobile number
              const selectedMember = availableTeamMembers.find(
                (member: any) => member.fullName === value
              );

              setFormData({
                ...formData,
                caseHandledBy: value,
                // Automatically set the doctor's mobile number if available
                doctorMobile:
                  selectedMember?.contactNumber || formData.doctorMobile,
              });
            }}
          >
            <SelectTrigger
              className="mt-1"
              style={{
                borderRadius: "0.5rem",
              }}
            >
              <SelectValue
                placeholder={
                  teamLoading
                    ? "Loading..."
                    : teamError
                    ? "Failed to load"
                    : "Select doctor"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {teamLoading ? (
                <div className="p-2 text-gray-500">Loading team members...</div>
              ) : teamError ? (
                <div className="p-2 text-red-500">
                  Failed to load team members
                </div>
              ) : availableTeamMembers.length > 0 ? (
                availableTeamMembers.map(
                  (member: {
                    id: string;
                    fullName: string;
                    roleName: string;
                    contactNumber?: string;
                  }) => (
                    <SelectItem key={member.id} value={member.fullName}>
                      {member.fullName} ({member.roleName})
                    </SelectItem>
                  )
                )
              ) : (
                <div className="p-2 text-gray-500">No team members found</div>
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="doctorMobile">Doctor Mobile Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <Input
              id="doctorMobile"
              style={{
                borderRadius: "0.5rem",
              }}
              value={formData.doctorMobile}
              onChange={(e) =>
                handleMobileNumberChange("doctorMobile", e.target.value)
              }
              className="mt-1 pl-10"
              placeholder="Enter mobile number (numbers only)"
              error={!!errors.doctorMobile}
              errorMessage={errors.doctorMobile}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="consultingDoctor">Consulting Doctor</Label>
          <Input
            id="consultingDoctor"
            style={{
              borderRadius: "0.5rem",
            }}
            value={formData.consultingDoctor}
            onChange={(e) =>
              setFormData({
                ...formData,
                consultingDoctor: e.target.value,
              })
            }
            className="mt-1"
            placeholder="Enter Consulting Doctor Name"
          />
        </div>
        <div>
          <Label htmlFor="consultingDoctorMobile">
            Consulting Doctor Mobile Number
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <Input
              id="consultingDoctorMobile"
              style={{
                borderRadius: "0.5rem",
              }}
              value={formData.consultingDoctorMobile}
              onChange={(e) =>
                handleMobileNumberChange(
                  "consultingDoctorMobile",
                  e.target.value
                )
              }
              className="mt-1 pl-10"
              placeholder="Enter mobile number (numbers only)"
              error={!!errors.doctorMobile}
              errorMessage={errors.consultingDoctorMobile}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseInfoCard;
