import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalFormuleAddRendezVous: false,
  typeModalFormuleAddRendezVous: "",
};

const ModalFormuleAddRendezVous = createSlice({
  name: "ModalFormuleAddRendezVous",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalFormuleAddRendezVous = true;
      state.typeModalFormuleAddRendezVous = action.payload.type
    },
    close: (state) => {
      state.displayModalFormuleAddRendezVous = false;
      state.typeModalFormuleAddRendezVous = "";
    },
  },
});

export default ModalFormuleAddRendezVous;