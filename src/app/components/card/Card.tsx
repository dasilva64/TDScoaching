"use client";

import React, { useRef } from "react";
import Image from "next/image";
import styles from "./Card.module.scss";

const Card = ({ title, content }: any) => {
  const [show, setShow] = React.useState(false);
  return (
    <>
      <div
        className={styles.card}
        onClick={() => {
          setShow(!show);
        }}
      >
        <h3 className={styles.card__h3}>{title}</h3>
        <Image
          className={`${styles.card__img} ${
            show === true ? styles.card__img__up : styles.card__img__down
          }`}
          width="20"
          height="20"
          priority={true}
          src={"/assets/icone/chevron-down-solid.svg"}
          alt="bousole"
        />
      </div>
      <p
        className={`${
          show === true ? styles.card__p__show : styles.card__p__hide
        } ${styles.card__p}`}
        style={{ display: show === true ? "block" : "none" }}
      >
        {content}
      </p>
    </>
  );
};

export default Card;
