import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalFormuleCancelRendezVous: false,
};

const ModalFormuleCancelRendezVous = createSlice({
  name: "ModalFormuleCancelRendezVous",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalFormuleCancelRendezVous = true;
    },
    close: (state) => {
      state.displayModalFormuleCancelRendezVous = false;
    },
  },
});

export default ModalFormuleCancelRendezVous;