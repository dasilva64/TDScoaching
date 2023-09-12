import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalEditDiscoveryMeeting: false,
  dataModalEditDiscoveryMeeting: "",
};

const ModalEditDiscoveryMeeting = createSlice({
  name: "ModalEditDiscoveryMeeting",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalEditDiscoveryMeeting = true;
      state.dataModalEditDiscoveryMeeting = action.payload.date;
    },
    close: (state) => {
      state.displayModalEditDiscoveryMeeting = false;
      state.dataModalEditDiscoveryMeeting = "";
    },
  },
});

export default ModalEditDiscoveryMeeting;
