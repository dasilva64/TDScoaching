import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalAddMeetingRendezVous: false,
  dateModalAddMeetingRendezVous: "",
};

const ModalAddMeetingRendezVous = createSlice({
  name: "ModalAddMeetingRendezVous",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalAddMeetingRendezVous = true;
      state.dateModalAddMeetingRendezVous = action.payload.date;
    },
    close: (state) => {
      state.displayModalAddMeetingRendezVous = false;
      state.dateModalAddMeetingRendezVous = "";
    },
  },
});

export default ModalAddMeetingRendezVous;