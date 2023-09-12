import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalEditMeeting: false,
  dataModalEditMeeting: "",
};

const ModalEditMeeting = createSlice({
  name: "ModalEditMeeting",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalEditMeeting = true;
      state.dataModalEditMeeting = action.payload.date;
    },
    close: (state) => {
      state.displayModalEditMeeting = false;
      state.dataModalEditMeeting = "";
    },
  },
});

export default ModalEditMeeting;
