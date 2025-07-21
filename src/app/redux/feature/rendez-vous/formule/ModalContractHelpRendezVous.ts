import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalContractHelpRendezVous: false,
};

const ModalContractHelpRendezVous = createSlice({
  name: "ModalContractHelpRendezVous",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalContractHelpRendezVous = true;
    },
    close: (state) => {
      state.displayModalContractHelpRendezVous = false;
    },
  },
});

export default ModalContractHelpRendezVous;