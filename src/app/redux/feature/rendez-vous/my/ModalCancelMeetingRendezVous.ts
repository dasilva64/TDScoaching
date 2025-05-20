import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalCancelMeetingRendezVous: false,
  dataModalCancelMeetingRendezVous: "",
};

const ModalCancelMeetingRendezVous = createSlice({
  name: "ModalCancelMeetingRendezVous",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalCancelMeetingRendezVous = true;
    },
    close: (state) => {
      state.displayModalCancelMeetingRendezVous = false;
    },
  },
});

export default ModalCancelMeetingRendezVous;