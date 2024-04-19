import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalNav: false,
};

const ModalNav = createSlice({
  name: "ModalNav",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalNav = true;
    },
    close: (state) => {
      state.displayModalNav = false;
    },
  },
});

export default ModalNav;
