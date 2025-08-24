import fetchPost from "@/app/components/fetch/FetchPost";
import TabIndex from "@/app/components/tabIndex/TabIndex";
import { RootState } from "@/app/redux/store/store";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useSWRMutation from "swr/mutation";
import {mutate as globalMutate} from "swr"
import Image from "@/app/components/image/Image";
import styles from "./ModalConfirmMeetingUnique.module.scss"

const ModalConfirmMeetingUnique = ({
  mutate,
  userData
}: {
  mutate: any;
  userData: any;
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
    "/rendez-vous/components/test/modal/unique/confirm/api/",
    fetchPost
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        const { meeting } = data.body;
        mutate(
            {
              ...userData,
              body: {
                ...userData.body,
                meeting,
              },
            },
            { revalidate: false }
          );
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        globalMutate("/components/header/api");
        dispatch({
          type: "ModalConfirmPaidMeetingRendezVous/close",
        });
        reset();
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
        router.push(`/acces-refuse?destination=rendez-vous`)
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        dispatch({ type: "ModalConfirmPaidMeetingRendezVous/close" });
        reset();
      }
    }
  }, [data, dispatch, mutate, reset, router, userData]);
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
              className={styles.modalConfirmMeetingUnique}
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
                className={styles.modalConfirmMeetingUnique__btn}
                onClick={() => closeForm()}
                onMouseDown={(e) => e.preventDefault()}
              >
                <Image
                  className={styles.modalConfirmMeetingUnique__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="arrow-left"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h1 className={styles.modalConfirmMeetingUnique__h1}>
                Confirmation du rendez-vous
              </h1>             
              <p>Êtes vous sûre de vouloir confirmer votre rendez-vous</p>
              <div className={styles.modalConfirmMeetingUnique__div}>
                {isMutating === false && (
                  <button
                    className={styles.modalConfirmMeetingUnique__div__btn}
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
                    className={styles.modalConfirmMeetingUnique__div__btn__load}
                  >
                    <span className={styles.modalConfirmMeetingUnique__div__btn__load__span}>
                      Chargement
                    </span>

                    <div className={styles.modalConfirmMeetingUnique__div__btn__load__arc}>
                      <div
                        className={
                          styles.modalConfirmMeetingUnique__div__btn__load__arc__circle
                        }
                      ></div>
                    </div>
                  </button>
                )}
                <button
                  className={styles.modalConfirmMeetingUnique__div__btn}
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
}

export default ModalConfirmMeetingUnique