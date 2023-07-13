import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface AuthType {
  role: string
  emailUser: string
  isLog: boolean;
  id: string
  lastname: string
  firstname: string
  phone: string
  editEmail: any[]
}

const initialState: AuthType = {
  role: "",
  isLog: false,
  emailUser: "",
  id: "",
  lastname: "",
  firstname: "",
  phone: "",
  editEmail: []
};
interface UserData {
  email: string;
  password: string;
}

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLog = true;
      state.role = action.payload.role;
      state.id = action.payload.id
    },
    logout: (state, action) => {
      state.isLog = false;
      state.role = "";
      state.id = ""

    },
  },
});

export default auth;
