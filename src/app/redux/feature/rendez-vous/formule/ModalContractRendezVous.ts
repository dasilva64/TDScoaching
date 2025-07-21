import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalContractRendezVous: false,
  typeModalContractRendezVous: "",
  statusModalContractRendezVous: ""
};

const ModalContractRendezVous = createSlice({
  name: "ModalContractRendezVous",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalContractRendezVous = true;
      state.typeModalContractRendezVous = action.payload.type;
      state.statusModalContractRendezVous = action.payload.statut;
    },
    close: (state) => {
      state.displayModalContractRendezVous = false;
      state.typeModalContractRendezVous = "";
      state.statusModalContractRendezVous= ""
    },
  },
});

export default ModalContractRendezVous;