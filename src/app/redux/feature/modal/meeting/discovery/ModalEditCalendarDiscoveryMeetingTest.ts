import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalEditDiscoveryMeetingTest: false,
  dataModalEditDiscoveryMeetingTest: "",
};

const ModalEditDiscoveryMeetingTest = createSlice({
  name: "ModalEditDiscoveryMeetingTest",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalEditDiscoveryMeetingTest = true;
    },
    close: (state) => {
      state.displayModalEditDiscoveryMeetingTest = false;
    },
  },
});

export default ModalEditDiscoveryMeetingTest;