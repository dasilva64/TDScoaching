import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TabIndex from "@/app/components/tabIndex/TabIndex";
import { AnimatePresence, motion } from "framer-motion";
import Image from "@/app/components/image/Image";
import useSWRMutation from "swr/mutation";
import styles from "./ModalDeleteDiscoveryMeeting.module.scss";
import fetchPost from "@/app/components/fetch/FetchPost";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

const ModalDeleteDiscoveryMeeting = ({ token }: any) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { displayModalDeleteDiscoveryMeetingRendezVousToken } = useSelector(
    (state: RootState) => state.ModalDeleteDiscoveryMeetingRendezVousToken
  );
  const closeModal = () => {
    dispatch({
      type: "ModalDeleteDiscoveryMeetingRendezVousToken/close",
    });
  };
  const { csrfToken } = useSelector(
    (state: RootState) => state.csrfToken
  );
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/rendez-vous/[token]/components/modal/delete/api",
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
          type: "ModalDeleteDiscoveryMeetingRendezVousToken/close",
        });
        mutate("/components/header/api");
        /* dispatch({
          type: "csrfToken/store",
          payload: { csrfToken: data.csrfToken },
        }); */
        router.push("/");
        reset();
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
      }
    }
  }, [data, dispatch, reset, router]);
  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "flash/clearFlashMessage",
    });
    trigger({ token: token.trim(), csrfToken: csrfToken });
  };
  return (
    <>
      <TabIndex
        displayModal={displayModalDeleteDiscoveryMeetingRendezVousToken}
      />
      <AnimatePresence>
        {displayModalDeleteDiscoveryMeetingRendezVousToken === true && (
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
                Supprimer le rendez-vous
              </h2>
              <p>
                Veuillez cliquer sur le bouton ci-dessous si vous voulez
                supprimer le rendez-vous
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
                      Supprimer
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

export default ModalDeleteDiscoveryMeeting;
