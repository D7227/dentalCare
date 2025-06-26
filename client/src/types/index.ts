// Re-export shared types for easier imports
export * from '../../../shared/types/OrderData';
export * from '../../../shared/types/OrderFormData';
export * from '../../../shared/utils/orderUtils';

// File upload components and types
export { default as FileUploader } from '../components/shared/FileUploader';
export type { UploadedFile } from '../components/shared/FileUploader';
export { default as FileUploadZone } from '../components/FileUploadZone';