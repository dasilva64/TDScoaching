/* import React, { useEffect, useState } from "react";
import styles from "./ModalEditDiscovery.module.scss";
import TabIndex from "@/app/components/tabIndex/TabIndex";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import fetchPost from "@/app/components/fetch/FetchPost";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

const ModalEditDiscovery = ({ currentTypeCoaching, mutate }: any) => {
   const { displayModalEditDiscoveryMeeting, dataModalEditDiscoveryMeeting } =
    useSelector((state: RootState) => state.ModalEditDiscoveryMeeting); 
  const [typeCoaching, setTypeCoaching] = useState<string>(currentTypeCoaching);
  const [pseudo, setPseudo] = useState<string>("");
  const [typeCoachingErrorMessage, setTypeCoachingErrorMessage] =
    useState<string>("");
  const [typeCoachingValid, setTypeCoachingValid] = useState<boolean>(true);
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
    "/rendez-vous/components/discovery/my/api/",
    fetchPost
  );
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({ type: "ModalEditDiscoveryMeeting/close" });
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
          dispatch({ type: "ModalEditDiscoveryMeeting/close" });
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
      { <TabIndex displayModal={displayModalEditDiscoveryMeeting} />
      <AnimatePresence>
        {displayModalEditDiscoveryMeeting === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() =>
                dispatch({
                  type: "ModalEditDiscoveryMeeting/close",
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
                    type: "ModalEditDiscoveryMeeting/close",
                  });
                  dispatch({ type: "ModalCalendarEditDiscovery/open" });
                }}
              >
                Retour au calendrier
              </button>
              <button
                type="button"
                className={styles.modalAddDiscovery__btn}
                onClick={() =>
                  dispatch({
                    type: "ModalEditDiscoveryMeeting/close",
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
                  {new Date(dataModalEditDiscoveryMeeting).toLocaleDateString(
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
                  <Image
                    className={styles.modalAddDiscovery__rappel__p__img}
                    src="/assets/icone/clock-solid.svg"
                    alt="clock"
                    width={25}
                    height={25}
                  />
                  {" : "}
                  {new Date(dataModalEditDiscoveryMeeting).toLocaleTimeString(
                    "fr-FR"
                  )}
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
                  {typeCoaching}
                </p>
              </div>
              <p>
                Rappel du rendez-vous :{" "}
                {new Date(dataModalEditDiscoveryMeeting).toLocaleString(
                  "fr-FR"
                )}
              </p>
              <form
                className={styles.modalAddDiscovery__form}
                onSubmit={(e) => {
                  if (typeCoachingValid) {
                    if (pseudo.length === 0) {
                      trigger({
                        typeCoaching: typeCoaching,
                        start: dataModalEditDiscoveryMeeting,
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
                    className={`${
                      typeCoaching.length > 0
                        ? styles.modalAddDiscovery__form__div__label__value
                        : styles.modalAddDiscovery__form__div__label
                    }`}
                    htmlFor=""
                  >
                    Veuillez choissir un type de coaching pour ce rendez-vous
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
                        Modifier le rendez-vous
                      </button>
                    </>
                  )}
                </div>
              </form>
              <div className={styles.modalAddDiscovery__edit}>
                {isMutating === false && (
                  <button
                    className={styles.modalAddDiscovery__edit__btn}
                    onClick={() => {
                      trigger({
                        typeCoaching: typeCoaching,
                        start: dataModalEditDiscoveryMeeting,
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
      </AnimatePresence> }
    </>
  );
};

export default ModalEditDiscovery;
 */