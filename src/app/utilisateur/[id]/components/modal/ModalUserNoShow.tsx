import TabIndex from "@/app/components/tabIndex/TabIndex";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./ModalUserNoShow.module.scss"
import Image from "@/app/components/image/Image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import useSWRMutation from "swr/mutation";
import fetchPost from "@/app/components/fetch/FetchPost";
import { useEffect } from "react";
import { mutate as globalMutate } from "swr";
import { useRouter } from "next/navigation";

const ModalUserNoShow = ({ mutate, id }: any) => {
  const router = useRouter()
  const { csrfToken } = useSelector((state: RootState) => state.csrfToken)
  const dispatch = useDispatch()
  const closeModal = () => {
    dispatch({
      type: "ModalUserNoShow/close"
    })
  }
  const { displayModalUserNoShow } = useSelector((state: RootState) => state.ModalUserNoShow)
  const { data, isMutating, trigger, reset } = useSWRMutation("/utilisateur/[id]/components/modal/api", fetchPost)
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        mutate()
        reset()
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
      } else if (data.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
        globalMutate("/components/header/api");
        globalMutate("/components/header/ui/api");
        router.push("/");
      } else {
        reset();
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
      }
    }
  }, [data, dispatch, mutate, reset, router]);
  return (
    <>
      <TabIndex displayModal={displayModalUserNoShow} />
      <AnimatePresence>
        {displayModalUserNoShow === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeModal()}
            />
            <motion.div
              className={styles.modalUserNoShow}
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
                className={styles.modalUserNoShow__btn}
                onClick={() => closeModal()}
              >
                <Image
                  className={styles.modalUserNoShow__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="icone fermer modal"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h2 className={`${styles.modalUserNoShow__h1}`}>
                Utilisateur non présent
              </h2>


              <p className={styles.modalUserNoShow__choose}>
                Si l&apos;user n&apos;as pas été présent pour le rendez-vous, vous pouvez ici lui envoyer un mail pour lui permettre de reprendre le rendez-vous.
              </p>

              <div className={styles.modalUserNoShow__form__submit}>
                {isMutating && (
                  <>
                    <button
                      disabled
                      className={
                        styles.modalUserNoShow__form__submit__btn__load
                      }
                    >
                      <span
                        className={
                          styles.modalUserNoShow__form__submit__btn__load__span
                        }
                      >
                        Chargement
                      </span>

                      <div
                        className={
                          styles.modalUserNoShow__form__submit__btn__load__arc
                        }
                      >
                        <div
                          className={
                            styles.modalUserNoShow__form__submit__btn__load__arc__circle
                          }
                        ></div>
                      </div>
                    </button>
                  </>
                )}
                {isMutating === false && (
                  <>
                    <button
                      className={styles.modalUserNoShow__form__submit__btn}
                      onClick={() => {
                        trigger({
                          id: id,
                          csrfToken: csrfToken
                        })
                      }}
                    >
                      Envoyer
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default ModalUserNoShow