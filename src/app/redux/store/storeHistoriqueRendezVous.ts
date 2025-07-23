import { configureStore } from "@reduxjs/toolkit";
import ModalOffreDetail from "../feature/historique-rendez-vous/ModalOffreDetail";

export const storeHistoriqueRendezVous = configureStore({
    reducer: {
     ModalOffreDetail: ModalOffreDetail.reducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof storeHistoriqueRendezVous.getState>;
export type AppDispatch = typeof storeHistoriqueRendezVous.dispatch;