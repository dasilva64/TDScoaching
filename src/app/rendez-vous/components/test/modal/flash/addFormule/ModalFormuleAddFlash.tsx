import fetchPost from "@/app/components/fetch/FetchPost";
import TabIndex from "@/app/components/tabIndex/TabIndex";
import { RootState, AppDispatch } from "@/app/redux/store/store";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./ModalFormuleAddFlash.module.scss"
import Image from "@/app/components/image/Image";
import useSWRMutation from "swr/mutation";
import { mutate as globalMutate } from 'swr'
import Link from "next/link";
import React from "react";

const ModalFormuleAddFlash = ({ mutate, userData }: any) => {
  const { csrfToken } = useSelector((state: RootState) => state.csrfToken)
  const dispatch = useDispatch<AppDispatch>();
  const [pseudo, setPseudo] = useState<string>("");
  const [typeCoaching, setTypeCoaching] = useState<string>("");
  const [typeCoachingErrorMessage, setTypeCoachingErrorMessage] =
    useState<string>("");
  const [typeCoachingValid, setTypeCoachingValid] = useState<boolean>(false);

  const [contratInput, setContratInput] = useState<boolean>(false);
  const [validContratInput, setValidContratInput] = useState<boolean>(false);
  const [contratInputError, setContratInputError] = useState<string>("");

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
  const { displayModalFormuleAddRendezVous } =
    useSelector((state: RootState) => state.ModalFormuleAddRendezVous);
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/rendez-vous/components/test/modal/flash/addFormule/api",
    fetchPost
  );
  const router = useRouter();
  const inputRef: any = React.useRef();
  useEffect(() => {
    if (displayModalFormuleAddRendezVous === true) {
      if (inputRef && inputRef.current) {
        inputRef.current.addEventListener("keydown", (e: any) => {
          if (e.key === "Enter") {
            e.srcElement.click();
            e.preventDefault();
          }
        });
      }
    }
  }, [displayModalFormuleAddRendezVous]);
  useEffect(() => {
    const closeModal = () => {
    setPseudo("");
    dispatch({ type: "ModalFormuleAddRendezVous/close" });
  };
    if (data) {
      if (data.status === 200) {
        setTypeCoaching("");
        setTypeCoachingErrorMessage("");
        setTypeCoachingValid(false);
        setPseudo("");
        reset()
        closeModal()
        globalMutate("/components/header/api");
        dispatch({
          type: "ModalAddCardStripe/open",
          payload: {
            secret: data.body.client_secret
          }
        });
        const { offre } = data.body;
        mutate(
          {
            ...userData,
            body: {
              ...userData.body,
              offre,
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
            if (element[0] === "contratInput") {
              setValidContratInput(false);
              setContratInputError("Vous devez accepter le contrat");
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
  }, [data, dispatch, mutate, reset, router, userData, closeModal]);

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
              className={styles.modalAddFormuleFlash}
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
                className={styles.modalAddFormuleFlash__btn}
                onClick={() => closeModal()}
              >
                <Image
                  className={styles.modalAddFormuleFlash__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="icone fermer modal"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h2 className={`${styles.modalAddFormuleFlash__h1}`}>Formule</h2>
              <p className={styles.modalAddFormuleFlash__p}>Rappel de la formule sélectionné :</p>
              <div className={styles.modalAddFormuleFlash__formule}>
                <h3 className={styles.modalAddFormuleFlash__formule__title}>
                  Flash
                </h3>
                {/*{typeModalFormuleAddRendezVous === "unique" && (
                  <div className={styles.modalAddFormuleFlash__formule__content}>
                    <p>- faire directement appel au callendar pour unique</p>
                    <p>- je créer directemnet l'offre et le rdv ensemble</p>
                    <p>- donc pas de take components pour l'unique</p>
                    <p>- si l'user supprime son rdv payé ou non alors il restart direct au choix offre</p>
                     <ul
                      className={styles.modalAddFormuleFlash__formule__content__ul}
                    >
                      <li
                        className={
                          styles.modalAddFormuleFlash__formule__content__ul__li
                        }
                      >
                        <Image
                          className={
                            styles.modalAddFormuleFlash__formule__content__ul__li__icone
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
                          styles.modalAddFormuleFlash__formule__content__ul__li
                        }
                      >
                        <Image
                          className={
                            styles.modalAddFormuleFlash__formule__content__ul__li__icone
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
                        styles.modalAddFormuleFlash__formule__content__price
                      }
                    >
                      100
                      <span>€</span>
                    </p> 
                  </div>
                )}*/}
                <div className={styles.modalAddFormuleFlash__formule__content}>
                  <ul
                    className={styles.modalAddFormuleFlash__formule__content__ul}
                  >
                    <li
                      className={
                        styles.modalAddFormuleFlash__formule__content__ul__li
                      }
                    >
                      <Image
                        className={
                          styles.modalAddFormuleFlash__formule__content__ul__li__icone
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
                        styles.modalAddFormuleFlash__formule__content__ul__li
                      }
                    >
                      <Image
                        className={
                          styles.modalAddFormuleFlash__formule__content__ul__li__icone
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
                      styles.modalAddFormuleFlash__formule__content__price
                    }
                  >
                    300
                    <span>€</span>
                  </p>
                </div>
                {/* {typeModalFormuleAddRendezVous === "custom" && (
                  <div className={styles.modalAddFormuleFlash__formule__content}>
                    <ul
                      className={styles.modalAddFormuleFlash__formule__content__ul}
                    >
                      <li
                        className={
                          styles.modalAddFormuleFlash__formule__content__ul__li
                        }
                      >
                        <Image
                          className={
                            styles.modalAddFormuleFlash__formule__content__ul__li__icone
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
                          styles.modalAddFormuleFlash__formule__content__ul__li
                        }
                      >
                        <Image
                          className={
                            styles.modalAddFormuleFlash__formule__content__ul__li__icone
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
                          styles.modalAddFormuleFlash__formule__content__ul__li
                        }
                      >
                        <Image
                          className={
                            styles.modalAddFormuleFlash__formule__content__ul__li__icone
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
                        styles.modalAddFormuleFlash__formule__content__price
                      }
                    >
                      Prix sur demande
                    </p>
                  </div>
                )} */}
              </div>
              <form
                action=""
                method="POST"
                className={styles.modalAddFormuleFlash__form}
                onSubmit={(e) => {
                  if (typeCoachingValid && validContratInput) {
                    if (pseudo.length === 0) {
                      trigger({
                        typeCoaching: typeCoaching,
                        csrfToken: csrfToken,
                        pseudo: pseudo,
                        contratInput: contratInput
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
                    if (validContratInput === false) {
                      setContratInputError("Vous devez accepter le contrat")
                    }
                  }
                }}
              >
                <div className={styles.modalAddFormuleFlash__form__div}>
                  <label
                    className={`${typeCoaching.length > 0
                      ? styles.modalAddFormuleFlash__form__div__label__value
                      : styles.modalAddFormuleFlash__form__div__label
                      }`}
                    htmlFor=""
                  >
                    Type de coaching
                  </label>
                  <div className={styles.modalAddFormuleFlash__form__div__div}>
                    <select
                      className={
                        styles.modalAddFormuleFlash__form__div__div__select
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
                  <div className={styles.modalAddFormuleFlash__form__div__error}>
                    {typeCoachingErrorMessage}
                  </div>
                </div>
                <div className={styles.modalAddFormuleFlash__form__div}>
                  <div className={styles.modalAddFormuleFlash__form__div__div}>
                    <label
                      className={styles.modalAddFormuleFlash__form__div__div__label}
                      htmlFor="remenber"
                    >En cochant cette case, je reconnais avoir lu et accepté le &nbsp;
                      <Link
                        className={styles.modalAddFormuleFlash__form__div__div__label__link}
                        target="_blank"
                        href={"https://btmnafdfhekmxyquvyhm.supabase.co/storage/v1/object/public/public-contrat/ModelContrat.pdf"}
                      >
                        contrat d’engagement
                      </Link> relatif à l’offre Flash (3 séances). Ce contrat est actuellement vierge et
                      sera automatiquement complété avec mes informations personnelles (nom, prénom,
                      date, IP, type de coaching) au moment de la validation de l’offre.
                    </label>
                    <input
                      ref={inputRef}
                      className={styles.modalAddFormuleFlash__form__div__div__checkbox}
                      type="checkbox"
                      defaultChecked={contratInput}
                      name="legal"
                      id="legal"
                      onChange={(e) => {
                        if (e.target.checked === true) {
                          setContratInput(true);
                          setValidContratInput(true);
                          setContratInputError("");
                        } else {
                          setContratInput(false);
                          setValidContratInput(false);
                          setContratInputError(
                            "Vous devez accepter le contrat"
                          );
                        }
                      }}
                    />
                  </div>
                  <div className={styles.modalAddFormuleFlash__form__div__div__error}>
                    {contratInputError}
                  </div>
                </div>
                <input
                  type="text"
                  name="pseudo"
                  id="pseudo"
                  className={styles.modalAddFormuleFlash__form__hidden}
                  tabIndex={-1}
                  autoComplete="off"
                  onChange={(e) => {
                    setPseudo(e.target.value);
                  }}
                />

                <div className={styles.modalAddFormuleFlash__form__submit}>
                  {!isMutating && (
                    <>
                      <input
                        className={styles.modalAddFormuleFlash__form__submit__btn}
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
                          styles.modalAddFormuleFlash__form__submit__btn__load
                        }
                      >
                        <span
                          className={
                            styles.modalAddFormuleFlash__form__submit__btn__load__span
                          }
                        >
                          Chargement
                        </span>

                        <div
                          className={
                            styles.modalAddFormuleFlash__form__submit__btn__load__arc
                          }
                        >
                          <div
                            className={
                              styles.modalAddFormuleFlash__form__submit__btn__load__arc__circle
                            }
                          ></div>
                        </div>
                      </button>
                    </>
                  )}
                  {/* <p onClick={() => {
                    dispatch({
                      type: "ModalHelpPaiementRendezVous/open"
                    })

                  }} className={styles.modalAddFormuleFlash__form__help}>Information sur le paiement</p> */}
                </div>
              </form>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default ModalFormuleAddFlash