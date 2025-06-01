import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalSendTokenEmail: false,
  inputEmail: ""
};

const ModalSendTokenEmail = createSlice({
  name: "ModalSendTokenEmail",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalSendTokenEmail = true;
      state.inputEmail = action.payload.inputEmail
    },
    close: (state, action) => {
      state.displayModalSendTokenEmail = false;
      state.inputEmail = action.payload.inputEmail
    },
    edit: (state, action) => {
      state.inputEmail = action.payload.inputEmail
    }
  },
});

export default ModalSendTokenEmail;
