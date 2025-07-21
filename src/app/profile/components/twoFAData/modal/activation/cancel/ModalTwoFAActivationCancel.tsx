import TabIndex from "@/app/components/tabIndex/TabIndex";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./ModalTwoFAActivationCancel.module.scss"
import { useDispatch, useSelector } from "react-redux";
import useSWRMutation from "swr/mutation";
import fetchPost from "@/app/components/fetch/FetchPost";
import { RootState } from "@/app/redux/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

const ModalTwoFAActivationCancel = () => {
  const { csrfToken } = useSelector((state: RootState) => state.csrfToken)
  const dispatch = useDispatch()
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/profile/components/twoFAData/modal/activation/cancel/api",
    fetchPost
  );
  const router = useRouter()
  useEffect(() => {
    if (data) {
      if (data.status === 200) {

        dispatch({
          type: "ModalTwoFAActivationCancel/close",
        });
        dispatch({
          type: "ModalTwoFAActivation/close",
        });
        mutate("/components/header/api");
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        reset();
      } else if (data.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
        mutate("/components/header/api");
        mutate("/components/header/ui/api");
        router.push("/");
      } else if (data.status === 400) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
        router.push("/");
      }
    }
  }, [data, dispatch, reset, router]);
  const { displayModalTwoFAActivationCancel } = useSelector((state: RootState) => state.ModalTwoFAActivationCancel)
  return (
    <>
      <TabIndex displayModal={displayModalTwoFAActivationCancel} />
      <AnimatePresence>
        {displayModalTwoFAActivationCancel === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
            />
            <motion.div
              className={styles.modalCloseEmail}
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
              <h2 className={`${styles.modalCloseEmail__h1}`}>
                Êtes-vous sûr de vouloir quitter ?
              </h2>
              <p>
                Vous conserverez la double authentification désactivé.
              </p>
              <div className={styles.modalCloseEmail__reSend}>
                <button
                  type="button"
                  className={styles.modalCloseEmail__reSend__btn}
                  onClick={() => {
                    dispatch({
                      type: "flash/clearFlashMessage",
                    });
                    dispatch({
                      type: "ModalTwoFAActivationCancel/close",
                    });
                  }}
                >
                  Continuer
                </button>
                {isMutating && (
                  <>
                    <button
                      disabled
                      className={styles.modalCloseEmail__reSend__btn__load}
                    >
                      <span
                        className={
                          styles.modalCloseEmail__reSend__btn__load__span
                        }
                      >
                        Chargement
                      </span>

                      <div
                        className={
                          styles.modalCloseEmail__reSend__btn__load__arc
                        }
                      >
                        <div
                          className={
                            styles.modalCloseEmail__reSend__btn__load__arc__circle
                          }
                        ></div>
                      </div>
                    </button>
                  </>
                )}
                {!isMutating && (
                  <>
                    <button
                      type="button"
                      className={styles.modalCloseEmail__reSend__btn}
                      onClick={() => {
                        dispatch({
                          type: "flash/clearFlashMessage",
                        });
                        trigger({ csrfToken: csrfToken });
                      }}
                    >
                      Quitter
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

export default ModalTwoFAActivationCancel