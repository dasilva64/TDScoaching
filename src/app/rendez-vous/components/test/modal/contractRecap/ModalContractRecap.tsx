import Image from "@/app/components/image/Image";
import { RootState } from "@/app/redux/store/store";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ModalContractRecap.module.scss"
import fetchPost from "@/app/components/fetch/FetchPost";
import { useEffect } from "react";
import useSWRMutation from "swr/mutation";
import { mutate as globalMutate } from "swr";
import { useRouter } from "next/navigation";

const ModalContractRecap = ({mutate}: any) => {
  const router = useRouter()
  const { csrfToken } = useSelector((state: RootState) => state.csrfToken)
  const dispatch = useDispatch()
  const closeForm = () => {
    dispatch({
      type: "ModalContractRecapRendezVous/close",
    });
  }
  const {
    trigger: triggerConfirm,
    data: dataConfirm,
    reset: resetConfirm,
    isMutating: isMutatingConfirm,
  } = useSWRMutation("/rendez-vous/components/test/modal/contract/api/confirm", fetchPost);
  useEffect(() => {
    if (dataConfirm) {
      if (dataConfirm.status === 200) {
        mutate();
        resetConfirm();
        dispatch({
          type: "ModalContractRecapRendezVous/close",
        });

        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: dataConfirm.message },
        });
      } else if (dataConfirm.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataConfirm.message },
        });
        globalMutate("/components/header/api");
        globalMutate("/components/header/ui/api");
        resetConfirm()
        router.push(`/acces-refuse?destination=rendez-vous`)
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataConfirm.message },
        });
        resetConfirm()
      }
    }
  }, [dataConfirm, dispatch, resetConfirm, mutate, router]);
  const { data: dataSee, trigger: triggerSee, reset: resetSee, isMutating: isMutatingSee } = useSWRMutation("/rendez-vous/components/test/modal/contract/api/see/", fetchPost)
  useEffect(() => {
    if (dataSee) {
      if (dataSee.status === 200) {
        resetSee();
        window.open(dataSee.body, '_ blank')
      } else if (dataSee.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataSee.message },
        });
        globalMutate("/components/header/api");
        globalMutate("/components/header/ui/api");
        resetSee();
        router.push(`/acces-refuse?destination=rendez-vous`)
      }else {
        resetSee();
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: "Problème avec l'affichage du contrat, veuillez réessayer",
          },
        });
      }
    }
  }, [dataSee, dispatch, resetSee, router])
  const { displayModalContractRecapRendezVous, typeModalContractRecapRendezVous } = useSelector((state: RootState) => state.ModalContractRecapRendezVous)
  let content = (
    <>
      <div className={styles.contratModal__content}>
        <>

          {isMutatingSee === false && (

            <button
              onClick={() => {
                const fetchContract = async () => {
                  triggerSee({
                    typeOffre: typeModalContractRecapRendezVous,
                    csrfToken: csrfToken
                  })
                }
                fetchContract()
              }}
              className={styles.contratModal__content__contract}>
              Voir le contrat
            </button>

          )}
          {isMutatingSee && (
            <button
              disabled
              className={styles.contratModal__content__contract__load}
            >
              <span
                className={
                  styles.contratModal__content__contract__load__span
                }
              >
                Chargement
              </span>

              <div
                className={
                  styles.contratModal__content__contract__load__arc
                }
              >
                <div
                  className={
                    styles.contratModal__content__contract__load__arc__circle
                  }
                ></div>
              </div>
            </button>
          )}
          {/*  <Link
                    className={styles.contratModal__content__contract}
                    href={userData.body.contract}
                    target="_blank"
                  >
                   
                  </Link> */}
        </>

        <>
          <p>
            Vous pouvez reremplir le contrat en cliquant sur le bouton
            ci-dessous
          </p>
          <button
            className={styles.contratModal__content__btn}
            onClick={() => {
              dispatch({
                type: "ModalContractRecapRendezVous/close"
              })
              dispatch({
                type: "ModalContractEditRendezVous/open",
                payload: {
                  type: typeModalContractRecapRendezVous
                }
              })
            }}
          >
            Modifier le contrat
          </button>
          <p>
            En acceptant le contrat vous pourrez prendre rendez-vous
          </p>
          {!isMutatingConfirm && (
            <button
              className={styles.contratModal__content__btn}
              onClick={() => {
                const fetchEdit = async () => {
                  if (typeModalContractRecapRendezVous === "flash") {
                    triggerConfirm({
                      formule: typeModalContractRecapRendezVous,
                      csrfToken: csrfToken
                    });
                  }/* else if (typeModalContractRendezVous === "custom") {
                    triggerEdit({
                      formule: typeModalContractRendezVous,
                      nbSeance: nbSeance,
                    });
                  } */
                };
                fetchEdit();
              }}
            >
              Confirmer le choix
            </button>
          )}
          {isMutatingConfirm && (
            <button
              disabled
              className={styles.contratModal__content__btn__load}
            >
              <span
                className={
                  styles.contratModal__content__btn__load__span
                }
              >
                Chargement
              </span>

              <div
                className={
                  styles.contratModal__content__btn__load__arc
                }
              >
                <div
                  className={
                    styles.contratModal__content__btn__load__arc__circle
                  }
                ></div>
              </div>
            </button>
          )}

        </>

      </div>
    </>
  )
  return (
    <>
      <AnimatePresence>
        {displayModalContractRecapRendezVous === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeForm()}
            />
            <motion.div
              className={styles.contratModal}
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
              <div className={styles.contratModal__top}>

                <button
                  type="button"
                  className={styles.contratModal__top__close}
                  onClick={() => closeForm()}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <Image
                    className={styles.contratModal__top__close__img}
                    src="/assets/icone/xmark-solid.svg"
                    alt="icone fermer modal"
                    width={30}
                    height={30}
                  ></Image>
                </button>
              </div>
              <h1 className={styles.contratModal__h1}>Récapitulatif du contract</h1>

              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default ModalContractRecap