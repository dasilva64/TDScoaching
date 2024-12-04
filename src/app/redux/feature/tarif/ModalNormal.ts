import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalNormal: false,
};

const ModalNormal = createSlice({
  name: "ModalNormal",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalNormal = true;
    },
    close: (state) => {
      state.displayModalNormal = false;
    },
  },
});

export default ModalNormal;
