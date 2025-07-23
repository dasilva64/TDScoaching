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

export type RootState = ReturnType<typeof storeUtilisateurs.getState>;
export type AppDispatch = typeof storeUtilisateurs.dispatch;