import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isActive: false,
};

const menu = createSlice({
  name: "menu",
  initialState,
  reducers: {
    toggleMenu: (state) => {
      state.isActive = !state.isActive;
    },
    closeMenu: (state) => {
      state.isActive = false;
    },
  },
});

export default menu;
