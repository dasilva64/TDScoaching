import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TabIndex from "@/app/components/tabIndex/TabIndex";
import { AnimatePresence, motion } from "framer-motion";
import useSWRMutation from "swr/mutation";
import validator from "validator";
import styles from "./ModalComfirmDiscoveryMeeting.module.scss";
import Image from "@/app/components/image/Image";
import fetchPost from "@/app/components/fetch/FetchPost";
import { RootState } from "@/app/redux/store";

const ModalComfirmDiscoveryMeeting = ({ token, mutate }: any) => {
  const { displayModalConfirmDiscoveryMeetingRendezVousToken } = useSelector(
    (state: RootState) => state.ModalConfirmDiscoveryMeetingRendezVousToken
  );
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch({
      type: "ModalConfirmDiscoveryMeetingRendezVousToken/close",
    });
  };
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/rendez-vous/[token]/components/modal/confirm/api",
    fetchPost
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        dispatch({
          type: "ModalConfirmDiscoveryMeetingRendezVousToken/close",
        });
        reset();
        mutate();
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
      }
    }
  }, [data, dispatch, mutate, reset]);
  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "flash/clearFlashMessage",
    });
    trigger({ token: validator.escape(token.trim()) });
  };
  return (
    <>
      <TabIndex
        displayModal={displayModalConfirmDiscoveryMeetingRendezVousToken}
      />
      <AnimatePresence>
        {displayModalConfirmDiscoveryMeetingRendezVousToken === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeModal()}
            />
            <motion.div
              className={styles.modalCalendarEditDiscovery}
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
                className={styles.modalCalendarEditDiscovery__btn}
                onClick={() => closeModal()}
              >
                <Image
                  className={styles.modalCalendarEditDiscovery__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="icone fermer modal"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h2 className={`${styles.modalCalendarEditDiscovery__h1}`}>
                Confirmer le rendez-vous
              </h2>
              <p>
                Cliquez sur le bouton ce-dessous pour confirmer le rendez-vous.
              </p>
              <div className={styles.modalCalendarEditDiscovery__submit}>
                {isMutating && (
                  <>
                    <button
                      disabled
                      className={
                        styles.modalCalendarEditDiscovery__submit__btn__load
                      }
                    >
                      <span
                        className={
                          styles.modalCalendarEditDiscovery__submit__btn__load__span
                        }
                      >
                        Chargement
                      </span>

                      <div
                        className={
                          styles.modalCalendarEditDiscovery__submit__btn__load__arc
                        }
                      >
                        <div
                          className={
                            styles.modalCalendarEditDiscovery__submit__btn__load__arc__circle
                          }
                        ></div>
                      </div>
                    </button>
                  </>
                )}
                {isMutating === false && (
                  <>
                    <button
                      className={styles.modalCalendarEditDiscovery__submit__btn}
                      onClick={(e) => {
                        handlerSubmit(e);
                      }}
                    >
                      Confirmer
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

export default ModalComfirmDiscoveryMeeting;
