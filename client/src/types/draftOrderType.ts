import { d } from "node_modules/vite/dist/node/types.d-aGj9QkWt";
import { Accessorios, CourierData, PickUpData, SelectedTeeth, TeethGroup, UploadedFile } from "./orderType";

export interface DraftOrderType{
    firstName:string;
    lastName:string;
    age:number;
    sex:string;
    clinicId:string;
    caseHandleBy:string;
    doctorMobileNumber:string;
    consultingDoctorName: string;
    consultingDoctorMobileNumber: string;
    orderMethod:string; //Digital || Manual
    prescriptionTypesId:string[];
    subPrescriptionTypesId:string[];
    selectedTeeth:SelectedTeeth[];
    teethGroup:TeethGroup[];
    teethNumber:[];
    products: [];
    files:UploadedFile;
    accessorios:Accessorios[];
    handllingType:string;
    pickupData:PickUpData[];
    courierData:CourierData[];
    resonOfReject:string;
    resonOfRescan:string;
    rejectNote:string;
    orderId:string;
    crateNo:string;
    qaNote:string;
    orderBy:string;
    AcpectedDileveryData:Date;
    lifeCycle:[];
    orderStatus:string;
    refId:string;
    orderDate:string;
    updateDate:string;
    totalAmount:string;
    paymentType:string;
    doctorNote:string;
    orderType:string;
    step:number;
   }