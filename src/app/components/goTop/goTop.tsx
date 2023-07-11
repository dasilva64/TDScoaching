"use client";

import { useEffect, useState } from "react";
import styles from "./goTop.module.scss";

const GoTop = () => {
  const [displayGoTop, setDisplayGoTop] = useState<boolean>(false);
  const goTop = () => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  };
  useEffect(() => {
    if (document) {
      document.addEventListener("scroll", () => {
        if (document.documentElement.scrollTop > 50) {
          setDisplayGoTop(true);
        } else {
          setDisplayGoTop(false);
        }
      });
    }
  }, []);
  return (
    <>
      {displayGoTop === true && (
        <div
          onClick={() => {
            goTop();
          }}
          className={styles.top}
        ></div>
      )}
    </>
  );
};

export default GoTop;
