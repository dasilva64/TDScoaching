"use client";

import React, { useEffect } from "react";
import styles from "./ModalCloseEmail.module.scss";
import { AppDispatch, RootState } from "../../../../../../src/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import useSWRMutation from "swr/mutation";
import fetchGet from "../../../../../../src/app/components/fetch/fetchGet";
//import useGet from "../../../../components/hook/useGet";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import localFont from "next/font/local";
const Parisienne = localFont({
  src: "../../../../Parisienne-Regular.ttf",
  display: "swap",
});

const ModalCloseEmail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/profile/components/emailData/modal/api",
    fetchGet
  );
  const { displayModalCancelEmail } = useSelector(
    (state: RootState) => state.ModalCancelEmail
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "ModalCancelEmail/close",
        });
        dispatch({
          type: "ModalEditEmail/close",
        });
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        reset();
      } else if (data.status === 401) {
        setTimeout(() => {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "error", flashMessage: data.message },
          });
          reset();
        }, 2000);
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

  return (
    <>
      <AnimatePresence>
        {displayModalCancelEmail === true && (
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
              <h2
                className={`${styles.modalCloseEmail__h1} ${Parisienne.className}`}
              >
                Êtes-vous sûr de vouloir quitter ?
              </h2>
              <p>
                Vous conserverez votre adresse e-mail précédente si vous étiez
                en train de la modifier.
              </p>
              <div className={styles.modalCloseEmail__reSend}>
                <button
                  className={styles.modalCloseEmail__reSend__btn}
                  onClick={() => {
                    dispatch({
                      type: "flash/clearFlashMessage",
                    });
                    dispatch({
                      type: "ModalCancelEmail/close",
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
                      className={styles.modalCloseEmail__reSend__btn}
                      onClick={() => {
                        dispatch({
                          type: "flash/clearFlashMessage",
                        });
                        trigger();
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
};

export default ModalCloseEmail;
