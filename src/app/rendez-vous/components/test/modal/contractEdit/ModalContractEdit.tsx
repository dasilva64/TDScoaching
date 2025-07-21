import Image from "@/app/components/image/Image";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./ModalContractEdit.module.scss"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import useSWRMutation from "swr/mutation";
import fetchPost from "@/app/components/fetch/FetchPost";
import { useEffect } from "react";
import { mutate as globalMutate } from "swr";
import { useRouter } from "next/navigation";

const ModalContractEdit = ({mutate}: any) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { displayModalContractEditRendezVous, typeModalContractEditRendezVous } = useSelector((state: RootState) => state.ModalContractEditRendezVous)
  const { csrfToken } = useSelector((state: RootState) => state.csrfToken)
  const { data, reset, trigger, isMutating } = useSWRMutation("/rendez-vous/components/test/modal/contractEdit/api/", fetchPost)
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        mutate()
        reset()
        dispatch({
          type: "ModalContractEditRendezVous/close"
        })
        dispatch({
          type: "ModalContractRendezVous/open",
          payload: {
            type: typeModalContractEditRendezVous,
            statusModalContractRendezVous: "reprendre"
          }
        })
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "success",
            flashMessage: data.message,
          },
        });
      }else if (data.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        globalMutate("/components/header/api");
        globalMutate("/components/header/ui/api");
        reset();
        router.push("/")
      } else {
        reset();
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: data.message,
          },
        });
      }

    }
  }, [data, dispatch, mutate, reset, router, typeModalContractEditRendezVous])
  return (
    <>
      <AnimatePresence>
        {displayModalContractEditRendezVous === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
            //onClick={() => closeForm()}
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
                  /* onClick={() => closeForm()} */
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
              <h1 className={styles.contratModal__h1}>Modification du contract</h1>
              <p>Cette action supprimera l&apos;ancien contrat et vous devriez alors signé et un remplir un autre de nouveau</p>
              <p>Êtes vous sûre de vouloir modifier votre contrat ?</p>
              {/* {content} */}
              <div className={styles.contratModal__actions}>
                {!isMutating && (
                  <button className={styles.contratModal__actions__edit} onClick={() => {
                    trigger({
                      csrfToken: csrfToken
                    })

                  }}>Oui, modifier</button>
                )}
                {isMutating && (
                  <button
                    disabled
                    className={styles.contratModal__actions__edit__load}
                  >
                    <span
                      className={
                        styles.contratModal__actions__edit__load__span
                      }
                    >
                      Chargement
                    </span>

                    <div
                      className={
                        styles.contratModal__actions__edit__load__arc
                      }
                    >
                      <div
                        className={
                          styles.contratModal__actions__edit__load__arc__circle
                        }
                      ></div>
                    </div>
                  </button>
                )}
                <button className={styles.contratModal__actions__comeBack} onClick={() => {
                  dispatch({
                    type: "ModalContractEditRendezVous/close"
                  })
                  dispatch({
                    type: "ModalContractRecapRendezVous/open",
                    payload: {
                      type: typeModalContractEditRendezVous
                    }
                  })
                }}>Non, revenir</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default ModalContractEdit