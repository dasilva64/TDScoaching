import React, { useEffect } from "react";
import styles from "./ModalEditDiscoveryMeeting.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import fetchPost from "../../../../../../src/app/components/fetch/FetchPost";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const ModalEditDiscoveryMeeting = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dataModalEditDiscoveryMeeting, displayModalEditDiscoveryMeeting } =
    useSelector((state: RootState) => state.ModalEditDiscoveryMeeting);
  const { data, trigger, reset, isMutating } = useSWRMutation(
    "/api/meeting/edit",
    fetchPost
  );
  const closeForm = () => {
    dispatch({
      type: "ModalEditDiscoveryMeeting/close",
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
          type: "ModalEditDiscoveryMeeting/close",
        });
        dispatch({
          type: "ModalDatePickerEditDiscovery/close",
        });
        dispatch({
          type: "ModalDatePickerEditDiscovery/reload",
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
        start: new Date(dataModalEditDiscoveryMeeting).toLocaleString("en-US"),
      });
    };
    fetchEditMeeting();
  };
  return (
    <>
      <AnimatePresence>
        {displayModalEditDiscoveryMeeting === true && (
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
                Modification du rendez-vous de découverte
              </h1>
              <p>
                Rappel du rendez-vous :{" "}
                {new Date(dataModalEditDiscoveryMeeting).toLocaleString(
                  "fr-FR"
                )}
              </p>
              <div className={styles.modalComfirm__div}>
                {isMutating === false && (
                  <button
                    className={styles.modalComfirm__div__btn}
                    onClick={() => {
                      dispatch({
                        type: "flash/clearFlashMessage",
                      });
                      handlerClick();
                    }}
                  >
                    Comfirmer
                  </button>
                )}

                {isMutating === true && (
                  <button
                    disabled
                    className={styles.modalComfirm__div__btn__load}
                  >
                    <span className={styles.modalComfirm__div__btn__load__span}>
                      Chargement
                    </span>

                    <div className={styles.modalComfirm__div__btn__load__arc}>
                      <div
                        className={
                          styles.modalComfirm__div__btn__load__arc__circle
                        }
                      ></div>
                    </div>
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalEditDiscoveryMeeting;
