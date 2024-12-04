import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalComfirmEditContrat: false,
};

const ModalComfirmEditContrat = createSlice({
  name: "ModalComfirmEditContrat",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalComfirmEditContrat = true;
    },
    close: (state) => {
      state.displayModalComfirmEditContrat = false;
    },
  },
});

export default ModalComfirmEditContrat;
