import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalEditTypeDiscovery: false,
  dataModalEditTypeDiscovery: "",
};

const ModalEditTypeDiscovery = createSlice({
  name: "ModalEditTypeDiscovery",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalEditTypeDiscovery = true;
    },
    close: (state) => {
      state.displayModalEditTypeDiscovery = false;
    },
  },
});

export default ModalEditTypeDiscovery;