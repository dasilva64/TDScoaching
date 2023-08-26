"use client";

import React, { useRef } from "react";
import Image from "next/image";
import styles from "./Card.module.scss";
import "./style.css";

const Card = ({ title, content }: any) => {
  const [show, setShow] = React.useState(false);
  return (
    <>
      <div className={styles.card}>
        <h3
          className={styles.card__h3}
          onClick={() => {
            setShow(!show);
          }}
        >
          {title}
        </h3>
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
      {/* <CSSTransition
        ref={nodeRef}
        in={show}
        key={title}
        timeout={400}
        classNames="item"
      > */}

      <p
        className={`${
          show === true ? styles.card__p__show : styles.card__p__hide
        } ${styles.card__p}`}
      >
        {content}
      </p>
      {/* </CSSTransition> */}
    </>
  );
};

export default Card;
