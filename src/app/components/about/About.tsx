"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./About.module.scss";
import Link from "next/link";
import Image from "../image/Image";

const About = () => {
  const [open, setOpen] = useState(false);
  const ref: any = useRef(null);
  useEffect(() => {
    if (open === true) {
      ref.current?.setAttribute("tabindex", "0");
    } else {
      ref.current?.setAttribute("tabindex", "-1");
    }
  }, [open]);
  return (
    <div
      className={`${open ? styles.about__open : styles.about__close} ${
        styles.about
      }`}
    >
      <h2 className={`${styles.about__h1}`}>Thierry Da Silva</h2>
      <p className={styles.about__p}>
        Coach professionnel certifié, je vous accompagne dans votre
      </p>
      <p className={styles.about__p}>
        développement personnel et professionnel.
      </p>
      <Link
        ref={ref}
        tabIndex={open ? 0 : -1}
        prefetch={false}
        href="/tarif"
        className={`${styles.about__btn} modalOpen`}
      >
        Voir les offres
      </Link>
      <button
        className={`modalOpen ${styles.about__plus} ${
          open ? styles.about__plus__open : styles.about__plus__close
        }`}
        aria-label="button pour ouvrir ou fermer le texte de présentation"
        onMouseDown={(e) => e.preventDefault()}
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
