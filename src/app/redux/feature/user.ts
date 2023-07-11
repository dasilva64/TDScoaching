import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface DataState {
    user: any,
    messageRegister: string,
    isLoading: boolean,
    isGet: boolean
}

const initialState: DataState = {
    user: {},
    messageRegister: "",
    isLoading: false,
    isGet: true
  };

  interface Data {
    token: string
  }
const user = createSlice({
  name: "user",
  initialState,
  reducers: {
      editGet: (state) => {
        state.isGet = true
      }
  },
});

export default user
