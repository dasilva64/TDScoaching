import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import styles from "./ModalDeleteDiscovery.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { RootState } from "@/app/redux/store";
import fetchDelete from "@/app/components/fetch/FetchDelete";

const ModalDeleteDiscovery = ({ mutate }: any) => {
  const { displayModalDeleteDiscoveryMeeting } = useSelector(
    (state: RootState) => state.ModalDeleteDiscoveryMeeting
  );
  const dispatch = useDispatch();
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/rendez-vous/components/discovery/my/api/",
    fetchDelete
  );
  useEffect(() => {
    if (data) {
      dispatch({
        type: "flash/storeFlashMessage",
        payload: { type: "success", flashMessage: data.message },
      });
      dispatch({
        type: "ModalDeleteDiscoveryMeeting/close",
      });
      reset();
      mutate();
    }
  }, [data, dispatch, mutate, reset]);

  const closeForm = () => {
    dispatch({
      type: "ModalDeleteDiscoveryMeeting/close",
    });
  };
  return (
    <>
      <AnimatePresence>
        {displayModalDeleteDiscoveryMeeting === true && (
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

export default ModalDeleteDiscovery;
