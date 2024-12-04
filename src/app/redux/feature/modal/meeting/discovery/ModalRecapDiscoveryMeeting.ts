import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalRecapDiscoveryMeeting: false,
  dateModalRecapDiscoveryMeeting: "",
  emailModalRecapDiscoveryMeeting: "",
};

const ModalRecapDiscoveryMeeting = createSlice({
  name: "ModalRecapDiscoveryMeeting",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalRecapDiscoveryMeeting = true;
      state.dateModalRecapDiscoveryMeeting = action.payload.date;
      state.emailModalRecapDiscoveryMeeting = action.payload.email;
    },
    close: (state) => {
      state.displayModalRecapDiscoveryMeeting = false;
      state.dateModalRecapDiscoveryMeeting = "";
      state.emailModalRecapDiscoveryMeeting = "";
    },
  },
});

export default ModalRecapDiscoveryMeeting;