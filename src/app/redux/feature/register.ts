import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  messageRegister: "",
  isLoading: false,
};

interface UserData {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phone: string
}


const register = createSlice({
  name: "register",
  initialState,
  reducers: {
    test: (state) => {},
  },
});

export default register;
