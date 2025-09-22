"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import flash from "../feature/header/flash";
import ModalNav from "../feature/header/ModalNav";
import menu from "../feature/header/menu";
import ModalDiscovery from "../feature/tarif/ModalDiscovery";
import ModalNormal from "../feature/tarif/ModalNormal";

const rootReducer = combineReducers({

  //header
  flash: flash.reducer,
  menu: menu.reducer,
  ModalNav: ModalNav.reducer,

  //tarif 
  ModalDiscovery: ModalDiscovery.reducer,
  ModalNormal: ModalNormal.reducer,

});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
