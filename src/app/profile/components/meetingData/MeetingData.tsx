"use client";

import React from "react";
import styles from "./MeetingData.module.scss";
import useUserGet from "@/app/components/hook/user/useUserGet";
import Link from "next/link";

const MeetingData = () => {
  const { userData, isLoading, isError } = useUserGet();
  let content;
  if (isError) {
    content = <div>error</div>;
  } else if (isLoading) {
    content = (
      <div className={styles.meetingData__loadData}>
        Chargement des données
        <div className={styles.meetingData__loadData__arc}>
          <div className={styles.meetingData__loadData__arc__circle}></div>
        </div>
      </div>
    );
  } else {
    if (userData) {
      content = (
        <>
        <h3 className={styles.meetingData__h3}>Prochain rendez-vous</h3>
          <ul className={styles.meetingData__ul}>
            <li
              className={`${styles.meetingData__ul__li} ${styles.meetingData__ul__li__margin}`}
            >
              Rendez-vous :{" "}
              {userData && userData.body.meetings
                ? "test"
                : "Aucun de rendez-vous programmé"}
            </li>
          </ul>

          <div className={styles.meetingData__div}>
            {userData && userData.body.meetings && (
              <>
                <Link
                  href={"/rendez-vous"}
                  className={styles.meetingData__div__button}
                >
                  Voir
                </Link>
              </>
            )}
            {userData && !userData.body.meetings && (
              <>
                <Link
                  href={"/rendez-vous"}
                  className={styles.meetingData__div__button}
                >
                  Prendre un Rendez-vous
                </Link>
              </>
            )}
          </div>
        </>
      );
    }
  }
  return (
    <>
      <>
        <div className={styles.meetingData}>{content}</div>
      </>
    </>
  );
};

export default MeetingData;
