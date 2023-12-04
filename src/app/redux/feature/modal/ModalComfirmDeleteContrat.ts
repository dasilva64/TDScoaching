import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayModalComfirmDeleteContrat: false,
};

const ModalComfirmDeleteContrat = createSlice({
  name: "ModalComfirmDeleteContrat",
  initialState,
  reducers: {
    open: (state) => {
      state.displayModalComfirmDeleteContrat = true;
    },
    close: (state) => {
      state.displayModalComfirmDeleteContrat = false;
    },
  },
});

export default ModalComfirmDeleteContrat;
