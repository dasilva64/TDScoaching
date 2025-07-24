import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalLogin: false,
  destinationModalLogin: ""
};

const ModalLogin = createSlice({
  name: "ModalLogin",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalLogin = true;
      state.destinationModalLogin = action.payload.destination
    },
    close: (state) => {
      state.displayModalLogin = false;
      state.destinationModalLogin = "";
    },
  },
});

export default ModalLogin;
