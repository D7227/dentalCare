import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { DraftOrderType } from "@/types/draftOrderType";

interface DraftOrderState {
  draftOrder: Partial<DraftOrderType>;
  step: number;
}

const initialDraftOrder: Partial<DraftOrderType> = {
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
  files: undefined,
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
  orderType: "",
  step: 0,
};

const initialState: DraftOrderState = {
  draftOrder: initialDraftOrder,
  step: 0,
};

const draftOrderSlice = createSlice({
  name: "draftOrder",
  initialState,
  reducers: {
    setDraftOrder(state, action: PayloadAction<Partial<DraftOrderType>>) {
      state.draftOrder = { ...state.draftOrder, ...action.payload };
    },
    setDraftStep(state, action: PayloadAction<number>) {
      state.step = action.payload;
    },
    resetDraftOrder(state) {
      state.draftOrder = initialDraftOrder;
      state.step = 0;
    },
    initializeDraftOrder(
      state,
      action: PayloadAction<{ draftOrder: Partial<DraftOrderType>; step: number }>
    ) {
      state.draftOrder = action.payload.draftOrder;
      state.step = action.payload.step;
    },
  },
});

export const { setDraftOrder, setDraftStep, resetDraftOrder, initializeDraftOrder } = draftOrderSlice.actions;
export default draftOrderSlice.reducer; 