import { configureStore } from "@reduxjs/toolkit";
import ArrayMeetingByUser from "../feature/utilisateur/ArrayMeetingByUser";
import ModalCalendarTakeNextMeeting from "../feature/utilisateur/ModalCalendarTakeNextMeeting";
import ModalTakeNextMeeting from "../feature/utilisateur/ModalTakeNextMeeting";
import ModalUserNoShow from "../feature/utilisateur/ModalUserNoShow";

export const storeUtilisateur = configureStore({
    reducer: {
        ArrayMeetingByUser: ArrayMeetingByUser.reducer,
    ModalUserNoShow: ModalUserNoShow.reducer,
    ModalCalendarTakeNextMeeting: ModalCalendarTakeNextMeeting.reducer,
    ModalTakeNextMeeting: ModalTakeNextMeeting.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootStateUtilisateur = ReturnType<typeof storeUtilisateur.getState>;
export type AppDispatchUtilisateur = typeof storeUtilisateur.dispatch;