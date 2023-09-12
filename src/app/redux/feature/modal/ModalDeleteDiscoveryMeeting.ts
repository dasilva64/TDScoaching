import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalDeleteDiscoveryMeeting: false,
};

const ModalDeleteDiscoveryMeeting = createSlice({
  name: "ModalDeleteDiscoveryMeeting",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalDeleteDiscoveryMeeting = true;
    },
    close: (state) => {
      state.displayModalDeleteDiscoveryMeeting = false;
    },
  },
});

export default ModalDeleteDiscoveryMeeting;
