import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalHelpPaiementRendezVous: false,
};

const ModalHelpPaiementRendezVous = createSlice({
  name: "ModalHelpPaiementRendezVous",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalHelpPaiementRendezVous = true;
    },
    close: (state) => {
      state.displayModalHelpPaiementRendezVous = false;
    },
  },
});

export default ModalHelpPaiementRendezVous;