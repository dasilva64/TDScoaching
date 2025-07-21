import fetchPost from "@/app/components/fetch/FetchPost";
import TabIndex from "@/app/components/tabIndex/TabIndex";
import { AppDispatch, RootState } from "@/app/redux/store";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWRMutation from "swr/mutation";
import styles from "./ModalAddPaidMeeting.module.scss";
import Image from "next/image";
import { mutate as globalMutate } from "swr";

const ModalAddPaidMeeting = ({ mutate, discovery, offre }: any) => {
  const { csrfToken } = useSelector((state: RootState) => state.csrfToken)
  const dispatch = useDispatch<AppDispatch>();
  const [typeCoaching, setTypeCoaching] = useState<string>("");
  const [pseudo, setPseudo] = useState<string>("");
  const [typeCoachingErrorMessage, setTypeCoachingErrorMessage] =
    useState<string>("");
  const [typeCoachingValid, setTypeCoachingValid] = useState<boolean>(false);
  const closeModal = () => {
    setTypeCoaching("");
    setTypeCoachingErrorMessage("");
    setTypeCoachingValid(false);
    setPseudo("");
    dispatch({ type: "ModalAddPaidMeetingRendezVous/close" });
  };
  const openCalendar = () => {
    setTypeCoaching("");
    setTypeCoachingErrorMessage("");
    setTypeCoachingValid(false);
    setPseudo("");
    dispatch({ type: "ModalAddPaidMeetingRendezVous/close" });
    dispatch({ type: "ModalCalendarAddMeetingRendezVous/open" });
  };
  const {
    displayModalAddPaidMeetingRendezVous,
    dateModalAddPaidMeetingRendezVous,
  } = useSelector((state: RootState) => state.ModalAddPaidMeetingRendezVous);

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
  const router = useRouter();
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/rendez-vous/components/test/modal/add/paid/api/",
    fetchPost
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        setTypeCoaching("");
        setTypeCoachingErrorMessage("");
        setTypeCoachingValid(false);
        setPseudo("");
        reset()
        window.location.href = data.url;
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
          dispatch({ type: "ModalAddDiscovery/close" });
          reset();
        }
      } else if (data.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
        globalMutate("/components/header/api");
        globalMutate("/components/header/ui/api");
        router.push("/");
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
      }
    }
    
  }, [data, dispatch, mutate, reset, router]);
  return (
    <>
      <TabIndex displayModal={displayModalAddPaidMeetingRendezVous} />
      <AnimatePresence>
        {displayModalAddPaidMeetingRendezVous === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeModal()}
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
                onClick={() => openCalendar()}
              >
                Retour au calendrier
              </button>
              <button
                type="button"
                className={styles.modalAddDiscovery__btn}
                onClick={() => closeModal()}
              >
                <Image
                  className={styles.modalAddDiscovery__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="icone fermer modal"
                  width={25}
                  height={25}
                ></Image>
              </button>
              <h2 className={`${styles.modalAddDiscovery__h1}`}>
                Rendez-vous {discovery && <>de découverte</>}
              </h2>
              <div className={styles.modalAddDiscovery__rappel}>
                <h3 className={styles.modalAddDiscovery__rappel__title}>Récapitulatif</h3>
                <p className={styles.modalAddDiscovery__rappel__p}>
                  <span className={styles.modalAddDiscovery__rappel__p__strong}>Type de l&apos;offre :&nbsp;</span>

                  {offre.type !== "discovery"
                    ? String(offre.type).charAt(0).toLocaleUpperCase() +
                    String(offre.type).slice(1)
                    : "Découverte"}
                </p>
                <p className={styles.modalAddDiscovery__rappel__p}>
                  <span className={styles.modalAddDiscovery__rappel__p__strong}>Date du rendez-vous :&nbsp;</span>
                  {new Date(dateModalAddPaidMeetingRendezVous).toLocaleDateString(
                    "fr-FR",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
                <p className={styles.modalAddDiscovery__rappel__p}>
                  <span className={styles.modalAddDiscovery__rappel__p__strong}>Heure du rendez-vous :&nbsp;</span>
                  {new Date(dateModalAddPaidMeetingRendezVous).toLocaleTimeString(
                    "fr-FR"
                  )}
                </p>
                <p className={styles.modalAddDiscovery__rappel__p}>
                  <span className={styles.modalAddDiscovery__rappel__p__strong}>Durée du rendez-vous :&nbsp;</span>
                  {["unique", "discovery"].includes(offre.type)
                    ? "1h"
                    : (offre.type === "flash"
                      ? "3 × 1h (séances individuelles)"
                      : "1h")}
                </p>

                <p className={styles.modalAddDiscovery__rappel__p}>
                  <span className={styles.modalAddDiscovery__rappel__p__strong}>Tarif :&nbsp;</span>
                  {offre.type === "discovery" ? "Gratuit" : offre.type === "unique" ? "100€" : "300€"}
                </p>
                <p className={styles.modalAddDiscovery__rappel__p}>
                  <span className={styles.modalAddDiscovery__rappel__p__strong}>Rendez-vous en cours :&nbsp;</span>
                  {offre.currentNumberOfMeeting === null
                    ? 0
                    : offre.currentNumberOfMeeting}
                  /{offre.type === "discovery" ? "1" : offre.type === "flash" ? "3" : "1"}
                </p>
              </div>
              <p className={styles.modalAddDiscovery__choose}>
                Veuillez choissir un type de coaching pour ce rendez-vous
              </p>
              <form
                className={styles.modalAddDiscovery__form}
                onSubmit={(e) => {
                  if (typeCoachingValid) {
                    if (pseudo.length === 0) {
                      trigger({
                        typeCoaching: typeCoaching,
                        start: dateModalAddPaidMeetingRendezVous,
                        csrfToken: csrfToken,
                        pseudo: pseudo
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
                <div className={styles.modalAddDiscovery__form__div}>
                  <label
                    className={`${typeCoaching.length > 0
                      ? styles.modalAddDiscovery__form__div__label__value
                      : styles.modalAddDiscovery__form__div__label
                      }`}
                    htmlFor=""
                  >
                    Type de coaching
                  </label>
                  <div className={styles.modalAddDiscovery__form__div__div}>
                    <select
                      className={
                        styles.modalAddDiscovery__form__div__div__select
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
                  <div className={styles.modalAddDiscovery__form__div__error}>
                    {typeCoachingErrorMessage}
                  </div>
                </div>

                <input
                  type="text"
                  name="pseudo"
                  id="pseudo"
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                  onChange={(e) => {
                    setPseudo(e.target.value);
                  }}
                />

                <div className={styles.modalAddDiscovery__form__submit}>
                  {isMutating && (
                    <>
                      <button
                        disabled
                        className={
                          styles.modalAddDiscovery__form__submit__btn__load
                        }
                      >
                        <span
                          className={
                            styles.modalAddDiscovery__form__submit__btn__load__span
                          }
                        >
                          Chargement
                        </span>

                        <div
                          className={
                            styles.modalAddDiscovery__form__submit__btn__load__arc
                          }
                        >
                          <div
                            className={
                              styles.modalAddDiscovery__form__submit__btn__load__arc__circle
                            }
                          ></div>
                        </div>
                      </button>
                    </>
                  )}
                  {isMutating === false && (
                    <>
                      <button
                        className={styles.modalAddDiscovery__form__submit__btn}
                      >
                        Payer
                      </button>
                    </>
                  )}
                </div>
              </form>
              <p className={styles.modalAddDiscovery__help} onClick={() => {
                dispatch({
                  type: "ModalHelpPaiementRendezVous/open"
                })
              }}>Comment ça marche ?</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalAddPaidMeeting;
