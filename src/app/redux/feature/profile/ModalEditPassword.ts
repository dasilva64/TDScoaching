import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalEditPassword: false,
};

const ModalEditPassword = createSlice({
  name: "ModalEditPassword",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalEditPassword = true;
    },
    close: (state) => {
      state.displayModalEditPassword = false;
    },
  },
});

export default ModalEditPassword;
