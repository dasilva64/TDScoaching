import { configureStore } from "@reduxjs/toolkit";
import ModalCancelEmail from "../feature/profile/ModalCancelEmail";
import ModalDeleteAccount from "../feature/profile/ModalDeleteAccount";
import ModalEditEmail from "../feature/profile/ModalEditEmail";
import ModalEditFirstname from "../feature/profile/ModalEditFirstname";
import ModalEditLastname from "../feature/profile/ModalEditLastname";
import ModalEditPassword from "../feature/profile/ModalEditPassword";
import ModalSendTokenEmail from "../feature/profile/ModalSendTokenEmail";
import ModalTwoFAActivation from "../feature/profile/ModalTwoFAActivation";
import ModalTwoFAActivationCancel from "../feature/profile/ModalTwoFAActivationCancel";
import ModalTwoFADesactivation from "../feature/profile/ModalTwoFADesactivation";

export const storeProfile = configureStore({
    reducer: {
     ModalCancelEmail: ModalCancelEmail.reducer,
    ModalDeleteAccount: ModalDeleteAccount.reducer,
    ModalEditFirstname: ModalEditFirstname.reducer,
    ModalEditLastname: ModalEditLastname.reducer,
    ModalEditPassword: ModalEditPassword.reducer,
    ModalEditEmail: ModalEditEmail.reducer,
    ModalSendTokenEmail: ModalSendTokenEmail.reducer,
    ModalTwoFADesactivation: ModalTwoFADesactivation.reducer,
    ModalTwoFAActivation: ModalTwoFAActivation.reducer,
    ModalTwoFAActivationCancel: ModalTwoFAActivationCancel.reducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof storeProfile.getState>;
export type AppDispatch = typeof storeProfile.dispatch;