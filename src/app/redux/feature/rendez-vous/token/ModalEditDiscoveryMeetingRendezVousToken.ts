import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalEditDiscoveryMeetingRendezVousToken: false,
  dateModalEditDiscoveryMeetingRendezVousToken: "",
};

const ModalEditDiscoveryMeetingRendezVousToken = createSlice({
  name: "ModalEditDiscoveryMeetingRendezVousToken",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalEditDiscoveryMeetingRendezVousToken = true;
      state.dateModalEditDiscoveryMeetingRendezVousToken = action.payload.date;
    },
    close: (state) => {
      state.displayModalEditDiscoveryMeetingRendezVousToken = false;
      state.dateModalEditDiscoveryMeetingRendezVousToken = "";
    },
  },
});

export default ModalEditDiscoveryMeetingRendezVousToken;