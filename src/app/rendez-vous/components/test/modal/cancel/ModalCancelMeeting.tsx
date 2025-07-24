import fetchDelete from "@/app/components/fetch/FetchDelete";
import TabIndex from "@/app/components/tabIndex/TabIndex";
import { RootState } from "@/app/redux/store/store";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import styles from "./ModalCancelMeeting.module.scss";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import useSWRMutation from "swr/mutation";
import { mutate as globalMutate } from "swr";

const ModalCancelMeeting = ({ mutate, offre }: any) => {

  const { csrfToken } = useSelector((state: RootState) => state.csrfToken)

  const { displayModalCancelMeetingRendezVous } = useSelector(
    (state: RootState) => state.ModalCancelMeetingRendezVous
  );
  const dispatch = useDispatch();
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/rendez-vous/components/test/modal/cancel/api/",
    fetchDelete
  );
  const router = useRouter();
  useEffect(() => {
    if (data) {
      if (data.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        dispatch({
          type: "ModalCancelMeetingRendezVous/close",
        });
        reset();
        globalMutate("/components/header/api");
        globalMutate("/components/header/ui/api");
        router.push(`/acces-refuse?destination=rendez-vous`)
      } else if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        dispatch({
          type: "ModalCancelMeetingRendezVous/close",
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
  }, [data, dispatch, mutate, reset, router]);

  const closeForm = () => {
    dispatch({
      type: "ModalCancelMeetingRendezVous/close",
    });
  };
  return (
    <>
      <TabIndex displayModal={displayModalCancelMeetingRendezVous} />
      <AnimatePresence>
        {displayModalCancelMeetingRendezVous === true && (
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
                Annulation du rendez-vous
              </h1>
              <p>Êtes vous sûre de vouloir annuler votre rendez-vous ?</p>
              {offre.payment && (
                <>
                  <p>Votre paiement va être annuler.</p>
                </>
              )}
              <div className={styles.deleteModal__div}>
                {isMutating === false && (
                  <button
                    className={styles.deleteModal__div__btn}
                    onClick={() => {
                      const fetchDeleteeeting = async () => {
                        dispatch({
                          type: "flash/clearFlashMessage",
                        });
                        trigger({ csrfToken: csrfToken });
                      };
                      fetchDeleteeeting();
                    }}
                  >
                    Oui, annuler
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
                      type: "ModalCancelMeetingRendezVous/close",
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

export default ModalCancelMeeting;
