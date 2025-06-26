import React, { useCallback, useState } from 'react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export interface UploadedFile {
  fileName: string;
  fileType: string;
  url: string;
}

interface FileUploaderProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
  disabled?: boolean;
  label?: string;
  description?: string;
}

const FileUploader = ({
  files,
  onFilesChange,
  maxFiles = 5,
  maxFileSize = 10,
  acceptedTypes = ['.png', '.jpg', '.jpeg', '.stl', '.pdf'],
  className = '',
  disabled = false,
  label = 'Upload Files',
  description = 'Drag and drop files here or click to browse'
}: FileUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File "${file.name}" is too large. Maximum size is ${maxFileSize}MB.`;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      return `File "${file.name}" has an unsupported format. Accepted formats: ${acceptedTypes.join(', ')}`;
    }

    return null;
  };

  // Simulate file upload and generate URL (in real app, this would upload to server/cloud)
  const uploadFile = async (file: File): Promise<UploadedFile> => {
    // In a real implementation, this would upload to your server or cloud storage
    // For now, we'll create a blob URL as a placeholder
    const url = URL.createObjectURL(file);
    
    return {
      fileName: file.name,
      fileType: file.type,
      url: url
    };
  };

  const handleFiles = useCallback(async (newFiles: FileList | File[]) => {
    if (disabled) return;
    
    const fileArray = Array.from(newFiles);
    const validationErrors: string[] = [];
    const validFiles: File[] = [];

    // Check total file count
    if (files.length + fileArray.length > maxFiles) {
      validationErrors.push(`Cannot upload more than ${maxFiles} files.`);
      setErrors(validationErrors);
      return;
    }

    // Validate each file
    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        validationErrors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      toast({
        title: "Upload Error",
        description: validationErrors[0],
        variant: "destructive",
      });
    } else {
      setErrors([]);
      setUploading(true);
      
      // Convert files to UploadedFile format
      try {
        const uploadedFiles = await Promise.all(
          validFiles.map(file => uploadFile(file))
        );
        
        onFilesChange([...files, ...uploadedFiles]);
        toast({
          title: "Files Uploaded",
          description: `${uploadedFiles.length} file(s) uploaded successfully.`,
        });
      } catch (error) {
        toast({
          title: "Upload Error",
          description: "Failed to upload files. Please try again.",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    }
  }, [files, maxFiles, maxFileSize, acceptedTypes, onFilesChange, toast, disabled]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setDragActive(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    if (disabled) return;
    
    const updatedFiles = files.filter((_, i) => i !== index);
    onFilesChange(updatedFiles);
    
    toast({
      title: "File Removed",
      description: "File has been removed from upload list.",
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            {label}
            {files.length > 0 && (
              <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {files.length}/{maxFiles}
              </span>
            )}
          </label>
        </div>
      )}

      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          disabled 
            ? 'border-muted bg-muted/20 cursor-not-allowed' 
            : dragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 cursor-pointer'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="text-center">
          <Upload className={`mx-auto h-12 w-12 mb-4 ${
            disabled ? 'text-muted-foreground/50' : 'text-muted-foreground'
          }`} />
          <div>
            <label htmlFor="file-upload" className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}>
              <span className={`font-medium ${
                disabled 
                  ? 'text-muted-foreground/50' 
                  : 'text-primary hover:text-primary/80'
              }`}>
                {uploading ? 'Uploading...' : 'Click to upload'}
              </span>
              <span className="text-muted-foreground"> or drag and drop</span>
            </label>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              multiple
              accept={acceptedTypes.join(',')}
              onChange={handleFileInput}
              disabled={disabled || uploading}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {description || `${acceptedTypes.join(', ').toUpperCase()} up to ${maxFileSize}MB each (max ${maxFiles} files)`}
          </p>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          ))}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Uploaded Files ({files.length}/{maxFiles})</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-md"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{file.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {file.fileType}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  disabled={disabled}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;