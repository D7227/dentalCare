import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Technician, type Department } from "@/store/slices/technicianApi";

interface TechnicianFormProps {
  technician?: Technician;
  onSubmit: (data: any) => void;
  departments: Department[];
}

const TechnicianForm: React.FC<TechnicianFormProps> = ({
  technician,
  onSubmit,
  departments,
}) => {
  const [formData, setFormData] = useState({
    firstName: technician?.firstName || "",
    lastName: technician?.lastName || "",
    email: technician?.email || "",
    mobileNumber: technician?.mobileNumber || "",
    employeeId: technician?.employeeId || "",
    departmentId: technician?.departmentId || "",
    password: "", // Added password field for registration
    status: technician?.status || "active",
  });

  // Update form data when technician prop changes
  useEffect(() => {
    if (technician) {
      setFormData({
        firstName: technician.firstName || "",
        lastName: technician.lastName || "",
        email: technician.email || "",
        mobileNumber: technician.mobileNumber || "",
        employeeId: technician.employeeId || "",
        departmentId: technician.departmentId || "",
        password: "", // Don't populate password for edit mode
        status: technician.status || "active",
      });
    } else {
      // Reset form for new technician
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        mobileNumber: "",
        employeeId: "",
        departmentId: "",
        password: "",
        status: "active",
      });
    }
  }, [technician]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare data based on whether it's create or update
    if (technician) {
      // Update mode - exclude password if empty
      const updateData = { ...formData };
      if (!updateData.password) {
        const { password, ...dataWithoutPassword } = updateData;
        onSubmit(dataWithoutPassword);
      } else {
        onSubmit(updateData);
      }
    } else {
      // Create mode - include all fields including password
      onSubmit(formData);
    }
  };

  const handleCancel = () => {
    onSubmit(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <Input
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <Input
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Mobile Number
          </label>
          <Input
            value={formData.mobileNumber}
            onChange={(e) =>
              setFormData({ ...formData, mobileNumber: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Employee ID</label>
          <Input
            value={formData.employeeId}
            onChange={(e) =>
              setFormData({ ...formData, employeeId: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Department</label>
          <Select
            value={formData.departmentId}
            onValueChange={(value) =>
              setFormData({ ...formData, departmentId: value })
            }
          >
            <SelectTrigger>
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

      {/* Password field - required for new technicians, optional for updates */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Password {!technician && <span className="text-red-500">*</span>}
        </label>
        <Input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required={!technician} // Required only for new technicians
          placeholder={
            technician
              ? "Leave blank to keep current password"
              : "Enter password"
          }
        />
        {technician && (
          <p className="text-xs text-gray-500 mt-1">
            Leave blank to keep the current password
          </p>
        )}
      </div>

      {technician && (
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                status: value as "active" | "inactive",
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {technician ? "Update Technician" : "Add Technician"}
        </Button>
      </div>
    </form>
  );
};

export default TechnicianForm;
