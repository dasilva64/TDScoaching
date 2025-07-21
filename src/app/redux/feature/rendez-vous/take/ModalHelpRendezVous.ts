import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalHelpRendezVous: false,
};

const ModalHelpRendezVous = createSlice({
  name: "ModalHelpRendezVous",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalHelpRendezVous = true;
    },
    close: (state) => {
      state.displayModalHelpRendezVous = false;
    },
  },
});

export default ModalHelpRendezVous;