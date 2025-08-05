import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { DailyReport } from "@/qaScreen/data/dailyReports";

interface DepartmentHeadUser {
  id: string;
  name: string;
  email: string;
}

interface DepartmentHeadState {
  departmentHeadUser: DepartmentHeadUser | null;
  departmentHeadToken: string | null;
  dailyReports: DailyReport[];
}

const initialState: DepartmentHeadState = {
  departmentHeadUser: null,
  departmentHeadToken: localStorage.getItem("department-head-token"),
  dailyReports: [],
};

const departmentHeadSlice = createSlice({
  name: "departmentHead",
  initialState,
  reducers: {
    setDepartmentHeadUser(
      state,
      action: PayloadAction<DepartmentHeadUser | null>
    ) {
      state.departmentHeadUser = action.payload;
    },
    setDepartmentHeadToken(state, action: PayloadAction<string | null>) {
      state.departmentHeadToken = action.payload;
    },
    clearDepartmentHead(state) {
      state.departmentHeadUser = null;
      state.departmentHeadToken = null;
      state.dailyReports = [];
      // Clear the department head token from localStorage
      localStorage.removeItem("department-head-token");
    },
  },
});

export const {
  setDepartmentHeadUser,
  setDepartmentHeadToken,
  clearDepartmentHead,
} = departmentHeadSlice.actions;
export default departmentHeadSlice.reducer;

// Selectors
export const selectDepartmentHeadUser = (state: {
  departmentHead: DepartmentHeadState;
}) => state.departmentHead?.departmentHeadUser;
export const selectDepartmentHeadToken = (state: {
  departmentHead: DepartmentHeadState;
}) => state.departmentHead?.departmentHeadToken;
export const selectDepartmentHeadDailyReports = (state: {
  departmentHead: DepartmentHeadState;
}) => state.departmentHead?.dailyReports;
