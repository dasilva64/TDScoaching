import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalContract: false,
  type: "",
};

const ModalContract = createSlice({
  name: "ModalContract",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalContract = true;
      state.type = action.payload.type;
    },
    close: (state) => {
      state.displayModalContract = false;
      state.type = "";
    },
  },
});

export default ModalContract;
