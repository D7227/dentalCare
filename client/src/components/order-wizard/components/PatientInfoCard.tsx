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
import CommonModal from "@/components/common/CommonModal";

interface PatientInfoCardProps {
  formData: any;
  setFormData: (data: any) => void;
  render?: boolean;
  editing?: boolean;
}

const PatientInfoCard = ({
  formData,
  setFormData,
  render = false,
  editing = false,
}: PatientInfoCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(formData);

  const capitalizeWords = (text: string): string => text.toUpperCase();

  // Handlers for editData (modal)
  const handleEditNameChange = (field: "firstName" | "lastName", value: string) => {
    setEditData((prev: any) => ({
      ...prev,
      [field]: capitalizeWords(value),
    }));
  };
  const handleEditAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (
      value === "" ||
      (/^\d+$/.test(value) && parseInt(value) >= 1 && parseInt(value) <= 99)
    ) {
      setEditData((prev: any) => ({
        ...prev,
        age: value,
      }));
    }
  };
  const handleEditSexChange = (value: string) => {
    setEditData((prev: any) => ({
      ...prev,
      sex: value,
    }));
  };

  // Handlers for formData (default mode)
  const handleFormNameChange = (field: "firstName" | "lastName", value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: capitalizeWords(value),
    }));
  };
  const handleFormAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (
      value === "" ||
      (/^\d+$/.test(value) && parseInt(value) >= 1 && parseInt(value) <= 99)
    ) {
      setFormData((prev: any) => ({
        ...prev,
        age: value,
      }));
    }
  };
  const handleFormSexChange = (value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      sex: value,
    }));
  };

  const handleSave = () => {
    setFormData(editData);
    setIsModalOpen(false);
  };

  // Updated renderInputs to accept handlers
  const renderInputs = (data: any, onNameChange: any, onAgeChange: any, onSexChange: any) => (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label>First Name *</Label>
        <Input
          value={data.firstName}
          onChange={(e) => onNameChange("firstName", e.target.value)}
          placeholder="Enter first name"
        />
      </div>
      <div className="space-y-1">
        <Label>Last Name *</Label>
        <Input
          value={data.lastName}
          onChange={(e) => onNameChange("lastName", e.target.value)}
          placeholder="Enter last name"
        />
      </div>
      <div className="space-y-1">
        <Label>Years</Label>
        <Input
          type="number"
          value={data.age}
          onChange={onAgeChange}
          placeholder="Enter age"
        />
      </div>
      <div className="space-y-1">
        <Label>Gender</Label>
        <Select value={data.sex} onValueChange={onSexChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select sex" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderSummary = (data: any) => (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">First Name</Label>
        <div className="text-sm font-medium">{data.firstName || "-"}</div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Last Name</Label>
        <div className="text-sm font-medium">{data.lastName || "-"}</div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Age</Label>
        <div className="text-sm font-medium">{data.age || "-"}</div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Sex</Label>
        <div className="text-sm font-medium">
          {data.sex
            ? data.sex.charAt(0).toUpperCase() + data.sex.slice(1)
            : "-"}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Card>
        <CardHeader className="py-3 flex justify-between items-center flex-row">
          <CardTitle className="text-xl font-semibold">
            Patient Information
          </CardTitle>
          {editing && (
            <button
              onClick={() => {
                setEditData(formData);
                setIsModalOpen(true);
              }}
              className="ml-2 px-3 py-1 rounded bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200"
            >
              edit
            </button>
          )}
        </CardHeader>
        <CardContent>
          {render || editing
            ? renderSummary(formData)
            : renderInputs(formData, handleFormNameChange, handleFormAgeChange, handleFormSexChange)}
        </CardContent>
      </Card>

      <CommonModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Update Patient Details"
      >
        <div className="space-y-4 p-2 ">{renderInputs(editData, handleEditNameChange, handleEditAgeChange, handleEditSexChange)}</div>
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
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </CommonModal>
    </>
  );
};

export default PatientInfoCard;
