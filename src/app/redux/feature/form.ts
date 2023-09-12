import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displaySendCode: false,
  displayFormCheck: false,
  displayModalDeleteMeeting: false,
  displayModalDeleteFirstMeeting: false,
  displayModalEditValidEmailData: false,
  displayModalCancelMeeting: false,
  displayModalMeeting: false,
  displayModalFirstMeeting: false,
  displayModalEditMeeting: false,
  dataModalMeeting: "",
  dataModalEditMeeting: "",
  displayModalCloseEmail: false,
  displayModalEditFormule: false,
  displayModalCancelFormule: false,
  displayModalAddMeetingAdmin: false,
  dataModalAddMeetingAdmin: "",
  displayModalDatePickerEdit: false,
  dataEventsModalDatePickerEdit: [],
  dataStartModalDatePickerEdit: "",
  displayModalDatePicker: false,
  dataEventsModalDatePicker: [],
  dataStartModalDatePicker: "",
  displayModalDiscoveryDatePicker: false,
  displayModalDiscoveryDatePickerEdit: false,
};

const form = createSlice({
  name: "form",
  initialState,
  reducers: {
    closeCheck: (state) => {
      state.displayFormCheck = false;
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
    openModalDatePickerEdit: (state) => {
      state.displayModalDatePickerEdit = true;
    },
    closeModalDatePickerEdit: (state) => {
      state.displayModalDatePickerEdit = false;
    },
    openModalDatePicker: (state, action) => {
      state.displayModalDatePicker = true;
      state.dataEventsModalDatePicker = action.payload.events;
      state.dataStartModalDatePicker = action.payload.start;
    },
    editModalArrayPicker: (state, action) => {},
    editModalStartPicker: (state, action) => {
      state.dataStartModalDatePicker = action.payload.start;
    },
    closeModalDatePicker: (state) => {
      state.displayModalDatePicker = false;
      state.dataEventsModalDatePicker = [];
      state.dataStartModalDatePicker = "";
    },
    openModalDiscoveryDatePicker: (state, action) => {
      state.displayModalDiscoveryDatePicker = true;
    },
    closeModalDateDiscoveryPicker: (state) => {
      state.displayModalDiscoveryDatePicker = false;
    },
    openModalDiscoveryDatePickerEdit: (state, action) => {
      state.displayModalDiscoveryDatePickerEdit = true;
    },
    closeModalDateDiscoveryPickerEdit: (state) => {
      state.displayModalDiscoveryDatePickerEdit = false;
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
    openModalEditValidEmailData: (state) => {
      state.displayModalEditValidEmailData = true;
    },
    closeModalEditValidEmailData: (state) => {
      state.displayModalEditValidEmailData = false;
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
    },
    closeModalFirstMeeting: (state) => {
      state.displayModalFirstMeeting = false;
    },
    openModalEditMeeting: (state, action) => {
      state.displayModalEditMeeting = true;
      state.dataModalEditMeeting = action.payload.date;
    },
    closeModalEditMeeting: (state) => {
      state.displayModalEditMeeting = false;
      state.dataModalEditMeeting = "";
    },
    openModalCloseEmail: (state) => {
      state.displayModalCloseEmail = true;
    },
    closeModalCloseEmail: (state) => {
      state.displayModalCloseEmail = false;
    },
    closeModalCloseEmailAndEditEmailData: (state) => {
      state.displayModalCloseEmail = false;
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
