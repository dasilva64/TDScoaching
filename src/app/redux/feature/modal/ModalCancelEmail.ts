import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalCancelEmail: false,
};

const ModalCancelEmail = createSlice({
  name: "ModalCancelEmail",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalCancelEmail = true;
    },
    close: (state) => {
      state.displayModalCancelEmail = false;
    },
  },
});

export default ModalCancelEmail;
