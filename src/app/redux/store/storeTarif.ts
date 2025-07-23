import { configureStore } from "@reduxjs/toolkit";
import ModalDiscovery from "../feature/tarif/ModalDiscovery";
import ModalNormal from "../feature/tarif/ModalNormal";

export const storeTarif = configureStore({
    reducer: {
        ModalDiscovery: ModalDiscovery.reducer,
        ModalNormal: ModalNormal.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootStateTarif = ReturnType<typeof storeTarif.getState>;
export type AppDispatchTarif = typeof storeTarif.dispatch;