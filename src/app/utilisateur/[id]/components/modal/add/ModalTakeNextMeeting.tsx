import fetchPost from "@/app/components/fetch/FetchPost";
import csrfToken from "@/app/redux/feature/csrfToken";
import { AppDispatch, RootState } from "@/app/redux/store/store";
import { animate, AnimatePresence, motion } from "framer-motion";
import { discovery } from "googleapis/build/src/apis/discovery";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWRMutation from "swr/mutation";
import Image from "@/app/components/image/Image";
import styles from './ModalTakeNextMeeting.module.scss'
import { mutate as globalMutate } from "swr";
import TabIndex from "@/app/components/tabIndex/TabIndex";
import { RootStateUtilisateur } from "@/app/redux/store/storeUtilisateur";

const ModalTakeNextMeeting = ({ discovery, offre, id }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [pseudo, setPseudo] = useState<string>("");
  const { csrfToken } = useSelector((state: RootState) => state.csrfToken)
  const [typeCoachingErrorMessage, setTypeCoachingErrorMessage] =
    useState<string>("");
  const [typeCoachingValid, setTypeCoachingValid] = useState<boolean>(false);
  const closeModal = () => {
    setTypeCoachingErrorMessage("");
    setTypeCoachingValid(false);
    setPseudo("");
    dispatch({ type: "ModalAddMeetingRendezVous/close" });
  };
  const openCalendar = () => {
    setTypeCoachingErrorMessage("");
    setTypeCoachingValid(false);
    setPseudo("");
    dispatch({ type: "ModalAddMeetingRendezVous/close" });
    dispatch({ type: "ModalCalendarAddMeetingRendezVous/open" });
  };
  const { dateModalTakeNextMeeting, displayModalTakeNextMeeting } =
    useSelector((state: RootStateUtilisateur) => state.ModalTakeNextMeeting);

  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/utilisateur/[id]/components/modal/add/api/",
    fetchPost
  );
  const router = useRouter();
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        const processFetchedData = async () => {
          setTypeCoachingErrorMessage("");
          setTypeCoachingValid(false);
          setPseudo("");
          /*  dispatch({
             type: "csrfToken/store",
             payload: { csrfToken: data.csrfToken },
           }); */
          globalMutate('/components/header/ui/api')
          await dispatch({ type: "ModalAddMeetingRendezVous/close" });
          await dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "success", flashMessage: data.message },
          });

          await reset();
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
      }
    }
  }, [data, dispatch, reset, router]);
  return (
    <>
      <TabIndex displayModal={displayModalTakeNextMeeting} />
      <AnimatePresence>
        {displayModalTakeNextMeeting === true && (
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
                  width={20}
                  height={20}
                ></Image>
              </button>
              <h2 className={`${styles.modalAddDiscovery__h1}`}>
                Rendez-vous {discovery && <>de découverte</>}
              </h2>
              <div className={styles.modalAddDiscovery__rappel}>
                <h3 className={styles.modalAddDiscovery__rappel__title}>Récapitulatif</h3>
                <p className={styles.modalAddDiscovery__rappel__p}>
                  ⭐
                  {" : "}
                  {offre.type !== "discovery"
                    ? String(offre.type).charAt(0).toLocaleUpperCase() +
                    String(offre.type).slice(1)
                    : "Découverte"}
                </p>
                <p className={styles.modalAddDiscovery__rappel__p}>
                  <Image
                    className={styles.modalAddDiscovery__rappel__p__img}
                    src="/assets/icone/calendar-regular.svg"
                    alt="clock"
                    width={20}
                    height={20}
                  />
                  {" : "}
                  {new Date(dateModalTakeNextMeeting).toLocaleDateString(
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
                  Type coaching
                  {" : "}
                  {offre.coaching}
                </p>
                <p className={styles.modalAddDiscovery__rappel__p}>
                  ⏳
                  {" : "}
                  {["unique", "discovery"].includes(offre.type)
                    ? "1h"
                    : (offre.type === "flash"
                      ? "3 × 1h (séances individuelles)"
                      : "1h")}
                </p>
                <p className={styles.modalAddDiscovery__rappel__p}>
                  <Image
                    className={styles.modalAddDiscovery__rappel__p__img}
                    src="/assets/icone/clock-solid.svg"
                    alt="clock"
                    width={20}
                    height={20}
                  />
                  {" : "}
                  {new Date(dateModalTakeNextMeeting).toLocaleTimeString(
                    "fr-FR"
                  )}
                </p>
                <p className={styles.modalAddDiscovery__rappel__p}>
                  <Image
                    className={styles.modalAddDiscovery__rappel__p__img}
                    src="/assets/icone/euro-sign-solid.svg"
                    alt=""
                    width={20}
                    height={20}
                  />{" : "}
                  {offre.type === "discovery" ? "Gratuit" : offre.type === "unique" ? "100€" : "300€"}
                </p>
                <p className={styles.modalAddDiscovery__rappel__p}>
                  <Image
                    className={styles.modalAddDiscovery__rappel__p__img}
                    src="/assets/icone/tickets.png"
                    alt=""
                    width={20}
                    height={20}
                  />{" : "}
                  {offre.currentNumberOfMeeting === null
                    ? 0
                    : offre.currentNumberOfMeeting}
                  /{offre.type === "discovery" ? "1" : offre.type === "flash" ? "3" : "1"}
                </p>
              </div>
              <p className={styles.modalAddDiscovery__choose}>
                Veuillez choissir un type de coaching pour ce rendez-vous
              </p>
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
                    onClick={(e) => {
                        if (pseudo.length === 0) {
                          trigger({
                            start: dateModalTakeNextMeeting,
                            csrfToken: csrfToken,
                            id: id
                          });
                        }
                        e.preventDefault();
                      
                    }}
                  >
                    Ajouter le rendez-vous
                  </button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default ModalTakeNextMeeting