import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalTwoFADesactivation: false,
};

const ModalTwoFADesactivation = createSlice({
  name: "ModalTwoFADesactivation",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalTwoFADesactivation = true;
    },
    close: (state) => {
      state.displayModalTwoFADesactivation = false;
    },
  },
});

export default ModalTwoFADesactivation;