import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalCancelMeetingRendezVous: false,
  typeModalCancelMeetingRendezVous: "",
};

const ModalCancelMeetingRendezVous = createSlice({
  name: "ModalCancelMeetingRendezVous",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalCancelMeetingRendezVous = true;
      state.typeModalCancelMeetingRendezVous = action.payload.type;
    },
    close: (state) => {
      state.displayModalCancelMeetingRendezVous = false;
      state.typeModalCancelMeetingRendezVous = "";
    },
  },
});

export default ModalCancelMeetingRendezVous;