import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalDiscoveryMeetingTest: false,
};

const ModalDiscoveryMeetingTest = createSlice({
  name: "ModalDiscoveryMeetingTest",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalDiscoveryMeetingTest = true;
    },
    close: (state) => {
      state.displayModalDiscoveryMeetingTest = false;
    },
  },
});

export default ModalDiscoveryMeetingTest;
