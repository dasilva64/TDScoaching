import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalCalendarEditMeetingRendezVous: false,
  dataModalCalendarEditMeetingRendezVous: "",
};

const ModalCalendarEditMeetingRendezVous = createSlice({
  name: "ModalCalendarEditMeetingRendezVous",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalCalendarEditMeetingRendezVous = true;
    },
    close: (state) => {
      state.displayModalCalendarEditMeetingRendezVous = false;
    },
  },
});

export default ModalCalendarEditMeetingRendezVous;