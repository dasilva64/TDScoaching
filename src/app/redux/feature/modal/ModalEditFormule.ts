import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalEditFormule: false,
};

const ModalEditFormule = createSlice({
  name: "ModalEditFormule",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalEditFormule = true;
    },
    close: (state) => {
      state.displayModalEditFormule = false;
    },
  },
});

export default ModalEditFormule;
