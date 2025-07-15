import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { OrderType } from "@/types/orderType";

interface OrderLocalState {
  order: Partial<OrderType>;
  step: number;
}

const initialOrder: Partial<OrderType> = {
  firstName: "",
  lastName: "",
  age: 0,
  sex: "",
  clinicId: "",
  caseHandleBy: "",
  doctorMobileNumber: "",
  consultingDoctorName: "",
  consultingDoctorMobileNumber: "",
  orderMethod: "",
  prescriptionTypesId: [],
  subPrescriptionTypesId: [],
  selectedTeeth: [],
  teethGroup: [],
  teethNumber: [],
  products: [],
  files: {
    intraOralScan: null,
    faceScan: null,
    addPatientPhotos: null,
    referralImages: null,
  },
  accessorios: [],
  handllingType: "",
  pickupData: [],
  courierData: [],
  resonOfReject: "",
  resonOfRescan: "",
  rejectNote: "",
  orderId: "",
  crateNo: "",
  qaNote: "",
  orderBy: "",
  AcpectedDileveryData: undefined,
  lifeCycle: [],
  orderStatus: "pending",
  refId: "",
  orderDate: "",
  updateDate: "",
  totalAmount: "",
  paymentType: "",
  doctorNote: "",
  orderType: "", // New | Repeat | Repair
};

const initialState: OrderLocalState = {
  order: initialOrder,
  step: 0,
};

const orderLocalSlice = createSlice({
  name: "orderLocal",
  initialState,
  reducers: {
    setOrder(state, action: PayloadAction<Partial<OrderType>>) {
      state.order = { ...state.order, ...action.payload };
    },
    setStep(state, action: PayloadAction<number>) {
      state.step = action.payload;
    },
    resetOrder(state) {
      state.order = initialOrder;
      state.step = 0;
    },
    initializeOrder(
      state,
      action: PayloadAction<{ order: Partial<OrderType>; step: number }>
    ) {
      state.order = action.payload.order;
      state.step = action.payload.step;
    },
  },
});

export const { setOrder, setStep, resetOrder, initializeOrder } =
  orderLocalSlice.actions;
export default orderLocalSlice.reducer;