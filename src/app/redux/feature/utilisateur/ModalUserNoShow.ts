import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalUserNoShow: false,
};

const ModalUserNoShow = createSlice({
  name: "ModalUserNoShow",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalUserNoShow = true;
    },
    close: (state) => {
      state.displayModalUserNoShow = false;
    },
  },
});

export default ModalUserNoShow;
