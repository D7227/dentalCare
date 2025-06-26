import { OrderData } from '../types/OrderData';

// Order status and badge utilities
export const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { label: string; variant: any }> = {
    pending_approval: { label: 'Pending Approval', variant: 'outline' },
    approved: { label: 'Approved', variant: 'secondary' },
    in_process: { label: 'In Process', variant: 'default' },
    completed: { label: 'Completed', variant: 'success' },
    rejected: { label: 'Rejected', variant: 'destructive' },
  };
  return statusMap[status] || { label: status, variant: 'outline' };
};

// Date formatting utilities
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Patient utilities
export const getPatientFullName = (patient: { firstName: string; lastName: string }) => {
  return `${patient.firstName} ${patient.lastName}`.trim();
};

export const getPatientDisplayName = (order: OrderData) => {
  return getPatientFullName(order.patient);
};

// Doctor utilities
export const getDoctorDisplayName = (order: OrderData) => {
  return order.doctor.name;
};

export const getDoctorClinicInfo = (order: OrderData) => {
  return `${order.doctor.clinicName}, ${order.doctor.city}`;
};

// Order type utilities
export const getOrderTypeLabel = (orderType: string) => {
  const typeMap: Record<string, string> = {
    new: 'New Order',
    repeat: 'Repeat Order',
    repair: 'Repair Order'
  };
  return typeMap[orderType] || orderType;
};

// Tooth group utilities
export const extractTeethFromGroups = (toothGroups: any[]) => {
  const allTeeth: string[] = [];
  toothGroups.forEach(group => {
    if (group.teeth && Array.isArray(group.teeth)) {
      allTeeth.push(...group.teeth.map((tooth: any) => tooth.toString()));
    }
  });
  return Array.from(new Set(allTeeth)).sort((a, b) => parseInt(a) - parseInt(b));
};

// Order filtering utilities
export const filterOrders = (
  orders: OrderData[],
  filters: {
    searchTerm: string;
    categoryFilter: string;
    statusFilter: string;
    orderTypeFilter: string;
  }
) => {
  const { searchTerm, categoryFilter, statusFilter, orderTypeFilter } = filters;
  
  return orders.filter((order: OrderData) => {
    const patientName = getPatientDisplayName(order);
    const doctorName = getDoctorDisplayName(order);
    const matchesSearch = searchTerm === '' ||
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.restorationType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || order.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesOrderType = orderTypeFilter === 'all' || order.orderType === orderTypeFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesOrderType;
  });
};

// Order validation utilities
export const validateOrderData = (orderData: Partial<OrderData>): string[] => {
  const errors: string[] = [];
  
  if (!orderData.referenceId?.trim()) errors.push('Reference ID is required');
  if (!orderData.patient?.firstName?.trim()) errors.push('Patient first name is required');
  if (!orderData.patient?.lastName?.trim()) errors.push('Patient last name is required');
  if (!orderData.patient?.age) errors.push('Patient age is required');
  if (!orderData.patient?.sex) errors.push('Patient sex is required');
  if (!orderData.doctor?.name?.trim()) errors.push('Doctor name is required');
  if (!orderData.doctor?.clinicName?.trim()) errors.push('Clinic name is required');
  if (!orderData.category?.trim()) errors.push('Category is required');
  if (!orderData.restorationType?.trim()) errors.push('Restoration type is required');
  if (!orderData.productSelection?.trim()) errors.push('Product selection is required');
  if (!orderData.orderType) errors.push('Order type is required');
  
  return errors;
};

// File utilities
export const getFileTypeIcon = (fileType: string) => {
  const typeMap: Record<string, string> = {
    'image': '🖼️',
    'pdf': '📄',
    'doc': '📝',
    'docx': '📝',
    'zip': '📦'
  };
  return typeMap[fileType] || '📎';
};

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};