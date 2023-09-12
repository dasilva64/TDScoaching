import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalForgot: false,
};

const ModalForgot = createSlice({
  name: "ModalForgot",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalForgot = true;
    },
    close: (state) => {
      state.displayModalForgot = false;
    },
  },
});

export default ModalForgot;
