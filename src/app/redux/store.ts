"use client";

import { configureStore } from "@reduxjs/toolkit";
import flash from "./feature/global/flash";
import Array from "./feature/Array";
import ArrayMeeting from "./feature/ArrayMeeting";
import ArrayMeetingByUser from "./feature/ArrayMeetingByUser";
import ModalLogin from "./feature/modal/ModalLogin";
import ModalRegister from "./feature/modal/ModalRegister";
import ModalForgot from "./feature/modal/ModalForgot";
import ModalDeleteDiscoveryMeeting from "./feature/modal/ModalDeleteDiscoveryMeeting";
import ModalEditDiscoveryMeeting from "./feature/modal/ModalEditDiscoveryMeeting";
import ModalDiscovery from "./feature/tarif/ModalDiscovery";
import ModalNormal from "./feature/tarif/ModalNormal";
import ModalNavAdmin from "./feature/modal/ModalNavAdmin";
import ModalNav from "./feature/modal/ModalNav";
import ModalElement from "./feature/modal/ModalElement";
import ModalNavUser from "./feature/modal/ModalNavUser";
import ModalCalendarDiscovery from "./feature/modal/ModalCalendarDiscovery";
import ModalAddDiscovery from "./feature/modal/ModalAddDiscovery";
import ModalCalendarEditDiscovery from "./feature/modal/ModalCalendarEditDiscovery";
import ModalEditTypeDiscovery from "./feature/modal/ModalEditTypeDiscovery";
import ModalDiscoveryMeetingTest from "./feature/modal/meeting/discovery/ModalDiscoveryMeetingTest";
import ModalAddDiscoveryMeetingTest from "./feature/modal/meeting/discovery/ModalAddDiscoveryMeetingTest";
import ModalEditDiscoveryMeetingTest from "./feature/modal/meeting/discovery/ModalEditCalendarDiscoveryMeetingTest";
import ModalRecapDiscoveryMeeting from "./feature/modal/meeting/discovery/ModalRecapDiscoveryMeeting";
import ModalCalendarEditDiscoveryMeetingRendezVousToken from "./feature/rendez-vous/token/ModalCalendarEditDiscoveryMeetingRendezVousToken";
import ModalConfirmDiscoveryMeetingRendezVousToken from "./feature/rendez-vous/token/ModalConfirmDiscoveryMeetingRendezVousToken";
import ModalDeleteDiscoveryMeetingRendezVousToken from "./feature/rendez-vous/token/ModalDeleteDiscoveryMeetingRendezVousToken";
import ModalEditDiscoveryMeetingRendezVousToken from "./feature/rendez-vous/token/ModalEditDiscoveryMeetingRendezVousToken";
import ModalEditFirstname from "./feature/profile/ModalEditFirstname";
import ModalEditLastname from "./feature/profile/ModalEditLastname";
import ModalCancelEmail from "./feature/profile/ModalCancelEmail";
import ModalDeleteAccount from "./feature/profile/ModalDeleteAccount";
import ModalEditEmail from "./feature/profile/ModalEditEmail";
import ModalEditPassword from "./feature/profile/ModalEditPassword";
import ModalSendTokenEmail from "./feature/profile/ModalSendTokenEmail";
import menu from "./feature/header/menu";

export const store = configureStore({
  reducer: {
    flash: flash.reducer,
    ArrayMeetingByUser: ArrayMeetingByUser.reducer,
    Array: Array.reducer,
    ModalLogin: ModalLogin.reducer,
    ModalRegister: ModalRegister.reducer,
    ArrayMeeting: ArrayMeeting.reducer,
    ModalForgot: ModalForgot.reducer,
    ModalEditFirstname: ModalEditFirstname.reducer,
    ModalEditLastname: ModalEditLastname.reducer,
    ModalEditPassword: ModalEditPassword.reducer,
    ModalSendTokenEmail: ModalSendTokenEmail.reducer,
    ModalEditEmail: ModalEditEmail.reducer,
    ModalCancelEmail: ModalCancelEmail.reducer,
    ModalDeleteAccount: ModalDeleteAccount.reducer,
    ModalDiscovery: ModalDiscovery.reducer,
    ModalNormal: ModalNormal.reducer,
    ModalNavAdmin: ModalNavAdmin.reducer,
    ModalNavUser: ModalNavUser.reducer,
    ModalNav: ModalNav.reducer,
    ModalElement: ModalElement.reducer,
    ModalCalendarDiscovery: ModalCalendarDiscovery.reducer,
    ModalCalendarEditDiscovery: ModalCalendarEditDiscovery.reducer,
    ModalAddDiscovery: ModalAddDiscovery.reducer,
    ModalDeleteDiscoveryMeeting: ModalDeleteDiscoveryMeeting.reducer,
    ModalEditDiscoveryMeeting: ModalEditDiscoveryMeeting.reducer,
    ModalEditTypeDiscovery: ModalEditTypeDiscovery.reducer,
    ModalDiscoveryMeetingTest: ModalDiscoveryMeetingTest.reducer,
    ModalAddDiscoveryMeetingTest: ModalAddDiscoveryMeetingTest.reducer,
    ModalEditDiscoveryMeetingTest: ModalEditDiscoveryMeetingTest.reducer,
    ModalRecapDiscoveryMeeting: ModalRecapDiscoveryMeeting.reducer,
    //header
    menu: menu.reducer,
    // Rendez-vous/token
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
