import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalAddPaidMeetingRendezVous: false,
  dateModalAddPaidMeetingRendezVous: "",
};

const ModalAddPaidMeetingRendezVous = createSlice({
  name: "ModalAddPaidMeetingRendezVous",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalAddPaidMeetingRendezVous = true;
      state.dateModalAddPaidMeetingRendezVous = action.payload.date;
    },
    close: (state) => {
      state.displayModalAddPaidMeetingRendezVous = false;
      state.dateModalAddPaidMeetingRendezVous = "";
    },
  },
});

export default ModalAddPaidMeetingRendezVous;