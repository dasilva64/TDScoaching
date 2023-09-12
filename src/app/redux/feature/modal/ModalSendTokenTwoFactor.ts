import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalSendTokenTwoFactor: false,
};

const ModalSendTokenTwoFactor = createSlice({
  name: "ModalSendTokenTwoFactor",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalSendTokenTwoFactor = true;
    },
    close: (state) => {
      state.displayModalSendTokenTwoFactor = false;
    },
  },
});

export default ModalSendTokenTwoFactor;
