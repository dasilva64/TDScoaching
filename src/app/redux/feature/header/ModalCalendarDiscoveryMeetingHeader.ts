import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalCalendarDiscoveryMeetingHeader: false,
};

const ModalCalendarDiscoveryMeetingHeader = createSlice({
  name: "ModalCalendarDiscoveryMeetingHeader",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalCalendarDiscoveryMeetingHeader = true;
    },
    close: (state) => {
      state.displayModalCalendarDiscoveryMeetingHeader = false;
    },
  },
});

export default ModalCalendarDiscoveryMeetingHeader;