import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalConfirmDiscoveryMeetingRendezVousToken: false,
  dataModalConfirmDiscoveryMeetingRendezVousToken: "",
};

const ModalConfirmDiscoveryMeetingRendezVousToken = createSlice({
  name: "ModalConfirmDiscoveryMeetingRendezVousToken",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalConfirmDiscoveryMeetingRendezVousToken = true;
    },
    close: (state) => {
      state.displayModalConfirmDiscoveryMeetingRendezVousToken = false;
    },
  },
});

export default ModalConfirmDiscoveryMeetingRendezVousToken;