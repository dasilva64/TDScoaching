import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalSaveCardDesactivation: false,
};

const ModalSaveCardDesactivation = createSlice({
  name: "ModalSaveCardDesactivation",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalSaveCardDesactivation = true;
    },
    close: (state) => {
      state.displayModalSaveCardDesactivation = false;
    },
  },
});

export default ModalSaveCardDesactivation;