import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalDeleteDiscoveryMeetingRendezVousToken: false,
  dataModalDeleteDiscoveryMeetingRendezVousToken: "",
};

const ModalDeleteDiscoveryMeetingRendezVousToken = createSlice({
  name: "ModalDeleteDiscoveryMeetingRendezVousToken",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalDeleteDiscoveryMeetingRendezVousToken = true;
    },
    close: (state) => {
      state.displayModalDeleteDiscoveryMeetingRendezVousToken = false;
    },
  },
});

export default ModalDeleteDiscoveryMeetingRendezVousToken;