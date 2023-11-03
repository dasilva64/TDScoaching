import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalDiscovery: false,
};

const ModalDiscovery = createSlice({
  name: "ModalDiscovery",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalDiscovery = true;
    },
    close: (state) => {
      state.displayModalDiscovery = false;
    },
  },
});

export default ModalDiscovery;
