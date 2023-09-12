import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalAddDiscoveryMeeting: false,
  dataModalAddDiscoveryMeeting: "",
};

const ModalAddDiscoveryMeeting = createSlice({
  name: "ModalAddDiscoveryMeeting",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalAddDiscoveryMeeting = true;
      state.dataModalAddDiscoveryMeeting = action.payload.date;
    },
    close: (state) => {
      state.displayModalAddDiscoveryMeeting = false;
      state.dataModalAddDiscoveryMeeting = "";
    },
  },
});

export default ModalAddDiscoveryMeeting;
