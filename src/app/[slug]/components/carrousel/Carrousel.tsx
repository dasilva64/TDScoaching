"use client";

import React, { useState } from "react";
import styles from "./Carrousel.module.scss";
import Image from "next/image";
import Link from "next/link";
import Paragraph from "@/app/blog/components/Paragraph";

const Carrousel = ({ data }: any) => {
  const [current, setCurrent] = useState(0);
  return (
    <>
      {current > 0 && (
        <>
          <Image
            onClick={() => {
              if (current > 0) {
                setCurrent((prev) => prev - 1);
              }
            }}
            style={{
              width: "30px",
              height: "30px",
              objectFit: "cover",
              transform: "translateY(-50%) rotate(180deg)",
              position: "absolute",
              top: "50%",
              left: "5px",
              cursor: "pointer",
            }}
            src={`/assets/icone/chevron-right-solid.svg`}
            width="0"
            height="0"
            sizes="100vw"
            alt="Description of my image"
          />
        </>
      )}

      <div className={styles.card}>
        <Image
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
          }}
          src={`/assets/blog/${data[current].image}`}
          width="0"
          height="0"
          sizes="100vw"
          alt="Description of my image"
        />
        <div className={styles.card__div}>
          <h3 className={`${styles.card__div__h2}`}>{data[current].title}</h3>
          <Paragraph content={data[current].description} />
          <Link
            className={`modalOpen ${styles.card__div__btn}`}
            href={`/${data[current].slug}`}
          >
            Lire la suite
          </Link>
        </div>
      </div>
      {current < 9 && (
        <>
          <Image
            onClick={() => {
              if (current < 9) {
                setCurrent((prev) => prev + 1);
              }
            }}
            style={{
              width: "30px",
              height: "30px",
              objectFit: "cover",
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              right: "5px",
              cursor: "pointer",
            }}
            src={`/assets/icone/chevron-right-solid.svg`}
            width="0"
            height="0"
            sizes="100vw"
            alt="Description of my image"
          />
        </>
      )}
    </>
  );
};

export default Carrousel;
