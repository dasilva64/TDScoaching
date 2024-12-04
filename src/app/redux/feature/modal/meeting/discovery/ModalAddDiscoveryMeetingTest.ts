import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalAddDiscoveryMeetingTest: false,
  dataModalAddDiscoveryMeetingTest: "",
};

const ModalAddDiscoveryMeetingTest = createSlice({
  name: "ModalAddDiscoveryMeetingTest",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalAddDiscoveryMeetingTest = true;
      state.dataModalAddDiscoveryMeetingTest = action.payload.date;
    },
    close: (state) => {
      state.displayModalAddDiscoveryMeetingTest = false;
      state.dataModalAddDiscoveryMeetingTest = "";
    },
  },
});

export default ModalAddDiscoveryMeetingTest;