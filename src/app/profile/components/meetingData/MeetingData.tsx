"use client";

import React from "react";
import styles from "./MeetingData.module.scss";
import useUserGet from "@/app/components/hook/user/useUserGet";
import Link from "next/link";
import dayjs from "dayjs";
import Image from "next/image";

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
          <>
            <Image
              className={styles.card__icone}
              width="20"
              height="20"
              priority={true}
              src={"/assets/icone/user-solid.svg"}
              alt="bousole"
            />
            <div className={styles.card__info}>
              <p>
                <strong>Prochain Rendez-vous</strong>
              </p>
              <p>{userData?.body.firstname}</p>
            </div>
            <Image
              className={styles.card__info__icone}
              width="20"
              height="20"
              priority={true}
              src={"/assets/icone/chevron-right-solid.svg"}
              alt="bousole"
            />
          </>
          {userData.body.role === "ROLE_USER" && (
            <div className={styles.meetingData}>
              <>
                <h3 className={styles.meetingData__h3}>Prochain rendez-vous</h3>
                <ul className={styles.meetingData__ul}>
                  <li
                    className={`${styles.meetingData__ul__li} ${styles.meetingData__ul__li__margin}`}
                  >
                    Rendez-vous :{" "}
                    {userData && userData.body.meeting
                      ? dayjs(userData.body.meeting.startAt).format(
                          "YYYY-MM-DD à HH"
                        ) + "h"
                      : "Aucun de rendez-vous programmé"}
                  </li>
                </ul>

                <div className={styles.meetingData__div}>
                  {userData && userData.body.meeting && (
                    <>
                      <Link
                        href={"/rendez-vous"}
                        className={styles.meetingData__div__button}
                      >
                        Voir
                      </Link>
                    </>
                  )}
                  {userData && !userData.body.meeting && (
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
  return (
    <>
      {userData && userData.body.role === "ROLE_USER" && (
        <div className={styles.profile__main__container__content}>
          <h3 className={styles.profile__main__container__content__h3}>
            Rendez-vous
          </h3>
          <div
            className={styles.card}
            onClick={() => {
              /* dispatch({
                type: "form/openModalEditFirstnameUserData",
              }); */
            }}
          >
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default MeetingData;
