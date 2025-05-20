import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalEditMeetingRendezVous: false,
  dateModalEditMeetingRendezVous: "",
};

const ModalEditMeetingRendezVous = createSlice({
  name: "ModalEditMeetingRendezVous",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalEditMeetingRendezVous = true;
      state.dateModalEditMeetingRendezVous = action.payload.date;
    },
    close: (state) => {
      state.displayModalEditMeetingRendezVous = false;
      state.dateModalEditMeetingRendezVous = "";
    },
  },
});

export default ModalEditMeetingRendezVous;