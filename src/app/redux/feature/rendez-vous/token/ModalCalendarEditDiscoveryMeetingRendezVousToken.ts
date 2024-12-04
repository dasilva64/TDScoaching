import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalCalendarEditDiscoveryMeetingRendezVousToken: false,
  dataModalCalendarEditDiscoveryMeetingRendezVousToken: "",
};

const ModalCalendarEditDiscoveryMeetingRendezVousToken = createSlice({
  name: "ModalCalendarEditDiscoveryMeetingRendezVousToken",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalCalendarEditDiscoveryMeetingRendezVousToken = true;
    },
    close: (state) => {
      state.displayModalCalendarEditDiscoveryMeetingRendezVousToken = false;
    },
  },
});

export default ModalCalendarEditDiscoveryMeetingRendezVousToken;