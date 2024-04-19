import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalNavUser: false,
};

const ModalNavUser = createSlice({
  name: "ModalNavUser",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalNavUser = true;
    },
    close: (state) => {
      state.displayModalNavUser = false;
    },
  },
});

export default ModalNavUser;
