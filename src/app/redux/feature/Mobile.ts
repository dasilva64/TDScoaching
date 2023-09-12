import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  isMobile: null,
};

const Mobile = createSlice({
  name: "Mobile",
  initialState,
  reducers: {
    isMobile: (state) => {
      state.isMobile = true;
    },
    notMobile: (state) => {
      state.isMobile = false;
    },
  },
});

export default Mobile;
