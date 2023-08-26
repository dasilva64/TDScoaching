"use client";

import { configureStore } from "@reduxjs/toolkit";
import form from "./feature/form";
import auth from "./feature/auth";
import flash from "./feature/flash";
import Array from "./feature/Array";
import ArrayMeeting from "./feature/ArrayMeeting";
import ArrayMeetingByUser from "./feature/ArrayMeetingByUser";
import ArrayHistorique from "./feature/ArrayHistorique";
import menu from "./feature/menu";

export const store = configureStore({
  reducer: {
    form: form.reducer,
    auth: auth.reducer,
    flash: flash.reducer,
    Array: Array.reducer,
    ArrayMeeting: ArrayMeeting.reducer,
    ArrayMeetingByUser: ArrayMeetingByUser.reducer,
    ArrayHistorique: ArrayHistorique.reducer,
    menu: menu.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
