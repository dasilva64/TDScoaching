import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalTakeNextMeeting: false,
  dateModalTakeNextMeeting: "",
};

const ModalTakeNextMeeting = createSlice({
  name: "ModalTakeNextMeeting",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalTakeNextMeeting = true;
      state.dateModalTakeNextMeeting = action.payload.date;
    },
    close: (state) => {
      state.displayModalTakeNextMeeting = false;
      state.dateModalTakeNextMeeting = "";
    },
  },
});

export default ModalTakeNextMeeting;
