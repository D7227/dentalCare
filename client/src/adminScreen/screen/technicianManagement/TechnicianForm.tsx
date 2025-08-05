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
import { useToast } from "@/hooks/use-toast";

interface TechnicianFormProps {
  technician?: Technician;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  departments: Department[];
  isLoading?: boolean;
}

const TechnicianForm: React.FC<TechnicianFormProps> = ({
  technician,
  onSubmit,
  onCancel,
  departments,
  isLoading = false,
}) => {
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required field validations
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters long";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters long";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (
        !phoneRegex.test(
          formData.mobileNumber.trim().replace(/[\s\-\(\)]/g, "")
        )
      ) {
        newErrors.mobileNumber = "Please enter a valid mobile number";
      }
    }

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = "Employee ID is required";
    } else if (formData.employeeId.trim().length < 3) {
      newErrors.employeeId = "Employee ID must be at least 3 characters long";
    }

    if (!formData.departmentId) {
      newErrors.departmentId = "Department is required";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    // Password validation for new technicians
    if (!technician) {
      if (!formData.password.trim()) {
        newErrors.password = "Password is required for new technicians";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters long";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const isValid = validateForm();
    if (!isValid) {
      return; // Don't submit if validation fails
    }

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
    // Reset form data to original values
    if (technician) {
      setFormData({
        firstName: technician.firstName || "",
        lastName: technician.lastName || "",
        email: technician.email || "",
        mobileNumber: technician.mobileNumber || "",
        employeeId: technician.employeeId || "",
        departmentId: technician.departmentId || "",
        password: "",
        status: technician.status || "active",
      });
    } else {
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
    // Call onCancel instead of onSubmit
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <Input
            value={formData.firstName}
            onChange={(e) => {
              setFormData({ ...formData, firstName: e.target.value });
              if (errors.firstName) {
                setErrors({ ...errors, firstName: "" });
              }
            }}
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <Input
            value={formData.lastName}
            onChange={(e) => {
              setFormData({ ...formData, lastName: e.target.value });
              if (errors.lastName) {
                setErrors({ ...errors, lastName: "" });
              }
            }}
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) {
                setErrors({ ...errors, email: "" });
              }
            }}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Mobile Number
          </label>
          <Input
            value={formData.mobileNumber}
            onChange={(e) => {
              setFormData({ ...formData, mobileNumber: e.target.value });
              if (errors.mobileNumber) {
                setErrors({ ...errors, mobileNumber: "" });
              }
            }}
            className={errors.mobileNumber ? "border-red-500" : ""}
          />
          {errors.mobileNumber && (
            <p className="text-sm text-red-500 mt-1">{errors.mobileNumber}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Employee ID</label>
          <Input
            value={formData.employeeId}
            onChange={(e) => {
              setFormData({ ...formData, employeeId: e.target.value });
              if (errors.employeeId) {
                setErrors({ ...errors, employeeId: "" });
              }
            }}
            className={errors.employeeId ? "border-red-500" : ""}
          />
          {errors.employeeId && (
            <p className="text-sm text-red-500 mt-1">{errors.employeeId}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Department</label>
          <Select
            value={formData.departmentId}
            onValueChange={(value) => {
              setFormData({ ...formData, departmentId: value });
              if (errors.departmentId) {
                setErrors({ ...errors, departmentId: "" });
              }
            }}
          >
            <SelectTrigger className={errors.departmentId ? "border-red-500" : ""}>
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
          {errors.departmentId && (
            <p className="text-sm text-red-500 mt-1">{errors.departmentId}</p>
          )}
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
          onChange={(e) => {
            setFormData({ ...formData, password: e.target.value });
            if (errors.password) {
              setErrors({ ...errors, password: "" });
            }
          }}
          className={errors.password ? "border-red-500" : ""}
          placeholder={
            technician
              ? "Enter new password or leave blank to keep current"
              : "Enter password"
          }
        />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password}</p>
        )}
        {technician && !errors.password && (
          <p className="text-xs text-gray-500 mt-1">
            Enter new password or leave blank to keep the current password
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <Select
          value={formData.status}
          onValueChange={(value) => {
            setFormData({
              ...formData,
              status: value as "active" | "inactive",
            });
            if (errors.status) {
              setErrors({ ...errors, status: "" });
            }
          }}
        >
          <SelectTrigger className={errors.status ? "border-red-500" : ""}>
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && (
          <p className="text-sm text-red-500 mt-1">{errors.status}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {technician ? "Updating..." : "Adding..."}
            </div>
          ) : technician ? (
            "Update Technician"
          ) : (
            "Add Technician"
          )}
        </Button>
      </div>
    </form>
  );
};

export default TechnicianForm;
