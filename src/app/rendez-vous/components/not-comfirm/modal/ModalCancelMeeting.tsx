import React, { useEffect } from "react";
import useSWRMutation from "swr/mutation";
import { useDispatch, useSelector } from "react-redux";
import { mutate } from "swr";
import fetchGet from "../../../../../../src/app/components/fetch/fetchGet";
import styles from "./ModalCancelMeeting.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import { RootState } from "@/app/redux/store";
import Image from "next/image";

const ModalCancelMeeting = () => {
  const dispatch = useDispatch();
  const { trigger, data, reset } = useSWRMutation(
    "/api/meeting/deleteMeeting",
    fetchGet
  );
  const { displayModalCancelMeeting } = useSelector(
    (state: RootState) => state.ModalCancelMeeting
  );
  useEffect(() => {
    if (data && data.status === 200) {
      if (data.status === 200) {
        mutate("/api/user/getUserMeeting", {
          ...data,
        });
        reset();
        dispatch({
          type: "ModalCancelMeeting/close",
        });
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        dispatch({
          type: "ModalDatePicker/reload",
        });
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
      }
    }
  }, [data, dispatch, reset]);
  const closeForm = () => {
    dispatch({
      type: "ModalCancelMeeting/close",
    });
  };
  return (
    <>
      <AnimatePresence>
        {displayModalCancelMeeting === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
            />
            <motion.div
              className={styles.cancelModal}
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
                className={styles.cancelModal__btn}
                onClick={() => closeForm()}
              >
                <Image
                  className={styles.cancelModal__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="arrow-left"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h1 className={styles.cancelModal__h1}>
                Comfirmation annulation rendez-vous
              </h1>
              <div className={styles.cancelModal__cancel}>
                <button
                  className={styles.cancelModal__cancel__btn}
                  onClick={() => {
                    const fetchCancelMeeting = async () => {
                      trigger();
                    };
                    fetchCancelMeeting();
                  }}
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalCancelMeeting;
