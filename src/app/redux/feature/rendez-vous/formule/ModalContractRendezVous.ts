import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalContractRendezVous: false,
  typeModalContractRendezVous: "",
};

const ModalContractRendezVous = createSlice({
  name: "ModalContractRendezVous",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalContractRendezVous = true;
      state.typeModalContractRendezVous = action.payload.type;
    },
    close: (state) => {
      state.displayModalContractRendezVous = false;
      state.typeModalContractRendezVous = "";
    },
  },
});

export default ModalContractRendezVous;