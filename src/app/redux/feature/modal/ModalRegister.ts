import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalRegister: false,
};

const ModalRegister = createSlice({
  name: "ModalRegister",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalRegister = true;
    },
    close: (state) => {
      state.displayModalRegister = false;
    },
  },
});

export default ModalRegister;
