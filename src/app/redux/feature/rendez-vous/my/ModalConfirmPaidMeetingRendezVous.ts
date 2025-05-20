import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalConfirmPaidMeetingRendezVous: false,
  dateModalConfirmPaidMeetingRendezVous: "",
};

const ModalConfirmPaidMeetingRendezVous = createSlice({
  name: "ModalConfirmPaidMeetingRendezVous",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalConfirmPaidMeetingRendezVous = true;
      state.dateModalConfirmPaidMeetingRendezVous = action.payload.date;
    },
    close: (state) => {
      state.displayModalConfirmPaidMeetingRendezVous = false;
      state.dateModalConfirmPaidMeetingRendezVous = "";
    },
  },
});

export default ModalConfirmPaidMeetingRendezVous;