import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalDeleteMeeting: false,
};

const ModalDeleteMeeting = createSlice({
  name: "ModalDeleteMeeting",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalDeleteMeeting = true;
    },
    close: (state) => {
      state.displayModalDeleteMeeting = false;
    },
  },
});

export default ModalDeleteMeeting;
