import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalCancelMeeting: false,
};

const ModalCancelMeeting = createSlice({
  name: "ModalCancelMeeting",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalCancelMeeting = true;
    },
    close: (state) => {
      state.displayModalCancelMeeting = false;
    },
  },
});

export default ModalCancelMeeting;
