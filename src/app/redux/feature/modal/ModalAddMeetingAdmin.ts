import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalAddMeetingAdmin: false,
  dataModalAddMeetingAdmin: "",
};

const ModalAddMeetingAdmin = createSlice({
  name: "ModalAddMeetingAdmin",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalAddMeetingAdmin = true;
      state.dataModalAddMeetingAdmin = action.payload.date;
    },
    close: (state) => {
      state.displayModalAddMeetingAdmin = false;
      state.dataModalAddMeetingAdmin = "";
    },
  },
});

export default ModalAddMeetingAdmin;
