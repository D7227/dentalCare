import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Smartphone, FileText } from "lucide-react";


interface OrderTypeSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}


const OrderTypeSection = ({ formData, setFormData }: OrderTypeSectionProps) => {
  return (
    <Card className="bg-custonLightGray-100">
      <CardHeader className="py-3">
        <CardTitle className="text-xl font-semibold">
          Order Type
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Digital Card */}
          <Card
            className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${formData.orderMethod === "digital"
              ? "border-teal-500 bg-teal-50 shadow-md"
              : "border-gray-200 hover:border-gray-300"
              }`}
            onClick={() =>
              setFormData({
                ...formData,
                orderMethod: "digital",
              })
            }
          >
            <CardContent className="p-4 text-center">
              <div
                className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${formData.orderMethod === "digital"
                  ? "bg-teal-100"
                  : "bg-gray-100"
                  }`}
              >
                <Smartphone
                  className={`w-6 h-6 ${formData.orderMethod === "digital"
                    ? "text-teal-600"
                    : "text-gray-600"
                    }`}
                />
              </div>
              <h3
                className={`font-medium text-sm ${formData.orderMethod === "digital"
                  ? "text-teal-700"
                  : "text-gray-700"
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
            className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${formData.orderMethod === "manual"
              ? "border-teal-500 bg-teal-50 shadow-md"
              : "border-gray-200 hover:border-gray-300"
              }`}
            onClick={() =>
              setFormData({
                ...formData,
                orderMethod: "manual",
              })
            }
          >
            <CardContent className="p-4 text-center">
              <div
                className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${formData.orderMethod === "manual"
                  ? "bg-teal-100"
                  : "bg-gray-100"
                  }`}
              >
                <FileText
                  className={`w-6 h-6 ${formData.orderMethod === "manual"
                    ? "text-teal-600"
                    : "text-gray-600"
                    }`}
                />
              </div>
              <h3
                className={`font-medium text-sm ${formData.orderMethod === "manual"
                  ? "text-teal-700"
                  : "text-gray-700"
                  }`}
              >
                Manual
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Physical impressions
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTypeSection