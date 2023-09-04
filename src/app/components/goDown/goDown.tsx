"use client";

import React from "react";
import Image from "next/image";
import styles from "./goDown.module.scss";

const GoDown = () => {
  return (
    <>
      <button
        className={styles.btn}
        onClick={() => {
          if (document)
            document
              .getElementById("anchor")
              ?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <Image
          width={20}
          height={20}
          src="/assets/icone/arrow-down-solid.svg"
          alt="flèche vers le haut"
          priority={true}
        />
      </button>
    </>
  );
};

export default GoDown;
