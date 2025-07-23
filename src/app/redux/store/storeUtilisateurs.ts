import { configureStore } from "@reduxjs/toolkit";
import Array from "../feature/utilisateurs/Array";

export const storeUtilisateurs = configureStore({
    reducer: {
        Array: Array.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootStateUtilisateurs = ReturnType<typeof storeUtilisateurs.getState>;
export type AppDispatchUtilisateurs = typeof storeUtilisateurs.dispatch;