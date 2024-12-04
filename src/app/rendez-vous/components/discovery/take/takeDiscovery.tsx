import React from "react";
import styles from "./takeDiscovery.module.scss";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import localFont from "next/font/local";

const TakeDiscovery = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  return (
    <>
      <div className={styles.takeDiscovery__infoo}>
        <Image
          className={styles.takeDiscovery__infoo__img}
          src="/assets/icone/circle-exclamation-solid-black.svg"
          alt=""
          width={20}
          height={20}
        />
        <p>Vous n&apos;avez aucun rendez-vous à venir</p>
      </div>
      <div className={styles.takeDiscovery__info}>
        <h3 className={styles.takeDiscovery__info__title}>
          Rendez-vous de découverte
        </h3>
        <p className={styles.takeDiscovery__info__description}>
          Ce rendez-vous est gratuit et sans engagement. Il permet de faire
          connaissance et de définir ensemble vos objectifs et vos besoins. Vous
          pouvez sélectionner une date en cliquant sur le bouton ci-dessous.
        </p>
        <div className={styles.takeDiscovery__info__time}>
          <Image
            className={styles.takeDiscovery__info__time__img}
            width="20"
            height="20"
            priority={true}
            src={"/assets/icone/clock-solid.svg"}
            alt="bousole"
          />
          <p className={styles.takeDiscovery__info__time__p}>: 30 min</p>
        </div>
        <div className={styles.takeDiscovery__info__payment}>
          <Image
            className={styles.takeDiscovery__info__payment__img}
            width="20"
            height="20"
            priority={true}
            src={"/assets/icone/euro-sign-solid.svg"}
            alt="bousole"
          />
          <p className={styles.takeDiscovery__info__payment__p}>: Gratuit</p>
        </div>
        <div className={styles.takeDiscovery__info__take}>
          <button
            className={styles.takeDiscovery__info__take__btn}
            onClick={() => {
              dispatch({
                type: "ModalCalendarDiscovery/open",
              });
            }}
          >
            Prendre un rendez-vous de découverte
          </button>
        </div>
        <p className={styles.takeDiscovery__info__email}>
          Vous pouvez m&apos;envoyer un mail en cliquant sur le bouton
          ce-dessous si vous voulez avoir d&apos;avantage de renseignement ou
          pour prendre un rendez-vous personnalisé.
        </p>
        <div className={styles.takeDiscovery__info__contact}>
          <button
            className={styles.takeDiscovery__info__contact__btn}
            onClick={() => {
              router.push("/contact");
            }}
          >
            Me contacter
          </button>
        </div>
      </div>
    </>
  );
};

export default TakeDiscovery;
