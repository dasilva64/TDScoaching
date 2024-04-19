import { createSlice } from "@reduxjs/toolkit";

interface FlashType {
  inputs: { type: string; content: string }[];
}

const initialState: FlashType = {
  inputs: [{ type: "title", content: "" }],
};

const article = createSlice({
  name: "article",
  initialState,
  reducers: {
    addInput: (state, action) => {
      state.inputs = [...state.inputs, action.payload];
    },
    removeInput: (state, action) => {
      state.inputs = state.inputs.filter(
        (input) => input.type !== action.payload
      );
    },
    updateInput: (state, action) => {
      state.inputs = state.inputs.map((input) => {
        if (input.type === action.payload.type) {
          return { ...input, content: action.payload.content };
        }
        return input;
      });
    },
  },
});

export default article;
