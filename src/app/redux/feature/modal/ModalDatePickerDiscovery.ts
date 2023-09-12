import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalDatePickerDiscovery: false,
  reloadModalDatePickerDiscovery: false,
};

const ModalDatePickerDiscovery = createSlice({
  name: "ModalDatePickerDiscovery",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalDatePickerDiscovery = true;
    },
    close: (state) => {
      state.displayModalDatePickerDiscovery = false;
    },
    reload: (state) => {
      state.reloadModalDatePickerDiscovery =
        !state.reloadModalDatePickerDiscovery;
    },
  },
});

export default ModalDatePickerDiscovery;
