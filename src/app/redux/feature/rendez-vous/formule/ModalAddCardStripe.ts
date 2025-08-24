import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalAddCardStripe: false,
  secretModalAddCardStripe: "",
};

const ModalAddCardStripe = createSlice({
  name: "ModalAddCardStripe",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalAddCardStripe = true;
      state.secretModalAddCardStripe = action.payload.secret;
    },
    close: (state) => {
      state.displayModalAddCardStripe = false;
      state.secretModalAddCardStripe = "";
    },
  },
});

export default ModalAddCardStripe;