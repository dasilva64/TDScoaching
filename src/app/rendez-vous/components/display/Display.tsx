"use client";

import React from "react";
import { useEffect, useState } from "react";
import styles from "./Display.module.scss";
import useGet from "../../../components/hook/useGet";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Formule from "../formule/Formule";
import localFont from "next/font/local";
const Parisienne = localFont({
  src: "../../../Parisienne-Regular.ttf",
  display: "swap",
});
import NoScript from "@/app/components/noscript/NoScript";
import TakeDiscovery from "../discovery/take/takeDiscovery";
import ModalCalendarDiscovery from "../discovery/take/modal/ModalCalendarDiscovery";
import ModalAddDiscovery from "../discovery/take/modal/ModalAddDiscovery";
import MyDiscovery from "../discovery/my/MyDiscovery";
import ModalDeleteDiscovery from "../discovery/my/modal/ModalDeleteDiscovery";
import ModalCalendarEditDiscovery from "../discovery/my/modal/ModalCalendarEditDiscovery";
import ModalEditDiscovery from "../discovery/my/modal/ModalEditDiscovery";
import { TakeDiscoveryLoad } from "../discovery/take/load/takeDiscoveryLoad";
import ModalEditTypeDiscovery from "../discovery/my/modal/ModalEditTypeDiscovery";

const Display = () => {
  const router = useRouter();
  const {
    data: userData,
    isLoading,
    isError,
    mutate,
  } = useGet("/rendez-vous/components/api");
  const dispatch: AppDispatch = useDispatch();
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
  const [allData, setAllData] = useState<any[]>([]);
  useEffect(() => {
    if (userData) {
      if (userData.status === 200) {
        let array = [];

        for (let i = 0; i < userData.body.meetings.length; i++) {
          if (userData.body.meeting === null) {
            array.push({
              start: userData.body.meetings[i].startAt,
              editable: true,
              backgroundColor: "red",
              textColor: "red",
              id: userData.body.meetings[i].userId,
            });
          } else {
            if (
              userData.body.meeting.userId === userData.body.meetings[i].userId
            ) {
              array.push({
                start: userData.body.meetings[i].startAt,
                editable: true,
                backgroundColor: "green",
                textColor: "white",
                title: "Mon rendez-vous",
                id: userData.body.meetings[i].userId,
              });
            } else {
              array.push({
                start: userData.body.meetings[i].startAt,
                editable: false,
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
      {userData && userData.status === 200 && (
        <>
          <ModalCalendarEditDiscovery allData={allData} />
          <ModalCalendarDiscovery allData={allData} />
          <ModalAddDiscovery mutate={mutate} />
          <ModalDeleteDiscovery mutate={mutate} />
          {userData.body.meeting !== null && (
            <>
              <ModalEditDiscovery
                currentTypeCoaching={userData.body.meeting.typeMeeting.coaching}
                mutate={mutate}
              />
              <ModalEditTypeDiscovery
                currentTypeCoaching={userData.body.meeting.typeMeeting.coaching}
                currentDateCoaching={userData.body.meeting.startAt}
                mutate={mutate}
              />
            </>
          )}
        </>
      )}

      <NoScript />
      <main className={styles.meet}>
        <section className={styles.meet__section}>
          <h1 className={`${styles.meet__section__h1} ${Parisienne.className}`}>
            Rendez-vous
          </h1>
          {userData &&
            userData.body.typeMeeting.type === "découverte" &&
            userData.body.discovery === false &&
            userData.body.meeting === null && <TakeDiscovery />}
          {userData &&
            userData.body.typeMeeting.type === "découverte" &&
            userData.body.discovery === false &&
            userData.body.meeting !== null && (
              <MyDiscovery
                meeting={userData.body.meeting}
                link={userData.body.link}
              />
            )}
          {userData?.body.typeMeeting.type === "découverte" &&
            userData?.body.discovery === true && <Formule />}
          {isLoading && (
            <>
              <TakeDiscoveryLoad />
            </>
          )}
        </section>

        {/* <Content /> */}
      </main>
    </>
  );
};

export default Display;
