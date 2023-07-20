"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import form from "./feature/form";
import auth from "./feature/auth";
import register from "./feature/register";

import user from "./feature/user";
import flash from "./feature/flash";
import { Array } from "./feature/Array";
import { ArrayMeeting } from "./feature/ArrayMeeting";

export const store = configureStore({
  reducer: {
    form: form.reducer,
    auth: auth.reducer,
    register: register.reducer,
    user: user.reducer,
    flash: flash.reducer,
    Array: Array.reducer,
    ArrayMeeting: ArrayMeeting.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

