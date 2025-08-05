import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedChatId: null,
};

const chatslice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSelectedChatId(state, action) {
      state.selectedChatId = action.payload;
    },
  },
});

export const { setSelectedChatId } = chatslice.actions;
export default chatslice.reducer;
