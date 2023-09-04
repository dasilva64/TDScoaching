"use client";

import React from "react";
import { useEffect, useState } from "react";
import DatePickerDesktop from "./datePicker/DatePickerDesktop";
import DisplayMeeting from "./meeting/DisplayMeeting";
import DisplayDiscoveryMeeting from "./meeting/DisplayDiscoveryMeeting";
import DisplayFormule from "./meeting/DisplayFormule";
import styles from "../page.module.scss";
import useGet from "@/app/components/hook/useGet";

const Display = () => {
  const [mobile, setMobile] = useState<boolean | null>(null);
  const {
    data: userData,
    isLoading,
    isError,
  } = useGet("/api/user/getUserMeeting");
  console.log(userData);
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 600) {
        if (mobile === false || mobile === null) {
          setMobile(true);
        }
      } else {
        if (mobile === true || mobile === null) {
          setMobile(false);
        }
      }
    }
  }, [mobile]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", () => {
        if (window.innerWidth < 600) {
          if (mobile === false || mobile === null) {
            setMobile(true);
          }
        } else {
          if (mobile === true || mobile === null) {
            setMobile(false);
          }
        }
      });
    }
  }, [mobile]);
  let content;
  if (isError && isError.message) {
    content = (
      <div className={styles.profile__article__h2}>{isError.message}</div>
    );
  } else if (isLoading) {
    content = (
      <div className={styles.loadData}>
        <div className={styles.loadData__div}>
          Chargement des données
          <div className={styles.loadData__div__arc}>
            <div className={styles.loadData__div__arc__circle}></div>
          </div>
        </div>
      </div>
    );
  } else {
    content = (
      <>
        {/* {mobile === false &&
          userData &&
          userData.body.meeting === null &&
          userData.body.typeMeeting !== null && (
            
          )} */}
        {userData &&
          !userData.body.meeting &&
          userData.body.typeMeeting !== null &&
          mobile === true &&
          {
            /* <DatePickerMobile
              user={userData}
              events={allMeeting}
              setDisplayModal={setDisplayModal}
              setDateMeeting={setDateMeeting}
            /> */
          }}
        {userData?.body.typeMeeting.type === "découverte" && (
          <>
            {userData.body.meeting === null &&
              userData.body.discovery === false && (
                <>
                  <h2 className={styles.meet__container__h2}>
                    Comment faire ?
                  </h2>
                  <div className={styles.meet__container__how__discovery}>
                    <div
                      className={styles.meet__container__how__discovery__card}
                    >
                      <p>
                        1. Sélectionnez la date souhaitée dans le calendrier
                      </p>
                    </div>
                    <div
                      className={styles.meet__container__how__discovery__card}
                    >
                      <p>
                        2. Sélectionnez le type de coaching que vous souhaitez
                        prendre
                      </p>
                    </div>
                    <div
                      className={styles.meet__container__how__discovery__card}
                    >
                      <p>
                        4. Vous recevrez un mail de confirmation et le lien de
                        la visioconférence 48h avant le rendez-vous
                      </p>
                    </div>
                  </div>
                </>
              )}
            <div className={styles.meet__container__content}>
              {userData?.body.meeting === null &&
                userData?.body.discovery === false && (
                  <DatePickerDesktop
                    events={userData?.body.meetings}
                    discovery={userData?.body.discovery}
                  />
                )}

              <DisplayDiscoveryMeeting
                meeting={userData.body.meeting}
                discovery={userData.body.discovery}
              />
            </div>
          </>
        )}
        {userData?.body.typeMeeting.type !== "découverte" && (
          <>
            {userData.body.meeting === null && (
              <>
                <h2 className={styles.meet__container__h2}>Comment faire ?</h2>
                <div className={styles.meet__container__how}>
                  <div className={styles.meet__container__how__card}>
                    <p>1. Sélectionnez la date souhaitée dans le calendrier</p>
                  </div>
                  <div className={styles.meet__container__how__card}>
                    <p>
                      2. Sélectionnez le type de coaching que vous souhaitez
                      prendre
                    </p>
                  </div>
                  <div className={styles.meet__container__how__card}>
                    <p>
                      3. Payez en ligne pour confirmer votre rendez-vous
                      (paiement sécurisé)
                    </p>
                  </div>
                  <div className={styles.meet__container__how__card}>
                    <p>
                      4. Vous recevrez un mail de confirmation et le lien de la
                      visioconférence 48h avant le rendez-vous
                    </p>
                  </div>
                </div>
              </>
            )}

            <div className={styles.meet__container__content}>
              {userData?.body.meeting === null && (
                <>
                  <DatePickerDesktop
                    events={userData?.body.meetings}
                    discovery={userData?.body.discovery}
                    typeMeeting={userData?.body.typeMeeting}
                  />
                </>
              )}

              <DisplayMeeting
                meeting={userData.body.meeting}
                discovery={userData.body.discovery}
                typeMeeting={userData.body.typeMeeting}
              />
            </div>
          </>
        )}
        {userData?.body.typeMeeting.type === "découverte" &&
          userData?.body.discovery === true && <DisplayFormule />}
      </>
    );
  }

  return <>{content}</>;
};

export default Display;
