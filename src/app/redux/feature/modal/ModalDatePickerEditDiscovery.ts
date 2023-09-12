import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalDatePickerEditDiscovery: false,
  reloadModalDatePickerEditDiscovery: false,
};

const ModalDatePickerEditDiscovery = createSlice({
  name: "ModalDatePickerEditDiscovery",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalDatePickerEditDiscovery = true;
    },
    close: (state) => {
      state.displayModalDatePickerEditDiscovery = false;
    },
    reload: (state) => {
      state.reloadModalDatePickerEditDiscovery =
        !state.reloadModalDatePickerEditDiscovery;
    },
  },
});

export default ModalDatePickerEditDiscovery;
