import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalDeleteMeetingRendezVous: false,
  dataModalDeleteMeetingRendezVous: "",
};

const ModalDeleteMeetingRendezVous = createSlice({
  name: "ModalDeleteMeetingRendezVous",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalDeleteMeetingRendezVous = true;
    },
    close: (state) => {
      state.displayModalDeleteMeetingRendezVous = false;
    },
  },
});

export default ModalDeleteMeetingRendezVous;