import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  csrfToken: null,
};

const csrfToken = createSlice({
  name: "csrfToken",
  initialState,
  reducers: {
    store: (state, action) => {
      state.csrfToken = action.payload.csrfToken;
    },
    clear: (state) => {
        state.csrfToken = null;
      },
  },
});

export default csrfToken;
