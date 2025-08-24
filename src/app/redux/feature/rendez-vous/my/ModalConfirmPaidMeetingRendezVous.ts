import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalConfirmPaidMeetingRendezVous: false,
};

const ModalConfirmPaidMeetingRendezVous = createSlice({
  name: "ModalConfirmPaidMeetingRendezVous",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalConfirmPaidMeetingRendezVous = true;
    },
    close: (state) => {
      state.displayModalConfirmPaidMeetingRendezVous = false;
    },
  },
});

export default ModalConfirmPaidMeetingRendezVous;