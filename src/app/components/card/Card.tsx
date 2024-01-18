"use client";

import React from "react";
import Image from "next/image";
import styles from "./Card.module.scss";
import { motion, useAnimation, useInView } from "framer-motion";

import { usePathname, useRouter } from "next/navigation";
import WhileInView from "../framer/WhileInView";

const Card = ({ title, content }: any) => {
  const [show, setShow] = React.useState(false);
  const pathname = usePathname();
  const p = () => {
    if (pathname === "/") {
      if (show === true) {
        return styles.card__p__show;
      } else {
        return styles.card__p__hide;
      }
    } else {
      if (show === true) {
        return styles.card__p__about__show;
      } else {
        return styles.card__p__about__hide;
      }
    }
  };
  return (
    <>
      <WhileInView type="y">
        <button
          tabIndex={0}
          className={`${styles.card} modalOpen`}
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
        </button>
        <p className={`${p()} ${styles.card__p}`}>{content}</p>{" "}
      </WhileInView>
    </>
  );
};

export default Card;
