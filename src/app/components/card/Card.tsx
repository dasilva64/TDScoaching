import React from "react";
import styles from "./Card.module.scss";
import WhileInView from "../framer/WhileInView";

const Card = ({ title, content }: any) => {
  return (
    <>
      <WhileInView type="y">
        <details className={`${styles.card}`}>
          <summary className="modalOpen">{title}</summary>
          <p className={styles.card__p}>{content}</p>{" "}
        </details>
      </WhileInView>
    </>
  );
};

export default Card;
