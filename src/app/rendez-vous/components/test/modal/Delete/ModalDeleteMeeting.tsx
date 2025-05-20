import React, { useEffect } from "react";
import styles from "./ModalDeleteMeeting.module.scss";
import fetchDelete from "@/app/components/fetch/FetchDelete";
import { RootState } from "@/app/redux/store";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";
import { mutate as globalMutate } from "swr";
import TabIndex from "@/app/components/tabIndex/TabIndex";

const ModalDeleteMeeting = ({ mutate }: any) => {
  const { displayModalDeleteMeetingRendezVous } = useSelector(
    (state: RootState) => state.ModalDeleteMeetingRendezVous
  );
  const dispatch = useDispatch();
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/rendez-vous/components/test/modal/Delete/api/",
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
          type: "ModalDeleteMeetingRendezVous/close",
        });
        reset();
        router.push("/");
      } else if (data.status === 200) {
        const processFetchedData = async () => {
          await globalMutate('/components/header/ui/api')
             await mutate();
          await dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "success", flashMessage: data.message },
          });
          
         
          await dispatch({
            type: "ModalDeleteMeetingRendezVous/close",
          });
          
          await reset();
        }
        processFetchedData()
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
      type: "ModalDeleteMeetingRendezVous/close",
    });
  };
  return (
    <>
      <TabIndex displayModal={displayModalDeleteMeetingRendezVous} />
      <AnimatePresence>
        {displayModalDeleteMeetingRendezVous === true && (
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
                Suppression rendez-vous de découverte
              </h1>

              <p>
                Si vous supprimer ce rendez-vous de découverte vous pourrez en
                reprendre un autre.
              </p>
              <div className={styles.deleteModal__div}>
                {isMutating === false && (
                  <button
                    className={styles.deleteModal__div__btn}
                    onClick={() => {
                      const fetchDeleteeeting = async () => {
                        dispatch({
                          type: "flash/clearFlashMessage",
                        });
                        trigger();
                      };
                      fetchDeleteeeting();
                    }}
                  >
                    Supprimer ce rendez-vous
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalDeleteMeeting;
