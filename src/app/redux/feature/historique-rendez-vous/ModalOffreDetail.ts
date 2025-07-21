import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalOffreDetail: false,
  meetingModalOffreDetail: null,
};

const ModalOffreDetail = createSlice({
  name: "ModalOffreDetail",
  initialState,
  reducers: {
    open: (state, action) => {
      state.displayModalOffreDetail = true;
      state.meetingModalOffreDetail = action.payload.meet;
    },
    close: (state) => {
      state.displayModalOffreDetail = false;
      state.meetingModalOffreDetail = null;
    },
  },
});

export default ModalOffreDetail;