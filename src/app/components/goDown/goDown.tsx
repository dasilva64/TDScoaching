"use client";

import React from "react";
import Image from "next/image";
import styles from "./goDown.module.scss";

const GoDown = () => {
  return (
    <>
      <button
        className={`${styles.btn} modalOpen`}
        tabIndex={0}
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          if (document)
            document
              .getElementById("anchor")
              ?.scrollIntoView({ block: "start", behavior: "smooth" });
        }}
      >
        <Image
          id="anchor"
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
