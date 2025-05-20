/* import fetchPost from "@/app/components/fetch/FetchPost";
import TabIndex from "@/app/components/tabIndex/TabIndex";
import { AppDispatch, RootState } from "@/app/redux/store";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import styles from "./ModalFormuleEdit.module.scss";
import Image from "next/image";

const ModalFormuleEdit = ({ mutate }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [pseudo, setPseudo] = useState<string>("");
  const closeModal = () => {
    setPseudo("");
    dispatch({ type: "ModalFormuleEditRendezVous/close" });
  };
  const { displayModalFormuleEditRendezVous, idModalFormuleEditRendezVous } =
    useSelector((state: RootState) => state.ModalFormuleEditRendezVous);
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/rendez-vous/components/test/modal/editOffre/api/",
    fetchPost
  );
  const router = useRouter();
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        dispatch({ type: "ModalFormuleEditRendezVous/close" });
        reset();
        mutate();
      } else if (data.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
        router.push("/");
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
      }
    }
  }, [data, dispatch, mutate, reset, router]);

  return (
    <>
      <TabIndex displayModal={displayModalFormuleEditRendezVous} />
      <AnimatePresence>
        {displayModalFormuleEditRendezVous === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeModal()}
            />
            <motion.div
              className={styles.modalAddFormule}
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
                className={styles.modalAddFormule__btn}
                onClick={() => closeModal()}
              >
                <Image
                  className={styles.modalAddFormule__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="icone fermer modal"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h2 className={`${styles.modalAddFormule__h1}`}>Formule</h2>
              <p>Êtes vous sûre de vouloir changer d'offre ?</p>

              <div className={styles.modalAddFormule__action}>
                {!isMutating && (
                  <>
                    <button
                      className={styles.modalAddFormule__action__btn}
                      onClick={() => {
                        trigger({
                          id: idModalFormuleEditRendezVous,
                        });
                      }}
                    >
                      Changer
                    </button>
                  </>
                )}
                {isMutating && (
                  <>
                    <span className={styles.modalAddFormule__action__btn}>
                      Chargement ...
                    </span>
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

export default ModalFormuleEdit;
 */