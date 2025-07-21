import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalContractRecapRendezVous: false,
  typeModalContractRecapRendezVous: "",
};

const ModalContractRecapRendezVous = createSlice({
  name: "ModalContractRecapRendezVous",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalContractRecapRendezVous = true;
      state.typeModalContractRecapRendezVous = action.payload.type;
    },
    close: (state) => {
      state.displayModalContractRecapRendezVous = false;
      state.typeModalContractRecapRendezVous = "";
    },
  },
});

export default ModalContractRecapRendezVous;