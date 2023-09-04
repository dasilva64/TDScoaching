import React, { useEffect } from "react";
import styles from "./DisplayMeeting.module.scss";
import { AppDispatch } from "../../../redux/store";
import { useDispatch } from "react-redux";
import useSWRMutation from "swr/mutation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import fetchGet from "@/app/components/fetch/fetchGet";

const DisplayMeeting = ({ meeting, discovery, typeMeeting }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { trigger, data } = useSWRMutation("/api/paiement/getValid", fetchGet);
  useEffect(() => {
    if (data) {
      window.location.href = data.url;
    }
  }, [data, dispatch]);

  const { push } = useRouter();
  let restDate;
  if (meeting && meeting.limitDate) {
    let limitDate = meeting.limitDate;
    let convertInDate = new Date(Number(limitDate));
    let difference = Math.abs(convertInDate.getTime() - new Date().getTime());
    restDate = new Date(difference);
  }
  let content;
  if (meeting && meeting.status === true) {
    content = (
      <>
        <div className={styles.myMeeting}>
          <h3 className={styles.myMeeting__h3}>
            Voici votre prochain rendez-vous :{" "}
          </h3>
          <div className={styles.myMeeting__container}>
            <p className={styles.myMeeting__container__p}>
              Votre prochain rendez vous est le{" "}
              {new Date(meeting.startAt).toLocaleString("fr-FR")}
            </p>
            <div className={styles.myMeeting__container__content}>
              <button className={styles.myMeeting__container__content__btn}>
                Modifier votre rendez-vous
              </button>
              <button
                className={styles.myMeeting__container__content__btn}
                onClick={() => {
                  dispatch({
                    type: "form/openModalDeleteMeeting",
                  });
                }}
              >
                Supprimer votre rendez-vous
              </button>
            </div>
          </div>
        </div>
      </>
    );
  } else if (meeting && meeting.status === false) {
    content = (
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
                    type: "form/openModalCancelMeeting",
                  });
                }}
              >
                Annuler ce rendez-vous
              </button>
            </div>
          </div>
          <div className={styles.notcomfirm__reminder}>
            <h3 className={styles.meet__meet__h3}>Rappel du rendez-vous</h3>
            <p>{new Date(meeting.startAt).toLocaleString("fr-FR")}</p>
            <p>Consultation vidéo</p>
          </div>
        </div>
      </>
    );
  } else if (!meeting && discovery) {
    content = (
      <>
        <div className={styles.booking}>
          <h3 className={styles.booking__h3}>
            Vous n&apos;avez pas encore de rendez-vous de programmé
          </h3>
          <div className={styles.booking__container}>
            <div className={styles.booking__container__offre}>
              {typeMeeting.type === "unique" && (
                <>
                  <div className={styles.booking__container__offre__content}>
                    <h4
                      className={styles.booking__container__offre__content__h4}
                    >
                      Formule {typeMeeting.type}
                    </h4>
                    <p className={styles.booking__container__offre__content__p}>
                      Vous disposez actuellement de l&apos;offre{" "}
                      {typeMeeting.type}, cette offre ne contient aucun
                      engagement, vous pouvez changer d&apos;offre en cliquant
                      sur le bouton ci-dessous
                    </p>
                    <div
                      className={styles.booking__container__offre__content__div}
                    >
                      <button
                        className={
                          styles.booking__container__offre__content__div__btn
                        }
                        onClick={() => {
                          dispatch({
                            type: "form/openModalEditFormuleUserData",
                          });
                        }}
                      >
                        Changer d&apos;offre
                      </button>
                    </div>
                  </div>
                </>
              )}
              {typeMeeting.type !== "unique" && (
                <>
                  <div className={styles.booking__container__offre__content}>
                    <h4
                      className={styles.booking__container__offre__content__h4}
                    >
                      Formule {typeMeeting.type}
                    </h4>
                    <p className={styles.booking__container__offre__content__p}>
                      Vous disposez actuellement de l&apos;offre{" "}
                      {typeMeeting.type}, il vous reste encore{" "}
                      {typeMeeting.number} rendez-vous à prendre
                    </p>
                    {typeMeeting.type === "flash" && (
                      <>
                        {typeMeeting.number === 3 && (
                          <>
                            <p
                              className={
                                styles.booking__container__offre__content__p
                              }
                            >
                              Vous pouvez changer d&apos;offre en cliquant sur
                              le bouton ci-dessous
                            </p>
                            <div
                              className={
                                styles.booking__container__offre__content__div
                              }
                            >
                              <button
                                className={
                                  styles.booking__container__offre__content__div__btn
                                }
                                onClick={() => {
                                  dispatch({
                                    type: "form/openModalEditFormuleUserData",
                                  });
                                }}
                              >
                                Changer d&apos;offre
                              </button>
                            </div>
                          </>
                        )}
                        {typeMeeting.number !== 3 && (
                          <>
                            <p
                              className={
                                styles.booking__container__offre__content__p
                              }
                            >
                              Vous pouvez annuler votre offre en cliquant sur le
                              bouton ci-dessous
                            </p>
                            <div
                              className={
                                styles.booking__container__offre__content__div
                              }
                            >
                              <button
                                className={
                                  styles.booking__container__offre__content__div__btn
                                }
                                onClick={() => {
                                  dispatch({
                                    type: "form/openModalCancelFormuleUserData",
                                  });
                                }}
                              >
                                Annuler d&apos;offre
                              </button>
                            </div>
                          </>
                        )}
                      </>
                    )}
                    {typeMeeting.type === "longue" && (
                      <>
                        {typeMeeting.number === 10 && (
                          <>
                            <p
                              className={
                                styles.booking__container__offre__content__p
                              }
                            >
                              Vous pouvez changer d&apos;offre en cliquant sur
                              le bouton ci-dessous
                            </p>
                            <div
                              className={
                                styles.booking__container__offre__content__div
                              }
                            >
                              <button
                                className={
                                  styles.booking__container__offre__content__div__btn
                                }
                                onClick={() => {
                                  dispatch({
                                    type: "form/openModalEditFormuleUserData",
                                  });
                                }}
                              >
                                Changer d&apos;offre
                              </button>
                            </div>
                          </>
                        )}
                        {typeMeeting.number !== 10 && (
                          <>
                            <p
                              className={
                                styles.booking__container__offre__content__p
                              }
                            >
                              Vous pouvez annuler votre offre en cliquant sur le
                              bouton ci-dessous
                            </p>
                            <div
                              className={
                                styles.booking__container__offre__content__div
                              }
                            >
                              <button
                                className={
                                  styles.booking__container__offre__content__div__btn
                                }
                                onClick={() => {
                                  dispatch({
                                    type: "form/openModalCancelFormuleUserData",
                                  });
                                }}
                              >
                                Annuler d&apos;offre
                              </button>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className={styles.booking__container__info}>
              <p className={styles.booking__container__info__p}>
                Vous pouvez sélectionner une date en cliquant sur le calendrier.
                La durée standard d&apos;un rendez-vous est de 45 min.
              </p>
              <div className={styles.booking__container__info__div}>
                <Image
                  className={styles.booking__container__info__div__img}
                  width="20"
                  height="20"
                  priority={true}
                  src={"/assets/icone/clock-solid.svg"}
                  alt="bousole"
                />
                <p className={styles.booking__container__info__div__p}>
                  : 45 min
                </p>
              </div>
              <div className={styles.booking__container__info__div}>
                <Image
                  className={styles.booking__container__info__div__img}
                  width="20"
                  height="20"
                  priority={true}
                  src={"/assets/icone/euro-sign-solid.svg"}
                  alt="bousole"
                />
                <p className={styles.booking__container__info__div__p}>
                  : 100€
                </p>
              </div>
              <p className={styles.booking__container__info__p}>
                Vous pouvez m&apos;envoyer un mail en cliquant sur le bouton
                ci-dessous si vous voulez avoir d&apos;avantage de renseignement
                ou pour prendre un rendez-vous personnalisé.
              </p>

              <div className={styles.booking__container__info__content}>
                <button
                  className={styles.booking__container__info__content__btn}
                  onClick={() => {
                    push("/contact");
                  }}
                >
                  Me contacter
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return <>{content}</>;
};

export default DisplayMeeting;
