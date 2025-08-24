import fetchPost from "@/app/components/fetch/FetchPost";
import TabIndex from "@/app/components/tabIndex/TabIndex";
import { RootState } from "@/app/redux/store/store";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "@/app/components/image/Image";
import styles from "./ModalCancelMeetingDiscovery.module.scss"
import { useSelector, useDispatch } from "react-redux";
import { mutate as globalMutate } from "swr";
import useSWRMutation from "swr/mutation";

const ModalCancelMeetingDiscovery = ({ mutate, userData }: any) => {
  const { displayModalDeleteMeetingRendezVous } = useSelector(
    (state: RootState) => state.ModalDeleteMeetingRendezVous
  );
  const { csrfToken } = useSelector((state: RootState) => state.csrfToken)
  const dispatch = useDispatch();
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/rendez-vous/components/test/modal/discovery/cancel/api/",
    fetchPost
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
        globalMutate("/components/header/api");
        globalMutate("/components/header/ui/api");
        router.push(`/acces-refuse?destination=rendez-vous`)
      } else if (data.status === 200) {
        const header = document.getElementById("header");
        if (!header) return;
        header.style.top = "0px";
        const processFetchedData = async () => {
          const { meeting, offre, meetings } = data.body;
          mutate(
            {
              ...userData,
              body: {
                ...userData.body,
                meeting: null,
                offre,
                meetings,
              },
            },
            { revalidate: false }
          );
          await dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "success", flashMessage: data.message },
          });
          globalMutate("/components/header/api");
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
  }, [data, dispatch, mutate, reset, router, userData]);

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
              className={styles.modalCancelMeetingDiscovery}
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
                className={styles.modalCancelMeetingDiscovery__btn}
                onClick={() => closeForm()}
                onMouseDown={(e) => e.preventDefault()}
              >
                <Image
                  className={styles.modalCancelMeetingDiscovery__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="arrow-left"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h1 className={styles.modalCancelMeetingDiscovery__h1}>
                Suppression rendez-vous
              </h1>

              <p>
                Si vous supprimer ce rendez-vous de découverte vous pourrez en
                reprendre un autre.
              </p>
              <p>Êtes vous sûre de vouloir supprimer votre rendez-vous de découverte ?</p>
              <div className={styles.modalCancelMeetingDiscovery__div}>
                {isMutating === false && (
                  <button
                    className={styles.modalCancelMeetingDiscovery__div__btn}
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
                    Oui, supprimer
                  </button>
                )}
                {isMutating === true && (
                  <button
                    disabled
                    className={styles.modalCancelMeetingDiscovery__div__btn__load}
                  >
                    <span className={styles.modalCancelMeetingDiscovery__div__btn__load__span}>
                      Chargement
                    </span>

                    <div className={styles.modalCancelMeetingDiscovery__div__btn__load__arc}>
                      <div
                        className={
                          styles.modalCancelMeetingDiscovery__div__btn__load__arc__circle
                        }
                      ></div>
                    </div>
                  </button>
                )}
                <button
                  className={styles.modalCancelMeetingDiscovery__div__btn}
                  onClick={() => {
                    dispatch({
                      type: "ModalDeleteMeetingRendezVous/close",
                    });
                  }}
                >
                  Non, annuler
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default ModalCancelMeetingDiscovery