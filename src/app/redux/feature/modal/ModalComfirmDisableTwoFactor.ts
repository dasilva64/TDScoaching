import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalComfirmDisableTwoFactor: false,
};

const ModalComfirmDisableTwoFactor = createSlice({
  name: "ModalComfirmDisableTwoFactor",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalComfirmDisableTwoFactor = true;
    },
    close: (state) => {
      state.displayModalComfirmDisableTwoFactor = false;
    },
  },
});

export default ModalComfirmDisableTwoFactor;
