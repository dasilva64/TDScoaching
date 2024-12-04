import TabIndex from "@/app/components/tabIndex/TabIndex";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ModalEditDiscoveryMeeting.module.scss";
import fetchPost from "@/app/components/fetch/FetchPost";
import useSWRMutation from "swr/mutation";
import { RootState } from "@/app/redux/store";
import validator from "validator";

const ModalEditDiscoveryMeeting = ({ mutate, token }: any) => {
  const dispatch = useDispatch();
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/rendez-vous/[token]/components/modal/edit/api/",
    fetchPost
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        dispatch({
          type: "ModalEditDiscoveryMeetingRendezVousToken/close",
        });
        reset();
        mutate();
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
      }
    }
  }, [data, dispatch, mutate, reset]);
  const {
    displayModalEditDiscoveryMeetingRendezVousToken,
    dataModalEditDiscoveryMeetingRendezVousToken,
  } = useSelector(
    (state: RootState) => state.ModalEditDiscoveryMeetingRendezVousToken
  );
  return (
    <>
      <TabIndex
        displayModal={displayModalEditDiscoveryMeetingRendezVousToken}
      />
      <AnimatePresence>
        {displayModalEditDiscoveryMeetingRendezVousToken === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() =>
                dispatch({
                  type: "ModalEditDiscoveryMeetingRendezVousToken/close",
                })
              }
            />
            <motion.div
              className={styles.modalAddDiscovery}
              initial={{ y: 200, x: "-50%", opacity: 0 }}
              animate={{
                y: "-50%",
                x: "-50%",
                opacity: 1,
                transition: { duration: 0.3 },
              }}
              exit={{
                y: 200,
                x: "-50%",
                opacity: 0,
                transition: { duration: 0.3 },
              }}
            >
              <button
                type="button"
                className={styles.modalAddDiscovery__return}
                onClick={() => {
                  dispatch({
                    type: "ModalEditDiscoveryMeetingRendezVousToken/close",
                  });
                  dispatch({
                    type: "ModalCalendarEditDiscoveryMeetingRendezVousToken/open",
                  });
                }}
              >
                Retour au calendrier
              </button>
              <button
                type="button"
                className={styles.modalAddDiscovery__btn}
                onClick={() =>
                  dispatch({
                    type: "ModalEditDiscoveryMeetingRendezVousToken/close",
                  })
                }
              >
                <Image
                  className={styles.modalAddDiscovery__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="icone fermer modal"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h2 className={`${styles.modalAddDiscovery__h1}`}>
                Modification du rendez-vous
              </h2>
              <div className={styles.modalAddDiscovery__rappel}>
                <p className={styles.modalAddDiscovery__rappel__p}>
                  <Image
                    className={styles.modalAddDiscovery__rappel__p__img}
                    src="/assets/icone/calendar-regular.svg"
                    alt="clock"
                    width={25}
                    height={25}
                  />
                  {" : "}
                  {new Date(
                    dataModalEditDiscoveryMeetingRendezVousToken
                  ).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className={styles.modalAddDiscovery__rappel__p}>
                  <Image
                    className={styles.modalAddDiscovery__rappel__p__img}
                    src="/assets/icone/clock-solid.svg"
                    alt="clock"
                    width={25}
                    height={25}
                  />
                  {" : "}
                  {new Date(
                    dataModalEditDiscoveryMeetingRendezVousToken
                  ).toLocaleTimeString("fr-FR")}
                </p>
                {/* <p className={styles.modalAddDiscovery__rappel__p}>
                  <Image
                    className={styles.modalAddDiscovery__rappel__p__img}
                    src="/assets/icone/coach.png"
                    alt="clock"
                    width={25}
                    height={25}
                  />
                  {" : "}
                  {typeCoaching}
                </p> */}
              </div>
              <div className={styles.modalAddDiscovery__edit}>
                {isMutating === false && (
                  <button
                    className={styles.modalAddDiscovery__edit__btn}
                    onClick={() => {
                      trigger({
                        start: dataModalEditDiscoveryMeetingRendezVousToken,
                        token: validator.escape(token.trim()),
                      });
                    }}
                  >
                    Voulez vous modifier votre rendez-vous
                  </button>
                )}
                {isMutating && (
                  <>
                    <button
                      disabled
                      className={styles.modalAddDiscovery__edit__btn__load}
                    >
                      <span
                        className={
                          styles.modalAddDiscovery__edit__btn__load__span
                        }
                      >
                        Chargement
                      </span>

                      <div
                        className={
                          styles.modalAddDiscovery__edit__btn__load__arc
                        }
                      >
                        <div
                          className={
                            styles.modalAddDiscovery__edit__btn__load__arc__circle
                          }
                        ></div>
                      </div>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalEditDiscoveryMeeting;
