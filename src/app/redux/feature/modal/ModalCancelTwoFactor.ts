import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalCancelTwoFactor: false,
};

const ModalCancelTwoFactor = createSlice({
  name: "ModalCancelTwoFactor",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalCancelTwoFactor = true;
    },
    close: (state) => {
      state.displayModalCancelTwoFactor = false;
    },
  },
});

export default ModalCancelTwoFactor;
