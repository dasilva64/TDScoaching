import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalSurMesure: false,
};

const ModalSurMesure = createSlice({
  name: "ModalSurMesure",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalSurMesure = true;
    },
    close: (state) => {
      state.displayModalSurMesure = false;
    },
  },
});

export default ModalSurMesure;
