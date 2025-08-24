import React from "react";
import styles from "./Formule.module.scss";
import Image from "@/app/components/image/Image";
import { useDispatch } from "react-redux";

const Formule = () => {
  const dispatch = useDispatch();
  return (
    <>
    <div className={styles.container}>

      <h1>Sélectionnez une offre</h1>
      <div className={styles.formule}>
        <div
          className={`${styles.formule__card} ${styles.formule__card__unique}`}
          onClick={async () => {
            dispatch({ type: "ModalCalendarAddMeetingRendezVous/open",
             });
            /* dispatch({
              type: "ModalFormuleAddRendezVous/open",
              payload: {
                type: "unique",
              },
            }); */
          }}
        >
          <h3 className={styles.formule__card__title}>Pack unique</h3>
          <ul className={styles.formule__card__content}>
            <li className={styles.formule__card__content__li}>
              <Image
                className={styles.formule__card__content__li__icone}
                width="25"
                height="25"
                priority={true}
                src={"/assets/icone/check-solid.svg"}
                alt="bousole"
              />
              1 séances de coaching
            </li>
            <li className={styles.formule__card__content__li}>
              <Image
                className={styles.formule__card__content__li__icone}
                width="25"
                height="25"
                priority={true}
                src={"/assets/icone/check-solid.svg"}
                alt="bousole"
              />
              Sans engagement
            </li>
          </ul>
          <p className={styles.formule__card__price}>
            100
            <span>€</span>
          </p>
        </div>
        <div
          className={`${styles.formule__card} ${styles.formule__card__flash}`}
          onClick={async () => {
            dispatch({
              type: "ModalFormuleAddRendezVous/open",
              payload: {
                type: "flash",
              },
            });
          }}
        >
          <h3 className={styles.formule__card__title}>Pack flash</h3>
          <ul className={styles.formule__card__content}>
            <li className={styles.formule__card__content__li}>
              <Image
                className={styles.formule__card__content__li__icone}
                width="25"
                height="25"
                priority={true}
                src={"/assets/icone/check-solid.svg"}
                alt="bousole"
              />
              3 séances de coaching
            </li>
            <li className={styles.formule__card__content__li}>
              <Image
                className={styles.formule__card__content__li__icone}
                width="25"
                height="25"
                priority={true}
                src={"/assets/icone/check-solid.svg"}
                alt="bousole"
              />
              1 bilan final offert
            </li>
          </ul>
          <p className={styles.formule__card__price}>
            300
            <span>€</span>
          </p>
        </div>
        <div
          className={`${styles.formule__card} ${styles.formule__card__custom}`}
          onClick={async () => {
            dispatch({
              type: "flash/storeFlashMessage",
              payload: { type: "success", flashMessage: "Vous ne pouvez pas choisir d'offre sur mesure pour le moment, veuillez me contacter" },
            });
          }}
        >
          <h3 className={styles.formule__card__title}>Pack sur mesure</h3>
          <ul className={styles.formule__card__content}>
            <li className={styles.formule__card__content__li}>
              <Image
                className={styles.formule__card__content__li__icone}
                width="25"
                height="25"
                priority={true}
                src={"/assets/icone/check-solid.svg"}
                alt="bousole"
              />
              Nombre de séances de coaching à définir (selon choix du client et
              problématique abordée)
            </li>
            <li className={styles.formule__card__content__li}>
              <Image
                className={styles.formule__card__content__li__icone}
                width="25"
                height="25"
                priority={true}
                src={"/assets/icone/check-solid.svg"}
                alt="bousole"
              />
              Points d’étape offerts (en fonction de la durée totale du
              coaching)
            </li>
            <li className={styles.formule__card__content__li}>
              <Image
                className={styles.formule__card__content__li__icone}
                width="25"
                height="25"
                priority={true}
                src={"/assets/icone/check-solid.svg"}
                alt="bousole"
              />
              1 bilan final offert
            </li>
          </ul>
          <p className={styles.formule__card__price}>Prix sur demande</p>
        </div>
      </div>
       <p onClick={() => {
          dispatch({
            type: "ModalContractHelpRendezVous/open"
          })
        }} className={styles.container__help}>Comment ça marche ?</p>
    </div>
      
    </>
  );
};

export default Formule;
