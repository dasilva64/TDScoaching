import fetchPost from "@/app/components/fetch/FetchPost";
import TabIndex from "@/app/components/tabIndex/TabIndex";
import { RootState } from "@/app/redux/store";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useSWRMutation from "swr/mutation";
import Image from "next/image";
import {mutate as globalMutate} from "swr"
import styles from "./ModalConfirmPaidMeeting.module.scss";

const ModalConfirmPaidMeeting = ({
  mutate,
  meeting,
}: {
  mutate: any;
  meeting: any;
}) => {
  const { csrfToken } = useSelector((state: RootState) => state.csrfToken)
  const { displayModalConfirmPaidMeetingRendezVous } = useSelector(
    (state: RootState) => state.ModalConfirmPaidMeetingRendezVous
  );
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    trigger: trigger,
    data: data,
    reset: reset,
    isMutating: isMutating,
  } = useSWRMutation(
    "/rendez-vous/components/test/modal/confirmPaid/api/",
    fetchPost
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        router.push(data.url);
      } else if (data.status === 400) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        dispatch({ type: "ModalConfirmPaidMeetingRendezVous/close" });
        reset();
      } else if (data.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        globalMutate("/components/header/api");
        globalMutate("/components/header/ui/api");
        reset();
        router.push("/");
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        dispatch({ type: "ModalConfirmPaidMeetingRendezVous/close" });
        reset();
      }
    }
  }, [data, dispatch, mutate, reset, router]);
  const closeForm = () => {
    dispatch({
      type: "ModalConfirmPaidMeetingRendezVous/close",
    });
  };
  return (
    <>
      <TabIndex displayModal={displayModalConfirmPaidMeetingRendezVous} />
      <AnimatePresence>
        {displayModalConfirmPaidMeetingRendezVous === true && (
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
              {meeting.type === "unique" && (
                <>
                  <p>100€</p>
                </>
              )}
              <p>Êtes vous sûre de vouloir confirmer votre rendez-vous</p>
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
                      type: "ModalConfirmPaidMeetingRendezVous/close",
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

export default ModalConfirmPaidMeeting;
