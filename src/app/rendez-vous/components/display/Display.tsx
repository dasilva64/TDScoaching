"use client";

import React from "react";
import { useEffect, useState } from "react";
import styles from "./Display.module.scss";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/app/redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import NoScript from "@/app/components/noscript/NoScript";
import Load from "../load/Load";
import { Elements } from "@stripe/react-stripe-js";
import My from "../test/My";
import Take from "../test/Take";
import Formule from "../test/Formule";
import FormuleNotConfirm from "../test/FormuleNotConfirm";
import useGetRevalidateOnFocus from "@/app/components/hook/useGetRevalidateOnFocus";
import { mutate as globalMutate } from "swr";
import Error from "../error/Error"
import ModalCalendarAddMeetingUnique from "../test/modal/unique/calendarAdd/ModalCalendarAddMeetingUnique";
import ModalAddMeetingUnique from "../test/modal/unique/add/ModalAddMeetingUnique";
import ModalConfirmMeetingUnique from "../test/modal/unique/confirm/ModalConfirmMeetingUnique";
import ModalEditMeetingUnique from "../test/modal/unique/editMeeting/ModalEditMeetingUnique";
import ModalCalendarEditMeetingUnique from "../test/modal/unique/calendarEdit/ModalCalendarEditMeetingUnique";
import ModalCancelMeetingUnique from "../test/modal/unique/cancel/ModalCancelMeetingUnique";
import ModalCalendarAddMeetingDiscovery from "../test/modal/discovery/calendarAdd/ModalCalendarAddMeetingDiscovery";
import ModalAddMeetingDiscovery from "../test/modal/discovery/add/ModalAddMeetingDiscovery";
import ModalConfirmMeetingDiscovery from "../test/modal/discovery/confirm/ModalConfirmMeetingDiscovery";
import ModalCalendarEditMeetingDiscovery from "../test/modal/discovery/calendarEdit/ModalCalendarEditMeetingDiscovery";
import ModalEditMeetingDiscovery from "../test/modal/discovery/editMeeting/ModalEditMeetingDiscovery";
import ModalCancelMeetingDiscovery from "../test/modal/discovery/cancel/ModalCancelMeetingDiscovery";
import ModalFormuleAddFlash from "../test/modal/flash/addFormule/ModalFormuleAddFlash";
import ModalFormuleEditFlash from "../test/modal/flash/editFormule/ModalFormuleEditFlash";
import ModalFormuleConfirmFlash from "../test/modal/flash/confirmFormule/ModalFormuleConfirmFlash";
import ModalCalendarAddMeetingFlash from "../test/modal/flash/calendarAdd/ModalCalendarAddMeetingFlash";
import ModalAddMeetingFlash from "../test/modal/flash/addMeeting/ModalAddMeetingFlash";
import ModalCalendarEditMeetingFlash from "../test/modal/flash/calendarEdit/ModalCalendarEditMeetingFlash";
import ModalEditMeetingFlash from "../test/modal/flash/editMeeting/ModalEditMeetingFlash";
import ModalConfirmMeetingFlash from "../test/modal/flash/confirmMeeting/ModalConfirmMeetingFlash";
import ModalCancelMeetingFlash from "../test/modal/flash/cancelMeeting/ModalCancelMeetingFlash";
import { loadStripe } from "@stripe/stripe-js";
import ModalHelpFormuleGlobal from "../test/modal/global/helpFormule/ModalHelpFormuleGlobal";
import ModalHelpSaveCardGlobal from "../test/modal/global/helpStripe/ModalHelpSaveCardGlobal";
import ModalAddCardStripeUnique from "../test/modal/unique/stripe/ModalAddCardStripeUnique";
import ModalAddCardStripeFlash from "../test/modal/flash/stripe/ModalAddCardStripeFlash";
import ModalHistoriqueMeetingFlash from "../test/modal/flash/historiqueMeeting/ModalHistoriqueMeetingFlash";
import ModalHelpMeeting from "../test/modal/global/helpMeeting/ModalHelpMeeting";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const Display = () => {
  const router = useRouter();
  const { secretModalAddCardStripe } = useSelector((state: RootState) => state.ModalAddCardStripe)
  const [options, setOptions] = useState<any>(null)
  useEffect(() => {
    if (secretModalAddCardStripe !== "") {
      console.log(secretModalAddCardStripe)
      setOptions({
        clientSecret: secretModalAddCardStripe, // 👈 obligatoire pour PaymentElement
        appearance: {
          theme: 'stripe',
        },
      })
    }
  }, [secretModalAddCardStripe])

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
  const { displayModalAddCardStripe } = useSelector((state: RootState) => state.ModalAddCardStripe)
  return (
    <>
      {userData && userData.status === 200 && (
        <>
          {userData.body.meeting === null &&
            userData.body.discovery === false && userData.body.offre === null && (
              <>
                <ModalCalendarAddMeetingUnique allData={allData} />
                <ModalAddMeetingUnique mutate={mutate} userData={userData} />
                <ModalFormuleAddFlash mutate={mutate} userData={userData} />
                <ModalHelpFormuleGlobal />
                <ModalHelpSaveCardGlobal />
                {displayModalAddCardStripe && (
                  <>
                    {options !== null && (
                      <>

                        <Elements stripe={stripePromise} options={options}>
                          <ModalAddCardStripeUnique />
                        </Elements>
                      </>
                    )}
                  </>
                )}


              </>
            )}
          {userData.body.meeting !== null &&
            userData.body.discovery === false && userData.body.offre !== null && userData.body.offre.type === "unique" && (
              <>
                <ModalConfirmMeetingUnique mutate={mutate} userData={userData} />
                <ModalEditMeetingUnique mutate={mutate} offre={userData.body.offre} meeting={userData.body.meeting} userData={userData} />
                <ModalCalendarEditMeetingUnique allData={allData} startMeet={userData.body.meeting.startAt} />
                <ModalCancelMeetingUnique mutate={mutate} offre={userData.body.offre} userData={userData} />
                <ModalHelpSaveCardGlobal />
                {options !== null && (
                  <>

                    <Elements stripe={stripePromise} options={options}>
                      <ModalAddCardStripeUnique />
                    </Elements>
                  </>
                )}
              </>
            )}
            {userData.body.meeting === null &&
            userData.body.discovery === false && userData.body.offre !== null && userData.body.offre.type === "unique" && (
              <>
                <ModalFormuleEditFlash data={userData} mutate={mutate} />
                <ModalCalendarAddMeetingFlash allData={allData} type={userData.body.offre.type} />
                <ModalAddMeetingFlash mutate={mutate} offre={userData.body.offre} userData={userData} />
                <ModalHelpMeeting />
              </>
            )}
          {userData.body.meeting === null &&
            userData.body.discovery === true && userData.body.offre !== null && userData.body.offre.type === "discovery" && (
              <>
                <ModalCalendarAddMeetingDiscovery allData={allData} />
                <ModalAddMeetingDiscovery mutate={mutate} userData={userData} />
                <ModalHelpMeeting />
              </>
            )}
          {userData.body.meeting !== null &&
            userData.body.discovery === true && userData.body.offre !== null && userData.body.offre.type === "discovery" && (
              <>
                <ModalConfirmMeetingDiscovery mutate={mutate} userData={userData} />
                <ModalCalendarEditMeetingDiscovery allData={allData} startMeet={userData.body.meeting.startAt} />
                <ModalEditMeetingDiscovery offre={userData.body.offre} mutate={mutate} meeting={userData.body.meeting} userData={userData} />
                <ModalCancelMeetingDiscovery mutate={mutate} userData={userData} />
              </>
            )}
          {userData.body.meeting === null &&
            userData.body.discovery === false && userData.body.offre !== null && userData.body.offre.type === "flash" && (
              <>
                <ModalFormuleEditFlash data={userData} mutate={mutate} />
                <ModalFormuleConfirmFlash mutate={mutate} offre={userData.body.offre} />
                <ModalCalendarAddMeetingFlash allData={allData} type={userData.body.offre.type} />
                <ModalAddMeetingFlash mutate={mutate} offre={userData.body.offre} userData={userData} />
                <ModalHelpSaveCardGlobal />
                <ModalHelpMeeting />
                {userData.body.meetingsByUser && userData.body.meetingsByUser.length > 0 && <ModalHistoriqueMeetingFlash meet={userData.body.meetingsByUser} offre={userData.body.offre} />}
                {options !== null && (
                  <>

                    <Elements stripe={stripePromise} options={options}>
                      <ModalAddCardStripeFlash />
                    </Elements>
                  </>
                )}
              </>
            )}
          {userData.body.meeting !== null &&
            userData.body.discovery === false && userData.body.offre !== null && userData.body.offre.type === "flash" && (
              <>
                <ModalCalendarEditMeetingFlash allData={allData} startMeet={userData.body.meeting.startAt} />
                <ModalEditMeetingFlash mutate={mutate} meeting={userData.body.meeting} offre={userData.body.offre} userData={userData} />
                <ModalConfirmMeetingFlash mutate={mutate} userData={userData} />
                <ModalHistoriqueMeetingFlash meet={userData.body.meetingsByUser} offre={userData.body.offre} />
                <ModalCancelMeetingFlash mutate={mutate} offre={userData.body.offre} userData={userData} />
              </>
            )}
          {/* {userData.body.meeting !== null && (
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
                    offre={userData.body.offre}
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
               <ModalConfirmPaidMeeting
                    mutate={mutate}
                    offre={userData.body.offre}
                  />
              <ModalHelpMeeting offre={userData.body.offre} />
            </>
          )}

          {userData.body.meeting === null &&
            userData.body.discovery === false && (
              <>
                <ModalFormuleAdd mutate={mutate} data={userData} />
                <ModalFormuleEdit mutate={mutate} data={userData} />
                <ModalFormuleCancel />
                <ModalContract mutate={mutate} />
                <ModalContractRecap mutate={mutate} />
                <ModalContractEdit mutate={mutate} />
                <ModalHelpContract />
              </>
            )} */}
        </>
      )}
      <NoScript />
      {!isLoading && userData.status === 200 && (
        <>
          <main className={styles.meet}>
            {userData &&
              userData.body.offre !== null &&
              userData.body.meeting === null &&
              (userData.body.offre.hasCard || userData.body.discovery === true) && (
                <Take offre={userData.body.offre} mutate={mutate} meetingsByUser={userData.body.meetingsByUser} />
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
              userData.body.offre !== null && !userData.body.offre.hasCard && <FormuleNotConfirm offre={userData.body.offre} />}
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