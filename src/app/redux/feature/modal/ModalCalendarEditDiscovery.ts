import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalCalendarEditDiscovery: false,
};

const ModalCalendarEditDiscovery = createSlice({
  name: "ModalCalendarEditDiscovery",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalCalendarEditDiscovery = true;
    },
    close: (state) => {
      state.displayModalCalendarEditDiscovery = false;
    },
  },
});

export default ModalCalendarEditDiscovery;
