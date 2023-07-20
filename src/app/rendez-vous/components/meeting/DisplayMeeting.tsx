import React, { useEffect, useState } from "react";
import styles from "../../page.module.scss";
import { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import fetchAddDescription from "../../../components/fetch/meeting/fetchAddDescription";
import useSWRMutation from "swr/mutation";
import fetchDeleteDescription from "../../../components/fetch/meeting/fetchDeleteDescription";
import { useRouter } from "next/navigation";
import DeleteMeeting from "./deleteMeeting/DeleteMeeting";
import EditDescription from "./editDescription/EditDescription";
import DeleteDescription from "./deleteDescription/DeleteDescription";
import AddDescription from "./addDescription/AddDescription";
import useUserGet from "@/app/components/hook/user/useUserGet";
import fetchGetPaymentValid from "@/app/components/fetch/paiement/fetchGetPaymentValid";
import fetchCancel from "@/app/components/fetch/paiement/fetchCancel";

const DisplayMeeting = () => {
  const { userData, isLoading, isError } = useUserGet();
  const dispatch = useDispatch<AppDispatch>();
  const { trigger, data } = useSWRMutation(
    "/api/paiement/getValid",
    fetchGetPaymentValid
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200)  {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
      }
      //window.location.href = data.url;
    }
  }, [data, dispatch]);

  
  const { push } = useRouter();
  let restDate;
  if (userData?.body.meeting && userData?.body.meeting.limitDate) {
    let limitDate = userData?.body.meeting.limitDate;
    let convertInDate = new Date(Number(limitDate));
    let difference = Math.abs(convertInDate.getTime() - new Date().getTime());
    restDate = new Date(difference);
  }
  
  /* let content;
  if (isError) {
    content = <div>error</div>;
  } else if (isLoading) {
    content = (
      <div className={styles.loadData}>
        Chargement des données
        <div className={styles.loadData__arc}>
          <div className={styles.loadData__arc__circle}></div>
        </div>
      </div>
    );
  } else { */
   let content = (
      <>
        <div className={styles.meet__meet}>
          {(userData &&
            userData.body.meeting &&
            userData.body.meeting.status === true && (
              <>
                <h3 className={styles.meet__meet__h3}>
                  Voici votre prochain rendez-vous :{" "}
                </h3>
                <p className={styles.meet__meet__p__start}>
                  Votre prochain rendez vous est le{" "}
                  {new Date(userData.body.meeting.startAt).toLocaleString(
                    "fr-FR",
                    {
                      timeZone: "UTC",
                    }
                  )}
                </p>
                {(userData.body.meeting.description && (
                  <>
                    <p className={styles.meet__meet__p__description}>
                      {userData.body.meeting.description}
                    </p>
                    <div className={styles.meet__meet__div}>
                      <EditDescription />

                      <DeleteDescription />

                      <div className={styles.meet__meet__div}>
                        <DeleteMeeting />
                      </div>
                    </div>
                  </>
                )) ||
                  (!userData.body.meeting.description && (
                    <>
                      <p className={styles.meet__meet__p}>
                        Vous pouvez ajouter une description ici ajouter des
                        informations sur vous. Je prendrais alors vos remarque
                        en compte avant notre rendez-vous.
                      </p>
                      <AddDescription />
                      <div className={styles.meet__meet__div}>
                        <DeleteMeeting />
                      </div>
                    </>
                  ))}
              </>
            )) ||
            (userData &&
              userData.body.meeting &&
              userData.body.meeting.status === false && (
                <>
                  <div className={styles.meet__div}>
                    <div className={styles.meet__div__div}>
                      <h3 className={styles.meet__meet__h3}>
                        Attention votre rendez-vous n&apos;est pas encore
                        comfirmé
                      </h3>
                      <p>
                        Vous devez terminé le processus de réservation pour que
                        le rendez-vous soit actif
                      </p>
                      <p>Il vous reste {Number(restDate?.getUTCMinutes()) + 1} min{" "} pour le comfirmer</p>
                      <div className={styles.meet__div}>
                        <button
                          className={styles.meet__div__div__btn}
                          onClick={() => {
                            const fetchAddMeeting = async () => {
                              trigger();
                            };
                            fetchAddMeeting();
                          }}
                        >
                          Comfirmer ce rendez-vous
                        </button>
                        <button
                          className={styles.meet__div__div__btn}
                          onClick={() => {
                            dispatch({
                              type: "form/openModalCancelMeeting",
                            });
                          }}
                        >
                          Annuler ce rendez-vous
                        </button>
                      </div>
                    </div>
                    <div className={styles.meet__div__rappel}>
                      <h3 className={styles.meet__meet__h3}>
                        Rappel du rendez-vous
                      </h3>
                      <p>
                        {new Date(userData.body.meeting.startAt).toLocaleString(
                          "fr-FR",
                          {
                            timeZone: "UTC",
                          }
                        )}
                      </p>
                      <p>Consultation vidéo</p>
                    </div>
                  </div>
                </>
              )) ||
            (userData && !userData.body.meeting && (
              <>
                <h3 className={styles.meet__meet__h3}>
                  Vous n&apos;avez pas encore de rendez-vous de programmé
                </h3>
                <div className={styles.meet__meet__div}>
                  <p className={styles.meet__meet__div__p}>
                    Vous pouvez sélectionner une date en cliquant sur le
                    calendrier. La durée standar d&apos;un rendez-vous est de 1
                    heure. Vous pouvez m&apos;envoyer un mail en cliquant sur le
                    bouton ce-dessous si vous voulez avoir d&apos;avantage de
                    renseignement ou pour prendre un rendez-vous personnalisé.
                  </p>
                  <div>
                    <button
                      className={styles.meet__meet__div__btn}
                      onClick={() => {
                        push("/contact");
                      }}
                    >
                      bouton
                    </button>
                  </div>
                  <p className={styles.meet__meet__div__p__marge}>
                    Avant de prendre un rendez-vous vous devez autoriser un
                    paiement.
                  </p>
                </div>
              </>
            ))}
        </div>
      </>
    );
  


  return <>{content}</>;
};

export default DisplayMeeting;
