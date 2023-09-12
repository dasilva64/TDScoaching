import fetchGet from "@/app/components/fetch/fetchGet";
import { AppDispatch, RootState } from "@/app/redux/store";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWRMutation from "swr/mutation";
import styles from "./ModalCloseTwoFactor.module.scss";

const ModalCloseTwoFactor = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { trigger, data, reset } = useSWRMutation(
    "/api/user/cancelTwoFactor",
    fetchGet
  );
  const { displayModalCancelTwoFactor } = useSelector(
    (state: RootState) => state.ModalCancelTwoFactor
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "ModalCancelTwoFactor/close",
        });
        dispatch({
          type: "ModalEditTwoFactor/close",
        });
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        reset();
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
      }
    }
  }, [data, dispatch, reset]);

  return (
    <>
      <AnimatePresence>
        {displayModalCancelTwoFactor === true && (
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
              <h1 className={styles.modalCloseEmail__h1}>
                Êtes-vous sûr de vouloir quitter ?
              </h1>
              <p>
                Vous conserverez votre adresse e-mail précédente si vous étiez
                en train de la modifier.
              </p>
              <div className={styles.modalCloseEmail__reSend}>
                <button
                  className={styles.modalCloseEmail__reSend__btn}
                  onClick={() => {
                    dispatch({
                      type: "ModalCancelTwoFactor/close",
                    });
                  }}
                >
                  Continuer
                </button>
                <button
                  className={styles.modalCloseEmail__reSend__btn}
                  onClick={() => {
                    trigger();
                  }}
                >
                  Quitter
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalCloseTwoFactor;
