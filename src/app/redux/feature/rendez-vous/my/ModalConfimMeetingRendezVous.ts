import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalConfirmMeetingRendezVous: false,
  dateModalConfirmMeetingRendezVous: "",
};

const ModalConfirmMeetingRendezVous = createSlice({
  name: "ModalConfirmMeetingRendezVous",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalConfirmMeetingRendezVous = true;
      state.dateModalConfirmMeetingRendezVous = action.payload.date;
    },
    close: (state) => {
      state.displayModalConfirmMeetingRendezVous = false;
      state.dateModalConfirmMeetingRendezVous = "";
    },
  },
});

export default ModalConfirmMeetingRendezVous;