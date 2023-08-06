import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayFormLogin: false,
  displayFormRegister: false,
  displaySendCode: false,
  displayFormCheck: false,
  displayFormForgot: false,
  displayModalDeleteMeeting: false,
  displayModalEditMainUserData: false,
  displayModalEditPasswordData: false,
  displayModalEditPhoneSendData: false,
  displayModalEditPhoneData: false,
  displayModalEditValidPhoneData: false,
  displayModalEditEmailSendData: false,
  displayModalEditEmailData: false,
  displayModalEditValidEmailData: false,
  displayModalTwoFactor: false,
  displayModalTwoFactorDisable: false,
  displayModalCancelMeeting: false,
  displayModalMeeting: false,
  dataModalMeeting: "",
  displayModalDeleteAccount: false,
};

const form = createSlice({
  name: "form",
  initialState,
  reducers: {
    toggleLogin: (state, action) => {
      state.displayFormLogin = !state.displayFormLogin;
    },
    closeLogin: (state) => {
      state.displayFormLogin = false;
    },
    toggleRegister: (state, action) => {
      state.displayFormLogin = false;
      state.displayFormRegister = !state.displayFormRegister;
    },
    closeRegister: (state) => {
      state.displayFormRegister = false;
    },
    closeRegisterOpenLogin: (state) => {
      state.displayFormRegister = false;
      state.displayFormLogin = true;
    },
    openSendCode: (state) => {
      state.displayFormLogin = false;
      state.displaySendCode = true;
    },
    openCheck: (state) => {
      state.displayFormCheck = true;
      state.displayFormLogin = false;
    },
    closeCheck: (state) => {
      state.displayFormCheck = false;
    },
    openForgot: (state) => {
      state.displayFormCheck = false;
      state.displayFormLogin = false;
      state.displayFormForgot = true;
    },
    closeForgot: (state) => {
      state.displayFormForgot = false;
    },
    closeForgotOpenLogin: (state) => {
      state.displayFormForgot = false;
      state.displayFormLogin = true;
    },
    openModalDeleteMeeting: (state) => {
      state.displayModalDeleteMeeting = true;
    },
    closeModalDeleteMeeting: (state) => {
      state.displayModalDeleteMeeting = false;
    },
    openModalEditMainUserData: (state) => {
      state.displayModalEditMainUserData = true;
    },
    closeModalEditMainUserData: (state) => {
      state.displayModalEditMainUserData = false;
    },
    openModalEditPasswordData: (state) => {
      state.displayModalEditPasswordData = true;
    },
    closeModalEditPasswordData: (state) => {
      state.displayModalEditPasswordData = false;
    },
    openModalEditEmailSendData: (state) => {
      state.displayModalEditEmailSendData = true;
    },
    closeModalEditEmailSendData: (state) => {
      state.displayModalEditEmailSendData = false;
    },
    openModalEditEmailData: (state) => {
      state.displayModalEditEmailSendData = false;
      state.displayModalEditEmailData = true;
    },
    closeModalEditEmailData: (state) => {
      state.displayModalEditEmailData = false;
    },
    openModalEditValidEmailData: (state) => {
      state.displayModalEditValidEmailData = true;
    },
    closeModalEditValidEmailData: (state) => {
      state.displayModalEditValidEmailData = false;
    },
    openModalEditPhoneSendData: (state) => {
      state.displayModalEditPhoneSendData = true;
    },
    closeModalEditPhoneSendData: (state) => {
      state.displayModalEditPhoneSendData = false;
    },
    openModalEditPhoneData: (state) => {
      state.displayModalEditPhoneSendData = false;
      state.displayModalEditPhoneData = true;
    },
    closeModalEditPhoneData: (state) => {
      state.displayModalEditPhoneData = false;
    },
    openModalEditValidPhoneData: (state) => {
      state.displayModalEditValidPhoneData = true;
    },
    closeModalEditValidPhoneData: (state) => {
      state.displayModalEditValidPhoneData = false;
    },
    openModalTwoFactor: (state) => {
      state.displayModalTwoFactor = true;
    },
    closeModalTwoFactor: (state) => {
      state.displayModalTwoFactor = false;
    },
    openModalTwoFactorDisable: (state) => {
      state.displayModalTwoFactorDisable = true;
    },
    closeModalTwoFactorDisable: (state) => {
      state.displayModalTwoFactorDisable = false;
    },
    openModalCancelMeeting: (state) => {
      state.displayModalCancelMeeting = true;
    },
    closeModalCancelMeeting: (state) => {
      state.displayModalCancelMeeting = false;
    },
    openModalMeeting: (state, action) => {
      state.displayModalMeeting = true;
      state.dataModalMeeting = action.payload.date;
    },
    closeModalMeeting: (state) => {
      state.displayModalMeeting = false;
      state.dataModalMeeting = "";
    },
    openModalDeleteAccount: (state) => {
      state.displayModalDeleteAccount = true;
    },
    closeModalDeleteAccount: (state) => {
      state.displayModalDeleteAccount = false;
    },
  },
});

export default form;
