import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalCalendarDiscovery: false,
};

const ModalCalendarDiscovery = createSlice({
  name: "ModalCalendarDiscovery",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalCalendarDiscovery = true;
    },
    close: (state) => {
      state.displayModalCalendarDiscovery = false;
    },
  },
});

export default ModalCalendarDiscovery;
