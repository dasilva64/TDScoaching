import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalAddDiscovery: false,
  dataModalAddDiscovery: "",
};

const ModalAddDiscovery = createSlice({
  name: "ModalAddDiscovery",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalAddDiscovery = true;
      state.dataModalAddDiscovery = action.payload.date;
    },
    close: (state, action) => {
      state.displayModalAddDiscovery = false;
      state.dataModalAddDiscovery = "";
    },
  },
});

export default ModalAddDiscovery;
