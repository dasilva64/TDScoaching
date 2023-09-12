import React, { useEffect } from "react";
import styles from "./ModalEditMeeting.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import fetchPost from "@/app/components/fetch/FetchPost";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const ModalEditMeeting = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { displayModalEditMeeting, dataModalEditMeeting } = useSelector(
    (state: RootState) => state.ModalEditMeeting
  );
  const { data, trigger, reset } = useSWRMutation(
    "/api/meeting/edit",
    fetchPost
  );
  const closeForm = () => {
    dispatch({
      type: "ModalEditMeeting/close",
    });
  };
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        dispatch({
          type: "ModalEditMeeting/close",
        });
        dispatch({
          type: "ModalDatePickerEdit/close",
        });
        dispatch({
          type: "ModalDatePickerEdit/reload",
        });
      } else if (data.status === 400) {
        data.message.forEach((element: string) => {
          if (element[0] === "start") {
            dispatch({
              type: "flash/storeFlashMessage",
              payload: { type: "error", flashMessage: element[1] },
            });
          }
        });
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
      }
    }
  }, [data, dispatch]);
  useEffect(() => {
    const mutateMeetingData = async () => {
      mutate(
        "/api/user/getUserMeeting",
        {
          ...data,
        },
        { revalidate: false }
      );
      reset();
    };
    if (data && data.body) {
      mutateMeetingData();
    }
  }, [data, reset]);
  const handlerClick = () => {
    const fetchEditMeeting = async () => {
      trigger({
        start: new Date(dataModalEditMeeting).toLocaleString("en-US"),
      });
    };
    fetchEditMeeting();
  };
  return (
    <>
      <AnimatePresence>
        {displayModalEditMeeting === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
            />
            <motion.div
              className={styles.modalComfirm}
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
                className={styles.modalComfirm__btn}
                onClick={() => closeForm()}
              >
                <Image
                  className={styles.modalComfirm__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="arrow-left"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h1 className={styles.modalComfirm__h1}>
                Modification du rendez-vous
              </h1>
              <p>
                Rappel du nouveau rendez-vous :{" "}
                {new Date(dataModalEditMeeting).toLocaleString("fr-FR", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </p>
              <p className={styles.modalComfirm__p}>
                L&apos;autorisation bancaire a déjà été accepté pour ce rendez
                vous. Vous n&apos;avez donc pas besoin d&apos;effecter un
                paiement. Le paiement pour ce rendez-vous sera effectué à la fin
                de celui-ci.
              </p>
              <div className={styles.modalComfirm__div}>
                <button
                  className={styles.modalComfirm__div__btn}
                  onClick={() => {
                    handlerClick();
                  }}
                >
                  Comfirmer
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalEditMeeting;
