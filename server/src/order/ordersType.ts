export interface doctorOrderTableType {
    id: string;
    refId: string;
    orderId?: string;
    prescriptionTypes: string[];
    subPrescriptionTypes: string[];
    orderDate: any;
    orderType: string;
    orderStatus: string;
    products: [];
    paymentStatus: string;
    firstName: string;
    lastName: string;
    percentage: number | string;
    orderMethod: string;
    logs: any;
    message: any;
  }
  
  