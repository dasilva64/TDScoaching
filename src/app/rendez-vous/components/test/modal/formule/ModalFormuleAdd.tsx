import fetchPost from "@/app/components/fetch/FetchPost";
import TabIndex from "@/app/components/tabIndex/TabIndex";
import { AppDispatch, RootState } from "@/app/redux/store/store";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import styles from "./ModalFormuleAdd.module.scss";
import useSWRMutation from "swr/mutation";
import { mutate as globalMutate } from 'swr'

const ModalFormuleAdd = ({ data: globalData, mutate }: any) => {
  const { csrfToken } = useSelector((state: RootState) => state.csrfToken)
  const dispatch = useDispatch<AppDispatch>();
  const [pseudo, setPseudo] = useState<string>("");
  const [typeCoaching, setTypeCoaching] = useState<string>("");
  const [typeCoachingErrorMessage, setTypeCoachingErrorMessage] =
    useState<string>("");
  const [typeCoachingValid, setTypeCoachingValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false)
  const closeModal = () => {
    setPseudo("");
    dispatch({ type: "ModalFormuleAddRendezVous/close" });
  };
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
  const { displayModalFormuleAddRendezVous, typeModalFormuleAddRendezVous } =
    useSelector((state: RootState) => state.ModalFormuleAddRendezVous);
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/rendez-vous/components/test/modal/add/paid/flash/api",
    fetchPost
  );
  const router = useRouter();
  useEffect(() => {
    if (data) {
          if (data.status === 200) {
            setTypeCoaching("");
            globalMutate("/components/header/api");
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
            router.push(`/acces-refuse?destination=rendez-vous`)
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
      <TabIndex displayModal={displayModalFormuleAddRendezVous} />
      <AnimatePresence>
        {displayModalFormuleAddRendezVous === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeModal()}
            />
            <motion.div
              className={styles.modalAddFormule}
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
                className={styles.modalAddFormule__btn}
                onClick={() => closeModal()}
              >
                <Image
                  className={styles.modalAddFormule__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="icone fermer modal"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h2 className={`${styles.modalAddFormule__h1}`}>Formule</h2>
              <p className={styles.modalAddFormule__p}>Rappel de la formule sélectionné :</p>
              <div className={styles.modalAddFormule__formule}>
                <h3 className={styles.modalAddFormule__formule__title}>
                  {typeModalFormuleAddRendezVous[0].toUpperCase()}{typeModalFormuleAddRendezVous.slice(1)}
                </h3>
                {typeModalFormuleAddRendezVous === "unique" && (
                  <div className={styles.modalAddFormule__formule__content}>
                    <p>- faire directement appel au callendar pour unique</p>
                    <p>- je créer directemnet l&apos;offre et le rdv ensemble</p>
                    <p>- donc pas de take components pour l&apos;unique</p>
                    <p>- si l&apos;user supprime son rdv payé ou non alors il restart direct au choix offre</p>
                    {/* <ul
                      className={styles.modalAddFormule__formule__content__ul}
                    >
                      <li
                        className={
                          styles.modalAddFormule__formule__content__ul__li
                        }
                      >
                        <Image
                          className={
                            styles.modalAddFormule__formule__content__ul__li__icone
                          }
                          width="25"
                          height="25"
                          priority={true}
                          src={"/assets/icone/check-solid.svg"}
                          alt="bousole"
                        />
                        1 séances de coaching
                      </li>
                      <li
                        className={
                          styles.modalAddFormule__formule__content__ul__li
                        }
                      >
                        <Image
                          className={
                            styles.modalAddFormule__formule__content__ul__li__icone
                          }
                          width="25"
                          height="25"
                          priority={true}
                          src={"/assets/icone/check-solid.svg"}
                          alt="bousole"
                        />
                        Sans engagement
                      </li>
                    </ul>
                    <p
                      className={
                        styles.modalAddFormule__formule__content__price
                      }
                    >
                      100
                      <span>€</span>
                    </p> */}
                  </div>
                )}
                {typeModalFormuleAddRendezVous === "flash" && (
                  <div className={styles.modalAddFormule__formule__content}>
                    <ul
                      className={styles.modalAddFormule__formule__content__ul}
                    >
                      <li
                        className={
                          styles.modalAddFormule__formule__content__ul__li
                        }
                      >
                        <Image
                          className={
                            styles.modalAddFormule__formule__content__ul__li__icone
                          }
                          width="25"
                          height="25"
                          priority={true}
                          src={"/assets/icone/check-solid.svg"}
                          alt="bousole"
                        />
                        3 séances de coaching
                      </li>
                      <li
                        className={
                          styles.modalAddFormule__formule__content__ul__li
                        }
                      >
                        <Image
                          className={
                            styles.modalAddFormule__formule__content__ul__li__icone
                          }
                          width="25"
                          height="25"
                          priority={true}
                          src={"/assets/icone/check-solid.svg"}
                          alt="bousole"
                        />
                        1 bilan final offert
                      </li>
                    </ul>

                    <p
                      className={
                        styles.modalAddFormule__formule__content__price
                      }
                    >
                      300
                      <span>€</span>
                    </p>
                  </div>
                )}
                {typeModalFormuleAddRendezVous === "custom" && (
                  <div className={styles.modalAddFormule__formule__content}>
                    <ul
                      className={styles.modalAddFormule__formule__content__ul}
                    >
                      <li
                        className={
                          styles.modalAddFormule__formule__content__ul__li
                        }
                      >
                        <Image
                          className={
                            styles.modalAddFormule__formule__content__ul__li__icone
                          }
                          width="25"
                          height="25"
                          priority={true}
                          src={"/assets/icone/check-solid.svg"}
                          alt="bousole"
                        />
                        Nombre de séances de coaching à définir (selon choix du
                        client et problématique abordée)
                      </li>
                      <li
                        className={
                          styles.modalAddFormule__formule__content__ul__li
                        }
                      >
                        <Image
                          className={
                            styles.modalAddFormule__formule__content__ul__li__icone
                          }
                          width="25"
                          height="25"
                          priority={true}
                          src={"/assets/icone/check-solid.svg"}
                          alt="bousole"
                        />
                        Points d’étape offerts (en fonction de la durée totale
                        du coaching)
                      </li>
                      <li
                        className={
                          styles.modalAddFormule__formule__content__ul__li
                        }
                      >
                        <Image
                          className={
                            styles.modalAddFormule__formule__content__ul__li__icone
                          }
                          width="25"
                          height="25"
                          priority={true}
                          src={"/assets/icone/check-solid.svg"}
                          alt="bousole"
                        />
                        1 bilan final offert
                      </li>
                    </ul>
                    <p
                      className={
                        styles.modalAddFormule__formule__content__price
                      }
                    >
                      Prix sur demande
                    </p>
                  </div>
                )}
              </div>
              <form
                action=""
                method="POST"
                className={styles.modalAddFormule__form}
                onSubmit={(e) => {
                  if (typeCoachingValid) {
                    if (pseudo.length === 0) {
                      trigger({
                        typeCoaching: typeCoaching,
                        csrfToken: csrfToken,
                        formule: typeModalFormuleAddRendezVous,
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
                <div className={styles.modalAddFormule__form__div}>
                  <label
                    className={`${typeCoaching.length > 0
                      ? styles.modalAddFormule__form__div__label__value
                      : styles.modalAddFormule__form__div__label
                      }`}
                    htmlFor=""
                  >
                    Type de coaching
                  </label>
                  <div className={styles.modalAddFormule__form__div__div}>
                    <select
                      className={
                        styles.modalAddFormule__form__div__div__select
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
                  <div className={styles.modalAddFormule__form__div__error}>
                    {typeCoachingErrorMessage}
                  </div>
                </div>

                <input
                  type="text"
                  name="pseudo"
                  id="pseudo"
                  className={styles.modalAddFormule__form__hidden}
                  tabIndex={-1}
                  autoComplete="off"
                  onChange={(e) => {
                    setPseudo(e.target.value);
                  }}
                />

                <div className={styles.modalAddFormule__form__submit}>
                  {!isMutating && (
                    <>
                      <input
                        className={styles.modalAddFormule__form__submit__btn}
                        /* onClick={() => {
                          if (typeModalFormuleAddRendezVous === "unique") {
                            setIsLoading(true)
                            trigger({
                              formule: typeModalFormuleAddRendezVous,
                              pseudo: pseudo,
                              csrfToken: csrfToken
                            }); 
                          } else {
                             dispatch({ type: "ModalFormuleAddRendezVous/close" });
                            dispatch({
                              type: "ModalContractRendezVous/open",
                              payload: {
                                type: typeModalFormuleAddRendezVous,
                                statut: "creation"
                              },
                            }); 
                          }
                        }}*/
                        value={"Prendre cette offre"}
                        type="submit"
                      />
                        
                    </>
                  )}
                  {isMutating && (
                    <>
                      <button
                        disabled
                        className={
                          styles.modalAddFormule__form__submit__btn__load
                        }
                      >
                        <span
                          className={
                            styles.modalAddFormule__form__submit__btn__load__span
                          }
                        >
                          Chargement
                        </span>

                        <div
                          className={
                            styles.modalAddFormule__form__submit__btn__load__arc
                          }
                        >
                          <div
                            className={
                              styles.modalAddFormule__form__submit__btn__load__arc__circle
                            }
                          ></div>
                        </div>
                      </button>
                    </>
                  )}
                  <p onClick={() => {
                    dispatch({
                      type: "ModalHelpPaiementRendezVous/open"
                    })

                  }} className={styles.modalAddFormule__form__help}>Information sur le paiement</p>
                </div>
              </form>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalFormuleAdd;
