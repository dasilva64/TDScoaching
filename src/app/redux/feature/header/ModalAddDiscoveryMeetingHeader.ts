import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalAddDiscoveryMeetingHeader: false,
  dataModalAddDiscoveryMeetingHeader: "",
};

const ModalAddDiscoveryMeetingHeader = createSlice({
  name: "ModalAddDiscoveryMeetingHeader",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalAddDiscoveryMeetingHeader = true;
      state.dataModalAddDiscoveryMeetingHeader = action.payload.date;
    },
    close: (state) => {
      state.displayModalAddDiscoveryMeetingHeader = false;
      state.dataModalAddDiscoveryMeetingHeader = "";
    },
  },
});

export default ModalAddDiscoveryMeetingHeader;