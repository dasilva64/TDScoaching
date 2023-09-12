import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalSendTokenEmail: false,
};

const ModalSendTokenEmail = createSlice({
  name: "ModalSendTokenEmail",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalSendTokenEmail = true;
    },
    close: (state) => {
      state.displayModalSendTokenEmail = false;
    },
  },
});

export default ModalSendTokenEmail;
