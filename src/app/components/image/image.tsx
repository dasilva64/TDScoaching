"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./image.module.scss";

interface Proptype {
  path: string;
  className: string;
  border: string;
}

const ImageDisplay: React.FC<Proptype> = ({ path, className, border }) => {
  const [style, setStyle] = useState<boolean>(false);
  if (typeof document !== "undefined") {
    document.addEventListener("scroll", () => {
      if (className === "left") {
        let divLeft = document.querySelector(".left");
        if (divLeft) visibility(divLeft);
      }

      if (className === "right") {
        let divRight = document.querySelector(".right");
        if (divRight) visibility(divRight);
      }
    });
  }
  const visibility = (element: Element) => {
    let rect = element?.getBoundingClientRect();
    let elemTop = rect?.top;
    let elemBottom = rect?.bottom;
    if (elemBottom && elemTop) {
      if (elemBottom <= 100 || elemTop + 100 >= window.innerHeight) {
        setStyle(true);
      } else {
        setStyle(false);
      }
    }
  };
  return (
    <Image
      width="0"
      height="0"
      sizes="100vw"
      style={{
        objectFit: "contain",
        width: "100%",
        height: "auto",
        borderRadius: border,
      }}
      priority={true}
      className={
        style === false
          ? `${className} ${styles.image__scrollImg}`
          : className === "left"
          ? `${className} ${styles.image__scrollImgInv}`
          : `${className} ${styles.image__scrollImgInvRight}`
      }
      src={path}
      alt="bousole"
    />
  );
};

export default ImageDisplay;
