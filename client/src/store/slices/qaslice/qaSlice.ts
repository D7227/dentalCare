import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { DailyReport } from '@/qaScreen/data/dailyReports';

interface QaUser {
  id: string;
  name: string;
  email: string;
  // Add more fields as needed
}

interface QaState {
  user: QaUser | null;
  token: string | null;
  dailyReports: DailyReport[];
}

const initialState: QaState = {
  user: null,
  token: null,
  dailyReports: [],
};

const qaSlice = createSlice({
  name: 'qa',
  initialState,
  reducers: {
    setQaUser(state, action: PayloadAction<QaUser | null>) {
      state.user = action.payload;
    },
    setQaToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    setQaDailyReports(state, action: PayloadAction<any>) {
      // Accepts either an array or an object with a 'data' array
      if (Array.isArray(action.payload)) {
        state.dailyReports = action.payload;
      } else if (action.payload && Array.isArray(action.payload.data)) {
        state.dailyReports = action.payload.data;
      } else {
        state.dailyReports = [];
      }
    },
    addQaDailyReport(state, action: PayloadAction<DailyReport>) {
      state.dailyReports.unshift(action.payload);
    },
    clearQa(state) {
      state.user = null;
      state.token = null;
      state.dailyReports = [];
    },
  },
});

export const { setQaUser, setQaToken, setQaDailyReports, addQaDailyReport, clearQa } = qaSlice.actions;
export default qaSlice.reducer;

// Selectors
export const selectQaUser = (state: { qa: QaState }) => state.qa.user;
export const selectQaToken = (state: { qa: QaState }) => state.qa.token;
export const selectQaDailyReports = (state: { qa: QaState }) => state.qa.dailyReports;
