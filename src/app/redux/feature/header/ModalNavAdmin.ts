import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalNavAdmin: false,
};

const ModalNavAdmin = createSlice({
  name: "ModalNavAdmin",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalNavAdmin = true;
    },
    close: (state) => {
      state.displayModalNavAdmin = false;
    },
  },
});

export default ModalNavAdmin;
