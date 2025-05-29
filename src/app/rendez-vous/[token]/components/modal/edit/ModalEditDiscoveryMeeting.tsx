import TabIndex from "@/app/components/tabIndex/TabIndex";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ModalEditDiscoveryMeeting.module.scss";
import fetchPost from "@/app/components/fetch/FetchPost";
import useSWRMutation from "swr/mutation";
import { RootState } from "@/app/redux/store";
import validator from "validator";

const ModalEditDiscoveryMeeting = ({ mutate, meeting, token }: any) => {
  const dispatch = useDispatch();
  const [typeCoaching, setTypeCoaching] = useState<string>(meeting.coaching);
  const [pseudo, setPseudo] = useState<string>("");
  const [typeCoachingErrorMessage, setTypeCoachingErrorMessage] =
    useState<string>("");
  const [typeCoachingValid, setTypeCoachingValid] = useState<boolean>(true);
  const { displayModalEditDiscoveryMeetingRendezVousToken, dateModalEditDiscoveryMeetingRendezVousToken }: any =
    useSelector((state: RootState) => state.ModalEditDiscoveryMeetingRendezVousToken);
  const { trigger, data, reset, isMutating } = useSWRMutation(
    `/rendez-vous/[token]/components/modal/edit/api/`,
    fetchPost
  );
  const handleChange = (e: any) => {
    setTypeCoaching(e.target.value);
    if (e.target.value.length > 0) {
      setTypeCoachingValid(true);
      setTypeCoachingErrorMessage("");
    } else {
      setTypeCoachingErrorMessage("Veuillez selectionner un type de coaching");
      setTypeCoachingValid(false);
    }
  };
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
              className={styles.modalEditDiscovery}
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
                className={styles.modalEditDiscovery__return}
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
                className={styles.modalEditDiscovery__btn}
                onClick={() =>
                  dispatch({
                    type: "ModalEditDiscoveryMeetingRendezVousToken/close",
                  })
                }
              >
                <Image
                  className={styles.modalEditDiscovery__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="icone fermer modal"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h2 className={`${styles.modalEditDiscovery__h1}`}>
                Modification du rendez-vous
              </h2>
              <div
                className={`${styles.modalEditDiscovery__previous} ${styles.modalEditDiscovery__rdv}`}
              >
                <p className={styles.modalEditDiscovery__rdv__title}>
                  Ancien rendez-vous
                </p>
                <p className={styles.modalEditDiscovery__rdv__p}>
                  <Image
                    className={styles.modalEditDiscovery__rdv__p__img}
                    src="/assets/icone/calendar-regular.svg"
                    alt="clock"
                    width={25}
                    height={25}
                  />
                  {new Date(meeting.startAt).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className={styles.modalEditDiscovery__rdv__p}>
                  <Image
                    className={styles.modalEditDiscovery__rdv__p__img}
                    src="/assets/icone/clock-solid.svg"
                    alt="clock"
                    width={25}
                    height={25}
                  />
                  {new Date(meeting.startAt).toLocaleTimeString("fr-FR")}
                </p>
              </div>
              <div
                className={`${styles.modalEditDiscovery__new} ${styles.modalEditDiscovery__rdv}`}
              >
                <p className={styles.modalEditDiscovery__rdv__title}>
                  Nouveau rendez-vous
                </p>
                <p className={styles.modalEditDiscovery__rdv__p}>
                  <Image
                    className={styles.modalEditDiscovery__rdv__p__img}
                    src="/assets/icone/calendar-regular.svg"
                    alt="clock"
                    width={25}
                    height={25}
                  />
                  {new Date(dateModalEditDiscoveryMeetingRendezVousToken).toLocaleDateString(
                    "fr-FR",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
                <p className={styles.modalEditDiscovery__rdv__p}>
                  <Image
                    className={styles.modalEditDiscovery__rdv__p__img}
                    src="/assets/icone/clock-solid.svg"
                    alt="clock"
                    width={25}
                    height={25}
                  />
                  {new Date(dateModalEditDiscoveryMeetingRendezVousToken).toLocaleTimeString(
                    "fr-FR"
                  )}
                </p>
              </div>

              <p className={styles.modalEditDiscovery__choose}>
                Vous pouvez également changer le type de coaching pour ce
                rendez-vous
              </p>
              <form
                className={styles.modalEditDiscovery__form}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (typeCoachingValid) {
                    if (pseudo.length === 0) {
                      trigger({
                        typeCoaching: typeCoaching,
                        start: dateModalEditDiscoveryMeetingRendezVousToken,
                        token: validator.escape(token.trim()),
                      });
                    }
                    e.preventDefault();
                  } else {
                    e.preventDefault();
                    if (typeCoaching.length === 0) {
                      setTypeCoachingErrorMessage(
                        "Veuillez selectionner un type de coaching"
                      );
                    }
                  }
                }}
              >
                <div className={styles.modalEditDiscovery__form__div}>
                  <label
                    className={`${
                      typeCoaching.length > 0
                        ? styles.modalEditDiscovery__form__div__label__value
                        : styles.modalEditDiscovery__form__div__label
                    }`}
                    htmlFor=""
                  >
                    Type de coaching
                  </label>
                  <div className={styles.modalEditDiscovery__form__div__div}>
                    <select
                      className={
                        styles.modalEditDiscovery__form__div__div__select
                      }
                      name="typeCoaching"
                      id="typeCoaching"
                      value={typeCoaching}
                      onChange={handleChange}
                    >
                      <option disabled value=""></option>
                      <option value="familial">Coaching familial</option>
                      <option value="couple">Coaching de couple</option>
                      <option value="professionnel">
                        Coaching professionnel
                      </option>
                    </select>
                  </div>
                  <div className={styles.modalEditDiscovery__form__div__error}>
                    {typeCoachingErrorMessage}
                  </div>
                </div>

                <input
                  type="text"
                  name="pseudo"
                  id="pseudo"
                  className={styles.modalEditDiscovery__form__hidden}
                  tabIndex={-1}
                  autoComplete="off"
                  onChange={(e) => {
                    setPseudo(e.target.value);
                  }}
                />
                <div className={styles.modalEditDiscovery__form__submit}>
                  {isMutating && (
                    <>
                      <button
                        disabled
                        className={
                          styles.modalEditDiscovery__form__submit__btn__load
                        }
                      >
                        <span
                          className={
                            styles.modalEditDiscovery__form__submit__btn__load__span
                          }
                        >
                          Chargement
                        </span>

                        <div
                          className={
                            styles.modalEditDiscovery__form__submit__btn__load__arc
                          }
                        >
                          <div
                            className={
                              styles.modalEditDiscovery__form__submit__btn__load__arc__circle
                            }
                          ></div>
                        </div>
                      </button>
                    </>
                  )}
                  {isMutating === false && (
                    <>
                      <button
                        className={styles.modalEditDiscovery__form__submit__btn}
                      >
                        Modifier le rendez-vous
                      </button>
                    </>
                  )}
                </div>
              </form>

              {/* <div className={styles.modalAddDiscovery__rappel}>
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
                    dateModalEditDiscoveryMeetingRendezVousToken
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
                    dateModalEditDiscoveryMeetingRendezVousToken
                  ).toLocaleTimeString("fr-FR")}
                </p>
                <p className={styles.modalAddDiscovery__rappel__p}>
                  <Image
                    className={styles.modalAddDiscovery__rappel__p__img}
                    src="/assets/icone/coach.png"
                    alt="clock"
                    width={25}
                    height={25}
                  />
                  {" : "}
                  {"Découverte"}
                </p>
              </div>
              <div className={styles.modalAddDiscovery__edit}>
                {isMutating === false && (
                  <button
                    className={styles.modalAddDiscovery__edit__btn}
                    onClick={() => {
                      trigger({
                        start: dateModalEditDiscoveryMeetingRendezVousToken,
                        token: validator.escape(token.trim()),
                      });
                    }}
                  >
                    Modifier mon rendez-vous
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
              </div> */}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalEditDiscoveryMeeting;
