"use client";

import React, { useEffect } from "react";
import styles from "./ModalCloseEmail.module.scss";
import { useDispatch, useSelector } from "react-redux";
import useSWRMutation from "swr/mutation";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { mutate as globalMutate } from "swr";
import TabIndex from "@/app/components/tabIndex/TabIndex";
import fetchPost from "@/app/components/fetch/FetchPost";

const ModalCloseEmail = ({mutate}: any) => {
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/profile/components/emailData/modal/api",
    fetchPost
  );
  const { csrfToken } = useSelector(
    (state: any) => state.csrfToken
  );
  const { displayModalCancelEmail } = useSelector(
    (state: any) => state.ModalCancelEmail
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        mutate(
          {
            ...data,
            body: {
              ...data.body,
              newEmail: null
            },
          },
          {
            revalidate: false,
          }
        );
        dispatch({
          type: "ModalCancelEmail/close",
        });
        dispatch({
          type: "ModalEditEmail/close",
        });
        globalMutate("/components/header/api");
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
          globalMutate("/components/header/api");
                  globalMutate("/components/header/ui/api");
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
      }
    }
  }, [data, dispatch, reset, router, mutate]);

  return (
    <>
      <TabIndex displayModal={displayModalCancelEmail} />
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
              <h2 className={`${styles.modalCloseEmail__h1}`}>
                Êtes-vous sûr de vouloir quitter ?
              </h2>
              <p>
                Vous conserverez votre adresse e-mail précédente si vous étiez
                en train de la modifier.
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
                      type="button"
                      className={styles.modalCloseEmail__reSend__btn}
                      onClick={() => {
                        dispatch({
                          type: "flash/clearFlashMessage",
                        });
                        trigger({csrfToken: csrfToken});
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
