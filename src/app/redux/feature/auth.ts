import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

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
      state.emailUser = action.payload.email;
      state.role = action.payload.role;
      state.id = action.payload.id
      state.firstname = action.payload.firstname
      state.lastname = action.payload.lastname
      state.phone = action.payload.phone
      state.editEmail = action.payload.editEmail
    },
    logout: (state, action) => {
      state.isLog = false;
      state.emailUser = "";

    },
  },
});

export default auth;
