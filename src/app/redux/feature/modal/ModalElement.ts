import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  displayModalElement: false,
  data: null,
};

const ModalElement = createSlice({
  name: "ModalElement",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalElement = true;
      state.data = action.payload.data;
    },
    close: (state) => {
      state.displayModalElement = false;
      state.data = null;
    },
  },
});

export default ModalElement;
