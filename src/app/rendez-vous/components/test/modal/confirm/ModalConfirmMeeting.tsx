import { RootState } from "@/app/redux/store/store";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useSWRMutation from "swr/mutation";
import Image from "@/app/components/image/Image";
import styles from "./ModalConfirmMeeting.module.scss";
import TabIndex from "@/app/components/tabIndex/TabIndex";
import fetchPost from "@/app/components/fetch/FetchPost";
import { mutate as globalMutate } from "swr";

const ModalConfirmMeeting = ({
  mutate,
}: {
  mutate: any;
  meeting: any;
}) => {
  const { displayModalConfirmMeetingRendezVous } = useSelector(
    (state: RootState) => state.ModalConfirmMeetingRendezVous
  );
  const dispatch = useDispatch();
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/rendez-vous/components/test/modal/confirm/api/",
    fetchPost
  );
  const { csrfToken } = useSelector((state: RootState) => state.csrfToken)
  const router = useRouter();
  useEffect(() => {
    if (data) {
      if (data.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        dispatch({
          type: "ModalConfirmMeetingRendezVous/close",
        });
        reset();
        globalMutate("/components/header/api");
        globalMutate("/components/header/ui/api");
        router.push(`/acces-refuse?destination=rendez-vous`)
      } else if (data.status === 200) {
        mutate();
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        dispatch({
          type: "ModalConfirmMeetingRendezVous/close",
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
  }, [data, dispatch, mutate, reset, router]);

  const closeForm = () => {
    dispatch({
      type: "ModalConfirmMeetingRendezVous/close",
    });
  };
  return (
    <>
      <TabIndex displayModal={displayModalConfirmMeetingRendezVous} />
      <AnimatePresence>
        {displayModalConfirmMeetingRendezVous === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeForm()}
            />
            <motion.div
              className={styles.deleteModal}
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
                className={styles.deleteModal__btn}
                onClick={() => closeForm()}
                onMouseDown={(e) => e.preventDefault()}
              >
                <Image
                  className={styles.deleteModal__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="arrow-left"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h1 className={styles.deleteModal__h1}>
                Confirmation du rendez-vous
              </h1>
              <p>Êtes vous sûre de vouloir confirmer votre rendez-vous de découverte ?</p>
              <div className={styles.deleteModal__div}>
                {isMutating === false && (
                  <button
                    className={styles.deleteModal__div__btn}
                    onClick={() => {
                      const triggerConfirm = async () => {
                        dispatch({
                          type: "flash/clearFlashMessage",
                        });
                        trigger({ csrfToken: csrfToken });
                      };
                      triggerConfirm();
                    }}
                  >
                    Oui, confirmer
                  </button>
                )}
                {isMutating === true && (
                  <button
                    disabled
                    className={styles.deleteModal__div__btn__load}
                  >
                    <span className={styles.deleteModal__div__btn__load__span}>
                      Chargement
                    </span>

                    <div className={styles.deleteModal__div__btn__load__arc}>
                      <div
                        className={
                          styles.deleteModal__div__btn__load__arc__circle
                        }
                      ></div>
                    </div>
                  </button>
                )}
                <button
                  className={styles.deleteModal__div__btn}
                  onClick={() => {
                    dispatch({
                      type: "ModalConfirmMeetingRendezVous/close",
                    });
                  }}
                >
                  Non, quitter
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalConfirmMeeting;
