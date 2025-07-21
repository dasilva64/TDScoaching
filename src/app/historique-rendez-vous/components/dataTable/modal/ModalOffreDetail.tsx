import TabIndex from "@/app/components/tabIndex/TabIndex";
import { RootState, AppDispatch } from "@/app/redux/store";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./ModalOffreDetail.module.scss"
import Image from "@/app/components/image/Image";
import React from "react";

const ModalOffreDetail = () => {
  const { displayModalOffreDetail, meetingModalOffreDetail }: any = useSelector(
    (state: RootState) => state.ModalOffreDetail
  );
  const dispatch = useDispatch<AppDispatch>();
  const closeForm = () => {
    dispatch({
      type: "ModalOffreDetail/close",
    });
  };
  const [keyAr, setKeyAr] = useState<string[]>([]);
  useEffect(() => {
    if (meetingModalOffreDetail && meetingModalOffreDetail.meetings.length > 0) {
      setKeyAr(["Status", "Début", "Rdv dans l’offre"]);
    }
  }, [meetingModalOffreDetail]);
  return (
    <>
      <TabIndex displayModal={displayModalOffreDetail} />
      <AnimatePresence>
        {displayModalOffreDetail === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeForm()}
            />
            <motion.div
              className={styles.modalOffreDetail}
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
                className={styles.modalOffreDetail__btn}
                onClick={() => closeForm()}
                onMouseDown={(e) => e.preventDefault()}
              >
                <Image
                  className={styles.modalOffreDetail__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="icone fermer modal"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h2 className={`${styles.modalOffreDetail__h1}`}>
                Rendez-vous de l'offre
              </h2>
              <p><span className={`${styles.modalOffreDetail__strong}`}>Type de l'offre :</span> {meetingModalOffreDetail["Type de l'offre"][0].toUpperCase() + meetingModalOffreDetail["Type de l'offre"].slice(1)}</p>
              <p><span className={`${styles.modalOffreDetail__strong}`}>Type de coaching :</span> {meetingModalOffreDetail["Type de coaching"][0].toUpperCase() + meetingModalOffreDetail["Type de coaching"].slice(1)}</p>
              {
                meetingModalOffreDetail.meetings.length > 0 && (
                  <>
                  <div className={styles.table__container}>
                    <table className={styles.table}>
                      <thead className={styles.table__head}>
                        <tr className={styles.table__head__tr}>
                          {keyAr &&
                            keyAr.map((key: any, index: any) => {
                              if (key === "id") return
                              return (
                                <th
                                  className={`${styles.table__head__tr__th}`}
                                  //onClick={(e) => handlerSortBy(e)}
                                  key={index}
                                >
                                  {key}
                                </th>
                              );
                            })}
                        </tr>
                      </thead>
                      <tbody className={styles.table__body}>
                        {meetingModalOffreDetail.meetings?.map((data: any, index: any) => {
                          return (
                            <tr
                              className={styles.table__body__tr}
                              key={index}
                            >
                              {keyAr &&
                                keyAr.map((key: any, index: any) => {
                                  if (key === "id") return
                                  return (
                                    <>
                                      <td
                                        className={`${styles.table__body__tr__td__even__first} ${styles.table__body__tr__td}`}
                                        key={index}
                                      >
                                        {" "}
                                        <div className={styles.table__body__tr__td__div__id}>
                                          {key === "Début" && (
                                            <>
                                              {new Date(data["startAt"]).toLocaleString()}
                                            </>
                                          )}
                                          {key === "Status" && (
                                            <>
                                              {data["status"] === "pending" ? "En cours" : data["status"] === "confirmed" ? "Confirmé" : data["status"] === "completed" ? "Terminé" : "Erreur"}
                                            </>
                                          )}
                                          {key === "Rdv dans l’offre" && (
                                            <>
                                              {data["numberOfMeeting"]} / {meetingModalOffreDetail["Type de l'offre"].toUpperCase() === "UNIQUE" ? 1 : 3}
                                            </>
                                          )}
                                        </div>
                                      </td>
                                    </>
                                  )
                                })}

                            </tr>

                          )

                        })}
                      </tbody >
                    </table>
                  </div>
                    
                  </>
                )
              }
              {meetingModalOffreDetail.meetings.length === 0 && (
                <>
                  <p><span className={`${styles.modalOffreDetail__strong}`}>Rendez-vous :</span> Pas encore de rendez-vous</p>
                </>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default ModalOffreDetail