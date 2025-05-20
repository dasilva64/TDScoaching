import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalFormuleEditRendezVous: false,
  idModalFormuleEditRendezVous: ""
};

const ModalFormuleEditRendezVous = createSlice({
  name: "ModalFormuleEditRendezVous",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalFormuleEditRendezVous = true;
      state.idModalFormuleEditRendezVous = action.payload.id
    },
    close: (state) => {
      state.displayModalFormuleEditRendezVous = false;
      state.idModalFormuleEditRendezVous = ""
    },
  },
});

export default ModalFormuleEditRendezVous;