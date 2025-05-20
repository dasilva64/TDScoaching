import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalRecapDiscoveryMeetingHeader: false,
  dateModalRecapDiscoveryMeetingHeader: "",
  emailModalRecapDiscoveryMeetingHeader: "",
  typeModalRecapDiscoveryMeetingHeader: "",
};

const ModalRecapDiscoveryMeetingHeader = createSlice({
  name: "ModalRecapDiscoveryMeetingHeader",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalRecapDiscoveryMeetingHeader = true;
      state.dateModalRecapDiscoveryMeetingHeader = action.payload.date;
      state.emailModalRecapDiscoveryMeetingHeader = action.payload.email;
      state.typeModalRecapDiscoveryMeetingHeader = action.payload.type;
    },
    close: (state) => {
      state.displayModalRecapDiscoveryMeetingHeader = false;
      state.dateModalRecapDiscoveryMeetingHeader = "";
      state.emailModalRecapDiscoveryMeetingHeader = "";
      state.typeModalRecapDiscoveryMeetingHeader = "";
    },
  },
});

export default ModalRecapDiscoveryMeetingHeader;