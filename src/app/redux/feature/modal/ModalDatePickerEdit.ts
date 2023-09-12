import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalDatePickerEdit: false,
  reloadModalDatePickerEdit: false,
};

const ModalDatePickerEdit = createSlice({
  name: "ModalDatePickerEdit",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalDatePickerEdit = true;
    },
    close: (state) => {
      state.displayModalDatePickerEdit = false;
    },
    reload: (state) => {
      state.reloadModalDatePickerEdit = !state.reloadModalDatePickerEdit;
    },
  },
});

export default ModalDatePickerEdit;
