import fetchPost from "@/app/components/fetch/FetchPost";
import TabIndex from "@/app/components/tabIndex/TabIndex";
import { AppDispatch, RootState } from "@/app/redux/store";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import Image from "next/image";
import styles from "./ModalEditMeeting.module.scss";

const ModalEditMeeting = ({ mutate, meeting }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [typeCoaching, setTypeCoaching] = useState<string>(meeting.coaching);
  const [pseudo, setPseudo] = useState<string>("");
  const [typeCoachingErrorMessage, setTypeCoachingErrorMessage] =
    useState<string>("");
  const [typeCoachingValid, setTypeCoachingValid] = useState<boolean>(true);
  const closeModal = () => {
    dispatch({ type: "ModalEditMeetingRendezVous/close" });
  };
  const openCalendar = () => {
    dispatch({ type: "ModalEditMeetingRendezVous/close" });
    dispatch({ type: "ModalCalendarEditMeetingRendezVous/open" });
  };
  const { displayModalEditMeetingRendezVous, dateModalEditMeetingRendezVous }: any =
    useSelector((state: RootState) => state.ModalEditMeetingRendezVous);
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
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/rendez-vous/components/test/modal/edit/api/",
    fetchPost
  );
  const router = useRouter();
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        setTypeCoaching("");
        setTypeCoachingErrorMessage("");
        setTypeCoachingValid(false);
        setPseudo("");
        dispatch({ type: "ModalEditMeetingRendezVous/close" });
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        mutate();
        reset();
      } else if (data.status === 400) {
        if (data.type === "validation") {
          data.message.forEach((element: string) => {
            if (element[0] === "typeCoaching") {
              setTypeCoachingErrorMessage(element[1]);
            }
            if (element[0] === "start") {
              dispatch({
                type: "flash/storeFlashMessage",
                payload: { type: "error", flashMessage: element[1] },
              });
            }
          });
          reset();
        } else {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "error", flashMessage: data.message },
          });
          setTypeCoachingErrorMessage("");
          setTypeCoachingValid(false);
          setTypeCoaching("");
          reset();
        }
      } else if (data.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
        router.push("/");
      }
    }
  }, [data, dispatch, mutate, reset, router]);

  return (
    <>
      <TabIndex displayModal={displayModalEditMeetingRendezVous} />
      <AnimatePresence>
        {displayModalEditMeetingRendezVous === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeModal()}
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
                onClick={() => openCalendar()}
              >
                Retour au calendrier
              </button>
              <button
                type="button"
                className={styles.modalEditDiscovery__btn}
                onClick={() => closeModal()}
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
                  {new Date(dateModalEditMeetingRendezVous).toLocaleDateString(
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
                  {new Date(dateModalEditMeetingRendezVous).toLocaleTimeString(
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
                  if (typeCoachingValid) {
                    if (pseudo.length === 0) {
                      trigger({
                        typeCoaching: typeCoaching,
                        start: dateModalEditMeetingRendezVous,
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalEditMeeting;
