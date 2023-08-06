"use client";

import React from "react";
import styles from "./MeetingData.module.scss";
import useUserGet from "@/app/components/hook/user/useUserGet";
import Link from "next/link";

const MeetingData = () => {
  const { userData, isLoading, isError } = useUserGet();
  let content;
  if (isError) {
    content = (
      <div className={styles.meetingData}>
        <div>error</div>
      </div>
    );
  } else if (isLoading) {
    content = (
      <div className={styles.meetingData}>
        <div className={styles.meetingData__loadData}>
          Chargement des données
          <div className={styles.meetingData__loadData__arc}>
            <div className={styles.meetingData__loadData__arc__circle}></div>
          </div>
        </div>
      </div>
    );
  } else {
    if (userData) {
      content = (
        <>
          {userData.body.role === "ROLE_USER" && (
            <div className={styles.meetingData}>
              <>
                <h3 className={styles.meetingData__h3}>Prochain rendez-vous</h3>
                <ul className={styles.meetingData__ul}>
                  <li
                    className={`${styles.meetingData__ul__li} ${styles.meetingData__ul__li__margin}`}
                  >
                    Rendez-vous :{" "}
                    {userData && userData.body.meetingId
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
            </div>
          )}
          {userData.body.role === "ROLE_ADMIN" && (
            <>
              <div className={styles.meetingData__flex}>
                <h3 className={styles.meetingData__h3}>Tous les rendez-vous</h3>

                <div
                  className={`${styles.meetingData__div} ${styles.meetingData__div__flex}`}
                >
                  <Link
                    href={"/meetingAdmin"}
                    className={styles.meetingData__div__button}
                  >
                    Voir sur le calendrier
                  </Link>
                  <Link
                    href={"/meetings"}
                    className={styles.meetingData__div__button}
                  >
                    voir sur la table
                  </Link>
                </div>
              </div>
            </>
          )}
        </>
      );
    }
  }
  return <>{content}</>;
};

export default MeetingData;
