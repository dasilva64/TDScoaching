import fetchPost from "@/app/components/fetch/FetchPost";
import TabIndex from "@/app/components/tabIndex/TabIndex";
import { AppDispatch, RootState } from "@/app/redux/store/store";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mutate as globalMutate } from "swr";
import useSWRMutation from "swr/mutation";
import Image from "@/app/components/image/Image";
import styles from "./ModalFormuleEdit.module.scss";

const ModalFormuleEdit = ({ data: globalData, mutate }: any) => {
  const { csrfToken } = useSelector((state: RootState) => state.csrfToken)
  const dispatch = useDispatch<AppDispatch>();
  const closeModal = () => {
    dispatch({ type: "ModalFormuleEditRendezVous/close" });
  };
  const [isLoading, setIsLoading] = useState(false)
  const { displayModalFormuleEditRendezVous, idModalFormuleEditRendezVous } =
    useSelector((state: RootState) => state.ModalFormuleEditRendezVous);
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/rendez-vous/components/test/modal/editOffre/api/",
    fetchPost
  );
  const router = useRouter();
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        const waiting = async () => {
          mutate();
          globalMutate("/components/header/api");
          reset();
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "success", flashMessage: data.message },
          });
          dispatch({ type: "ModalFormuleEditRendezVous/close" });
          setIsLoading(false)
        }
        waiting()

      } else if (data.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
        globalMutate("/components/header/api");
        globalMutate("/components/header/ui/api");
        router.push(`/acces-refuse?destination=rendez-vous`)
        setIsLoading(false)
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
        setIsLoading(false)
      }

    }
  }, [data, dispatch, mutate, reset, router]);

  return (
    <>
      <TabIndex displayModal={displayModalFormuleEditRendezVous} />
      <AnimatePresence>
        {displayModalFormuleEditRendezVous === true && (
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
              <h2 className={`${styles.modalAddFormule__h1}`}>Changer de formule</h2>
              {globalData.body.offre && (
                <>

                  {globalData.body.offre.type === 'flash' && globalData.body.offre.contract_status && (
                    <>
                      <p>
                        En choisissant une nouvelle offre, le contrat associé à votre formule actuelle sera automatiquement résilié.
                        Cette action est irréversible et peut entraîner la perte des avantages liés à l’offre “flash”.
                      </p><br />
                    </>

                  )}
                </>
              )}

              <p className={styles.modalAddFormule__p}>Êtes vous sûre de vouloir changer d&apos;offre ?</p>

              <div className={styles.modalAddFormule__action}>
                {!isLoading && (
                  <>
                    <button
                      className={styles.modalAddFormule__action__btn}
                      onClick={() => {
                        setIsLoading(true)
                        trigger({
                          //id: idModalFormuleEditRendezVous,
                          csrfToken: csrfToken
                        });
                      }}
                    >
                      Oui, changer
                    </button>
                  </>
                )}
                {isLoading && (
                  <>
                      <button
                        disabled
                        className={
                          styles.modalAddFormule__action__btn__load
                        }
                      >
                        <span
                          className={
                            styles.modalAddFormule__action__btn__load__span
                          }
                        >
                          Chargement
                        </span>

                        <div
                          className={
                            styles.modalAddFormule__action__btn__load__arc
                          }
                        >
                          <div
                            className={
                              styles.modalAddFormule__action__btn__load__arc__circle
                            }
                          ></div>
                        </div>
                      </button>
                    </>
                )}
                <button
                  className={styles.modalAddFormule__action__btn}
                  onClick={() => {
                    dispatch({ type: "ModalFormuleEditRendezVous/close" });

                  }}
                >
                  Non, annuler
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalFormuleEdit;
