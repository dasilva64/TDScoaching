import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalCalendarTakeNextMeeting: false,
};

const ModalCalendarTakeNextMeeting = createSlice({
  name: "ModalCalendarTakeNextMeeting",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalCalendarTakeNextMeeting = true;
    },
    close: (state) => {
      state.displayModalCalendarTakeNextMeeting = false;
    },
  },
});

export default ModalCalendarTakeNextMeeting;
