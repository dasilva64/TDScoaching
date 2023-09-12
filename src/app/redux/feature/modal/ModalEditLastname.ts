import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalEditLastname: false,
};

const ModalEditLastname = createSlice({
  name: "ModalEditLastname",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalEditLastname = true;
    },
    close: (state) => {
      state.displayModalEditLastname = false;
    },
  },
});

export default ModalEditLastname;
