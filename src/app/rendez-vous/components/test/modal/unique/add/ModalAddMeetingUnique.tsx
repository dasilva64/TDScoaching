import fetchPost from "@/app/components/fetch/FetchPost";
import TabIndex from "@/app/components/tabIndex/TabIndex";
import { RootState, AppDispatch } from "@/app/redux/store/store";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "@/app/components/image/Image";
import styles from "./ModalAddMeetingUnique.module.scss"
import { useSelector, useDispatch } from "react-redux";
import useSWRMutation from "swr/mutation";
import { mutate as globalMutate } from "swr";
import React from "react";
import Link from "next/link";

const ModalAddMeetingUnique = ({ mutate, userData }: any) => {
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
  const {
    displayModalAddPaidMeetingRendezVous,
    dateModalAddPaidMeetingRendezVous,
  } = useSelector((state: RootState) => state.ModalAddPaidMeetingRendezVous);
  const inputRef: any = React.useRef();
  useEffect(() => {
    if (displayModalAddPaidMeetingRendezVous === true) {
      if (inputRef && inputRef.current) {
        inputRef.current.addEventListener("keydown", (e: any) => {
          if (e.key === "Enter") {
            e.srcElement.click();
            e.preventDefault();
          }
        });
      }
    }
  }, [displayModalAddPaidMeetingRendezVous]);
  const openCalendar = () => {
    setTypeCoaching("");
    setTypeCoachingErrorMessage("");
    setTypeCoachingValid(false);
    setPseudo("");
    dispatch({ type: "ModalAddPaidMeetingRendezVous/close" });
    dispatch({
      type: "ModalCalendarAddMeetingRendezVous/open",
    });
  };

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
    "/rendez-vous/components/test/modal/unique/add/api/",
    fetchPost
  );
  useEffect(() => {
    const closeModal = () => {
    setTypeCoaching("");
    setTypeCoachingErrorMessage("");
    setTypeCoachingValid(false);
    setPseudo("");
    dispatch({ type: "ModalAddPaidMeetingRendezVous/close" });
  };
    if (data) {
      if (data.status === 200) {
        setTypeCoaching("");
        setTypeCoachingErrorMessage("");
        setTypeCoachingValid(false);
        setPseudo("");
        globalMutate("/components/header/api");
        reset()
        closeModal()
        dispatch({
          type: "ModalAddCardStripe/open",
          payload: {
            secret: data.body.client_secret
          }
        });
        const { meeting, offre, meetings } = data.body;
        mutate(
          {
            ...userData,
            body: {
              ...userData.body,
              meeting,
              offre,
              meetings,
              meetingsByUser: [...(userData.body.meetingsByUser ?? []), meeting],
            },
          },
          { revalidate: false }
        );
      } else if (data.status === 400) {
        if (data.type === "validation") {
          data.message.forEach((element: string) => {
            if (element[0] === "typeCoaching") {
              setTypeCoachingErrorMessage(element[1]);
              setTypeCoachingValid(false);
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
          dispatch({ type: "modalAddMeetingUnique/close" });
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
        router.push(`/acces-refuse?destination=rendez-vous`)
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
      }
    }

  }, [data, dispatch, mutate, reset, router, userData, closeModal]);
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
              className={styles.modalAddMeetingUnique}
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
                className={styles.modalAddMeetingUnique__return}
                onClick={() => openCalendar()}
              >
                Retour au calendrier
              </button>
              <button
                type="button"
                className={styles.modalAddMeetingUnique__btn}
                onClick={() => closeModal()}
              >
                <Image
                  className={styles.modalAddMeetingUnique__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="icone fermer modal"
                  width={25}
                  height={25}
                ></Image>
              </button>
              <h2 className={`${styles.modalAddMeetingUnique__h1}`}>
                Rendez-vous unique
              </h2>
              <div className={styles.modalAddMeetingUnique__rappel}>
                <h3 className={styles.modalAddMeetingUnique__rappel__title}>Récapitulatif</h3>
                <p className={styles.modalAddMeetingUnique__rappel__p}>
                  <span className={styles.modalAddMeetingUnique__rappel__p__strong}>Type de l&apos;offre :&nbsp;</span>

                  Unique
                </p>
                <p className={styles.modalAddMeetingUnique__rappel__p}>
                  <span className={styles.modalAddMeetingUnique__rappel__p__strong}>Date du rendez-vous :&nbsp;</span>
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
                <p className={styles.modalAddMeetingUnique__rappel__p}>
                  <span className={styles.modalAddMeetingUnique__rappel__p__strong}>Heure du rendez-vous :&nbsp;</span>
                  {new Date(dateModalAddPaidMeetingRendezVous).toLocaleTimeString(
                    "fr-FR"
                  )}
                </p>
                <p className={styles.modalAddMeetingUnique__rappel__p}>
                  <span className={styles.modalAddMeetingUnique__rappel__p__strong}>Durée du rendez-vous :&nbsp;</span>
                  1h
                </p>

                <p className={styles.modalAddMeetingUnique__rappel__p}>
                  <span className={styles.modalAddMeetingUnique__rappel__p__strong}>Tarif :&nbsp;</span>
                  100€
                </p>
                <p className={styles.modalAddMeetingUnique__rappel__p}>
                  <span className={styles.modalAddMeetingUnique__rappel__p__strong}>Rendez-vous en cours :&nbsp;</span>
                  0
                  / 1
                </p>
              </div>
              <p className={styles.modalAddMeetingUnique__choose}>
                Veuillez choissir un type de coaching pour ce rendez-vous
              </p>
              <form
                className={styles.modalAddMeetingUnique__form}
                onSubmit={(e) => {
                  if (typeCoachingValid) {
                    if (pseudo.length === 0) {
                      trigger({
                        typeCoaching: typeCoaching,
                        start: dateModalAddPaidMeetingRendezVous,
                        csrfToken: csrfToken,
                        pseudo: pseudo,
                        formule: "unique"
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
                <div className={styles.modalAddMeetingUnique__form__div}>
                  <label
                    className={`${typeCoaching.length > 0
                      ? styles.modalAddMeetingUnique__form__div__label__value
                      : styles.modalAddMeetingUnique__form__div__label
                      }`}
                    htmlFor=""
                  >
                    Type de coaching
                  </label>
                  <div className={styles.modalAddMeetingUnique__form__div__div}>
                    <select
                      className={
                        styles.modalAddMeetingUnique__form__div__div__select
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
                  <div className={styles.modalAddMeetingUnique__form__div__error}>
                    {typeCoachingErrorMessage}
                  </div>
                </div>
                {/* <div className={styles.modalAddMeetingUnique__form__checkbox}>
                  <div className={styles.modalAddMeetingUnique__form__checkbox__div}>
                    <label
                      className={styles.modalAddMeetingUnique__form__checkbox__div__label}
                      htmlFor="remenber"
                    >
                      Accepter les <Link target="_blank" className={styles.modalAddMeetingUnique__form__checkbox__div__label__link} href="/conditions-generales-de-vente">conditions générales de vente </Link> ?
                    </label>
                    <input
                      ref={inputRef}
                      className={styles.modalAddMeetingUnique__form__checkbox__div__checkbox}
                      type="checkbox"
                      name="cgv"
                      id="cgv"
                      onChange={(e) => {
                        if (e.target.checked === true) {
                          setCgvInput("true");
                          setValidCgvInput(true);
                          setCgvInputError("");
                        } else {
                          setCgvInput("false");
                          setValidCgvInput(false);
                          setCgvInputError(
                            "Vous devez valider les conditions générales de vente"
                          );
                        }
                      }}
                    />
                  </div>
                  <div className={styles.modalAddMeetingUnique__form__checkbox__div__error}>
                    {cgvInputError}
                  </div>
                </div> */}
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

                <div className={styles.modalAddMeetingUnique__form__submit}>
                  {isMutating && (
                    <>
                      <button
                        disabled
                        className={
                          styles.modalAddMeetingUnique__form__submit__btn__load
                        }
                      >
                        <span
                          className={
                            styles.modalAddMeetingUnique__form__submit__btn__load__span
                          }
                        >
                          Chargement
                        </span>

                        <div
                          className={
                            styles.modalAddMeetingUnique__form__submit__btn__load__arc
                          }
                        >
                          <div
                            className={
                              styles.modalAddMeetingUnique__form__submit__btn__load__arc__circle
                            }
                          ></div>
                        </div>
                      </button>
                    </>
                  )}
                  {isMutating === false && (
                    <>
                      <button
                        className={styles.modalAddMeetingUnique__form__submit__btn}
                      >
                        Enregistrer sa carte bancaire
                      </button>
                    </>
                  )}
                </div>
              </form>
              <p onClick={() => {
                dispatch({
                  type: "ModalHelpPaiementRendezVous/open"
                })
              }} className={styles.modalAddMeetingUnique__help}>Comment fonctionne le paiement ?</p>
               <Link target="_blank" href={"/conditions-generales-de-vente"} className={styles.modalAddMeetingUnique__help}>Conditions générales de vente</Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default ModalAddMeetingUnique