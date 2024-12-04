import React from "react";
import styles from "./Take.module.scss";
import { AppDispatch } from "@/app/redux/store";
import { useDispatch } from "react-redux";
import useGet from "../../../components/hook/useGet";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Map } from "./modal/ModalComfirmDeleteContrat";

const Take = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { push } = useRouter();
  const { data: userData } = useGet("/api/user/getUserMeeting");
  return (
    <>
      <div className={styles.booking}>
        <h2 className={styles.booking__h2}>Aucun rendez-vous programmé</h2>
        <div className={styles.booking__container}>
          <div className={styles.booking__container__offre}>
            {userData.body.typeMeeting.type === "unique" && (
              <>
                <div className={styles.booking__container__offre__content}>
                  <h3 className={styles.booking__container__offre__content__h3}>
                    Formule {userData.body.typeMeeting.type}
                  </h3>
                  <p className={styles.booking__container__offre__content__p}>
                    Vous disposez actuellement de l&apos;offre{" "}
                    {userData.body.typeMeeting.type}, cette offre ne contient
                    aucun engagement, vous pouvez changer d&apos;offre en
                    cliquant sur le bouton ci-dessous
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
                          type: "ModalEditFormule/open",
                        });
                      }}
                    >
                      Changer d&apos;offre
                    </button>
                  </div>
                </div>
              </>
            )}
            {userData.body.typeMeeting.type !== "unique" && (
              <>
                <div className={styles.booking__container__offre__content}>
                  <h4 className={styles.booking__container__offre__content__h4}>
                    Formule {userData.body.typeMeeting.type}
                  </h4>
                  <p className={styles.booking__container__offre__content__p}>
                    Vous disposez actuellement de l&apos;offre{" "}
                    {userData.body.typeMeeting.type}, il vous reste encore{" "}
                    {userData.body.typeMeeting.number} rendez-vous à prendre
                  </p>
                  {userData.body.typeMeeting.type === "flash" && (
                    <>
                      {userData.body.typeMeeting.number === 3 && (
                        <>
                          <p
                            className={
                              styles.booking__container__offre__content__p
                            }
                          >
                            Vous pouvez changer d&apos;offre en cliquant sur le
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
                                  type: "ModalEditFormule/open",
                                });
                              }}
                            >
                              Changer d&apos;offre
                            </button>
                          </div>
                        </>
                      )}
                      {userData.body.typeMeeting.number !== 3 && (
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
                  {userData.body.typeMeeting.type === "custom" && (
                    <>
                      {userData.body.typeMeeting.number ===
                        userData.body.typeMeeting.nbSeance && (
                        <>
                          <p
                            className={
                              styles.booking__container__offre__content__p
                            }
                          >
                            Vous pouvez changer d&apos;offre en cliquant sur le
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
                                  type: "ModalEditFormule/open",
                                });
                              }}
                            >
                              Changer d&apos;offre
                            </button>
                          </div>
                        </>
                      )}
                      {userData.body.typeMeeting.number !==
                        userData.body.typeMeeting.nbSeance && (
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
              <p className={styles.booking__container__info__div__p}>: 100€</p>
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
};

export default Take;
