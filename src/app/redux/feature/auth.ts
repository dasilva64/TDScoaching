/* import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface AuthType {
  role: string;
  isLog: boolean;
  id: string;
}

const initialState: AuthType = {
  role: "",
  isLog: false,
  id: "",
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLog = true;
      state.role = action.payload.role;
      state.id = action.payload.id;
    },
    logout: (state, action) => {
      state.isLog = false;
      state.role = "";
      state.id = "";
    },
  },
});

export default auth; */
