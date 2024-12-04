import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalDeleteAccount: false,
};

const ModalDeleteAccount = createSlice({
  name: "ModalDeleteAccount",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalDeleteAccount = true;
    },
    close: (state) => {
      state.displayModalDeleteAccount = false;
    },
  },
});

export default ModalDeleteAccount;
