import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalCalendarAddMeetingRendezVous: false,
};

const ModalCalendarAddMeetingRendezVous = createSlice({
  name: "ModalCalendarAddMeetingRendezVous",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalCalendarAddMeetingRendezVous = true;
    },
    close: (state) => {
      state.displayModalCalendarAddMeetingRendezVous = false;
    },
  },
});

export default ModalCalendarAddMeetingRendezVous;