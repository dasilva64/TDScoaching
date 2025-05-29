import React from "react";
import styles from "./Formule.module.scss";
import Image from "@/app/components/image/Image";
import ButtonOpenNormal from "../formule/components/ButtonOpenNormal";
import { useDispatch } from "react-redux";
import { Router } from "next/router";
import { useRouter } from "next/navigation";

const Formule = () => {
  const dispatch = useDispatch();
  const router = useRouter()
  return (
    <>
      <h1>Sélectionnez une offre</h1>
      <div className={styles.test}>
        <div
          className={`${styles.test__card} ${styles.test__card__unique}`}
          onClick={async () => {
            await router.push("/contact");
            dispatch({
              type: "flash/storeFlashMessage",
              payload: { type: "success", flashMessage: "Vous ne pouvez pas choisir d'offre pour le moment, veuillez me contacter" },
            });
            /* dispatch({
              type: "ModalFormuleAddRendezVous/open",
              payload: {
                type: "unique",
              },
            }); */
          }}
        >
          <h3 className={styles.test__card__title}>Pack unique</h3>
          <ul className={styles.test__card__content}>
            <li className={styles.test__card__content__li}>
              <Image
                className={styles.test__card__content__li__icone}
                width="25"
                height="25"
                priority={true}
                src={"/assets/icone/check-solid.svg"}
                alt="bousole"
              />
              1 séances de coaching
            </li>
            <li className={styles.test__card__content__li}>
              <Image
                className={styles.test__card__content__li__icone}
                width="25"
                height="25"
                priority={true}
                src={"/assets/icone/check-solid.svg"}
                alt="bousole"
              />
              Sans engagement
            </li>
          </ul>
          <p className={styles.test__card__price}>
            100
            <span>€</span>
          </p>
        </div>
        <div
          className={`${styles.test__card} ${styles.test__card__flash}`}
          onClick={async () => {
            await router.push("/contact");
            dispatch({
              type: "flash/storeFlashMessage",
              payload: { type: "success", flashMessage: "Vous ne pouvez pas choisir d'offre pour le moment, veuillez me contacter" },
            });
            /* dispatch({
              type: "ModalFormuleAddRendezVous/open",
              payload: {
                type: "flash",
              },
            }); */
          }}
        >
          <h3 className={styles.test__card__title}>Pack flash</h3>
          <ul className={styles.test__card__content}>
            <li className={styles.test__card__content__li}>
              <Image
                className={styles.test__card__content__li__icone}
                width="25"
                height="25"
                priority={true}
                src={"/assets/icone/check-solid.svg"}
                alt="bousole"
              />
              3 séances de coaching
            </li>
            <li className={styles.test__card__content__li}>
              <Image
                className={styles.test__card__content__li__icone}
                width="25"
                height="25"
                priority={true}
                src={"/assets/icone/check-solid.svg"}
                alt="bousole"
              />
              1 bilan final offert
            </li>
          </ul>
          <p className={styles.test__card__price}>
            300
            <span>€</span>
          </p>
        </div>
        <div
          className={`${styles.test__card} ${styles.test__card__custom}`}
          onClick={async () => {
            await router.push("/contact");
            dispatch({
              type: "flash/storeFlashMessage",
              payload: { type: "success", flashMessage: "Vous ne pouvez pas choisir d'offre pour le moment, veuillez me contacter" },
            });
            router.push("/contact");
            /* dispatch({
              type: "ModalFormuleAddRendezVous/open",
              payload: {
                type: "custom",
              },
            }); */
          }}
        >
          <h3 className={styles.test__card__title}>Pack sur mesure</h3>
          <ul className={styles.test__card__content}>
            <li className={styles.test__card__content__li}>
              <Image
                className={styles.test__card__content__li__icone}
                width="25"
                height="25"
                priority={true}
                src={"/assets/icone/check-solid.svg"}
                alt="bousole"
              />
              Nombre de séances de coaching à définir (selon choix du client et
              problématique abordée)
            </li>
            <li className={styles.test__card__content__li}>
              <Image
                className={styles.test__card__content__li__icone}
                width="25"
                height="25"
                priority={true}
                src={"/assets/icone/check-solid.svg"}
                alt="bousole"
              />
              Points d’étape offerts (en fonction de la durée totale du
              coaching)
            </li>
            <li className={styles.test__card__content__li}>
              <Image
                className={styles.test__card__content__li__icone}
                width="25"
                height="25"
                priority={true}
                src={"/assets/icone/check-solid.svg"}
                alt="bousole"
              />
              1 bilan final offert
            </li>
          </ul>
          <p className={styles.test__card__price}>Prix sur demande</p>
        </div>
      </div>
    </>
  );
};

export default Formule;
