import TabIndex from "@/app/components/tabIndex/TabIndex";
import { RootState, AppDispatch } from "@/app/redux/store/store";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "@/app/components/image/Image";
import styles from "./ModalHistoriqueMeet.module.scss"

const ModalHistoriqueMeet = ({meet, offre}: any) => {
const { displayModalHistoriqueMeetingRendezVous }: any = useSelector(
    (state: RootState) => state.ModalHistoriqueMeetingRendezVous
  );
  const dispatch = useDispatch<AppDispatch>();
  const closeForm = () => {
    dispatch({
      type: "ModalHistoriqueMeetingRendezVous/close",
    });
  };
  const [keyAr, setKeyAr] = useState<string[]>([]);
  useEffect(() => {
    if (meet && meet.length > 0) {
      setKeyAr(["Status", "Début", "Rdv dans l’offre", "Status du paiement"]);
    }
  }, [meet]);
  return (
    <>
      <TabIndex displayModal={displayModalHistoriqueMeetingRendezVous} />
      <AnimatePresence>
        {displayModalHistoriqueMeetingRendezVous === true && (
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
                Rendez-vous de l&apos;offre
              </h2>
              <p><span className={`${styles.modalOffreDetail__strong}`}>Type de l&apos;offre :</span> {offre.type[0].toUpperCase() + offre.type.slice(1)}</p>
              <p><span className={`${styles.modalOffreDetail__strong}`}>Type de coaching :</span> {offre.coaching[0].toUpperCase() + offre.coaching.slice(1)}</p>
              {
                meet.length > 0 && (
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
                        {meet?.map((data: any, index: any) => {
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
                                              {data["status"] === "pending" ? "En cours" : data["status"] === "confirmed" ? "Confirmé" : data["status"] === "completed" ? "Terminé" : data['status'] === "not_confirmed" ? "Pas confirmé" : data['status'] === "cancelled" ? "Annulé" : data['status'] === "expired" ? "Expiré" : "Absent"}
                                            </>
                                          )}
                                           {key === "Rdv dans l’offre" && (
                                            <>
                                              {/* {data["numberOfMeeting"]} / {["Découverte", 'Unique'].includes(meetingModalOffreDetail["Type de l'offre"]) ? 1 : 4} */}
                                            </>
                                          )}
                                          {key === "Status du paiement" && (
                                            <>
                                              {data["status_payment"] === "pending" ? "En attente" : data["status_payment"] === "success" ? "Payé" : data["status_payment"] === "not_paid" ? "Pas payé" : data["status_payment"] === "free" ? "Gratuit" : "Erreur"}
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
              {meet.length === 0 && (
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

export default ModalHistoriqueMeet