import fetchPost from "@/app/components/fetch/FetchPost";
import TabIndex from "@/app/components/tabIndex/TabIndex";
import { RootState } from "@/app/redux/store/store";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useSWRMutation from "swr/mutation";
import {mutate as globalMutate} from "swr"
import styles from "./ModalFormuleConfirmFlash.module.scss"
import Image from "@/app/components/image/Image";

const ModalFormuleConfirmFlash = ({
  mutate,
  offre,
}: {
  mutate: any;
  offre: any;
}) => {
  const closeForm = () => {
    dispatch({
      type: "ModalConfirmPaidMeetingRendezVous/close",
    });
  };
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
    "/rendez-vous/components/test/modal/flash/confirmFormule/api/",
    fetchPost
  );
  useEffect(() => {
    const closeForm = () => {
    dispatch({
      type: "ModalConfirmPaidMeetingRendezVous/close",
    });
  };
    if (data) {
      if (data.status === 200) {
        reset()
        globalMutate("/components/header/api");
        closeForm()
        dispatch({
          type: "ModalAddCardStripe/open",
          payload: {
            secret: data.body
          }
        });
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
  }, [data, dispatch, mutate, reset, router, closeForm]);
  
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
              className={styles.modalFormuleConfirmFlash}
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
                className={styles.modalFormuleConfirmFlash__btn}
                onClick={() => closeForm()}
                onMouseDown={(e) => e.preventDefault()}
              >
                <Image
                  className={styles.modalFormuleConfirmFlash__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="arrow-left"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h1 className={styles.modalFormuleConfirmFlash__h1}>
                Confirmation du rendez-vous
              </h1>
              <p>Pour confirmer votre offre, vous devez ajouter votre carte bancaire.</p>
             
              <p>Êtes vous sûre de vouloir confirmer votre rendez-vous ?</p>
              <div className={styles.modalFormuleConfirmFlash__div}>
                {isMutating === false && (
                  <button
                    className={styles.modalFormuleConfirmFlash__div__btn}
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
                    className={styles.modalFormuleConfirmFlash__div__btn__load}
                  >
                    <span className={styles.modalFormuleConfirmFlash__div__btn__load__span}>
                      Chargement
                    </span>

                    <div className={styles.modalFormuleConfirmFlash__div__btn__load__arc}>
                      <div
                        className={
                          styles.modalFormuleConfirmFlash__div__btn__load__arc__circle
                        }
                      ></div>
                    </div>
                  </button>
                )}
                <button
                  className={styles.modalFormuleConfirmFlash__div__btn}
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

export default ModalFormuleConfirmFlash