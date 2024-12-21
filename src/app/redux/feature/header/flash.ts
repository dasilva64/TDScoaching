import { createSlice } from "@reduxjs/toolkit";

interface FlashType {
    flashMessage: string[];
}

const initialState: FlashType = {
    flashMessage: ["", ""],
};

const flash = createSlice({
  name: "flash",
  initialState,
  reducers: {
    storeFlashMessage: (state, action) => {
      state.flashMessage = [action.payload.type, action.payload.flashMessage];
    },
    clearFlashMessage: (state) => {
        state.flashMessage = ["", ""]
    }
  },
});

export default flash;