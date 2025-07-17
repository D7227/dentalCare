import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Smartphone, FileText, User } from "lucide-react";
import CommonModal from "@/components/common/CommonModal";
import { cn } from "@/lib/utils";

interface OrderTypeSectionProps {
  formData: any;
  setFormData: (data: any) => void;
  readMode?: boolean;
  editMode?: boolean;
}

const OrderTypeSection = ({
  formData,
  setFormData,
  readMode = false,
  editMode = false,
}: OrderTypeSectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(formData);

  // Handlers for editData (modal)
  const handleEditValue = (field: string, value: string) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }));
  };
  // Handlers for formData (default mode)
  const handleFormValue = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  // Render input fields (for both default and edit mode)
  const renderInputs = (data: any, onValueChange: any) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Digital Card */}
      <Card
        className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
          data.orderMethod === "digital"
            ? "border-teal-500 bg-teal-50 shadow-md"
            : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={() => onValueChange("orderMethod", "digital")}
      >
        <CardContent className="p-4 text-center">
          <div
            className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
              data.orderMethod === "digital" ? "bg-teal-100" : "bg-gray-100"
            }`}
          >
            <Smartphone
              className={`w-6 h-6 ${
                data.orderMethod === "digital"
                  ? "text-teal-600"
                  : "text-gray-600"
              }`}
            />
          </div>
          <h3
            className={`font-medium text-sm ${
              data.orderMethod === "digital" ? "text-teal-700" : "text-gray-700"
            }`}
          >
            Digital
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Digital impressions & files
          </p>
        </CardContent>
      </Card>
      {/* Manual Card */}
      <Card
        className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
          data.orderMethod === "manual"
            ? "border-teal-500 bg-teal-50 shadow-md"
            : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={() => onValueChange("orderMethod", "manual")}
      >
        <CardContent className="p-4 text-center">
          <div
            className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
              data.orderMethod === "manual" ? "bg-teal-100" : "bg-gray-100"
            }`}
          >
            <FileText
              className={`w-6 h-6 ${
                data.orderMethod === "manual"
                  ? "text-teal-600"
                  : "text-gray-600"
              }`}
            />
          </div>
          <h3
            className={`font-medium text-sm ${
              data.orderMethod === "manual" ? "text-teal-700" : "text-gray-700"
            }`}
          >
            Manual
          </h3>
          <p className="text-xs text-gray-500 mt-1">Physical impressions</p>
        </CardContent>
      </Card>
    </div>
  );

  // Render summary
  const renderSummary = (data: any) => (
    <div className="flex flex-col gap-2">
      <Label className="text-xs text-muted-foreground">Order Type</Label>
      <div className="text-sm font-medium">
        {data.orderMethod === "digital"
          ? "Digital (Digital impressions & files)"
          : data.orderMethod === "manual"
          ? "Manual (Physical impressions)"
          : "-"}
      </div>
    </div>
  );

  // Save handler for modal
  const handleSave = () => {
    setFormData(editData);
    setIsModalOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="py-3 flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold flex gap-2 items-center">
            <div
              className={cn(
                "p-2 border bg-[#1D4ED826] text-[#1D4ED8] h-[32px] w-[32px] rounded-[6px]",
                readMode || editMode ? "flex" : "hidden"
              )}
            >
              <User className="h-4 w-4" />
            </div>
            Order Type
          </CardTitle>
          {editMode && (
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
          {readMode || editMode
            ? renderSummary(formData)
            : renderInputs(formData, handleFormValue)}
        </CardContent>
      </Card>
      <CommonModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Update Order Type"
      >
        <div className="space-y-4 p-2">
          {renderInputs(editData, handleEditValue)}
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
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </CommonModal>
    </>
  );
};

export default OrderTypeSection;
