import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayFormLogin: false,
  displayFormRegister: false,
  displaySendCode: false,
  displayFormCheck: false,
  displayFormForgot: false,
  displayModalDeleteMeeting: false,
  displayModalDeleteFirstMeeting: false,
  displayModalEditFirstnameUserData: false,
  displayModalEditLastnameUserData: false,
  displayModalEditBirthUserData: false,
  displayModalEditGenderUserData: false,
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
  displayModalFirstMeeting: false,
  displayModalEditMeeting: false,
  dataModalMeeting: "",
  dataModalEditMeeting: "",
  dataModalFirstMeeting: "",
  displayModalDeleteAccount: false,
  displayModalCloseEmail: false,
  displayModalClosePhone: false,
  displayModalEditFormule: false,
  displayModalCancelFormule: false,
  displayModalAddMeetingAdmin: false,
  dataModalAddMeetingAdmin: "",
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
    openModalDeleteFirstMeeting: (state) => {
      state.displayModalDeleteFirstMeeting = true;
    },
    closeModalDeleteFirstMeeting: (state) => {
      state.displayModalDeleteFirstMeeting = false;
    },
    openModalEditFormuleUserData: (state) => {
      state.displayModalEditFormule = true;
    },
    closeModalEditFormuleUserData: (state) => {
      state.displayModalEditFormule = false;
    },
    openModalCancelFormuleUserData: (state) => {
      state.displayModalCancelFormule = true;
    },
    closeModalCancelFormuleUserData: (state) => {
      state.displayModalCancelFormule = false;
    },
    openModalEditFirstnameUserData: (state) => {
      state.displayModalEditFirstnameUserData = true;
    },
    closeModalEditFirstnameUserData: (state) => {
      state.displayModalEditFirstnameUserData = false;
    },
    openModalEditLastnameUserData: (state) => {
      state.displayModalEditLastnameUserData = true;
    },
    closeModalEditLastnameUserData: (state) => {
      state.displayModalEditLastnameUserData = false;
    },
    openModalEditBirthUserData: (state) => {
      state.displayModalEditBirthUserData = true;
    },
    closeModalEditBirthUserData: (state) => {
      state.displayModalEditBirthUserData = false;
    },
    openModalEditGenderUserData: (state) => {
      state.displayModalEditGenderUserData = true;
    },
    closeModalEditGenderUserData: (state) => {
      state.displayModalEditGenderUserData = false;
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
    openModalFirstMeeting: (state, action) => {
      state.displayModalFirstMeeting = true;
      state.dataModalFirstMeeting = action.payload.date;
    },
    closeModalFirstMeeting: (state) => {
      state.displayModalFirstMeeting = false;
      state.dataModalFirstMeeting = "";
    },
    openModalEditMeeting: (state, action) => {
      state.displayModalEditMeeting = true;
      state.dataModalEditMeeting = action.payload.date;
    },
    closeModalEditMeeting: (state) => {
      state.displayModalEditMeeting = false;
      state.dataModalEditMeeting = "";
    },
    openModalDeleteAccount: (state) => {
      state.displayModalDeleteAccount = true;
    },
    closeModalDeleteAccount: (state) => {
      state.displayModalDeleteAccount = false;
    },
    openModalCloseEmail: (state) => {
      state.displayModalCloseEmail = true;
    },
    closeModalCloseEmail: (state) => {
      state.displayModalCloseEmail = false;
    },
    closeModalCloseEmailAndEditEmailData: (state) => {
      state.displayModalCloseEmail = false;
      state.displayModalEditEmailData = false;
    },
    openModalClosePhone: (state) => {
      state.displayModalClosePhone = true;
    },
    closeModalClosePhone: (state) => {
      state.displayModalClosePhone = false;
    },
    closeModalClosePhoneAndEditPhoneData: (state) => {
      state.displayModalClosePhone = false;
      state.displayModalEditPhoneData = false;
    },
    openModalAddMeetingAdmin: (state, action) => {
      state.displayModalAddMeetingAdmin = true;
      state.dataModalAddMeetingAdmin = action.payload.date;
    },
    closeModalAddMeetingAdmin: (state) => {
      state.displayModalAddMeetingAdmin = false;
      state.dataModalAddMeetingAdmin = "";
    },
  },
});

export default form;
