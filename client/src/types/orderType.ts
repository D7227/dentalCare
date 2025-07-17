// import { d } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

// export interface UploadedFile {
//   intraOralScan: File;
//   faceScan: File;
//   addPatientPhotos: File;
//   referralImages: File;
// }

// export type OrderCategoryType = "new" | "repeat" | "repair" | null;

// export type OrderMethodType = "digital" | "manual";

// export type PrescriptionType =
//   | "fixed-restoration"
//   | "implant"
//   | "splints-guards"
//   | "ortho"
//   | "dentures"
//   | "sleep-accessories"
//   | "";

// export interface ShadeGuide {
//   type: "anterior" | "posterior";
//   shades: string[];
// }
// export interface Accessorios {
//   name: string;
//   qut: number;
// }

// export interface Product {
//   id: string;
//   name: string;
//   category: PrescriptionType;
//   material: string;
//   description: string;
//   quantity: number;
// }

// export interface ToothDetail {
//   teethNumber: number;
//   type: "abutment" | "pontic";
//   productName: string[];
//   productQuantity: number;
//   shadeDetails?: string;
//   occlusalStaining?: string;
//   shadeGuide?: ShadeGuide | null;
//   shadeNotes?: string;
//   trialRequirements?: string;
//   implantDetails?: {
//     companyName: string;
//     systemName: string;
//     remarks: string;
//     photo?: File;
//   };
// }

// export interface TeethGroup {
//   groupType: "bridge" | "joint" | "separate" | "individual";
//   prescriptionId: string;
//   subPrescriptionId: string;
//   shadeDetails: string;
//   occlusalStaining: string;
//   shadeGuide: ShadeGuide | null;
//   shadeNotes: string;
//   trialRequirements: string;
//   selectedProducts: Product[];
//   teethDetails: ToothDetail[][];
// }

// export interface SelectedTeeth {
//   type: "abutment" | "pontic";
//   toothNumber: number;
//   prescriptionType: "implant" | "crown-bridge";
//   subcategoryType: string;
//   productName: string[];
//   shadeDetails: string;
//   occlusalStaining: string;
//   shadeGuide: ShadeGuide | null;
//   shadeNotes: string;
//   trialRequirements: string;
//   implantDetails?: {
//     companyName: string;
//     systemName: string;
//     remarks: string;
//     photo?: File;
//   };
//   selectedProducts: Product[];
// }

// export interface PickUpData {
//   pickUpDate: string;
//   pickUpTime: string;
//   pickUpMessage: string;
// }

// export interface CourierData {
//   courierName: string;
//   courierTrakingId: string;
// }

// export interface OrderType {
//   firstName: string;
//   lastName: string;
//   age: number;
//   sex: string;
//   clinicId: string;
//   caseHandleBy: string;
//   doctorMobileNumber: string;
//   consultingDoctorName: string;
//   consultingDoctorMobileNumber: string;
//   orderMethod: string; //Digital || Manual
//   prescriptionTypesId: string[];
//   subPrescriptionTypesId: string[];
//   selectedTeeth: SelectedTeeth[];
//   teethGroup: TeethGroup[];
//   teethNumber: [];
//   products: [];
//   files: UploadedFile;
//   accessorios: Accessorios[];
//   handllingType: string;
//   pickupData: PickUpData[];
//   courierData: CourierData[];
//   resonOfReject: string;
//   resonOfRescan: string;
//   rejectNote: string;
//   orderId: string;
//   crateNo: string;
//   qaNote: string;
//   orderBy: string;
//   AcpectedDileveryData: Date;
//   lifeCycle: [];
//   orderStatus: string;
//   refId: string;
//   orderDate: string;
//   updateDate: string;
//   totalAmount: string;
//   paymentType: string;
//   doctorNote: string;
//   orderType: string;
// }

// export interface orderTableType {
//   id: string;
//   refId: string;
//   orderId?: string;
//   prescriptionTypes: string[];
//   subPrescriptionTypes: string[];
//   orderDate: string;
//   orderType: string;
//   orderStatus: string;
//   products: [];
//   paymentStatus: string;
//   firstName: string;
//   lastName: string;
//   percentage: number | string;
//   orderMethod: string;
//   logs: any;
//   message: any;
// }
