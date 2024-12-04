import React from "react";
import styles from "./CardType.module.scss";
import WhileInView from "@/app/components/framer/WhileInView";

const CardType = ({ title, content, type }: any) => {
  return (
    <WhileInView
      type="y"
      className={`${
        type === "couple"
          ? styles.card__container__couple
          : styles.card__container
      } ${styles.card__margin}`}
    >
      <h2 className={styles.card__h3}>{title}</h2>
      <div className={styles.card__card}>
        <div
          className={`${styles.card__front} ${
            type === "couple"
              ? styles.card__front__couple
              : type === "pro"
              ? styles.card__front__pro
              : styles.card__front__famille
          }`}
        ></div>
        <div className={styles.card__back}>
          <p className={styles.card__p}>{content}</p>
        </div>
      </div>
    </WhileInView>
  );
};

export default CardType;
