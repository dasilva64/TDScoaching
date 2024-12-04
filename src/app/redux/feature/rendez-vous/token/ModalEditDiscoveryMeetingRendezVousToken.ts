import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalEditDiscoveryMeetingRendezVousToken: false,
  dataModalEditDiscoveryMeetingRendezVousToken: "",
};

const ModalEditDiscoveryMeetingRendezVousToken = createSlice({
  name: "ModalEditDiscoveryMeetingRendezVousToken",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalEditDiscoveryMeetingRendezVousToken = true;
      state.dataModalEditDiscoveryMeetingRendezVousToken = action.payload.date;
    },
    close: (state) => {
      state.displayModalEditDiscoveryMeetingRendezVousToken = false;
    },
  },
});

export default ModalEditDiscoveryMeetingRendezVousToken;