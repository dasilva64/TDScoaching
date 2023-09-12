import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalEditFirstname: false,
};

const ModalEditFirstname = createSlice({
  name: "ModalEditFirstname",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalEditFirstname = true;
    },
    close: (state) => {
      state.displayModalEditFirstname = false;
    },
  },
});

export default ModalEditFirstname;
