import { AppDispatch, RootState } from "@/app/redux/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./ModalComfirmDisable.module.scss";
import useSWRMutation from "swr/mutation";
import fetchGet from "../../../../../components/fetch/fetchGet";
import { mutate } from "swr";
import { useRouter } from "next/navigation";

const ModalComfirmDisable = () => {
  const { displayModalComfirmDisableTwoFactor } = useSelector(
    (state: RootState) => state.ModalComfirmDisableTwoFactor
  );
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const {
    data: dataDisable,
    trigger: triggerDisable,
    reset: resetDisable,
    isMutating: isMutatingDisable,
  } = useSWRMutation(
    "/profile/components/twoFactorSendTokenData/Modal/disable/api",
    fetchGet
  );
  useEffect(() => {
    if (dataDisable) {
      if (dataDisable.status === 200) {
        mutate(
          "/profile/components/api",
          {
            ...dataDisable,
          },
          { revalidate: false }
        );
        resetDisable();
        dispatch({
          type: "ModalSendTokenTwoFactor/close",
        });
        dispatch({
          type: "ModalComfirmDisableTwoFactor/close",
        });
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: dataDisable.message },
        });
        resetDisable();
      } else if (dataDisable.status === 401) {
        setTimeout(() => {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "error", flashMessage: dataDisable.message },
          });
          resetDisable();
        }, 2000);
        router.push("/");
      } else if (dataDisable.status === 400) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataDisable.message },
        });
        resetDisable();
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataDisable.message },
        });
        resetDisable();
      }
    }
  }, [dataDisable, dispatch, resetDisable, router]);
  /* useEffect(() => {
    const mutateMainData = async () => {
      mutate(
        "/api/user/getUserProfile",
        {
          ...dataDisable,
        },
        { revalidate: false }
      );
      resetDisable();
    };
    if (dataDisable && dataDisable.body) {
      mutateMainData();
    }
  }, [dataDisable, resetDisable]); */
  return (
    <>
      <AnimatePresence>
        {displayModalComfirmDisableTwoFactor === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
            />
            <motion.div
              className={styles.modalComfirmDisable}
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
              <h1 className={styles.modalComfirmDisable__h1}>
                Êtes-vous sûr de vouloir désactiver l&apos;authentification à
                deux facteur ?
              </h1>
              <p>
                Si vous désactivez l&apos;authentification à deux facteurs, vous
                devrez à nouveau la configurer pour la réactiver.
              </p>
              <div className={styles.modalComfirmDisable__reSend}>
                <button
                  className={styles.modalComfirmDisable__reSend__btn}
                  onClick={() => {
                    dispatch({
                      type: "ModalComfirmDisableTwoFactor/close",
                    });
                    dispatch({
                      type: "ModalSendTokenTwoFactor/close",
                    });
                  }}
                >
                  Annuler
                </button>
                {isMutatingDisable && (
                  <>
                    <button
                      className={styles.modalComfirmDisable__reSend__btn__load}
                    >
                      <span
                        className={
                          styles.modalComfirmDisable__reSend__btn__load__span
                        }
                      >
                        Chargement
                      </span>

                      <div
                        className={
                          styles.modalComfirmDisable__reSend__btn__load__arc
                        }
                      >
                        <div
                          className={
                            styles.modalComfirmDisable__reSend__btn__load__arc__circle
                          }
                        ></div>
                      </div>
                    </button>
                  </>
                )}
                {!isMutatingDisable && (
                  <>
                    <button
                      className={styles.modalComfirmDisable__reSend__btn}
                      onClick={() => {
                        dispatch({
                          type: "flash/clearFlashMessage",
                        });
                        triggerDisable();
                      }}
                    >
                      Désactiver
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
};

export default ModalComfirmDisable;
