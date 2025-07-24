"use client";

import React from "react";
import { useEffect, useState } from "react";
import styles from "./Display.module.scss";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/app/redux/store/store";
import { useDispatch } from "react-redux";
import NoScript from "@/app/components/noscript/NoScript";
import Load from "../load/Load";
import My from "../test/My";
import ModalCalendarEditMeeting from "../test/modal/calendarEdit/ModalCalendarEditMeeting";
import ModalDeleteMeeting from "../test/modal/Delete/ModalDeleteMeeting";
import Take from "../test/Take";
import ModalCalendarAddMeeting from "../test/modal/calendarAdd/ModalCalendarAddMeeting";
import ModalAddMeeting from "../test/modal/add/ModalAddMeeting";
import Formule from "../test/Formule";
import ModalEditMeeting from "../test/modal/edit/ModalEditMeeting";
import ModalConfirmMeeting from "../test/modal/confirm/ModalConfirmMeeting";
import ModalFormuleAdd from "../test/modal/formule/ModalFormuleAdd";
import ModalAddPaidMeeting from "../test/modal/add/paid/ModalAddPaidMeeting";
import ModalFormuleEdit from "../test/modal/editOffre/ModalFormuleEdit";
import ModalContract from "../test/modal/contract/ModalContract";
import FormuleNotConfirm from "../test/FormuleNotConfirm";
import ModalContractRecap from "../test/modal/contractRecap/ModalContractRecap";
import ModalContractEdit from "../test/modal/contractEdit/ModalContractEdit";
import ModalHelpMeeting from "../test/modal/help/ModalHelpMeeting";
import ModalHelpContract from "../test/modal/helpContract/ModalHelpContract";
import ModalConfirmPaidMeeting from "../test/modal/confirmPaid/ModalConfirmPaidMeeting";
import ModalCancelMeeting from "../test/modal/cancel/ModalCancelMeeting";
import useGetRevalidateOnFocus from "@/app/components/hook/useGetRevalidateOnFocus";
import ModalHelpPaiement from "../test/modal/helpPaiement/ModalHelpPaiment";
import ModalHistoriqueMeet from "../test/modal/historique/ModalHistoriqueMeet";
import ModalFormuleCancel from "../test/modal/formuleCancel/ModalFormuleCancel";
import { mutate as globalMutate } from "swr";
import Error from "../error/Error"

const Display = () => {
  const router = useRouter();
  const {
    data: userData,
    isLoading,
    isError,
    mutate,
  } = useGetRevalidateOnFocus("/rendez-vous/components/api");
  const dispatch: AppDispatch = useDispatch();
    const [allData, setAllData] = useState<any[]>([]);
  useEffect(() => {
    if (isError) {
      dispatch({
        type: "flash/storeFlashMessage",
        payload: {
          type: "error",
          flashMessage: "Erreur lors du chargement, veuillez réessayer",
        },
      });
    }
    if (userData) {
      if (userData.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: userData.message,
          },
        });
        globalMutate("/components/header/api");
        globalMutate("/components/header/ui/api");
        router.push(`/acces-refuse?destination=rendez-vous`);
      } if (userData.status === 200) {
        let array = [];
        for (let i = 0; i < userData.body.meetings.length; i++) {
          if (userData.body.meeting === null) {
            array.push({
              start: userData.body.meetings[i].startAt,
              startEditable: true,
              backgroundColor: "red",
              textColor: "red",
              id: userData.body.meetings[i].userId,
            });
          } else {
            if (
              userData.body.meeting.userMail ===
              userData.body.meetings[i].userMail
            ) {
              array.push({
                start: userData.body.meetings[i].startAt,
                startEditable: true,
                backgroundColor: "green",
                textColor: "white",
                title: "Mon rendez-vous",
                id: userData.body.meetings[i].userId,
              });
            } else {
              array.push({
                start: userData.body.meetings[i].startAt,
                startEditable: false,
                backgroundColor: "red",
                textColor: "red",
                id: userData.body.meetings[i].userId,
              });
            }
          }
        }
        setAllData(array);
      }
      else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: userData.message,
          },
        });
      }
    }
  }, [dispatch, isError, isLoading, router, userData]);
  return (
    <>
      {userData && userData.status === 200 && (
        <>
          {userData.body.meeting !== null && (
            <>
              <ModalCalendarEditMeeting allData={allData} />
              <ModalDeleteMeeting mutate={mutate} />
              <ModalEditMeeting
                mutate={mutate}
                meeting={userData.body.meeting}
                offre={userData.body.offre}
              />

              {userData.body.offre.type === "discovery" && (
                <ModalConfirmMeeting
                  mutate={mutate}
                  meeting={userData.body.meeting}
                />
              )}

              {(userData.body.offre.type === "unique" || userData.body.offre.type === "flash") && (
                <>
                  <ModalConfirmPaidMeeting
                    mutate={mutate}
                    meeting={userData.body.meeting}
                  />
                  <ModalCancelMeeting mutate={mutate} offre={userData.body.offre} />
                  <ModalConfirmMeeting
                    mutate={mutate}
                    meeting={userData.body.meeting}
                  />
                  <ModalHistoriqueMeet meet={userData.body.meetingsByUser} offre={userData.body.offre} />
                </>
              )}
            </>
          )}
          {userData.body.meeting === null && (
            <>
              <ModalCalendarAddMeeting
                allData={allData}
                discovery={userData.body.discovery}
                offre={userData.body.offre}
              />
              <ModalAddMeeting
                mutate={mutate}
                discovery={userData.body.discovery}
                offre={userData.body.offre}
              />
              <ModalAddPaidMeeting
                mutate={mutate}
                discovery={userData.body.discovery}
                offre={userData.body.offre}
              />
              <ModalHelpPaiement />
              <ModalHelpMeeting offre={userData.body.offre} />
            </>
          )}

          {userData.body.meeting === null &&
            userData.body.discovery === false && (
              <>
                <ModalFormuleAdd mutate={mutate} />
                <ModalFormuleEdit mutate={mutate} />
                <ModalFormuleCancel />
                <ModalContract mutate={mutate} />
                <ModalContractRecap mutate={mutate} />
                <ModalContractEdit mutate={mutate} />
                <ModalHelpContract />
              </>
            )}
        </>
      )}
      <NoScript />
      {!isLoading && userData.status === 200 && (
        <>
          <main className={styles.meet}>
            {userData &&
              userData.body.offre !== null &&
              userData.body.meeting === null &&
              (userData.body.offre.contract_status === null ||
                userData.body.offre.contract_status === "CONFIRMED") && (
                <Take offre={userData.body.offre} />
              )}
            {userData && userData.body.meeting !== null && (
              <My meeting={userData.body.meeting} offre={userData.body.offre} mutate={mutate} />
            )}
            {userData &&
              userData.body.meeting === null &&
              userData.body.discovery === false &&
              userData.body.offre === null && <Formule />}
            {userData &&
              userData.body.meeting === null &&
              userData.body.discovery === false &&
              userData.body.offre !== null && (userData.body.offre.contract_status === "GENERATED_NAME_ONLY" ||
                userData.body.offre.contract_status === "SIGNED") && <FormuleNotConfirm offre={userData.body.offre} />}
          </main>
        </>
      )}
      {!isLoading && userData.status === 429 && (
        <>
            <Error />
        </>
      )}

      {isLoading && (
        <>
          <Load />
        </>
      )}
    </>
  );
};

export default Display;
