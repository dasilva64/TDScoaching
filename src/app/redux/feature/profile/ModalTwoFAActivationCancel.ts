import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalTwoFAActivationCancel: false,
};

const ModalTwoFAActivationCancel = createSlice({
  name: "ModalTwoFAActivationCancel",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalTwoFAActivationCancel = true;
    },
    close: (state) => {
      state.displayModalTwoFAActivationCancel = false;
    },
  },
});

export default ModalTwoFAActivationCancel;