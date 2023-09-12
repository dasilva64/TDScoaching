"use client";

import React from "react";
import { useEffect, useState } from "react";
import styles from "./Display.module.scss";
import useGet from "@/app/components/hook/useGet";
import HowDo from "./how-do/HowDo";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/app/redux/store";
import { useDispatch } from "react-redux";
import TakeDiscovery from "./takeDiscovery/TakeDiscovery";
import MyDiscoveryMeeting from "./my-discovery-meeting/MyDiscoveryMeeting";
import HowDoDiscovery from "./how-do-discovery/HowDoDiscovery";
import Take from "./take/Take";
import NotComfirm from "./not-comfirm/NotComfirm";
import MyMeeting from "./my-meeting/MyMeeting";
import Formule from "./formule/Formule";

const Display = () => {
  const [mobile, setMobile] = useState<boolean | null>(null);
  const {
    data: userData,
    isLoading,
    isError,
  } = useGet("/api/user/getUserMeeting");
  const dispatch: AppDispatch = useDispatch();
  const { push } = useRouter();
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
    if (userData.status === 200) {
      content = (
        <>
          {/* {mobile === false &&
          userData &&
          userData.body.meeting === null &&
          userData.body.typeMeeting !== null && (
            
          )} */}

          {userData?.body.typeMeeting.type === "découverte" && (
            <>
              {userData.body.meeting === null &&
                userData.body.discovery === false && (
                  <>
                    <div className={styles.div}>
                      <p className={styles.div__p}>
                        Vous n&apos;avez pas de rendez vous de prévu, vous
                        pouvez prendre rendez-vous en cliquant sur ce bouton{" "}
                      </p>
                      <button
                        className={styles.div__btn}
                        onClick={() => {
                          dispatch({
                            type: "ModalDatePickerDiscovery/open",
                          });
                        }}
                      >
                        Prendre rendez-vous
                      </button>
                    </div>
                    <div className={styles.content}>
                      <HowDoDiscovery />
                      <TakeDiscovery />
                    </div>
                  </>
                )}
              {userData.body.meeting !== null &&
                userData.body.discovery === false && (
                  <>
                    <div className={styles.rappel}>
                      <h2 className={styles.rappel__h2}>Offre actuelle</h2>
                      <p className={styles.rappel__p}>
                        Vous disposez d&apos;une offre{" "}
                        <strong>{userData.body.typeMeeting.type}</strong>.
                      </p>
                      <p className={styles.rappel__p}>
                        Vous pouvez changer d&apos;offre en supprimant le
                        rendez-vous car il faudra effectué de nouveau un
                        paiement
                      </p>
                    </div>
                    <div className={styles.content}>
                      <MyDiscoveryMeeting />
                    </div>
                  </>
                )}
            </>
          )}
          {userData?.body.typeMeeting.type !== "découverte" && (
            <>
              {userData.body.meeting === null && (
                <>
                  <div className={styles.div}>
                    <p className={styles.div__p}>
                      Vous n&apos;avez pas de rendez vous de prévu, vous pouvez
                      prendre rendez-vous en cliquant sur ce bouton{" "}
                    </p>
                    <button
                      className={styles.div__btn}
                      onClick={() => {
                        dispatch({
                          type: "ModalDatePicker/open",
                        });
                      }}
                    >
                      Prendre rendez-vous
                    </button>
                  </div>
                  <div className={styles.content}>
                    <HowDo />
                    <Take />
                  </div>
                </>
              )}
              {userData.body.meeting !== null &&
                userData.body.meeting.status === false && (
                  <div className={styles.contentNot}>
                    <NotComfirm />
                  </div>
                )}
              {userData.body.meeting !== null &&
                userData.body.meeting.status === true && (
                  <>
                    <div className={styles.rappel}>
                      <h2 className={styles.rappel__h2}>Offre actuelle</h2>
                      <p className={styles.rappel__p}>
                        Vous disposez d&apos;une offre{" "}
                        <strong>{userData.body.typeMeeting.type}</strong>.
                      </p>
                      {userData.body.meeting.typeMeeting.type !== "unique" && (
                        <p className={styles.rappel__p}>
                          <strong>
                            Rendez-vous restant (ce rendez-vous inclus)
                          </strong>{" "}
                          : {userData.body.meeting.typeMeeting.number}
                        </p>
                      )}
                      <p className={styles.rappel__p}>
                        Vous pouvez changer d&apos;offre en supprimant le
                        rendez-vous car il faudra effectué de nouveau un
                        paiement
                      </p>
                    </div>
                    <div className={styles.content}>
                      <MyMeeting />
                    </div>
                  </>
                )}
            </>
          )}
          {userData?.body.typeMeeting.type === "découverte" &&
            userData?.body.discovery === true && <Formule />}
        </>
      );
    } else {
      content = <></>;
    }
  }

  return <>{content}</>;
};

export default Display;
