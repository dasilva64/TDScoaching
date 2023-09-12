import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalDatePicker: false,
  reloadModalDatePicker: false,
};

const ModalDatePicker = createSlice({
  name: "ModalDatePicker",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalDatePicker = true;
    },
    close: (state) => {
      state.displayModalDatePicker = false;
    },
    reload: (state) => {
      state.reloadModalDatePicker = !state.reloadModalDatePicker;
    },
  },
});

export default ModalDatePicker;
