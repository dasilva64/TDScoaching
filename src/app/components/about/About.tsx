"use client";

import React, { useState } from "react";
import styles from "./About.module.scss";
import Link from "next/link";
import Image from "next/image";
import localFont from "next/font/local";
const Parisienne = localFont({
  src: "../../Parisienne-Regular.ttf",
  display: "swap",
});

const About = () => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`${open ? styles.about__open : styles.about__close} ${
        styles.about
      }`}
    >
      <h2 className={`${styles.about__h1} ${Parisienne.className}`}>
        Thierry Da Silva
      </h2>
      <p className={styles.about__p}>
        Coach professionnel certifié, je vous accompagne dans votre
      </p>
      <p className={styles.about__p}>
        développement personnel et professionnel.
      </p>
      <Link
        prefetch={false}
        href="/tarif"
        className={`${styles.about__btn} modalOpen`}
        tabIndex={0}
      >
        Voir les offres
      </Link>
      <button
        className={`modalOpen ${styles.about__plus} ${
          open ? styles.about__plus__open : styles.about__plus__close
        }`}
        aria-label="button pour ouvrir ou fermer le texte de présentation"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <Image
          className={`${styles.about__plus__img} ${
            open
              ? styles.about__plus__img__open
              : styles.about__plus__img__close
          }`}
          src="/assets/icone/chevron-up-solid.svg"
          alt=""
          width={30}
          height={30}
        />
      </button>
    </div>
  );
};

export default About;
