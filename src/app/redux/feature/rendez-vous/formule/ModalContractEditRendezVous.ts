import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalContractEditRendezVous: false,
  typeModalContractEditRendezVous: "",
};

const ModalContractEditRendezVous = createSlice({
  name: "ModalContractEditRendezVous",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalContractEditRendezVous = true;
      state.typeModalContractEditRendezVous = action.payload.type;
    },
    close: (state) => {
      state.displayModalContractEditRendezVous = false;
      state.typeModalContractEditRendezVous = "";
    },
  },
});

export default ModalContractEditRendezVous;