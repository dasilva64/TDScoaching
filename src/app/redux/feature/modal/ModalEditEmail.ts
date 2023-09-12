import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalEditEmail: false,
};

const ModalEditEmail = createSlice({
  name: "ModalEditEmail",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalEditEmail = true;
    },
    close: (state) => {
      state.displayModalEditEmail = false;
    },
  },
});

export default ModalEditEmail;
