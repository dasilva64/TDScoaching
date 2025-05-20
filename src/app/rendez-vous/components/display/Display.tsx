"use client";

import React from "react";
import { useEffect, useState } from "react";
import styles from "./Display.module.scss";
import useGet from "../../../components/hook/useGet";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/app/redux/store";
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

const Display = () => {
  const router = useRouter();
  const {
    data: userData,
    isLoading,
    isError,
    mutate,
  } = useGet("/rendez-vous/components/api");
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    if (isError) {
      dispatch({
        type: "flash/storeFlashMessage",
        payload: {
          type: "error",
          flashMessage: "Erreur lors du chargement, veuillez réessayer",
        },
      });
      router.push("/");
    }
    if (isLoading === false && userData) {
      if (userData.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: userData.message,
          },
        });
        router.push("/");
      } else if (userData.status === 400) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: userData.message,
          },
        });
        router.push("/");
      }
    }
  }, [dispatch, isError, isLoading, router, userData]);

  const [allData, setAllData] = useState<any[]>([]);
  useEffect(() => {
    if (userData) {
      if (userData.status === 200) {
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
    }
  }, [userData]);
  return (
    <>
      <style>{"body { height: 100%; }"}</style>
      <style>{"html { height: 100%}"}</style>
      {userData && userData.status === 200 && (
        <>
          {userData.body.meeting !== null && (
            <>
              <ModalCalendarEditMeeting allData={allData} />
              <ModalDeleteMeeting mutate={mutate} />
              <ModalEditMeeting
                mutate={mutate}
                meeting={userData.body.meeting}
              />

              {userData.body.meeting.type === "discovery" && (
                <ModalConfirmMeeting
                  mutate={mutate}
                  meeting={userData.body.meeting}
                />
              )}
              {/* {userData.body.meeting.type === "unique" && (
                <>
                  <ModalConfirmPaidMeeting
                    mutate={mutate}
                    meeting={userData.body.meeting}
                  />
                  <ModalCancelMeeting mutate={mutate} />
                </>
              )} */}
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
              {/* <ModalAddPaidMeeting
                mutate={mutate}
                discovery={userData.body.discovery}
                offre={userData.body.offre}
              /> */}
            </>
          )}

          {/* {userData.body.meeting === null &&
            userData.body.discovery === false && (
              <>
                <ModalFormuleAdd mutate={mutate} />
                <ModalContract />
              </>
            )} */}
        </>
      )}
      {/* <ModalFormuleEdit mutate={mutate} /> */}

      <NoScript />
      {!isLoading && (
        <>
          <main className={styles.meet}>
            {userData &&
              userData.body.meeting === null &&
              userData.body.discovery === true && (
                <Take offre={userData.body.offre} />
              )}
            {userData && userData.body.meeting !== null && (
              <My meeting={userData.body.meeting} />
            )}
            {/* {userData.body.meeting === null && userData.body.offre !== null && (
              <>
                <Take offre={userData.body.offre} />
              </>
            )} */}
            {userData &&
              userData.body.meeting === null &&
              userData.body.discovery === false &&
              userData.body.offre === null && <Formule />}
          </main>
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
