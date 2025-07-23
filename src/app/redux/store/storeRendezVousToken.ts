import { configureStore } from "@reduxjs/toolkit";
import ModalCalendarEditDiscoveryMeetingRendezVousToken from "../feature/rendez-vous/token/ModalCalendarEditDiscoveryMeetingRendezVousToken";
import ModalConfirmDiscoveryMeetingRendezVousToken from "../feature/rendez-vous/token/ModalConfirmDiscoveryMeetingRendezVousToken";
import ModalDeleteDiscoveryMeetingRendezVousToken from "../feature/rendez-vous/token/ModalDeleteDiscoveryMeetingRendezVousToken";
import ModalEditDiscoveryMeetingRendezVousToken from "../feature/rendez-vous/token/ModalEditDiscoveryMeetingRendezVousToken";

export const storeRendezVousToken = configureStore({
    reducer: {
     ModalCalendarEditDiscoveryMeetingRendezVousToken: ModalCalendarEditDiscoveryMeetingRendezVousToken.reducer,
    ModalConfirmDiscoveryMeetingRendezVousToken: ModalConfirmDiscoveryMeetingRendezVousToken.reducer,
    ModalDeleteDiscoveryMeetingRendezVousToken: ModalDeleteDiscoveryMeetingRendezVousToken.reducer,
    ModalEditDiscoveryMeetingRendezVousToken: ModalEditDiscoveryMeetingRendezVousToken.reducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof storeRendezVousToken.getState>;
export type AppDispatch = typeof storeRendezVousToken.dispatch;