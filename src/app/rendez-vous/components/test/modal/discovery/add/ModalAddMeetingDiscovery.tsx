import fetchPost from "@/app/components/fetch/FetchPost";
import TabIndex from "@/app/components/tabIndex/TabIndex";
import { AppDispatch, RootState } from "@/app/redux/store/store";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./ModalAddMeetingDiscovery.module.scss"
import Image from "@/app/components/image/Image";
import { useDispatch, useSelector } from "react-redux";
import { mutate as globalMutate } from "swr";
import useSWRMutation from "swr/mutation";

const ModalAddMeetingDiscovery = ({ mutate, userData }: any) => {
const dispatch = useDispatch<AppDispatch>();
  const [typeCoaching, setTypeCoaching] = useState<string>("");
  const [pseudo, setPseudo] = useState<string>("");
  const { csrfToken } = useSelector((state: RootState) => state.csrfToken)
  const [typeCoachingErrorMessage, setTypeCoachingErrorMessage] =
    useState<string>("");
  const [typeCoachingValid, setTypeCoachingValid] = useState<boolean>(false);
  const closeModal = () => {
    setTypeCoaching("");
    setTypeCoachingErrorMessage("");
    setTypeCoachingValid(false);
    setPseudo("");
    dispatch({ type: "ModalAddMeetingRendezVous/close" });
  };
  const openCalendar = () => {
    setTypeCoaching("");
    setTypeCoachingErrorMessage("");
    setTypeCoachingValid(false);
    setPseudo("");
    dispatch({ type: "ModalAddMeetingRendezVous/close" });
    dispatch({ type: "ModalCalendarAddMeetingRendezVous/open" });
  };
  const { displayModalAddMeetingRendezVous, dateModalAddMeetingRendezVous } =
    useSelector((state: RootState) => state.ModalAddMeetingRendezVous);

  const handleChange = (e: any) => {
    setTypeCoaching(e.target.value);
    if (e.target.value === "couple" || e.target.value === "familial" || e.target.value === "professionnel") {
      setTypeCoachingValid(true);
      setTypeCoachingErrorMessage("");
    } else {
      setTypeCoachingErrorMessage("Veuillez selectionner un type de coaching");
      setTypeCoachingValid(false);
    }
  };
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/rendez-vous/components/test/modal/discovery/add/api/",
    fetchPost
  );
  const router = useRouter();
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        const processFetchedData = async () => {
          setTypeCoaching("");
          setTypeCoachingErrorMessage("");
          setTypeCoachingValid(false);
          setPseudo("");
          globalMutate("/components/header/api");
         const { meeting, offre,meetings } = data.body;
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
          dispatch({ type: "ModalAddMeetingRendezVous/close" });
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "success", flashMessage: data.message },
          });

          reset();
        }
        processFetchedData()

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
          dispatch({ type: "modalAddMeetingDiscovery/close" });
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
  }, [data, dispatch, mutate, reset, router, userData]);
  return (
    <>
      <TabIndex displayModal={displayModalAddMeetingRendezVous} />
      <AnimatePresence>
        {displayModalAddMeetingRendezVous === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeModal()}
            />
            <motion.div
              className={styles.modalAddMeetingDiscovery}
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
                className={styles.modalAddMeetingDiscovery__return}
                onClick={() => openCalendar()}
              >
                Retour au calendrier
              </button>
              <button
                type="button"
                className={styles.modalAddMeetingDiscovery__btn}
                onClick={() => closeModal()}
              >
                <Image
                  className={styles.modalAddMeetingDiscovery__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="icone fermer modal"
                  width={25}
                  height={25}
                ></Image>
              </button>
              <h2 className={`${styles.modalAddMeetingDiscovery__h1}`}>
                Rendez-vous de découverte
              </h2>
              <div className={styles.modalAddMeetingDiscovery__rappel}>
                <h3 className={styles.modalAddMeetingDiscovery__rappel__title}>Récapitulatif</h3>
                <p className={styles.modalAddMeetingDiscovery__rappel__p}>
                  <span className={styles.modalAddMeetingDiscovery__rappel__p__strong}>Type du rendez-vous : &nbsp;</span>
                  Découverte
                </p>
                <p className={styles.modalAddMeetingDiscovery__rappel__p}>
                  <span className={styles.modalAddMeetingDiscovery__rappel__p__strong}>Date :&nbsp;</span>
                  {new Date(dateModalAddMeetingRendezVous).toLocaleDateString(
                    "fr-FR",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
                <p className={styles.modalAddMeetingDiscovery__rappel__p}>
                  <span className={styles.modalAddMeetingDiscovery__rappel__p__strong}>Heure :&nbsp;</span>
                  {new Date(dateModalAddMeetingRendezVous).toLocaleTimeString(
                    "fr-FR"
                  )}
                </p>
                <p className={styles.modalAddMeetingDiscovery__rappel__p}>
                  <span className={styles.modalAddMeetingDiscovery__rappel__p__strong}>Durée :&nbsp;</span>
                  1h
                </p>

                <p className={styles.modalAddMeetingDiscovery__rappel__p}>
                  <span className={styles.modalAddMeetingDiscovery__rappel__p__strong}>Tarif :&nbsp;</span>
                  Gratuit
                </p>
                <p className={styles.modalAddMeetingDiscovery__rappel__p}>
                  <span className={styles.modalAddMeetingDiscovery__rappel__p__strong}>Rendez-vous en cours :&nbsp;</span>
                  0/1
                </p>
              </div>
              <p className={styles.modalAddMeetingDiscovery__choose}>
                Veuillez choissir un type de coaching pour ce rendez-vous
              </p>
              <form
                action=""
                method="POST"
                className={styles.modalAddMeetingDiscovery__form}
                onSubmit={(e) => {
                  if (typeCoachingValid) {
                    if (pseudo.length === 0) {
                      trigger({
                        typeCoaching: typeCoaching,
                        start: dateModalAddMeetingRendezVous,
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
                <div className={styles.modalAddMeetingDiscovery__form__div}>
                  <label
                    className={`${typeCoaching.length > 0
                      ? styles.modalAddMeetingDiscovery__form__div__label__value
                      : styles.modalAddMeetingDiscovery__form__div__label
                      }`}
                    htmlFor=""
                  >
                    Type de coaching
                  </label>
                  <div className={styles.modalAddMeetingDiscovery__form__div__div}>
                    <select
                      className={
                        styles.modalAddMeetingDiscovery__form__div__div__select
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
                  <div className={styles.modalAddMeetingDiscovery__form__div__error}>
                    {typeCoachingErrorMessage}
                  </div>
                </div>

                <input
                  type="text"
                  name="pseudo"
                  id="pseudo"
                  className={styles.modalAddMeetingDiscovery__form__hidden}
                  tabIndex={-1}
                  autoComplete="off"
                  onChange={(e) => {
                    setPseudo(e.target.value);
                  }}
                />
                <div className={styles.modalAddMeetingDiscovery__form__submit}>
                  {isMutating && (
                    <>
                      <button
                        disabled
                        className={
                          styles.modalAddMeetingDiscovery__form__submit__btn__load
                        }
                      >
                        <span
                          className={
                            styles.modalAddMeetingDiscovery__form__submit__btn__load__span
                          }
                        >
                          Chargement
                        </span>

                        <div
                          className={
                            styles.modalAddMeetingDiscovery__form__submit__btn__load__arc
                          }
                        >
                          <div
                            className={
                              styles.modalAddMeetingDiscovery__form__submit__btn__load__arc__circle
                            }
                          ></div>
                        </div>
                      </button>
                    </>
                  )}
                  {isMutating === false && (
                    <>
                      <button
                        className={styles.modalAddMeetingDiscovery__form__submit__btn}
                      >
                        Ajouter le rendez-vous
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
}

export default ModalAddMeetingDiscovery