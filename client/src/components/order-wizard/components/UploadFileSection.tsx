import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Combined3DPreview from "../Combined3DPreview";
import { useToast } from "@/hooks/use-toast";
import { Download, FileChartColumnIncreasing } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadFileSectionProps {
  formData: any;
  setFormData: any;
  readMode?: boolean;
  download?: boolean;
}

function formatFileSize(size: number) {
  if (size >= 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + " MB";
  }
  return (size / 1024).toFixed(2) + " KB";
}

const fileTypeMap: Record<string, string[]> = {
  "Intra oral scans (STL/PLY)": [".stl", ".ply"],
  "Face scans (JPG/PNG)": [".jpg", ".jpeg", ".png"],
  "Add patient photos (JPG/PNG)": [".jpg", ".jpeg", ".png"],
  "Referral images/docs (PDF/JPG/PNG)": [".pdf", ".jpg", ".jpeg", ".png"],
};

const UploadFileSection: React.FC<UploadFileSectionProps> = ({
  formData,
  setFormData,
  readMode = false,
  download = false,
}) => {
  const viewerRef = useRef(null);
  const { toast } = useToast();

  const handleDownload = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  const validateFiles = (files: File[], label: string) => {
    const allowedTypes = fileTypeMap[label];
    const validFiles = files.filter((file) =>
      allowedTypes.some((ext) => file.name.toLowerCase().endsWith(ext))
    );
    const invalidFiles = files.filter(
      (file) =>
        !allowedTypes.some((ext) => file.name.toLowerCase().endsWith(ext))
    );
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid file type(s)",
        description: `The following file(s) are not allowed: ${invalidFiles
          .map((f) => f.name)
          .join(", ")}. Allowed types: ${allowedTypes.join(", ")}`,
        variant: "destructive",
      });
    }
    return validFiles;
  };

  const renderFileList = (files: File[], label: string) => (
    <div>
      <Label className="text-base font-medium mb-1 block">{label}</Label>
      {readMode ? (
        <div className="mt-2 space-y-1">
          {files.length === 0 ? (
            <div className="text-xs text-gray-400">No files selected</div>
          ) : (
            files.map((file, idx) => (
              <div
                key={idx}
                className="text-xs text-gray-700 flex items-center gap-2 justify-between"
              >
                <span>
                  <span className="font-semibold text-black">{file.name}</span>
                  <span className="ml-2 text-gray-500">
                    ({formatFileSize(file.size)})
                  </span>
                </span>
                {download && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-2 px-2 py-1 text-xs flex items-center gap-1 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 text-blue-700 transition-colors"
                    onClick={() => handleDownload(file)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <>
          <Input
            type="file"
            accept={fileTypeMap[label].join(",")}
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              const validFiles = validateFiles(files, label);
              if (validFiles.length === 0) return;
              const key =
                label === "Intra oral scans (STL/PLY)"
                  ? "intraOralScans"
                  : label === "Face scans (JPG/PNG)"
                  ? "faceScans"
                  : label === "Add patient photos (JPG/PNG)"
                  ? "patientPhotos"
                  : "referralFiles";
              setFormData({
                ...formData,
                [key]: validFiles,
              });
            }}
          />
          <div className="mt-2 space-y-1">
            {files.length === 0 ? (
              <div className="text-xs text-gray-400">No files selected</div>
            ) : (
              files.map((file, idx) => (
                <div
                  key={idx}
                  className="text-xs text-gray-700 flex items-center gap-2"
                >
                  {file.name}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        {readMode || download ? (
          <>
            <CardTitle className="text-xl font-semibold flex gap-2 items-center">
              <div
                className={cn(
                  "p-2 border bg-[#1D4ED826] text-[#1D4ED8] h-[32px] w-[32px] rounded-[6px]",
                  readMode || download ? "flex" : "hidden"
                )}
              >
                <FileChartColumnIncreasing className="h-4 w-4" />
              </div>
              File Upload Summary
            </CardTitle>
          </>
        ) : (
          <>
            <CardTitle className="text-lg sm:text-xl font-semibold">
              Upload Files
            </CardTitle>
            <CardDescription className="text-xs sm:text-base">
              Please upload patient details
            </CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: File Inputs or Previews */}
          <div className="flex flex-col gap-4">
            {renderFileList(
              formData.intraOralScans || [],
              "Intra oral scans (STL/PLY)"
            )}
            {renderFileList(formData.faceScans || [], "Face scans (JPG/PNG)")}
            {renderFileList(
              formData.patientPhotos || [],
              "Add patient photos (JPG/PNG)"
            )}
            {renderFileList(
              formData.referralFiles || [],
              "Referral images/docs (PDF/JPG/PNG)"
            )}
          </div>
          {/* Right: STL Preview */}
          <div className="flex flex-col items-center justify-start w-full">
            <div
              ref={viewerRef}
              style={{
                width: 400,
                height: 400,
                border: "1px solid #ccc",
                borderRadius: 8,
                backgroundColor: "#000", // black background
                overflow: "hidden",
              }}
            >
              {(formData.intraOralScans || []).length > 0 ? (
                <Combined3DPreview files={formData.intraOralScans} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No STL/PLY file selected
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadFileSection;
