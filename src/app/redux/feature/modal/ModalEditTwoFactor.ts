import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalEditTwoFactor: false,
};

const ModalEditTwoFactor = createSlice({
  name: "ModalEditTwoFactor",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalEditTwoFactor = true;
    },
    close: (state) => {
      state.displayModalEditTwoFactor = false;
    },
  },
});

export default ModalEditTwoFactor;
