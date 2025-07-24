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
import {mutate as globalMutate} from 'swr'

const ModalFormuleAdd = ({ mutate }: any) => {
  const {csrfToken} = useSelector((state: RootState) => state.csrfToken)
  const dispatch = useDispatch<AppDispatch>();
  const [pseudo, setPseudo] = useState<string>("");
  const closeModal = () => {
    setPseudo("");
    dispatch({ type: "ModalFormuleAddRendezVous/close" });
  };
  const { displayModalFormuleAddRendezVous, typeModalFormuleAddRendezVous } =
    useSelector((state: RootState) => state.ModalFormuleAddRendezVous);
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/rendez-vous/components/test/modal/formule/api/",
    fetchPost
  );
  const router = useRouter();
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        dispatch({ type: "ModalFormuleAddRendezVous/close" });
        globalMutate("/components/header/api")
        reset();
        mutate();
      } else if (data.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
        router.push(`/acces-refuse?destination=rendez-vous`);
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
                    </p>
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

              <div className={styles.modalAddFormule__action}>
                {!isMutating && (
                  <>
                    <button
                      className={styles.modalAddFormule__action__btn}
                      onClick={() => {
                        if (typeModalFormuleAddRendezVous === "unique") {
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
                      }}
                    >
                      Prendre cette offre
                    </button>
                  </>
                )}
                {isMutating && (
                  <>
                    <span className={styles.modalAddFormule__action__btn}>
                      Chargement ...
                    </span>
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

export default ModalFormuleAdd;
