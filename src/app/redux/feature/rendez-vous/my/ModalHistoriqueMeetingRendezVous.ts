import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalHistoriqueMeetingRendezVous: false,
};

const ModalHistoriqueMeetingRendezVous = createSlice({
  name: "ModalHistoriqueMeetingRendezVous",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalHistoriqueMeetingRendezVous = true;
    },
    close: (state) => {
      state.displayModalHistoriqueMeetingRendezVous = false;
    },
  },
});

export default ModalHistoriqueMeetingRendezVous;