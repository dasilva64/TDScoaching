import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModal2FACode: false,
  destinationModal2FACode: ""
};

const Modal2FACode = createSlice({
  name: "Modal2FACode",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModal2FACode = true;
      state.destinationModal2FACode = action.payload.destination
    },
    close: (state) => {
      state.displayModal2FACode = false;
      state.destinationModal2FACode = "";
    },
  },
});

export default Modal2FACode;
