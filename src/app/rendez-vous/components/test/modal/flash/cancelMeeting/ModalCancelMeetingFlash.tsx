import fetchDelete from "@/app/components/fetch/FetchDelete";
import TabIndex from "@/app/components/tabIndex/TabIndex";
import { RootState } from "@/app/redux/store/store";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { mutate as globalMutate } from "swr";
import Image from "@/app/components/image/Image";
import styles from "./ModalCancelMeetingFlash.module.scss"
import useSWRMutation from "swr/mutation";

const ModalCancelMeetingFlash = ({ userData, mutate, offre }: any) => {
  const { csrfToken } = useSelector((state: RootState) => state.csrfToken)

  const { displayModalCancelMeetingRendezVous, typeModalCancelMeetingRendezVous } = useSelector(
    (state: RootState) => state.ModalCancelMeetingRendezVous
  );
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch();
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/rendez-vous/components/test/modal/flash/cancelMeeting/api/",
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
        const header = document.getElementById("header");
        if (!header) return;
        header.style.top = "0px";
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        dispatch({
          type: "ModalCancelMeetingRendezVous/close",
        });
        reset();
        globalMutate("/components/header/api");
        const { meeting, offre } = data.body;
        const updatedMeetingsByUser = userData.body.meetingsByUser?.map((m: any) =>
          m.id === meeting.id ? { ...m, status: "cancelled", status_payment: "not_paid" } : m
        );
        mutate(
          {
            ...userData,
            body: {
              ...userData.body,
              meeting: null,
              offre: offre,
              meetingsByUser: updatedMeetingsByUser
            },
          },
          { revalidate: false }
        );
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
      }
      setIsLoading(false)
    }
  }, [data, dispatch, mutate, reset, router, userData]);

  const { trigger: triggerUnique, data: dataUnique, reset: resetUnique, isMutating: isMutatingUnique } = useSWRMutation(
    "/rendez-vous/components/test/modal/cancel/unique/api/",
    fetchDelete
  );
  useEffect(() => {
    if (dataUnique) {
      if (dataUnique.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataUnique.message },
        });
        dispatch({
          type: "ModalCancelMeetingRendezVous/close",
        });
        resetUnique();
        globalMutate("/components/header/api");
        globalMutate("/components/header/ui/api");
        router.push(`/acces-refuse?destination=rendez-vous`)
      } else if (dataUnique.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: dataUnique.message },
        });
        dispatch({
          type: "ModalCancelMeetingRendezVous/close",
        });
        resetUnique();
        mutate();
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataUnique.message },
        });
        resetUnique();
      }
      setIsLoading(false)
    }
  }, [dataUnique, dispatch, mutate, resetUnique, router]);

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
              className={styles.modalCancelMeetingFlash}
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
                className={styles.modalCancelMeetingFlash__btn}
                onClick={() => closeForm()}
                onMouseDown={(e) => e.preventDefault()}
              >
                <Image
                  className={styles.modalCancelMeetingFlash__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="arrow-left"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h1 className={styles.modalCancelMeetingFlash__h1}>
                Annulation du rendez-vous
              </h1>
              <p>Êtes vous sûre de vouloir annuler votre rendez-vous ?</p>
              {offre.payment && (
                <>
                  <p>Votre paiement va être annulé.</p>
                  <p>Rassurez-vous, aucun prélèvement ne sera effectué sur votre compte bancaire.</p>
                </>
              )}
              <div className={styles.modalCancelMeetingFlash__div}>
                {isLoading === false && (
                  <button
                    className={styles.modalCancelMeetingFlash__div__btn}
                    onClick={() => {
                      setIsLoading(true)
                      const fetchDeleteeeting = async () => {
                        if (typeModalCancelMeetingRendezVous === "unique") {
                          dispatch({
                            type: "flash/clearFlashMessage",
                          });
                          triggerUnique({ csrfToken: csrfToken });
                        } else {
                          dispatch({
                            type: "flash/clearFlashMessage",
                          });
                          trigger({ csrfToken: csrfToken });
                        }

                      };
                      fetchDeleteeeting();
                    }}
                  >
                    Oui, annuler
                  </button>
                )}
                {isLoading === true && (
                  <button
                    disabled
                    className={styles.modalCancelMeetingFlash__div__btn__load}
                  >
                    <span className={styles.modalCancelMeetingFlash__div__btn__load__span}>
                      Chargement
                    </span>

                    <div className={styles.modalCancelMeetingFlash__div__btn__load__arc}>
                      <div
                        className={
                          styles.modalCancelMeetingFlash__div__btn__load__arc__circle
                        }
                      ></div>
                    </div>
                  </button>
                )}
                <button
                  className={styles.modalCancelMeetingFlash__div__btn}
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
}

export default ModalCancelMeetingFlash