import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalTwoFAActivation: false,
};

const ModalTwoFAActivation = createSlice({
  name: "ModalTwoFAActivation",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalTwoFAActivation = true;
    },
    close: (state) => {
      state.displayModalTwoFAActivation = false;
    },
  },
});

export default ModalTwoFAActivation;