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

export interface QaStatusApiBody {
    status: string;
    orderId: string;
    qaNote:string;
    crateNo:string;
    resonOfReject:string;
    resonOfRescan:string;
    rejectNote:string;
    userName:string;
}


export interface FilterBody {
    status : string;
}