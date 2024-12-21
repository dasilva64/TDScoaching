import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalLogin: false,
};

const ModalLogin = createSlice({
  name: "ModalLogin",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalLogin = true;
    },
    close: (state) => {
      state.displayModalLogin = false;
    },
  },
});

export default ModalLogin;
