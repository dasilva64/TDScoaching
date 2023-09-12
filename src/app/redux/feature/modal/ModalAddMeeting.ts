import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalAddMeeting: false,
  dataModalAddMeeting: "",
};

const ModalAddMeeting = createSlice({
  name: "ModalAddMeeting",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalAddMeeting = true;
      state.dataModalAddMeeting = action.payload.date;
    },
    close: (state) => {
      state.displayModalAddMeeting = false;
      state.dataModalAddMeeting = "";
    },
  },
});

export default ModalAddMeeting;
