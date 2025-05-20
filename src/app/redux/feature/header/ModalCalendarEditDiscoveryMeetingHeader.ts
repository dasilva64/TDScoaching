import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalCalendarEditDiscoveryMeetingHeader: false,
};

const ModalCalendarEditDiscoveryMeetingHeader = createSlice({
  name: "ModalCalendarEditDiscoveryMeetingHeader",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalCalendarEditDiscoveryMeetingHeader = true;
    },
    close: (state) => {
      state.displayModalCalendarEditDiscoveryMeetingHeader = false;
    },
  },
});

export default ModalCalendarEditDiscoveryMeetingHeader;