"use client";

import { configureStore } from "@reduxjs/toolkit";
import form from "./feature/form";
import flash from "./feature/flash";
import Array from "./feature/Array";
import ArrayMeeting from "./feature/ArrayMeeting";
import ArrayMeetingByUser from "./feature/ArrayMeetingByUser";
import ArrayHistorique from "./feature/ArrayHistorique";
import menu from "./feature/menu";
import ModalLogin from "./feature/modal/ModalLogin";
import ModalRegister from "./feature/modal/ModalRegister";
import ModalForgot from "./feature/modal/ModalForgot";
import ModalEditFirstname from "./feature/modal/ModalEditFirstname";
import ModalEditLastname from "./feature/modal/ModalEditLastname";
import ModalEditPassword from "./feature/modal/ModalEditPassword";
import ModalSendTokenEmail from "./feature/modal/ModalSendTokenEmail";
import ModalEditEmail from "./feature/modal/ModalEditEmail";
import ModalCancelEmail from "./feature/modal/ModalCancelEmail";
import ModalEditTwoFactor from "./feature/modal/ModalEditTwoFactor";
import ModalDeleteAccount from "./feature/modal/ModalDeleteAccount";
import ModalAddDiscoveryMeeting from "./feature/modal/ModalAddDiscoveryMeeting";
import ModalDeleteDiscoveryMeeting from "./feature/modal/ModalDeleteDiscoveryMeeting";
import ModalEditDiscoveryMeeting from "./feature/modal/ModalEditDiscoveryMeeting";
import Mobile from "./feature/Mobile";
import ModalEditFormule from "./feature/modal/ModalEditFormule";
import ModalDatePicker from "./feature/modal/ModalDatePicker";
import ModalAddMeeting from "./feature/modal/ModalAddMeeting";
import ModalCancelMeeting from "./feature/modal/ModalCancelMeeting";
import ModalEditMeeting from "./feature/modal/ModalEditMeeting";
import ModalDatePickerDiscovery from "./feature/modal/ModalDatePickerDiscovery";
import ModalDatePickerEditDiscovery from "./feature/modal/ModalDatePickerEditDiscovery";
import ModalDatePickerEdit from "./feature/modal/ModalDatePickerEdit";
import ModalDeleteMeeting from "./feature/modal/ModalDeleteMeeting";
import ModalAddMeetingAdmin from "./feature/modal/ModalAddMeetingAdmin";
import ModalCancelTwoFactor from "./feature/modal/ModalCancelTwoFactor";
import ModalSendTokenTwoFactor from "./feature/modal/ModalSendTokenTwoFactor";
import ModalComfirmDisableTwoFactor from "./feature/modal/ModalComfirmDisableTwoFactor";
import ModalDiscovery from "./feature/modal/ModalDiscovery";
import ModalNormal from "./feature/modal/ModalNormal";
import ModalSurMesure from "./feature/modal/ModalSurMesure";
import ModalContract from "./feature/modal/ModalContract";
import ModalComfirmDeleteContrat from "./feature/modal/ModalComfirmDeleteContrat";
import ModalComfirmEditContrat from "./feature/modal/ModalComfirmEditContrat";

export const store = configureStore({
  reducer: {
    //auth: auth.reducer,
    flash: flash.reducer,
    Array: Array.reducer,
    ArrayMeeting: ArrayMeeting.reducer,
    ArrayMeetingByUser: ArrayMeetingByUser.reducer,
    ArrayHistorique: ArrayHistorique.reducer,
    menu: menu.reducer,
    Mobile: Mobile.reducer,
    ModalLogin: ModalLogin.reducer,
    ModalRegister: ModalRegister.reducer,
    ModalForgot: ModalForgot.reducer,
    ModalEditFirstname: ModalEditFirstname.reducer,
    ModalEditLastname: ModalEditLastname.reducer,
    ModalEditFormule: ModalEditFormule.reducer,
    ModalEditPassword: ModalEditPassword.reducer,
    ModalEditTwoFactor: ModalEditTwoFactor.reducer,
    ModalCancelMeeting: ModalCancelMeeting.reducer,
    ModalEditEmail: ModalEditEmail.reducer,
    ModalCancelEmail: ModalCancelEmail.reducer,
    ModalCancelTwoFactor: ModalCancelTwoFactor.reducer,
    ModalSendTokenEmail: ModalSendTokenEmail.reducer,
    ModalDeleteAccount: ModalDeleteAccount.reducer,
    ModalDatePickerDiscovery: ModalDatePickerDiscovery.reducer,
    ModalAddMeetingAdmin: ModalAddMeetingAdmin.reducer,
    ModalAddDiscoveryMeeting: ModalAddDiscoveryMeeting.reducer,
    ModalAddMeeting: ModalAddMeeting.reducer,
    ModalDatePicker: ModalDatePicker.reducer,
    ModalDeleteDiscoveryMeeting: ModalDeleteDiscoveryMeeting.reducer,
    ModalDeleteMeeting: ModalDeleteMeeting.reducer,
    ModalEditDiscoveryMeeting: ModalEditDiscoveryMeeting.reducer,
    ModalEditMeeting: ModalEditMeeting.reducer,
    ModalDatePickerEditDiscovery: ModalDatePickerEditDiscovery.reducer,
    ModalDatePickerEdit: ModalDatePickerEdit.reducer,
    ModalSendTokenTwoFactor: ModalSendTokenTwoFactor.reducer,
    ModalComfirmDisableTwoFactor: ModalComfirmDisableTwoFactor.reducer,
    ModalDiscovery: ModalDiscovery.reducer,
    ModalNormal: ModalNormal.reducer,
    ModalSurMesure: ModalSurMesure.reducer,
    ModalContract: ModalContract.reducer,
    ModalComfirmDeleteContrat: ModalComfirmDeleteContrat.reducer,
    ModalComfirmEditContrat: ModalComfirmEditContrat.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
