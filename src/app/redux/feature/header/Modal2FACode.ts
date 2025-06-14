import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModal2FACode: false,
};

const Modal2FACode = createSlice({
  name: "Modal2FACode",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModal2FACode = true;
    },
    close: (state) => {
      state.displayModal2FACode = false;
    },
  },
});

export default Modal2FACode;
