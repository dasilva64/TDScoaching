"use client";

import { configureStore } from "@reduxjs/toolkit";
import flash from "./feature/header/flash";
import Array from "./feature/utilisateurs/Array";
import ArrayMeetingByUser from "./feature/utilisateur/ArrayMeetingByUser";
import ModalLogin from "./feature/header/ModalLogin";
import ModalRegister from "./feature/header/ModalRegister";
import ModalForgot from "./feature/header/ModalForgot";
import ModalDiscovery from "./feature/tarif/ModalDiscovery";
import ModalNormal from "./feature/tarif/ModalNormal";
import ModalNavAdmin from "./feature/header/ModalNavAdmin";
import ModalNav from "./feature/header/ModalNav";
import ModalNavUser from "./feature/header/ModalNavUser";
/* import ModalCalendarEditDiscoveryMeetingRendezVousToken from "./feature/rendez-vous/token/ModalCalendarEditDiscoveryMeetingRendezVousToken";
import ModalConfirmDiscoveryMeetingRendezVousToken from "./feature/rendez-vous/token/ModalConfirmDiscoveryMeetingRendezVousToken";
import ModalDeleteDiscoveryMeetingRendezVousToken from "./feature/rendez-vous/token/ModalDeleteDiscoveryMeetingRendezVousToken";
import ModalEditDiscoveryMeetingRendezVousToken from "./feature/rendez-vous/token/ModalEditDiscoveryMeetingRendezVousToken"; */
import ModalEditFirstname from "./feature/profile/ModalEditFirstname";
import ModalEditLastname from "./feature/profile/ModalEditLastname";
import ModalCancelEmail from "./feature/profile/ModalCancelEmail";
import ModalDeleteAccount from "./feature/profile/ModalDeleteAccount";
import ModalEditEmail from "./feature/profile/ModalEditEmail";
import ModalEditPassword from "./feature/profile/ModalEditPassword";
import ModalSendTokenEmail from "./feature/profile/ModalSendTokenEmail";
import menu from "./feature/header/menu";
import ModalCalendarDiscoveryMeetingHeader from "./feature/header/ModalCalendarDiscoveryMeetingHeader";
import ModalAddDiscoveryMeetingHeader from "./feature/header/ModalAddDiscoveryMeetingHeader";
import ModalRecapDiscoveryMeetingHeader from "./feature/header/ModalRecapDiscoveryMeetingHeader";
import ModalCalendarEditDiscoveryMeetingRendezVousToken from "./feature/rendez-vous/token/ModalCalendarEditDiscoveryMeetingRendezVousToken";
import ModalConfirmDiscoveryMeetingRendezVousToken from "./feature/rendez-vous/token/ModalConfirmDiscoveryMeetingRendezVousToken";
import ModalDeleteDiscoveryMeetingRendezVousToken from "./feature/rendez-vous/token/ModalDeleteDiscoveryMeetingRendezVousToken";
import ModalEditDiscoveryMeetingRendezVousToken from "./feature/rendez-vous/token/ModalEditDiscoveryMeetingRendezVousToken";
import ModalCalendarEditMeetingRendezVous from "./feature/rendez-vous/ModalCalendarEditMeetingRendezVous";
import ModalCalendarAddMeetingRendezVous from "./feature/rendez-vous/take/ModalCalendarAddMeetingRendezVous";
import ModalAddMeetingRendezVous from "./feature/rendez-vous/take/ModalAddMeetingRendezVous";
import ModalDeleteMeetingRendezVous from "./feature/rendez-vous/my/ModalDeleteMeetingRendezVous";
import ModalFormuleAddRendezVous from "./feature/rendez-vous/formule/ModalFormuleAddRendezVous";
import ModalEditMeetingRendezVous from "./feature/rendez-vous/my/ModalEditMeetingRendezVous";
import ModalConfirmMeetingRendezVous from "./feature/rendez-vous/my/ModalConfimMeetingRendezVous";
import ModalFormuleEditRendezVous from "./feature/rendez-vous/formule/ModalFormuleEditRendezVous";
import ModalConfirmPaidMeetingRendezVous from "./feature/rendez-vous/my/ModalConfirmPaidMeetingRendezVous";
import ModalCancelMeetingRendezVous from "./feature/rendez-vous/my/ModalCancelMeetingRendezVous";
import ModalAddPaidMeetingRendezVous from "./feature/rendez-vous/take/ModalAddPaidMeetingRendezVous";
import ModalContractRendezVous from "./feature/rendez-vous/formule/ModalContractRendezVous";
import ModalCalendarEditDiscoveryMeetingHeader from "./feature/header/ModalCalendarEditDiscoveryMeetingHeader";
import csrfToken from "./feature/csrfToken";
import Modal2FACode from "./feature/header/Modal2FACode";

export const store = configureStore({
  reducer: {
    /*
    ArrayMeeting: ArrayMeeting.reducer,
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
    ModalRecapDiscoveryMeeting: ModalRecapDiscoveryMeeting.reducer, */
    
    csrfToken: csrfToken.reducer,

    //header
    flash: flash.reducer,
    menu: menu.reducer,
    ModalLogin: ModalLogin.reducer,
    ModalRegister: ModalRegister.reducer,
    ModalForgot: ModalForgot.reducer,
    ModalNavAdmin: ModalNavAdmin.reducer,
    ModalNavUser: ModalNavUser.reducer,
    ModalNav: ModalNav.reducer,
    ModalCalendarDiscoveryMeetingHeader: ModalCalendarDiscoveryMeetingHeader.reducer,
    ModalAddDiscoveryMeetingHeader: ModalAddDiscoveryMeetingHeader.reducer,
    ModalRecapDiscoveryMeetingHeader: ModalRecapDiscoveryMeetingHeader.reducer,
    ModalCalendarEditDiscoveryMeetingHeader: ModalCalendarEditDiscoveryMeetingHeader.reducer,
    Modal2FACode: Modal2FACode.reducer,

    //profile
    ModalCancelEmail: ModalCancelEmail.reducer,
    ModalDeleteAccount: ModalDeleteAccount.reducer,
    ModalEditFirstname: ModalEditFirstname.reducer,
    ModalEditLastname: ModalEditLastname.reducer,
    ModalEditPassword: ModalEditPassword.reducer,
    ModalEditEmail: ModalEditEmail.reducer,
    ModalSendTokenEmail: ModalSendTokenEmail.reducer,

    //tarif
    ModalDiscovery: ModalDiscovery.reducer,
    ModalNormal: ModalNormal.reducer,

    //utilisateurs
    Array: Array.reducer,

    //utilisateur
    ArrayMeetingByUser: ArrayMeetingByUser.reducer,

    // Rendez-vous
    ModalCalendarEditMeetingRendezVous: ModalCalendarEditMeetingRendezVous.reducer,
    ModalCalendarAddMeetingRendezVous: ModalCalendarAddMeetingRendezVous.reducer,
    ModalAddMeetingRendezVous: ModalAddMeetingRendezVous.reducer,
    ModalDeleteMeetingRendezVous: ModalDeleteMeetingRendezVous.reducer,
    ModalCancelMeetingRendezVous: ModalCancelMeetingRendezVous.reducer,
    ModalFormuleAddRendezVous: ModalFormuleAddRendezVous.reducer,
    ModalEditMeetingRendezVous: ModalEditMeetingRendezVous.reducer,
    ModalConfirmMeetingRendezVous: ModalConfirmMeetingRendezVous.reducer,
    ModalFormuleEditRendezVous: ModalFormuleEditRendezVous.reducer,
    ModalConfirmPaidMeetingRendezVous: ModalConfirmPaidMeetingRendezVous.reducer,
    ModalAddPaidMeetingRendezVous: ModalAddPaidMeetingRendezVous.reducer,
    ModalContractRendezVous: ModalContractRendezVous.reducer,

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
