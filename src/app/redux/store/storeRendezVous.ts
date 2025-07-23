import { configureStore } from "@reduxjs/toolkit";
import ModalContractEditRendezVous from "../feature/rendez-vous/formule/ModalContractEditRendezVous";
import ModalContractHelpRendezVous from "../feature/rendez-vous/formule/ModalContractHelpRendezVous";
import ModalContractRecapRendezVous from "../feature/rendez-vous/formule/ModalContractRecapRendezVous";
import ModalContractRendezVous from "../feature/rendez-vous/formule/ModalContractRendezVous";
import ModalFormuleAddRendezVous from "../feature/rendez-vous/formule/ModalFormuleAddRendezVous";
import ModalFormuleEditRendezVous from "../feature/rendez-vous/formule/ModalFormuleEditRendezVous";
import ModalCalendarEditMeetingRendezVous from "../feature/rendez-vous/ModalCalendarEditMeetingRendezVous";
import ModalCancelMeetingRendezVous from "../feature/rendez-vous/my/ModalCancelMeetingRendezVous";
import ModalConfirmMeetingRendezVous from "../feature/rendez-vous/my/ModalConfimMeetingRendezVous";
import ModalConfirmPaidMeetingRendezVous from "../feature/rendez-vous/my/ModalConfirmPaidMeetingRendezVous";
import ModalDeleteMeetingRendezVous from "../feature/rendez-vous/my/ModalDeleteMeetingRendezVous";
import ModalEditMeetingRendezVous from "../feature/rendez-vous/my/ModalEditMeetingRendezVous";
import ModalHistoriqueMeetingRendezVous from "../feature/rendez-vous/my/ModalHistoriqueMeetingRendezVous";
import ModalAddMeetingRendezVous from "../feature/rendez-vous/take/ModalAddMeetingRendezVous";
import ModalAddPaidMeetingRendezVous from "../feature/rendez-vous/take/ModalAddPaidMeetingRendezVous";
import ModalCalendarAddMeetingRendezVous from "../feature/rendez-vous/take/ModalCalendarAddMeetingRendezVous";
import ModalFormuleCancelRendezVous from "../feature/rendez-vous/take/ModalFormuleCancelRendezVous";
import ModalHelpPaiementRendezVous from "../feature/rendez-vous/take/ModalHelpPaiementRendezVous";
import ModalHelpRendezVous from "../feature/rendez-vous/take/ModalHelpRendezVous";

export const storeRendezVous = configureStore({
    reducer: {
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
    ModalContractRecapRendezVous: ModalContractRecapRendezVous.reducer,
    ModalContractEditRendezVous: ModalContractEditRendezVous.reducer,
    ModalHelpRendezVous: ModalHelpRendezVous.reducer,
    ModalHelpPaiementRendezVous: ModalHelpPaiementRendezVous.reducer,
    ModalContractHelpRendezVous: ModalContractHelpRendezVous.reducer,
    ModalHistoriqueMeetingRendezVous: ModalHistoriqueMeetingRendezVous.reducer,
    ModalFormuleCancelRendezVous: ModalFormuleCancelRendezVous.reducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootStateRendezVous = ReturnType<typeof storeRendezVous.getState>;
export type AppDispatchRendezVous = typeof storeRendezVous.dispatch;