import fetchGetPaymentValid from "@/app/components/fetch/paiement/fetchGetPaymentValid";
import useUserGet from "@/app/components/hook/user/useUserGet";
import { AppDispatch } from "@/app/redux/store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import useSWRMutation from "swr/mutation";
import Image from "next/image";
import styles from "../../page.module.scss";

const DisplayDiscoveryMeeting = () => {
  const { userData } = useUserGet();
  const dispatch = useDispatch<AppDispatch>();
  const { trigger, data } = useSWRMutation(
    "/api/paiement/getValid",
    fetchGetPaymentValid
  );
  useEffect(() => {
    if (data) {
      window.location.href = data.url;
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
  let content;
  if (
    userData &&
    userData.body.meeting &&
    userData.body.meeting.status === true
  ) {
    content = (
      <>
        <div style={{ width: "100%" }} className={styles.meet__container__text}>
          <h3 className={styles.meet__container__text__h3}>
            Voici votre prochain rendez-vous :{" "}
          </h3>
          <p className={styles.meet__container__text__p}>
            Votre prochain rendez vous est le{" "}
            {new Date(userData.body.meeting.startAt).toLocaleString("fr-FR", {
              timeZone: "UTC",
            })}
          </p>
          <div className={styles.meet__container__text__div}>
            <button
              className={styles.meet__container__text__div__btn}
              onClick={() => {
                dispatch({
                  type: "form/openModalDeleteFirstMeeting",
                });
              }}
            >
              Supprimer votre rendez-vous découverte
            </button>
          </div>
        </div>
      </>
    );
  } else if (userData && !userData.body.meeting && !userData.body.discovery) {
    content = (
      <>
        <div className={styles.meet__container__text}>
          <h3 className={styles.meet__container__text__h3}>
            Rendez-vous de découverte
          </h3>
          <div className={styles.meet__container__text__h3__div}>
            <p className={styles.meet__container__text__h3__div__p}>
              Ce rendez-vous est gratuit et sans engagement. Il permet de faire
              connaissance et de définir ensemble vos objectifs et vos besoins.
              Vous pouvez sélectionner une date en cliquant sur le calendrier.
            </p>
            <div className={styles.meet__container__text__h3__div__div}>
              <Image
                className={styles.meet__container__text__h3__div__div__img}
                width="20"
                height="20"
                priority={true}
                src={"/assets/icone/clock-solid.svg"}
                alt="bousole"
              />
              <p className={styles.meet__container__text__h3__div__div__p}>
                : 30 min
              </p>
            </div>
            <div className={styles.meet__container__text__h3__div__div}>
              <Image
                className={styles.meet__container__text__h3__div__div__img}
                width="20"
                height="20"
                priority={true}
                src={"/assets/icone/euro-sign-solid.svg"}
                alt="bousole"
              />
              <p className={styles.meet__container__text__h3__div__div__p}>
                : Gratuit
              </p>
            </div>
            <p className={styles.meet__container__text__h3__div__p}>
              Vous pouvez m&apos;envoyer un mail en cliquant sur le bouton
              ce-dessous si vous voulez avoir d&apos;avantage de renseignement
              ou pour prendre un rendez-vous personnalisé.
            </p>
            <div className={styles.meet__container__text__h3__div__div}>
              <button
                className={styles.meet__container__text__h3__div__div__btn}
                onClick={() => {
                  push("/contact");
                }}
              >
                Me contacter
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return <>{content}</>;
};

export default DisplayDiscoveryMeeting;
