import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalSaveCardActivation: false,
};

const ModalSaveCardActivation = createSlice({
  name: "ModalSaveCardActivation",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalSaveCardActivation = true;
    },
    close: (state) => {
      state.displayModalSaveCardActivation = false;
    },
  },
});

export default ModalSaveCardActivation;