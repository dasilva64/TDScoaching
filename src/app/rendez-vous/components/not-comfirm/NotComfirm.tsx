import React, { useEffect } from "react";
import styles from "./NotComfirm.module.scss";
import useGet from "../../../components/hook/useGet";
import meeting from "../../../../api/fixtures/meeting";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import fetchGet from "../../../../../src/app/components/fetch/fetchGet";
import useSWRMutation from "swr/mutation";

const NotComfirm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: userData,
    isLoading,
    isError,
  } = useGet("/api/user/getUserMeeting");
  let restDate;
  if (userData.body.meeting && userData.body.meeting.limitDate) {
    let limitDate = userData.body.meeting.limitDate;
    let convertInDate = new Date(Number(limitDate));
    let difference = Math.abs(convertInDate.getTime() - new Date().getTime());
    restDate = new Date(difference);
  }
  const { trigger, data } = useSWRMutation("/api/paiement/getValid", fetchGet);
  useEffect(() => {
    if (data) {
      window.location.href = data.url;
    }
  }, [data, dispatch]);
  return (
    <>
      <div className={styles.notcomfirm}>
        <div className={styles.notcomfirm__text}>
          <h3 className={styles.notcomfirm__text__h3}>
            Attention votre rendez-vous n&apos;est pas encore comfirmé
          </h3>
          <p>
            Vous devez terminé le processus de réservation pour que le
            rendez-vous soit actif
          </p>
          <p>
            Il vous reste {Number(restDate?.getUTCMinutes()) + 1} min pour le
            comfirmer
          </p>
          <div className={styles.notcomfirm__text__div}>
            <button
              className={styles.notcomfirm__text__div__btn}
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
              className={styles.notcomfirm__text__div__btn}
              onClick={() => {
                dispatch({
                  type: "ModalCancelMeeting/open",
                });
              }}
            >
              Annuler ce rendez-vous
            </button>
          </div>
        </div>
        <div className={styles.notcomfirm__reminder}>
          <h3 className={styles.meet__meet__h3}>Rappel du rendez-vous</h3>
          <p>
            {new Date(userData.body.meeting.startAt).toLocaleString("fr-FR")}
          </p>
          <p>Consultation vidéo</p>
        </div>
      </div>
    </>
  );
};

export default NotComfirm;
